export function findThenParseNumberString (query: string) : number {
  const queryMatch = query.trim().replace(/[ ,\n]/g, '').match(/([\d.]+)/);
  return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
}

// TODO format number
