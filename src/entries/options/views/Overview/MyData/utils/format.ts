import { isValid } from "date-fns";

import { fixRatio, IUserInfo } from "@ptd/site";
import { deepToRaw } from "@/options/utils.ts";

export function fixUserInfo<T extends IUserInfo = IUserInfo>(userInfo: Partial<T>): Required<T> {
  userInfo = deepToRaw(userInfo);
  userInfo.ratio = fixRatio(userInfo);
  userInfo.trueRatio = fixRatio(userInfo, "trueRatio");
  userInfo.messageCount ??= 0;

  if (typeof userInfo.joinTime !== "number") {
    if (isValid(new Date(userInfo.joinTime!))) {
      userInfo.joinTime = new Date(userInfo.joinTime!).getTime();
    }
  }

  return userInfo as Required<T>;
}

export function realFormatRatio(ratio: number): string | "∞" | "" {
  if (ratio > 10000 || ratio === -1 || ratio === Infinity || ratio === null) {
    return "∞";
  }

  if (isNaN(ratio) || ratio === -Infinity) {
    return "-";
  }

  return ratio.toFixed(2);
}

export function formatRatio(
  userInfo: Partial<IUserInfo>,
  ratioKey: "ratio" | "trueRatio" = "ratio",
): string | "∞" | "" {
  let ratio = Number((userInfo[ratioKey] as string | number | undefined) ?? -1);
  return realFormatRatio(ratio);
}
