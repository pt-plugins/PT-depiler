import assert from "node:assert/strict";
import test from "node:test";

import { parseKeepfrdsTorrentListCount } from "../../../src/packages/site/definitions/utils/keepfrds.ts";

test("returns zero when the published torrent list is empty", () => {
  assert.equal(parseKeepfrdsTorrentListCount([], []), 0);
});

test("counts unique torrents on a single page", () => {
  assert.equal(
    parseKeepfrdsTorrentListCount(
      [],
      ["details.php?id=101&hit=1", "details.php?id=101&hit=1&cmtpage=1#startcomments", "details.php?id=102&hit=1"],
    ),
    2,
  );
});

test("uses the last pagination range for a multi-page list", () => {
  assert.equal(
    parseKeepfrdsTorrentListCount(["1\u00a0-\u00a050", "51\u00a0-\u00a099"], ["details.php?id=101&hit=1"]),
    99,
  );
});
