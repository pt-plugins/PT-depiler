export type BridgeState = "no-permission" | "disabled" | "connecting" | "connected" | "retrying" | "error";

export interface BridgeStatus {
  permissionGranted: boolean;
  enabled: boolean;
  state: BridgeState;
  connected: boolean;
  lastError?: string;
}
