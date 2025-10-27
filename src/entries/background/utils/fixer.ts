import { isValid } from "date-fns";
import { extStorage } from "@/storage.ts";
import type { TUserInfoStorageSchema, IStoredUserInfo } from "@/shared/types.ts";

// 修复用户信息中的坏数据
function fixStoredUserInfo(userInfo: Partial<IStoredUserInfo>): { fixed: IStoredUserInfo; hasChanges: boolean } {
  const fixed = { ...userInfo } as IStoredUserInfo;
  let hasChanges = false;

  // 修复 ratio 和 trueRatio，如果是字符串则尝试转换为数字
  // noinspection SuspiciousTypeOfGuard
  if (typeof userInfo.ratio === "string") {
    const ratioNum = parseFloat(userInfo.ratio);
    if (!isNaN(ratioNum)) {
      fixed.ratio = Math.round(ratioNum * 100) / 100;
      hasChanges = true;
    }
  }

  // noinspection SuspiciousTypeOfGuard
  if (typeof userInfo.trueRatio === "string") {
    const trueRatioNum = parseFloat(userInfo.trueRatio);
    if (!isNaN(trueRatioNum)) {
      fixed.trueRatio = Math.round(trueRatioNum * 100) / 100;
      hasChanges = true;
    }
  }

  // 修复 seeding，如果是字符串则尝试转换为数字
  // noinspection SuspiciousTypeOfGuard
  if (typeof userInfo.seeding === "string") {
    const seedingNum = parseInt(userInfo.seeding);
    fixed.seeding = isNaN(seedingNum) ? 0 : seedingNum;
    hasChanges = true;
  }

  // 修复 joinTime
  // noinspection SuspiciousTypeOfGuard
  if (typeof userInfo.joinTime === "string") {
    let joinTime = new Date(userInfo.joinTime);
    if (isValid(joinTime)) {
      fixed.joinTime = +joinTime;
      hasChanges = true;
    }
  }

  return { fixed, hasChanges };
}

// 修复所有存储的用户信息数据
export async function fixAllStoredUserInfo(): Promise<void> {
  try {
    const userInfoStore = ((await extStorage.getItem("userInfo")) ?? {}) as TUserInfoStorageSchema;

    let hasChanges = false;
    const fixedUserInfoData = {} as TUserInfoStorageSchema;

    for (const [siteId, siteUserInfo] of Object.entries(userInfoStore)) {
      fixedUserInfoData[siteId] = {};
      for (const [date, userInfo] of Object.entries(siteUserInfo)) {
        const result = fixStoredUserInfo(userInfo);

        // 检查是否有变化
        if (result.hasChanges) {
          hasChanges = true;
        }

        fixedUserInfoData[siteId][date] = result.fixed;
      }
    }

    // 只有当有变化时才更新存储
    if (hasChanges) {
      await extStorage.setItem("userInfo", fixedUserInfoData);
      console.debug("[PTD] Fixed corrupted user info data");
    }
  } catch (error) {
    console.error("[PTD] Error fixing user info data:", error);
  }
}
