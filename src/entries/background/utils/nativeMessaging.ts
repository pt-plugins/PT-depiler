import { sendMessage } from "@/messages.ts";

const NATIVE_HOST_NAME = "com.ptd.native";
const INSTANCE_ID_KEY = "ptd_native_instance_id";
const RECONNECT_BASE_MS = 2000;
const RECONNECT_MAX_MS = 60000;
const MAX_RECONNECT_ATTEMPTS = 5;

/** Methods the bridge will proxy to sendMessage(). Everything else is rejected. */
const ALLOWED_METHODS = new Set([
  // Storage and logging (read-only)
  "getExtStorage",
  "getLogger",
  // Site config
  "getSiteUserConfig",
  "getSiteFavicon",
  "clearSiteFaviconCache",
  // Search
  "getSiteSearchResult",
  "getMediaServerSearchResult",
  // Download and downloader
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

let reconnectAttempt = 0;

async function getOrCreateInstanceId(): Promise<string> {
  const stored = await chrome.storage.local.get(INSTANCE_ID_KEY);
  if (stored[INSTANCE_ID_KEY]) {
    return stored[INSTANCE_ID_KEY];
  }
  const id = crypto.randomUUID();
  await chrome.storage.local.set({ [INSTANCE_ID_KEY]: id });
  return id;
}

function connect() {
  let port: chrome.runtime.Port;
  let disconnected = false;

  try {
    port = chrome.runtime.connectNative(NATIVE_HOST_NAME);
  } catch {
    console.debug("[PTD] Native messaging host not available, CLI bridge disabled.");
    return;
  }

  port.onDisconnect.addListener(() => {
    disconnected = true;
    const err = chrome.runtime.lastError;

    // If we disconnected before any successful communication, the host likely isn't installed
    if (reconnectAttempt >= MAX_RECONNECT_ATTEMPTS) {
      console.debug(
        "[PTD] Native messaging host not reachable after",
        MAX_RECONNECT_ATTEMPTS,
        "attempts. CLI bridge disabled.",
      );
      return;
    }

    if (err) {
      console.debug("[PTD] Native messaging disconnected:", err.message);
    }

    reconnectAttempt++;
    const delay = Math.min(RECONNECT_BASE_MS * 2 ** reconnectAttempt, RECONNECT_MAX_MS);
    setTimeout(connect, delay);
  });

  // Send hello handshake — check if port is still alive before sending
  getOrCreateInstanceId().then((instanceId) => {
    if (disconnected) return;
    try {
      port.postMessage({
        type: "hello",
        instanceId,
        browser: __BROWSER__,
        extensionId: chrome.runtime.id,
        version: __EXT_VERSION__,
        capabilities: ["bridge-v1"],
      });
      // Reset reconnect counter on successful hello
      reconnectAttempt = 0;
    } catch {
      // Port already disconnected
    }
  });

  port.onMessage.addListener(async (msg: any) => {
    if (msg?.type !== "request" || !msg.id || !msg.method) {
      return;
    }

    const { id, method, params } = msg;

    if (!ALLOWED_METHODS.has(method)) {
      try {
        port.postMessage({
          type: "response",
          id,
          error: { code: "METHOD_NOT_ALLOWED", message: `Method '${method}' is not allowed` },
        });
      } catch {
        // Port disconnected
      }
      return;
    }

    try {
      const result = await sendMessage(method as any, params);
      if (!disconnected) port.postMessage({ type: "response", id, result });
    } catch (e: any) {
      if (!disconnected) {
        try {
          port.postMessage({
            type: "response",
            id,
            error: { code: "EXTENSION_ERROR", message: e?.message ?? String(e) },
          });
        } catch {
          // Port disconnected
        }
      }
    }
  });
}

connect();
