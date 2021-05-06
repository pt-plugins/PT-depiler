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
