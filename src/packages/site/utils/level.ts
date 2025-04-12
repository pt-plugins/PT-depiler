import {
  convertIsoDurationToDate,
  IImplicitUserInfo,
  ILevelRequirement,
  isoDuration,
  IUserInfo,
  parseSizeString,
  TLevelGroupType,
  TLevelId,
} from "@ptd/site";
import { omit } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";

export const MinVipLevelId = 100;
export const MinManagerLevelId = 200;

export function cleanLevelName(levelName: string): string {
  return levelName.replace(/[\s _]+/g, "").toLowerCase();
}

export function guessUserLevelGroupType(levelName: string): TLevelGroupType {
  let userLevel = levelName.toLowerCase();
  let specialNames: Record<"manager" | "vip", string[]> = {
    manager: [
      "admin",
      "moderator",
      "sys",
      "retire",
      "uploader",
      "管理",
      "版主",
      "发种",
      "保种",
      "上传",
      "退休",
      "开发",
    ],
    vip: ["vip", "贵宾"],
  };
  let res = "user";
  for (const [k, levelNames] of Object.entries(specialNames)) {
    if (levelNames.some((n: string) => userLevel?.includes(n))) {
      res = k;
      break;
    }
  }
  return res as TLevelGroupType;
}

export function levelRequirementUnMet(
  userInfo: IUserInfo,
  levelRequirement: ILevelRequirement,
): Partial<Omit<ILevelRequirement, "id" | "name" | "groupType" | "privilege">> {
  const unmetRequirement: Partial<Omit<ILevelRequirement, "id" | "name" | "groupType" | "privilege">> = {};
  const currentTime = +new Date();
  const compareRequirement = omit(levelRequirement, ["id", "name", "groupType", "alternative", "privilege"]);

  // 比较加入时间
  if (compareRequirement.interval) {
    const passTime = convertIsoDurationToDate(compareRequirement.interval, userInfo.joinTime ?? currentTime);
    if (passTime > currentTime) {
      unmetRequirement.interval = compareRequirement.interval;
    }
  }

  // 比较 totalTraffic, downloaded, trueDownloaded, uploaded, trueUploaded, seedingSize 等体积类字段需求
  for (const currentSizeElement of [
    "totalTraffic",
    "downloaded",
    "trueDownloaded",
    "uploaded",
    "trueUploaded",
    "seedingSize",
  ] as unknown as (keyof ILevelRequirement)[]) {
    let currentSizeRequirement = compareRequirement[currentSizeElement];
    if (typeof currentSizeRequirement === "undefined") {
      continue; // 如果没有这个字段要求则跳过
    }

    if (typeof currentSizeRequirement === "string") {
      currentSizeRequirement = parseSizeString(currentSizeRequirement);
    }

    if ((userInfo[currentSizeElement] ?? 0) < currentSizeRequirement) {
      unmetRequirement[currentSizeElement] = currentSizeRequirement;
    }
  }

  // 比较 ratio, trueRatio 等比率类字段需求，首先计算并设置 ratio
  if (typeof userInfo.ratio === "undefined") {
    let { uploaded = 0, downloaded = 0, ratio = -1 } = userInfo;
    if (downloaded == 0 && uploaded > 0) {
      ratio = Infinity; // 没有下载量时设置分享率为无限
    } else if (downloaded > 0) {
      ratio = uploaded / downloaded;
    }
    userInfo.ratio = ratio;
  }
  if (typeof userInfo.trueRatio === "undefined") {
    let { trueUploaded = 0, trueDownloaded = 0, trueRatio = -1 } = userInfo;
    if (trueDownloaded == 0 && trueUploaded > 0) {
      trueRatio = Infinity; // 没有下载量时设置分享率为无限
    } else if (trueDownloaded > 0) {
      trueRatio = trueUploaded / trueDownloaded;
    }
    userInfo.trueRatio = trueRatio;
  }

  for (const currentRatioElement of ["ratio", "trueRatio"] as unknown as (keyof ILevelRequirement)[]) {
    let currentRatioRequirement = compareRequirement[currentRatioElement];
    if (typeof currentRatioRequirement === "undefined") {
      continue; // 如果没有这个字段要求则跳过
    }

    if (typeof currentRatioRequirement === "string") {
      currentRatioRequirement = parseFloat(currentRatioRequirement);
    }

    if ((userInfo[currentRatioElement] ?? -1) < currentRatioRequirement) {
      unmetRequirement[currentRatioElement] = currentRatioRequirement;
    }
  }

  // 比较 seedingTime, averageSeedingTime 等时间长度类字段需求
  for (const currentDurationElement of [
    "seedingTime",
    "averageSeedingTime",
  ] as unknown as (keyof ILevelRequirement)[]) {
    let currentDurationRequirement = compareRequirement[currentDurationElement];
    if (typeof currentDurationRequirement === "undefined") {
      continue; // 如果没有这个字段要求则跳过
    }

    if (typeof currentDurationRequirement === "string") {
      // 将 isoDuration 转为 秒！
      currentDurationRequirement =
        (convertIsoDurationToDate(currentDurationRequirement as isoDuration, currentTime) - currentTime) / 1e3;
    }

    if ((userInfo[currentDurationElement] ?? 0) < currentDurationRequirement) {
      unmetRequirement[currentDurationElement] = currentDurationRequirement;
    }
  }

  // 比较 bonus, bonusPerHour, seedingBonus, uploads, leeching, snatches, posts 等应该大于的字段
  for (const currentGtElement of [
    "bonus",
    "bonusPerHour",
    "seedingBonus",
    "uploads",
    "leeching",
    "snatches",
    "posts",
  ] as unknown as (keyof ILevelRequirement)[]) {
    let currentGtRequirement = compareRequirement[currentGtElement];
    if (typeof currentGtRequirement === "undefined") {
      continue; // 如果没有这个字段要求则跳过
    }
    if ((userInfo[currentGtRequirement] ?? 0) < currentGtRequirement) {
      unmetRequirement[currentGtElement] = currentGtRequirement;
    }
  }

  // 比较 hnrUnsatisfied 等应该小于等于的字段
  for (const currentLtElement of ["hnrUnsatisfied"] as unknown as (keyof ILevelRequirement)[]) {
    let currentLtRequirement = compareRequirement[currentLtElement];
    if (typeof currentLtRequirement === "undefined") {
      continue; // 如果没有这个字段要求则跳过
    }
    if ((userInfo[currentLtElement] ?? 0) > currentLtRequirement) {
      unmetRequirement[currentLtElement] = currentLtRequirement;
    }
  }

  // 比较可选项，可选项中只要有一个满足即可
  if (levelRequirement.alternative) {
    let alternativeUnMet = [];

    for (const alternative of levelRequirement.alternative) {
      alternativeUnMet.push(levelRequirementUnMet(userInfo, alternative as ILevelRequirement));
    }

    alternativeUnMet = alternativeUnMet.filter((x) => !isEmpty(x));

    // 如果没有一个满足则返回 false
    if (alternativeUnMet.length > 0) {
      unmetRequirement.alternative = alternativeUnMet;
    }
  }

  return unmetRequirement;
}

export function isLevelRequirementMet(userInfo: IUserInfo, levelRequirement: ILevelRequirement): boolean {
  return isEmpty(levelRequirementUnMet(userInfo, levelRequirement));
}

export function getMaxUserLevelId(levelRequirements: ILevelRequirement[]): TLevelId {
  return levelRequirements
    .map((x) => ({ ...x, groupType: x.groupType ?? "user" }))
    .filter((x) => x.groupType === "user")
    .reduce((max, current) => (current.id > max ? current.id : max), 0);
}

export function getNextLevelUnMet(
  userInfo: IUserInfo,
  levelRequirements: ILevelRequirement[],
): Partial<IImplicitUserInfo> {
  let nextLevelUnMet: Partial<IImplicitUserInfo> = {};

  const currentLevelId = userInfo.levelId ?? -1;
  if (currentLevelId < getMaxUserLevelId(levelRequirements)) {
    const nextLevelRequirement = levelRequirements.find((level) => level.id > currentLevelId);
    nextLevelUnMet = levelRequirementUnMet(userInfo, nextLevelRequirement!);
  }

  return nextLevelUnMet;
}

export function guessUserLevelId(userInfo: IUserInfo, levelRequirements: ILevelRequirement[]): TLevelId {
  // 首先尝试 levelName 的直接匹配
  let level = levelRequirements.find((level) => cleanLevelName(level.name) == cleanLevelName(userInfo.levelName!));
  if (level) {
    return level.id;
  }

  // 再尝试判断 groupType
  let groupType = guessUserLevelGroupType(userInfo.levelName!);
  if (groupType !== "user") {
    level = levelRequirements.find((level) => level.groupType === groupType);
    if (level) {
      return level.id;
    } else {
      // 如果没有找到，这个人也应该是 vip 或者 manager，则返回一个默认值
      return groupType == "vip" ? MinVipLevelId : MinManagerLevelId;
    }
  }

  // 如果还是没有找到，说明应当是 user 类别的某一个，则尝试通过 userInfo 和 levelRequirements 的具体项匹配
  let testLevel = -1;
  for (const level of levelRequirements ?? []) {
    testLevel = level.id;
    if (!isLevelRequirementMet(userInfo, level)) {
      break;
    }
  }

  return testLevel;
}
