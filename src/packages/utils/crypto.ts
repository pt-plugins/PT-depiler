/**
 * 本项目原先使用 crypto-js，但其上游已停止维护（npm 上全部版本标记 deprecated）。
 * 这里用维护中的 @noble/hashes 与 @noble/ciphers 复刻所需的几个原语，两者均为 MIT、零依赖。
 *
 * 注意：文件加解密相关的函数必须与 crypto-js 的输出**字节兼容**，
 * 否则已存在的 Gist / CookieCloud / 本地 zip 备份将无法解密（同步会静默失效）。
 */
import { md5 } from "@noble/hashes/legacy.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { hmac } from "@noble/hashes/hmac.js";
import { cbc } from "@noble/ciphers/aes.js";
import { bytesToHex, bytesToUtf8, randomBytes, utf8ToBytes } from "@noble/ciphers/utils.js";

/** crypto-js 的默认 OpenSSL 序列化前缀，格式为 `Salted__` + 8 字节 salt + 密文 */
const OPENSSL_SALTED_PREFIX = utf8ToBytes("Salted__");
const OPENSSL_SALT_LENGTH = 8;
const AES_BLOCK_SIZE = 16;
/** EVP_BytesToKey 需要 key(32) + iv(16) 共 48 字节 */
const EVP_KEY_IV_LENGTH = 48;

function concatBytes(...chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return merged;
}

export function md5Hex(data: string | Uint8Array): string {
  return bytesToHex(md5(typeof data === "string" ? utf8ToBytes(data) : data));
}

export function sha256Hex(data: string | Uint8Array): string {
  return bytesToHex(sha256(typeof data === "string" ? utf8ToBytes(data) : data));
}

/** 对应 crypto-js 的 `CryptoJS.SHA256(data).toString()`（等价于 HMAC key 为空时的构造方式） */
export function hmacSha256Hex(data: string | Uint8Array, key: string | Uint8Array): string {
  const messageBytes = typeof data === "string" ? utf8ToBytes(data) : data;
  const keyBytes = typeof key === "string" ? utf8ToBytes(key) : key;
  return bytesToHex(hmac(sha256, keyBytes, messageBytes));
}

/**
 * OpenSSL 的 EVP_BytesToKey（MD5、1 轮、无 salt 前缀）：反复做 md5(prev || passphrase || salt) 拼接，
 * 直到产出足够长度的 key + iv。crypto-js 的 AES 默认走这条路径。
 */
function evpBytesToKey(passphrase: string, salt: Uint8Array, keyIvLength: number): Uint8Array {
  const passphraseBytes = utf8ToBytes(passphrase);
  const blocks: Uint8Array[] = [];
  let previous = new Uint8Array(0);
  let produced = 0;

  while (produced < keyIvLength) {
    previous = md5(concatBytes(previous, passphraseBytes, salt));
    blocks.push(previous);
    produced += previous.length;
  }

  return concatBytes(...blocks).subarray(0, keyIvLength);
}

/**
 * 复刻 `CryptoJS.AES.encrypt(data, passphrase).toString()`：
 * OpenSSL 格式（`Salted__` + 随机 salt + AES-256-CBC 密文），base64 编码。
 * crypto-js 中 passphrase 为字符串时等价于 OpenSSL 的 `-pass pass:<passphrase>`。
 */
export function aesEncryptOpenSsl(plaintext: string, passphrase: string): string {
  const salt = randomBytes(OPENSSL_SALT_LENGTH);
  const keyIv = evpBytesToKey(passphrase, salt, EVP_KEY_IV_LENGTH);
  const key = keyIv.subarray(0, 32);
  const iv = keyIv.subarray(32, EVP_KEY_IV_LENGTH);

  const ciphertext = cbc(key, iv).encrypt(utf8ToBytes(plaintext));
  return bytesToBase64(concatBytes(OPENSSL_SALTED_PREFIX, salt, ciphertext));
}

/** 对应 `CryptoJS.AES.decrypt(ciphertext, passphrase).toString(CryptoJS.enc.Utf8)` */
export function aesDecryptOpenSsl(ciphertext: string, passphrase: string): string {
  const payload = base64ToBytes(ciphertext);
  const prefixLength = OPENSSL_SALTED_PREFIX.length;

  const hasSaltedPrefix =
    payload.length >= prefixLength + OPENSSL_SALT_LENGTH &&
    OPENSSL_SALTED_PREFIX.every((byte, index) => payload[index] === byte);

  // crypto-js 在未显式提供 salt 时会省略 salt 并直接使用 passphrase 派生的 key/iv，这里同样兼容
  const salt = hasSaltedPrefix ? payload.subarray(prefixLength, prefixLength + OPENSSL_SALT_LENGTH) : new Uint8Array(0);
  const body = payload.subarray(hasSaltedPrefix ? prefixLength + OPENSSL_SALT_LENGTH : 0);

  const keyIv = evpBytesToKey(passphrase, salt, EVP_KEY_IV_LENGTH);
  const plaintext = cbc(keyIv.subarray(0, 32), keyIv.subarray(32, EVP_KEY_IV_LENGTH)).decrypt(body);
  return bytesToUtf8(plaintext);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

/** AES 分组长度，供调用方校验密文长度时复用 */
export { AES_BLOCK_SIZE };
