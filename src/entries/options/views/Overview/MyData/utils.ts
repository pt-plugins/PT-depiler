import { IUserInfo } from "@ptd/site";

export function getFixedRatio(
  userInfo: Partial<Pick<IUserInfo, "uploaded" | "downloaded" | "ratio">>,
): string | "∞" | "" {
  let ratio = userInfo.ratio ?? -1;

  if (ratio === -1) {
    if (userInfo.uploaded && userInfo.downloaded) {
      ratio = userInfo.uploaded / userInfo.downloaded;
    }
  }

  if (ratio > 10000) {
    return "∞";
  }

  if (ratio === -1 || isNaN(ratio)) {
    return "";
  }

  return ratio.toFixed(2);
}
