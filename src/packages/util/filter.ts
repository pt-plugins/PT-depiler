export function getFixedRatio(
  uploaded: number = 0,
  downloaded: number = 0,
): string | "∞" {
  const ratio = uploaded / downloaded;
  if (ratio === Infinity || ratio > 10000) {
    return "∞"; // Ratio过大时，将分享率设置为无限
  } else {
    return ratio.toFixed(2);
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function copy<T = any>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function unique(arr: any[]): any[] {
  return [...new Set(arr)];
}

/**
 * 生成随机字符串
 * @param length
 * @param noSimilar 是否包含容易混淆的字符[oO,Ll,9gq,Vv,Uu,I1]，默认为包含
 */
export function getRandomString(
  length: number = 32,
  noSimilar: boolean = false,
): string {
  const chars = noSimilar
    ? "abcdefhijkmnprstwxyz2345678ABCDEFGHJKMNPQRSTWXYZ"
    : "abcdefghijkmnopqrstuvwxyz0123456789ABCDEFGHIJKMNOPQRSTUVWXYZ";
  const maxLength = chars.length;
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(chars.charAt(Math.floor(Math.random() * maxLength)));
  }

  return result.join("");
}
