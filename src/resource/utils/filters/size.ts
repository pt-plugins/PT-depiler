export const sizePattern = /^(\d*\.?\d+)(.*[^ZEPTGMK])?([ZEPTGMK](B|iB))s?$/i;

export function parseSizeString (size: string): number {
  size = size.replace(/,/g, ''); // 建议在传入前就替换掉，但是以防万一还是在这里再做一次替换
  const sizeRawMatch = size.match(sizePattern);
  if (sizeRawMatch) {
    const sizeNumber = parseFloat(sizeRawMatch[1]);
    const sizeType = sizeRawMatch[3];
    switch (true) {
      case /Zi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 70);
      case /Ei?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 60);
      case /Pi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 50);
      case /Ti?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 40);
      case /Gi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 30);
      case /Mi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 20);
      case /Ki?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 10);
      default:
        return sizeNumber;
    }
  }
  return 0;
}

export function findThenParseSizeString (query: string): number {
  const queryMatch = query.trim().replace(/[ ,\n]/g, '').match(/([\d.]+ ?[ZEPTGMK]?i?B)/);
  return queryMatch && queryMatch.length >= 2 ? parseSizeString(queryMatch[1]) : 0;
}
