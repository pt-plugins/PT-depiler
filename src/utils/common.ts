// 生成随机数
export function getRandomInt (min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
}

export function normalizePieces (pieces: string | string[], joinBy:string = ','): string {
  if (Array.isArray(pieces)) {
    return pieces.join(joinBy)
  }
  return pieces
}
