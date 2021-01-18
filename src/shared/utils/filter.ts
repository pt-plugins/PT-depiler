export const sizePattern = /^(\d*\.?\d+)(.*[^ZEPTGMK])?([ZEPTGMK](B|iB))$/i

export function sizeToNumber (size: string): number {
  const sizeRawMatch = size.match(sizePattern)
  if (sizeRawMatch) {
    const sizeNumber = parseFloat(sizeRawMatch[1])
    const sizeType = sizeRawMatch[3]
    switch (true) {
      case /Zi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 70)
      case /Ei?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 60)
      case /Pi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 50)
      case /Ti?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 40)
      case /Gi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 30)
      case /Mi?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 20)
      case /Ki?B/i.test(sizeType):
        return sizeNumber * Math.pow(2, 10)
      default:
        return sizeNumber
    }
  }
  return 0
}
