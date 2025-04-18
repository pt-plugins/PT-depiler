import type { IUserInfo } from "@ptd/site";
import { EResultParseStatus } from "@ptd/site";

import { onMessage, sendMessage } from "@/messages.ts";
import { getSiteInstance } from "@/shared/adapters/site.ts";
import type { IMetadataPiniaStorageSchema } from "@/shared/storages/types/metadata.ts";

onMessage("getSiteUserInfoResult", async ({ data: siteId }) => {
  const site = await getSiteInstance<"private">(siteId);

  // 获取历史信息
  const metadataStoreRaw = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
  let lastUserInfo = metadataStoreRaw?.lastUserInfo?.[siteId as string] ?? {};
  if ((lastUserInfo as IUserInfo).status !== EResultParseStatus.success) {
    lastUserInfo = {} as IUserInfo;
  }

  let userInfo = await site.getUserInfoResult(lastUserInfo);
  await sendMessage("setSiteLastUserInfo", userInfo as IUserInfo);
  return userInfo;
});
