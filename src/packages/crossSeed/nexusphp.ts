/**
 * NexusPHP pieces-hash 站点直查源。
 * @see docs/nexusphp-pieces-hash-research.md（2023-07-26 随 v1.8.5 引入；POST /api/pieces-hash）
 * 协议：POST {apiUrl}?passkey=<passkey>，JSON body { "pieces_hash": ["<40位sha1>", ...] }
 * 返回：{ "code": 0, "data": { "<pieces_hash>": <torrent_id>, ... } }；单次上限 100 个。
 */
import axios from "axios";

/** 单次查询上限（服务端 getPiecesHashCache 硬限制 100） */
export const NEXUS_PIECES_HASH_BATCH = 100;

export interface INexusPiecesHashResp {
  code?: number;
  data?: Record<string, number>;
  msg?: string;
}

/**
 * 批量查询 pieces_hash → torrent_id 映射（自动按 100/批拆分）。
 * 某一批无命中（业务文案「未查询到可辅种数据」等）按空结果处理，不中断整体。
 */
export async function nexusQueryPiecesHash(
  apiUrl: string,
  passkey: string,
  hashes: string[],
): Promise<Record<string, number>> {
  if (!hashes.length) return {};
  const out: Record<string, number> = {};
  for (let i = 0; i < hashes.length; i += NEXUS_PIECES_HASH_BATCH) {
    const batch = hashes.slice(i, i + NEXUS_PIECES_HASH_BATCH);
    const { data } = await axios.post<INexusPiecesHashResp>(
      apiUrl,
      { pieces_hash: batch },
      {
        params: { passkey },
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        timeout: 30e3,
      },
    );
    if (data.code !== undefined && data.code !== 0) {
      const msg = data.msg ?? "";
      // 该批无命中属于正常空结果
      if (/未查询到可辅种数据|暂无.*辅种|没有.*辅种/.test(msg)) {
        continue;
      }
      throw new Error(msg || "NexusPHP pieces-hash 查询失败");
    }
    Object.assign(out, data.data ?? {});
  }
  return out;
}

/** 把 pieces_hash 命中映射为统一候选构建输入（站点上下文化在聚合层完成） */
export interface INexusPiecesHashHit {
  piecesHash: string;
  torrentId: number;
}

export function mapNexusHits(result: Record<string, number>): INexusPiecesHashHit[] {
  return Object.entries(result).map(([piecesHash, torrentId]) => ({ piecesHash, torrentId }));
}
