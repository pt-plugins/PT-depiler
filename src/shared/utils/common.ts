export function generateCategoryMap (categoryOptions: { name: string, value: string | number }[]): Map<string | number, string> {
  const CategoryMap = new Map()
  categoryOptions.forEach(v => {
    const { value, name } = v
    CategoryMap.set(value, name)
  })
  return CategoryMap
}

export function getFixedRatio (uploaded: number = 0, downloaded: number = 0): string | '∞' {
  const ratio = uploaded / downloaded
  if (ratio === Infinity || ratio > 10000) {
    return '∞' // Ratio过大时，将分享率设置为无限
  } else {
    return ratio.toFixed(2)
  }
}
