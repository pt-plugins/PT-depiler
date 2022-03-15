/**
 * cloudflare Email 解码方法，来自 https://usamaejaz.com/cloudflare-email-decoding/
 * @param {*} encodedString
 */
export function cfDecodeEmail(encodedString: string) {
  let email = "";
  const r = parseInt(encodedString.substr(0, 2), 16);
  for (let n = 2; encodedString.length - n; n += 2) {
    const i = parseInt(encodedString.substr(n, 2), 16) ^ r;
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

export function createDocument(
  str: string,
  type: DOMParserSupportedType = "text/html"
): Document {
  return new DOMParser().parseFromString(str, type);
}
