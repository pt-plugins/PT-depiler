const a =
  "当前目录列表配置是指定硬盘上的绝对路径，如 /volume1/music/ 或 D:\\download\\music\\。请确保对应路径软件有写入权限。";
var r = ((t) => (
  (t.downloading = "downloading"),
  (t.seeding = "seeding"),
  (t.paused = "paused"),
  (t.queued = "queued"),
  (t.checking = "checking"),
  (t.error = "error"),
  (t.unknown = "unknown"),
  t
))(r || {});
class o {
  config;
  clientVersion;
  constructor(e) {
    this.config = e;
  }
  async getClientVersion() {
    return (this.clientVersion || (this.clientVersion = await this.getClientVersionFromRemote()), this.clientVersion);
  }
  async getClientStatus() {
    return { dlSpeed: 0, upSpeed: 0, dlData: 0, upData: 0 };
  }
  async getClientFreeSpace() {
    return "N/A";
  }
  async getClientPaths() {
    const e = await this.getAllTorrents();
    return Array.from(new Set(e.map((n) => n.savePath))).filter(Boolean);
  }
  async getClientLabels() {
    const e = await this.getAllTorrents();
    return Array.from(new Set(e.map((n) => n.label))).filter(Boolean);
  }
  async getTorrentsBy(e) {
    let n = await this.getAllTorrents();
    if (e.ids) {
      const s = Array.isArray(e.ids) ? e.ids : [e.ids];
      n = n.filter((i) => s.includes(i.infoHash));
    }
    return (e.complete && (n = n.filter((s) => s.isCompleted)), n);
  }
  async getTorrent(e) {
    return (await this.getTorrentsBy({ ids: e }))[0];
  }
}
export { o as A, r as C, a };
