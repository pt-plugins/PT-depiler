/**
 * Uint8Array 的 hex/base64 便捷方法（prototype.toHex / static fromHex / prototype.toBase64 / static fromBase64）
 * 自 Chrome 140 起才提供，而运行时依赖链 parse-torrent → bencode → uint8-util（2.3+）已直接调用它们，
 * 低于 140 的 Chromium 上发送种子到下载器会抛 "toHex is not a function"（#1481）。
 * manifest 声明的 minimum_chrome_version 为 120，此处对缺失的平台方法做等价兜底。
 */

const HEX = "0123456789abcdef";

interface Uint8ArrayCompat {
  toHex?: (this: Uint8Array) => string;
  fromHex?: (str: string) => Uint8Array;
  toBase64?: (this: Uint8Array) => string;
  fromBase64?: (str: string) => Uint8Array;
}

const proto = Uint8Array.prototype as unknown as Uint8ArrayCompat;
const statics = Uint8Array as unknown as Uint8ArrayCompat;

if (typeof proto.toHex !== "function") {
  proto.toHex = function (this: Uint8Array) {
    let out = "";
    for (let i = 0; i < this.length; i++) {
      out += HEX[this[i]! >> 4]! + HEX[this[i]! & 0xf]!;
    }
    return out;
  };
}

if (typeof statics.fromHex !== "function") {
  statics.fromHex = (str: string) => {
    if (str.length % 2 !== 0) {
      throw new SyntaxError("The string must have an even number of hexadecimal digits.");
    }
    const out = new Uint8Array(str.length >> 1);
    for (let i = 0; i < out.length; i++) {
      const hi = HEX.indexOf(str[i * 2]!);
      const lo = HEX.indexOf(str[i * 2 + 1]!);
      if (hi < 0 || lo < 0) {
        throw new SyntaxError(`Invalid hexadecimal character at position ${hi < 0 ? i * 2 : i * 2 + 1}.`);
      }
      out[i] = (hi << 4) | lo;
    }
    return out;
  };
}

if (typeof proto.toBase64 !== "function") {
  proto.toBase64 = function (this: Uint8Array) {
    let binary = "";
    const chunk = 0x8000; // String.fromCharCode 参数个数上限
    for (let i = 0; i < this.length; i += chunk) {
      binary += String.fromCharCode(...this.subarray(i, i + chunk));
    }
    return btoa(binary);
  };
}

if (typeof statics.fromBase64 !== "function") {
  statics.fromBase64 = (str: string) => {
    const normalized = str.replace(/[\t\n\f\r ]+/g, "");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      out[i] = binary.charCodeAt(i);
    }
    return out;
  };
}
