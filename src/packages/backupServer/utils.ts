import type { IBackupFileInfo, IBackupFileListOption } from "./type.ts";
import { EListOrderBy, EListOrderMode } from "./type.ts";

export function localSort(
  files: IBackupFileInfo[],
  options: IBackupFileListOption
): IBackupFileInfo[] {
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
