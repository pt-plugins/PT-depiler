import type { ITorrent } from "@ptd/site";

export interface IRemoteDownloadDialogData {
  show: boolean;
  torrents: ITorrent[];
  isDefaultSend: boolean;
}
