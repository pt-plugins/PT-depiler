export const sizePattern = /^(\d*\.?\d+)(.*[^ZEPTGMK])?([ZEPTGMK](B|iB))s?$/i;

export const KB = Math.pow(2, 10);
export const MB = Math.pow(2, 20);
export const GB = Math.pow(2, 30);
export const TB = Math.pow(2, 40);
export const PB = Math.pow(2, 50);
export const EB = Math.pow(2, 60);
export const ZB = Math.pow(2, 70);

export function parseSizeString(size: string): number {
  size = size.replace(/,/g, ""); // 建议在传入前就替换掉，但是以防万一还是在这里再做一次替换
  const sizeRawMatch = size.match(sizePattern);
  if (sizeRawMatch) {
    const sizeNumber = parseFloat(sizeRawMatch[1]);
    const sizeType = sizeRawMatch[3];
    switch (true) {
      case /Zi?B/i.test(sizeType):
        return sizeNumber * ZB;
      case /Ei?B/i.test(sizeType):
        return sizeNumber * EB;
      case /Pi?B/i.test(sizeType):
        return sizeNumber * PB;
      case /Ti?B/i.test(sizeType):
        return sizeNumber * TB;
      case /Gi?B/i.test(sizeType):
        return sizeNumber * GB;
      case /Mi?B/i.test(sizeType):
        return sizeNumber * MB;
      case /Ki?B/i.test(sizeType):
        return sizeNumber * KB;
      default:
        return sizeNumber;
    }
  }
  return 0;
}
