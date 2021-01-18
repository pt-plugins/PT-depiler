// 生成随机数
export function getRandomInt (min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
}

const DomParser = new DOMParser()

export function generateDocumentFromString (text: string, type:DOMParserSupportedType = 'text/html'): Document {
  return DomParser.parseFromString(text, 'text/html')
}

export function getFixedRatio (uploaded: number = 0, downloaded: number = 0): string | '∞' {
  const ratio = uploaded / downloaded
  if (ratio === Infinity || ratio > 10000) {
    return '∞' // Ratio过大时，将分享率设置为无限
  } else {
    return ratio.toFixed(2)
  }
}
