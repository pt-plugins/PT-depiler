import { onMessage, sendMessage } from "@/messages.ts";
import { setupOffscreenDocument } from "./offscreen.ts";
import type { BridgeState, BridgeStatus } from "@/shared/types.ts";

const NATIVE_HOST_NAME = "com.ptd.native";
const INSTANCE_ID_KEY = "ptd_native_instance_id";
const ENABLED_KEY = "ptd_native_bridge_enabled";
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;
const MAX_RECONNECT_ATTEMPTS = 10;

/** Errors that indicate the native host is not installed — no point retrying. */
const FATAL_ERRORS = [
  "Specified native messaging host not found.",
  "Access to the specified native messaging host is forbidden.",
];

/** Methods the bridge will proxy to sendMessage(). Everything else is rejected. */
const ALLOWED_METHODS = new Set([
  // Site config
  "getSiteList",
  "getSiteUserConfig",
  "getSiteFavicon",
  "clearSiteFaviconCache",
  // Search
  "getSiteSearchResult",
  "getMediaServerSearchResult",
  // Download and downloader
  "getDownloaderList",
  "getDownloaderConfig",
  "getDownloaderVersion",
  "getDownloaderStatus",
  "getTorrentDownloadLink",
  "getTorrentInfoForVerification",
  "downloadTorrent",
  "getDownloadHistory",
  "getDownloadHistoryById",
  "deleteDownloadHistoryById",
  "clearDownloadHistory",
  // User info
  "getSiteUserInfoResult",
  "cancelUserInfoQueue",
  "getSiteUserInfo",
  "removeSiteUserInfo",
  // Keep-upload
  "getKeepUploadTasks",
  "getKeepUploadTaskById",
  "createKeepUploadTask",
  "updateKeepUploadTask",
  "deleteKeepUploadTask",
  "clearKeepUploadTasks",
]);

// ── Module-scoped state ──────────────────────────────────────────────

let port: chrome.runtime.Port | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempt = 0;
let enabled = true;
let state: BridgeState = "no-permission";
let lastError: string | undefined;
let intentionalDisconnect = false;

// ── Helpers ──────────────────────────────────────────────────────────

async function getOrCreateInstanceId(): Promise<string> {
  const stored = await chrome.storage.local.get(INSTANCE_ID_KEY);
  const storedInstanceId = stored[INSTANCE_ID_KEY];

  if (typeof storedInstanceId === "string" && storedInstanceId.length > 0) {
    return storedInstanceId;
  }
  const id = crypto.randomUUID();
  await chrome.storage.local.set({ [INSTANCE_ID_KEY]: id });
  return id;
}

async function checkPermission(): Promise<boolean> {
  try {
    return await chrome.permissions.contains({ permissions: ["nativeMessaging"] });
  } catch {
    return false;
  }
}

async function getStatus(): Promise<BridgeStatus> {
  const permissionGranted = await checkPermission();
  return {
    permissionGranted,
    enabled,
    state,
    connected: port !== null && state === "connected",
    lastError,
  };
}

function clearReconnectTimer() {
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

// ── Lifecycle ────────────────────────────────────────────────────────

function disconnect(intentional: boolean) {
  intentionalDisconnect = intentional;
  clearReconnectTimer();
  reconnectAttempt = 0;

  if (port) {
    try {
      port.disconnect();
    } catch {
      // Already disconnected — ignore
    }
    port = null;
  }
}

function scheduleReconnect() {
  clearReconnectTimer();
  reconnectAttempt++;

  if (reconnectAttempt > MAX_RECONNECT_ATTEMPTS) {
    state = "error";
    lastError = `Gave up after ${MAX_RECONNECT_ATTEMPTS} reconnect attempts`;
    console.debug("[PTD] Native bridge exceeded max reconnect attempts, giving up.");
    return;
  }

  const delay = Math.min(RECONNECT_BASE_MS * 2 ** reconnectAttempt, RECONNECT_MAX_MS);
  state = "retrying";
  console.debug(
    `[PTD] Native bridge reconnecting in ${delay}ms (attempt ${reconnectAttempt}/${MAX_RECONNECT_ATTEMPTS})...`,
  );
  reconnectTimer = setTimeout(connect, delay);
}

function connect() {
  if (!enabled) {
    return;
  }

  clearReconnectTimer();
  state = "connecting";
  lastError = undefined;
  intentionalDisconnect = false;

  let currentPort: chrome.runtime.Port;
  try {
    currentPort = chrome.runtime.connectNative(NATIVE_HOST_NAME);
    port = currentPort;
  } catch (e: any) {
    state = "error";
    lastError = e?.message ?? String(e);
    console.debug("[PTD] Native messaging host not available:", lastError);
    return;
  }

  // Send hello handshake — mark connected after successful send.
  // The native host does not send an ack, so a successful postMessage
  // is our best signal. If the host is absent, onDisconnect fires.
  getOrCreateInstanceId()
    .then((instanceId) => {
      if (port !== currentPort) return;

      try {
        currentPort.postMessage({
          type: "hello",
          instanceId,
          browser: __BROWSER__,
          extensionId: chrome.runtime.id,
          version: __EXT_VERSION__,
          capabilities: ["bridge-v1"],
        });
      } catch (e: any) {
        state = "error";
        lastError = e?.message ?? String(e);
        console.debug("[PTD] Failed to send native hello message:", lastError);
        return;
      }

      state = "connected";
      reconnectAttempt = 0;
    })
    .catch((e: any) => {
      if (port !== currentPort) return;
      state = "error";
      lastError = e?.message ?? String(e);
      console.debug("[PTD] Failed to get or create native instance id:", lastError);
      try {
        currentPort.disconnect();
      } catch {
        // ignore
      }
    });

  currentPort.onMessage.addListener(async (msg: any) => {
    if (msg?.type !== "request" || !msg.id || !msg.method) {
      return;
    }

    const { id, method, params } = msg;

    if (!ALLOWED_METHODS.has(method)) {
      currentPort.postMessage({
        type: "response",
        id,
        error: { code: "METHOD_NOT_ALLOWED", message: `Method '${method}' is not allowed` },
      });
      return;
    }

    try {
      await setupOffscreenDocument();
      const result = await sendMessage(method as any, params);
      if (port === currentPort) {
        currentPort.postMessage({ type: "response", id, result });
      }
    } catch (e: any) {
      if (port === currentPort) {
        currentPort.postMessage({
          type: "response",
          id,
          error: { code: "EXTENSION_ERROR", message: e?.message ?? String(e) },
        });
      }
    }
  });

  currentPort.onDisconnect.addListener(() => {
    const err = chrome.runtime.lastError;
    const errMsg = err?.message ?? "";

    // Stale port — a new connection has already replaced this one
    if (port !== currentPort) return;

    port = null;

    if (intentionalDisconnect) {
      return;
    }

    if (err) {
      console.debug("[PTD] Native messaging disconnected:", errMsg);
    }

    if (FATAL_ERRORS.some((e) => errMsg.includes(e))) {
      state = "error";
      lastError = errMsg;
      console.debug("[PTD] Native host not available, CLI bridge disabled.");
      return;
    }

    lastError = errMsg || "Connection lost";
    scheduleReconnect();
  });
}

async function init() {
  const permissionGranted = await checkPermission();

  // Refresh enabled flag
  const stored = await chrome.storage.local.get(ENABLED_KEY);
  enabled = stored[ENABLED_KEY] !== false; // default true

  if (!permissionGranted) {
    disconnect(true);
    state = "no-permission";
    lastError = undefined;
    return;
  }

  if (!enabled) {
    disconnect(true);
    state = "disabled";
    lastError = undefined;
    return;
  }

  connect();
}

// ── Runtime permission listeners ─────────────────────────────────────

chrome.permissions.onAdded?.addListener((permissions) => {
  if (permissions.permissions?.includes("nativeMessaging")) {
    init();
  }
});

chrome.permissions.onRemoved?.addListener((permissions) => {
  if (permissions.permissions?.includes("nativeMessaging")) {
    init();
  }
});

// ── Message handlers ─────────────────────────────────────────────────

onMessage("nativeBridgeGetStatus", async () => {
  return getStatus();
});

onMessage("nativeBridgeSetEnabled", async ({ data }) => {
  if (typeof data !== "boolean") {
    return getStatus();
  }
  await chrome.storage.local.set({ [ENABLED_KEY]: data });
  await init();
  if (state === "connecting") {
    await new Promise((r) => setTimeout(r, 200));
  }
  return getStatus();
});

onMessage("nativeBridgeReconnect", async () => {
  const permissionGranted = await checkPermission();
  if (!permissionGranted) {
    lastError = "Permission not granted — cannot reconnect";
    return getStatus();
  }
  if (!enabled) {
    lastError = "Bridge is disabled — cannot reconnect";
    return getStatus();
  }

  disconnect(true);
  connect();
  return getStatus();
});

// ── Startup ──────────────────────────────────────────────────────────

init();
