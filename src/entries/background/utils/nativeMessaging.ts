import { sendMessage } from "@/messages.ts";

const NATIVE_HOST_NAME = "com.ptd.native";
const INSTANCE_ID_KEY = "ptd_native_instance_id";
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;

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
  try {
    port = chrome.runtime.connectNative(NATIVE_HOST_NAME);
  } catch {
    // Native host not installed — silently skip
    console.debug("[PTD] Native messaging host not available, CLI bridge disabled.");
    return;
  }

  reconnectAttempt = 0;

  // Send hello handshake
  getOrCreateInstanceId().then((instanceId) => {
    const hello = {
      type: "hello",
      instanceId,
      browser: __BROWSER__,
      extensionId: chrome.runtime.id,
      version: __EXT_VERSION__,
      capabilities: ["bridge-v1"],
    };
    port.postMessage(hello);
  });

  port.onMessage.addListener(async (msg: any) => {
    if (msg?.type !== "request" || !msg.id || !msg.method) {
      return;
    }

    const { id, method, params } = msg;

    if (!ALLOWED_METHODS.has(method)) {
      port.postMessage({
        type: "response",
        id,
        error: { code: "METHOD_NOT_ALLOWED", message: `Method '${method}' is not allowed` },
      });
      return;
    }

    try {
      const result = await sendMessage(method as any, params);
      port.postMessage({ type: "response", id, result });
    } catch (e: any) {
      port.postMessage({
        type: "response",
        id,
        error: { code: "EXTENSION_ERROR", message: e?.message ?? String(e) },
      });
    }
  });

  port.onDisconnect.addListener(() => {
    const err = chrome.runtime.lastError;
    if (err) {
      console.debug("[PTD] Native messaging disconnected:", err.message);
    }
    // Reconnect with bounded exponential backoff
    reconnectAttempt++;
    const delay = Math.min(RECONNECT_BASE_MS * 2 ** reconnectAttempt, RECONNECT_MAX_MS);
    setTimeout(connect, delay);
  });
}

connect();
