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
