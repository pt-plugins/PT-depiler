export function getFixedRatio (uploaded: number = 0, downloaded: number = 0): string | '∞' {
  const ratio = uploaded / downloaded;
  if (ratio === Infinity || ratio > 10000) {
    return '∞'; // Ratio过大时，将分享率设置为无限
  } else {
    return ratio.toFixed(2);
  }
}

// From: https://stackoverflow.com/a/28899585/8824471
export function extractContent (s:string): string {
  const span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
}

export function createDocument (str: string, type: DOMParserSupportedType = 'text/html') : Document {
  return (new DOMParser()).parseFromString(str, type);
}

export function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 生成随机字符串
 * @param length
 * @param noSimilar 是否包含容易混淆的字符[oO,Ll,9gq,Vv,Uu,I1]，默认为包含
 */
export function getRandomString (length: number = 32, noSimilar: boolean = false):string {
  const chars = noSimilar
    ? 'abcdefhijkmnprstwxyz2345678ABCDEFGHJKMNPQRSTWXYZ'
    : 'abcdefghijkmnopqrstuvwxyz0123456789ABCDEFGHIJKMNOPQRSTUVWXYZ';
  const maxLength = chars.length;
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(chars.charAt(Math.floor(Math.random() * maxLength)));
  }

  return result.join('');
}
