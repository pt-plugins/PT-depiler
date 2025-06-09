import type { TSiteFullUrl, TSiteHost } from "../types";

/**
 * cloudflare Email 解码方法，来自 https://usamaejaz.com/cloudflare-email-decoding/
 * @param {*} encodedString
 */
export function cfDecodeEmail(encodedString: string) {
  let email = "";
  const r = parseInt(encodedString.slice(0, 2), 16);
  for (let n = 2; encodedString.length - n; n += 2) {
    const i = parseInt(encodedString.slice(n, 2), 16) ^ r;
    email += String.fromCharCode(i);
  }
  return email;
}

// From: https://stackoverflow.com/a/28899585/8824471
export function extractContent(s: string): string {
  const span = document.createElement("span");
  span.innerHTML = s;
  return span.textContent || span.innerText;
}

export function createDocument(str: string, type: DOMParserSupportedType = "text/html"): Document {
  return new DOMParser().parseFromString(str, type);
}

const inputChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
const outputChars = "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm".split("");

// 创建映射表，使用 Record 类型明确键和值的类型
const lookupTable: Record<string, string> = inputChars.reduce(
  (map, char, index) => ({ ...map, [char]: outputChars[index] }),
  {} as Record<string, string>,
);

/**
 * 对输入字符串执行 ROT13 加密/解密
 * @param input 待处理的字符串
 * @returns 处理后的字符串
 */
export function rot13(input: string): string {
  return input
    .split("")
    .map((char) => lookupTable[char] || char)
    .join("");
}

export function restoreSecureLink(url: string): TSiteFullUrl {
  return (url.startsWith("uggc") ? rot13(url) : url) as TSiteFullUrl;
}

export function getHostFromUrl(url: string): TSiteHost {
  let host = url;
  try {
    const urlObj = new URL(url);
    host = urlObj.host;
  } catch (e) {}

  return host;
}
