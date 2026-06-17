import { e, d as a, b as n, j as r } from "./utils-BmKctBTI.js";
class o {
  config;
  _encryptionKey;
  constructor(t) {
    this.config = t;
  }
  get userConfig() {
    return this.config.config;
  }
  get encryptionKey() {
    return this._encryptionKey;
  }
  setEncryptionKey(t) {
    this._encryptionKey = t;
  }
  encryptData(t) {
    return e(t, this.encryptionKey);
  }
  decryptData(t) {
    return a(t, this.encryptionKey);
  }
  async backupDataToJSZipBlob(t) {
    return await n(t, this.encryptionKey);
  }
  async jsZipBlobToBackupData(t) {
    return await r(t, this.encryptionKey);
  }
}
export { o as A };
