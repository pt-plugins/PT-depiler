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
import { intersection } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { intervalToDuration } from "date-fns";

export const MinVipLevelId = 100;
export const MinManagerLevelId = 200;

export function cleanLevelName(levelName: string): string {
  return levelName.replace(/[\s _]+/g, "").toLowerCase();
}

const ratioCountMap = {
  ratio: ["uploaded", "downloaded"],
  trueRatio: ["trueUploaded", "trueDownloaded"],
};

export function fixRatio(userInfo: Partial<IUserInfo>, ratioKey: "ratio" | "trueRatio" = "ratio"): number {
  let ratio = -1;
  if (typeof userInfo[ratioKey] === "undefined") {
    const [uploadedKey, downloadedKey] = ratioCountMap[ratioKey];
    const { [uploadedKey]: uploaded = 0, [downloadedKey]: downloaded = 0 } = userInfo;

    if (downloaded == 0 && uploaded == 0) {
      return -Infinity;
    } else if (downloaded == 0 && uploaded > 0) {
      ratio = Infinity; // 没有下载量时设置分享率为无限
    } else if (downloaded > 0) {
      ratio = uploaded / downloaded;
    }
  } else {
    ratio = userInfo[ratioKey];
  }
  return ratio;
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
  const levelRequirementKeys = Object.keys(levelRequirement);

  // 比较加入时间
  if (levelRequirement.interval) {
    const baseTimeInfo = userInfo.joinTime ?? currentTime;
    const passTime = convertIsoDurationToDate(levelRequirement.interval, baseTimeInfo);
    if (passTime > currentTime) {
      const leftDuration = intervalToDuration({ start: baseTimeInfo, end: currentTime });
      let interval = "P";
      if (leftDuration.years) interval += `${leftDuration.years}Y`;
      if (leftDuration.months) interval += `${leftDuration.months}M`;
      if (leftDuration.days) interval += `${leftDuration.days}D`;
      unmetRequirement.interval = interval; // 只保留日期部分
    }
  }

  // 比较 totalTraffic, downloaded, trueDownloaded, uploaded, trueUploaded, seedingSize 等体积类字段需求
  for (const currentSizeElement of intersection(
    ["totalTraffic", "downloaded", "trueDownloaded", "uploaded", "trueUploaded", "seedingSize"],
    levelRequirementKeys,
  )) {
    let currentSizeRequirement = levelRequirement[currentSizeElement];

    if (typeof currentSizeRequirement === "string") {
      currentSizeRequirement = parseSizeString(currentSizeRequirement);
    }

    const baseSizeInfo = userInfo[currentSizeElement] ?? 0;
    if (baseSizeInfo < currentSizeRequirement) {
      unmetRequirement[currentSizeElement] = currentSizeRequirement - baseSizeInfo;
    }
  }

  // 比较 ratio, trueRatio 等比率类字段需求，首先计算并设置 ratio
  userInfo.ratio = fixRatio(userInfo);
  userInfo.trueRatio = fixRatio(userInfo, "trueRatio");

  for (const currentRatioElement of intersection(["ratio", "trueRatio"], levelRequirementKeys)) {
    let currentRatioRequirement = levelRequirement[currentRatioElement];

    if (typeof currentRatioRequirement === "string") {
      currentRatioRequirement = parseFloat(currentRatioRequirement);
    }

    if ((userInfo[currentRatioElement] ?? -1) < currentRatioRequirement) {
      unmetRequirement[currentRatioElement] = levelRequirement[currentRatioElement]; // 无法做差比较，直接使用设置
    }
  }

  // 比较 seedingTime, averageSeedingTime 等时间长度类字段需求
  for (const currentDurationElement of intersection(["seedingTime", "averageSeedingTime"], levelRequirementKeys)) {
    let currentDurationRequirement = levelRequirement[currentDurationElement];

    if (typeof currentDurationRequirement === "string") {
      // 将 isoDuration 转为 秒！！！
      currentDurationRequirement =
        (convertIsoDurationToDate(currentDurationRequirement as isoDuration, currentTime) - currentTime) / 1e3;
    }

    const baseDurationInfo = userInfo[currentDurationElement] ?? 0;
    if (baseDurationInfo < currentDurationRequirement) {
      unmetRequirement[currentDurationElement] = currentDurationRequirement - baseDurationInfo;
    }
  }

  // 比较 bonus, bonusPerHour, seedingBonus, uploads, leeching, snatches, posts 等应该大于的字段
  for (const currentGtElement of intersection(
    ["bonus", "bonusPerHour", "seedingBonus", "uploads", "leeching", "snatches", "posts"],
    levelRequirementKeys,
  )) {
    let currentGtRequirement = levelRequirement[currentGtElement];
    const baseGtInfo = userInfo[currentGtElement] ?? 0;

    if (baseGtInfo < currentGtRequirement) {
      unmetRequirement[currentGtElement] = currentGtRequirement - baseGtInfo;
    }
  }

  // 比较 hnrUnsatisfied 等应该小于等于的字段
  for (const currentLtElement of intersection(["hnrUnsatisfied"], levelRequirementKeys)) {
    let currentLtRequirement = levelRequirement[currentLtElement];
    const baseLtInfo = userInfo[currentLtElement] ?? 0;

    if (baseLtInfo > currentLtRequirement) {
      unmetRequirement[currentLtElement] = baseLtInfo - currentLtRequirement;
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
): Partial<IImplicitUserInfo & { level?: ILevelRequirement }> {
  let nextLevelUnMet: Partial<IImplicitUserInfo> = {};

  const currentLevelId = userInfo.levelId ?? -1;
  if (currentLevelId < getMaxUserLevelId(levelRequirements)) {
    const nextLevelRequirement = levelRequirements.find((level) => level.id > currentLevelId);
    nextLevelUnMet = { ...levelRequirementUnMet(userInfo, nextLevelRequirement!), level: nextLevelRequirement };
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
  for (const levelIndex in levelRequirements ?? []) {
    const testLevelRequirement = levelRequirements[levelIndex];
    if (!isLevelRequirementMet(userInfo, testLevelRequirement)) {
      // 这个 level 对应的条件没有满足，返回上一个 level 的 id
      const prevLevelIndex = parseInt(levelIndex) - 1;
      if (prevLevelIndex >= 0) {
        testLevel = levelRequirements[prevLevelIndex].id;
      }

      break;
    }
  }

  return testLevel;
}
