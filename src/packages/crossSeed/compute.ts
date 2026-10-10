/**
 * pieces 哈希计算（nexus 源直查、local 源精确比对的公共原语）。
 * pieces_hash = sha1(torrent info.pieces) —— 与 infohash 不同，不受 announce/private 影响，
 * 跨站同文件种子的 pieces 串一致，故可作跨站辅种匹配键。
 */
export async function sha1Hex(data: Uint8Array | ArrayBuffer): Promise<string> {
  const source: BufferSource = data instanceof Uint8Array ? (data as unknown as BufferSource) : (data as ArrayBuffer);
  const digest = await crypto.subtle.digest("SHA-1", source);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** 由 torrent 解析出的 info.pieces（Uint8Array/Buffer）计算 pieces_hash */
export async function piecesHashFromInfoPieces(pieces: Uint8Array): Promise<string> {
  return sha1Hex(pieces);
}
