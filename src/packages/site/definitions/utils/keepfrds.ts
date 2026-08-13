const PAGE_RANGE_PATTERN = /\d[\d,]*\s*[-–]\s*(\d[\d,]*)/g;

export function parseKeepfrdsTorrentListCount(
  paginationTexts: Iterable<string>,
  detailHrefs: Iterable<string>,
): number {
  let lastItem = 0;

  for (const paginationText of paginationTexts) {
    for (const match of paginationText.matchAll(PAGE_RANGE_PATTERN)) {
      const rangeEnd = Number.parseInt(match[1].replace(/,/g, ""), 10);
      if (Number.isFinite(rangeEnd)) {
        lastItem = Math.max(lastItem, rangeEnd);
      }
    }
  }

  if (lastItem > 0) {
    return lastItem;
  }

  const torrentIds = new Set<string>();
  for (const detailHref of detailHrefs) {
    const queryString = detailHref.match(/details\.php\?([^#]+)/)?.[1];
    if (!queryString) continue;

    const torrentId = new URLSearchParams(queryString).get("id");
    if (torrentId) {
      torrentIds.add(torrentId);
    }
  }

  return torrentIds.size;
}
