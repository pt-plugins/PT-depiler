import JSZip from "jszip";
import CryptoJS from "crypto-js";
import { EListOrderBy, EListOrderMode } from "./type";
import type {
  IBackupData,
  IBackupFileInfo,
  IBackupFileListOption,
  IBackupFileManifest,
  IBackupRetention,
  IBackupRetentionSampleRule,
} from "./type";
import { omit } from "es-toolkit";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/** 时间窗口采样的默认规则（仅用于 UI 提示），单位为天 */
export const DEFAULT_BACKUP_RETENTION_SAMPLE_RULES = {
  day: { interval: 1, horizon: 7 },
  week: { interval: 7, horizon: 4 },
  month: { interval: 30, horizon: 6 },
  year: { interval: 365, horizon: 2 },
} as const satisfies Record<string, IBackupRetentionSampleRule>;

/** 一条保留规则 */
type TBackupRetentionPlan =
  | { type: "age"; keepAfter: number } // 保留 `keepAfter` 之后的全部备份
  | { type: "window"; interval: number; horizon: number; end: number }; // 保留若干时间窗口内各最新的一份备份

/**
 * 将用户配置的保留策略展开为一组有序的规则，顺序与 Borg 的 prune 语义一致：
 * 先按「按时间期限保留」整段保留，再按窗口宽度从大到小依次采样。
 *
 * 同一份备份只要被任意一条规则命中，就一定会被保留，
 * 因此叠加多条规则得到的清理结果总是「比单条规则更保守」的。
 *
 * @returns 若返回空数组，说明当前保留策略不会清理任何备份
 */
function getBackupRetentionPlan(retention?: IBackupRetention, now: number = Date.now()): TBackupRetentionPlan[] {
  const plans: TBackupRetentionPlan[] = [];

  const maxAge = retention?.time?.enabled ? (retention.time.maxAge ?? 0) : 0;
  if (maxAge > 0) {
    // 时间期限内的备份全部保留
    plans.push({ type: "age", keepAfter: now - maxAge * MILLISECONDS_PER_DAY });
  }

  if (retention?.sample?.enabled) {
    const samplePlans = Object.values(retention.sample.rules ?? {})
      .filter((rule) => !!rule && rule.interval > 0 && rule.horizon > 0)
      .map((rule) => ({ type: "window", interval: rule.interval, horizon: rule.horizon, end: now }) as const);

    // 窗口宽度更大的规则优先级更高，从而先在更长的时间窗口内选出需要保留的备份
    samplePlans.sort((a, b) => b.interval - a.interval);
    plans.push(...samplePlans);
  }

  return plans;
}

/**
 * 判断是否配置了会实际生效的保留策略（按时间期限 / 按数量 / 时间窗口采样）
 */
export function hasBackupRetentionToApply(retention?: IBackupRetention): boolean {
  if (retention?.time?.enabled && (retention.time.maxAge ?? 0) > 0) {
    return true;
  }
  if (retention?.count?.enabled && (retention.count.maxCount ?? 0) > 0) {
    return true;
  }
  return !!(
    retention?.sample?.enabled &&
    Object.values(retention.sample.rules ?? {}).some((rule) => rule && rule.interval > 0 && rule.horizon > 0)
  );
}

/**
 * 根据保留策略挑选出需要清理的备份文件，返回 `[需要清理的备份, 需要保留的备份]`
 *
 * 传入的 `files` 需要按备份时间从新到旧排序（即 `AbstractBackupServer.list()` 的返回结果）。
 */
export function pruneBackupFiles(
  files: IBackupFileInfo[],
  retention?: IBackupRetention,
  now: number = Date.now(),
): [IBackupFileInfo[], IBackupFileInfo[]] {
  const plans = getBackupRetentionPlan(retention, now);
  const maxCount = retention?.count?.enabled ? (retention.count.maxCount ?? 0) : 0;

  // 未配置有效的保留策略，则不清理任何备份
  if (plans.length === 0 && maxCount <= 0) {
    return [[], files];
  }

  const keptPaths = new Set<string>();
  const keptFiles: IBackupFileInfo[] = [];

  const keep = (file?: IBackupFileInfo) => {
    if (file && !keptPaths.has(file.path)) {
      keptPaths.add(file.path);
      keptFiles.push(file);
    }
  };

  for (const plan of plans) {
    if (plan.type === "age") {
      // 按时间期限保留：期限内的备份全部保留（正好等于期限的备份视为已过期）
      files.filter((file) => file.time > plan.keepAfter).forEach(keep);
      continue;
    }

    // 时间窗口采样：从最近的窗口开始向前逐个窗口，每个窗口内只保留最新的一份备份。
    // 使用备份自身的 time 计算窗口编号，避免时区与夏令时带来的偏差。
    const windowSize = plan.interval * MILLISECONDS_PER_DAY;
    let bucket = Math.floor((plan.end - 1) / windowSize);
    for (let i = 0; i < plan.horizon; i++) {
      keep(files.find((file) => Math.floor(file.time / windowSize) === bucket));
      bucket -= 1;
    }
  }

  // 按数量保留：保留最新的 maxCount 份备份
  if (maxCount > 0) {
    files.slice(0, maxCount).forEach(keep);
  }

  const deletedFiles = files.filter((file) => !keptPaths.has(file.path));

  return [deletedFiles, keptFiles];
}

/**
 * 注意，我们不直接使用用户提供的 secretKey 作为 AES 的密钥，因为可能无法提供足够强度的密钥
 */
export function encryptData(data: any, encryptionKey?: string): string {
  const stringifyData = JSON.stringify(data);
  if (!encryptionKey) {
    return stringifyData;
  }
  const the_key = CryptoJS.MD5(encryptionKey).toString().substring(0, 16);
  return CryptoJS.AES.encrypt(stringifyData, the_key).toString();
}

export function decryptData<T = any>(data: string, encryptionKey?: string): T {
  if (!encryptionKey) {
    return JSON.parse(data);
  }
  const the_key = CryptoJS.MD5(encryptionKey).toString().substring(0, 16);
  const decrypted = CryptoJS.AES.decrypt(data, the_key).toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted) as T;
}

export async function backupDataToJSZipBlob(data: IBackupData, encryptionKey?: string): Promise<Blob> {
  const zip = new JSZip();

  const manifest = {
    ...(data.manifest ?? {}),
    encryption: typeof encryptionKey === "string" && encryptionKey !== "",
    time: new Date().getTime(),
    files: {},
  } as IBackupFileManifest;

  delete data.manifest; // 确保 manifest 不会被重复添加到 zip 中
  for (const [key, value] of Object.entries(data)) {
    const fileName = `${key}.json`;
    const fileContent = encryptData(value, encryptionKey);
    zip.file(fileName, fileContent);
    manifest.files[key] = { name: fileName, hash: CryptoJS.MD5(fileContent).toString() };
  }

  zip.file("manifest.json", JSON.stringify(manifest));

  return await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } });
}

export async function jsZipBlobToBackupData(blob: Blob, encryptionKey?: string): Promise<IBackupData> {
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(blob);
  const data = {} as IBackupData;

  // 首先解出 manifest.json 的内容
  const manifest = await zipContent
    .file("manifest.json")
    ?.async("string")
    .then((content) => {
      return JSON.parse(content) as IBackupFileManifest;
    });

  if (manifest?.files) {
    if (!manifest.encryption && encryptionKey) {
      encryptionKey = "";
    }

    // 只解出 manifest 中记录的其他文件
    for (const [fileKey, manifestFileData] of Object.entries(omit(manifest.files ?? {}, ["manifest"]))) {
      const { name: fileName, hash: manifestFileHash } = manifestFileData;
      const fileContent = await zipContent.file(fileName)?.async("string");
      if (fileContent) {
        const fileContentHash = CryptoJS.MD5(fileContent).toString();
        if (fileKey != "manifest" && fileContentHash !== manifestFileHash) {
          throw new Error(`File hash mismatch for ${fileName}.`);
        }

        try {
          data[fileKey] = decryptData(fileContent, encryptionKey);
        } catch (e) {
          throw new Error(`Failed to decrypt file: ${fileName}`);
        }
      }
    }
    data.manifest = manifest; // 将 manifest 也添加到数据中
  } else {
    throw new Error("Manifest not found in the zip file");
  }

  return data;
}

export function localSort(files: IBackupFileInfo[], options: IBackupFileListOption): IBackupFileInfo[] {
  if (files.length > 0 && Object.keys(options).length > 0) {
    const orderMode: EListOrderMode = options.orderMode ?? EListOrderMode.desc;
    const orderBy: EListOrderBy = options.orderBy ?? EListOrderBy.time;

    files.sort((a, b) => {
      let v1, v2;
      switch (orderBy) {
        case EListOrderBy.name:
          v1 = a.filename;
          v2 = b.filename;
          break;
        case EListOrderBy.size:
          v1 = a.size;
          v2 = b.size;
          break;

        case EListOrderBy.time:
        default:
          v1 = a.time;
          v2 = b.time;
          break;
      }

      const compareRep = v1.toString().localeCompare(v2.toString());
      return orderMode === EListOrderMode.desc ? -compareRep : compareRep;
    });
  }

  return files;
}
