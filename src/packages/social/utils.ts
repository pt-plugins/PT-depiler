export function commonParseFactory(urlPatterns: (string | RegExp)[]): (query: string) => string {
  return (query: string): string => {
    for (const regExp of urlPatterns) {
      const match = query.match(regExp);
      if (match) {
        return match[1] as string;
      }
    }
    return query; // 如果没有匹配，返回原始查询
  };
}
