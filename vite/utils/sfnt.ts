/**
 * sfnt（TTF/OTF）二进制的最小手术工具：读表目录、按修改后的表重建文件（重算表校验和与
 * `head.checkSumAdjustment`）、往 cmap 里补一张**零映射的 BMP 子表**。
 *
 * 为什么需要最后这件事：harfbuzz 的子集器是**重建** cmap（按保留下来的码位重新生成子表，
 * 格式按需选择），而 MDI 的码位全在补充私用平面（U+F0000+），子集产物的 cmap 只剩 format 12。
 * Windows GDI 字体后端（`--disable-direct-write`）不直接解析字体，而是把字节交给
 * `AddFontMemResourceEx` 让 GDI **安装**它，安装器只认 BMP 的 format 4 —— 于是字体面创建失败，
 * 所有图标变成缺字方块。上游全量字体里那张 (3,1) format 4 是零映射的兼容桩，必须补回去。
 * 详见 issue #1669 与 `vite/scripts/subsetMdiFont.ts` 顶部注释。
 */

/** sfnt 表目录里的一项（校验和与 tag 顺序由重建逻辑负责，读取时只关心定位信息）。 */
export interface SfntTableRecord {
  tag: string;
  offset: number;
  length: number;
}

/** cmap 里的一张子表（只需知道平台/编码/格式即可判断 GDI 兼容性）。 */
export interface CmapSubtable {
  platformID: number;
  encodingID: number;
  format: number;
}

const SFNT_CHECKSUM_MAGIC = 0xb1b0afba;

/**
 * 空的 format 4 子表：只有一段 0xFFFF 终止段，不含任何映射。
 * 与上游全量 MDI 字体的 (3,1) 子表逐字节一致（segCount=1、searchRange=2、idDelta=1）。
 */
const EMPTY_FORMAT4_CMAP = Buffer.from([
  0x00,
  0x04, // format = 4
  0x00,
  0x18, // length = 24
  0x00,
  0x00, // language
  0x00,
  0x02, // segCountX2 = 2（1 段）
  0x00,
  0x02, // searchRange
  0x00,
  0x00, // entrySelector
  0x00,
  0x00, // rangeShift
  0xff,
  0xff, // endCode[0]
  0x00,
  0x00, // reservedPad
  0xff,
  0xff, // startCode[0]
  0x00,
  0x01, // idDelta[0]
  0x00,
  0x00, // idRangeOffset[0]
]);

export function readSfntTables(sfnt: Buffer): SfntTableRecord[] {
  if (sfnt.length < 12) throw new Error("不是 sfnt 字体：文件头不足 12 字节");
  const numTables = sfnt.readUInt16BE(4);
  const tables: SfntTableRecord[] = [];
  for (let i = 0; i < numTables; i++) {
    const p = 12 + i * 16;
    if (p + 16 > sfnt.length) throw new Error(`不是 sfnt 字体：表目录第 ${i} 项越界`);
    const tag = sfnt.toString("latin1", p, p + 4);
    const offset = sfnt.readUInt32BE(p + 8);
    const length = sfnt.readUInt32BE(p + 12);
    if (offset + length > sfnt.length) {
      throw new Error(`sfnt 表 ${tag} 越界（offset=${offset}, length=${length}, size=${sfnt.length}）`);
    }
    tables.push({ tag, offset, length });
  }
  return tables;
}

export function readCmapSubtables(sfnt: Buffer): CmapSubtable[] {
  const cmap = readSfntTables(sfnt).find((t) => t.tag === "cmap");
  if (!cmap) return [];
  const buf = sfnt.subarray(cmap.offset, cmap.offset + cmap.length);
  const count = buf.readUInt16BE(2);
  const subtables: CmapSubtable[] = [];
  for (let i = 0; i < count; i++) {
    const p = 4 + i * 8;
    const offset = buf.readUInt32BE(p + 4);
    subtables.push({
      platformID: buf.readUInt16BE(p),
      encodingID: buf.readUInt16BE(p + 2),
      format: buf.readUInt16BE(offset),
    });
  }
  return subtables;
}

/** 字体是否带 BMP 的 (3,1) format 4 子表 —— Windows GDI 安装字体的前提。 */
export function hasBmpCmapSubtable(font: Buffer): boolean {
  return readCmapSubtables(font).some((s) => s.platformID === 3 && s.encodingID === 1 && s.format === 4);
}

/**
 * 若字体缺少 (3,1) format 4 子表，则补一张零映射的兼容桩，并重建整个 sfnt。
 * 已经有（例如子集里含 BMP 码位时 harfbuzz 自己生成了）就原样返回。
 */
export function ensureBmpCmapSubtable(sfnt: Buffer): { font: Buffer; added: boolean } {
  const records = readSfntTables(sfnt);
  const cmapRecord = records.find((t) => t.tag === "cmap");
  if (!cmapRecord) throw new Error("字体没有 cmap 表，无法补 BMP 兼容子表");

  const cmapBuf = sfnt.subarray(cmapRecord.offset, cmapRecord.offset + cmapRecord.length);
  const count = cmapBuf.readUInt16BE(2);
  const subtables: { platformID: number; encodingID: number; data: Buffer }[] = [];
  for (let i = 0; i < count; i++) {
    const p = 4 + i * 8;
    const offset = cmapBuf.readUInt32BE(p + 4);
    const length = cmapSubtableLength(cmapBuf, offset);
    subtables.push({
      platformID: cmapBuf.readUInt16BE(p),
      encodingID: cmapBuf.readUInt16BE(p + 2),
      data: cmapBuf.subarray(offset, offset + length),
    });
  }

  const alreadyPresent = subtables.some(
    (s) => s.platformID === 3 && s.encodingID === 1 && s.data.readUInt16BE(0) === 4,
  );
  if (alreadyPresent) return { font: sfnt, added: false };

  subtables.push({ platformID: 3, encodingID: 1, data: EMPTY_FORMAT4_CMAP });
  subtables.sort((a, b) => a.platformID - b.platformID || a.encodingID - b.encodingID);

  const headerLength = 4 + subtables.length * 8;
  const offsets: number[] = [];
  let cursor = headerLength;
  for (const subtable of subtables) {
    offsets.push(cursor);
    cursor += subtable.data.length;
  }
  const newCmap = Buffer.alloc(cursor);
  newCmap.writeUInt16BE(0, 0); // version
  newCmap.writeUInt16BE(subtables.length, 2);
  subtables.forEach((subtable, i) => {
    const p = 4 + i * 8;
    newCmap.writeUInt16BE(subtable.platformID, p);
    newCmap.writeUInt16BE(subtable.encodingID, p + 2);
    newCmap.writeUInt32BE(offsets[i], p + 4);
    subtable.data.copy(newCmap, offsets[i]);
  });

  const font = rebuildSfnt(
    records.map((record) => ({
      tag: record.tag,
      data: record.tag === "cmap" ? newCmap : sfnt.subarray(record.offset, record.offset + record.length),
    })),
  );
  return { font, added: true };
}

function cmapSubtableLength(cmap: Buffer, offset: number): number {
  const format = cmap.readUInt16BE(offset);
  switch (format) {
    case 0:
    case 2:
    case 4:
    case 6:
      return cmap.readUInt16BE(offset + 2);
    case 8:
    case 10:
    case 12:
    case 13:
      return cmap.readUInt32BE(offset + 4);
    case 14:
      return cmap.readUInt32BE(offset + 2);
    default:
      throw new Error(`未知的 cmap 子表格式 ${format}（offset=${offset}）`);
  }
}

/** 按 sfnt 规范重建文件：表目录按 tag 排序、每表 4 字节对齐、重算全部校验和。 */
function rebuildSfnt(entries: { tag: string; data: Buffer }[]): Buffer {
  const sorted = [...entries].sort((a, b) => (a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0));
  const numTables = sorted.length;

  let searchRange = 1;
  let entrySelector = 0;
  while (searchRange * 2 <= numTables) {
    searchRange *= 2;
    entrySelector += 1;
  }
  searchRange *= 16;
  const rangeShift = numTables * 16 - searchRange;

  let size = 12 + numTables * 16;
  const placed = sorted.map((entry) => {
    const offset = (size + 3) & ~3;
    // head 的 checkSumAdjustment 必须先置零再算表校验和（规范要求），最后整文件回填。
    const data = entry.tag === "head" ? zeroHeadAdjustment(entry.data) : entry.data;
    size = offset + ((data.length + 3) & ~3);
    return { tag: entry.tag, data, offset };
  });

  const out = Buffer.alloc(size);
  out.writeUInt32BE(0x00010000, 0); // sfnt version
  out.writeUInt16BE(numTables, 4);
  out.writeUInt16BE(searchRange, 6);
  out.writeUInt16BE(entrySelector, 8);
  out.writeUInt16BE(rangeShift, 10);

  placed.forEach((entry, i) => {
    const p = 12 + i * 16;
    out.write(entry.tag, p, 4, "latin1");
    out.writeUInt32BE(tableChecksum(entry.data), p + 4);
    out.writeUInt32BE(entry.offset, p + 8);
    out.writeUInt32BE(entry.data.length, p + 12);
    entry.data.copy(out, entry.offset);
  });

  const head = placed.find((entry) => entry.tag === "head");
  if (!head) throw new Error("字体没有 head 表");
  out.writeUInt32BE((SFNT_CHECKSUM_MAGIC - tableChecksum(out)) >>> 0, head.offset + 8);
  return out;
}

function zeroHeadAdjustment(head: Buffer): Buffer {
  if (head.length < 12) throw new Error("head 表长度不足 12 字节");
  const copy = Buffer.from(head);
  copy.writeUInt32BE(0, 8);
  return copy;
}

function tableChecksum(buf: Buffer): number {
  let sum = 0;
  const end = (buf.length + 3) & ~3;
  for (let i = 0; i < end; i += 4) {
    const word =
      (((buf[i] ?? 0) << 24) | ((buf[i + 1] ?? 0) << 16) | ((buf[i + 2] ?? 0) << 8) | (buf[i + 3] ?? 0)) >>> 0;
    sum = (sum + word) >>> 0;
  }
  return sum >>> 0;
}
