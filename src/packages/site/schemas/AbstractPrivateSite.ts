// 所有PT站点的基类
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { difference, intersection, pascalCase, pick, toMerged, uniq } from "es-toolkit";
import { get, has, set } from "es-toolkit/compat";

import BittorrentSite from "./AbstractBittorrentSite";
import { guessUserLevelId } from "../utils";
import {
  EResultParseStatus,
  NeedLoginError,
  type IElementQuery,
  type ISiteMetadata,
  type IUserInfo,
  type TLevelId,
} from "../types";

export const SchemaMetadata: Partial<ISiteMetadata> = {
  version: -1,
  search: {},
  userInfo: {},
};

export default class PrivateSite extends BittorrentSite {
  get allowQueryUserInfo(): boolean {
    return this.isOnline && !!this.metadata.userInfo && !(this.userConfig.allowQueryUserInfo === false);
  }

  /**
   * 这是一个比较通用的检查是否登录方法，如果不行请考虑覆写扩展
   */
  protected override loggedCheck(res: AxiosResponse, strict: boolean = false): boolean {
    const request = res.request as XMLHttpRequest;
    try {
      if (/doLogin|login|verify|checkpoint|returnto/gi.test(request.responseURL)) {
        return false; // 检查最终的URL看是不是需要登陆
      } else if (res.headers.refresh && /\d+; url=.+(login|verify|checkpoint|returnto).+/gi.test(res.headers.refresh)) {
        return false; // 检查responseHeader有没有重定向
      } else if (strict) {
        const responseText =
          request.responseType === "document" ? request.responseXML?.documentElement.outerHTML : request.responseText;
        if (typeof responseText === "undefined") {
          return false; // 检查最终的Text，如果什么都没有也可能说明需要登陆
        } else if (responseText.length < 800 && /login|auth_form|not authorized/.test(responseText)) {
          return false; // 对Text进行检查，断言 “过短，且中间出现login等字段“ 说明可能需要登陆
        }
      }
    } catch (e) {
      // Catch Nothing
    }

    return true;
  }

  /**
   * 获得当前站点最新的用户信息方法入口
   * 这里 lastUserInfo 以及 保存/更新 UserInfo 均由调用的上层完成
   */
  public async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo: IUserInfo = {
      status: EResultParseStatus.unknownError,
      updateAt: +new Date(),
      site: this.metadata.id,
    };

    if (!this.allowQueryUserInfo || !this.metadata.userInfo?.process) {
      flushUserInfo.status = EResultParseStatus.passParse;
      return flushUserInfo;
    }

    // 如果有 lastUserInfo 则合并
    if (this.metadata.userInfo.pickLast) {
      flushUserInfo = toMerged(flushUserInfo, pick(lastUserInfo, this.metadata.userInfo.pickLast));
    }

    try {
      for (const thisUserInfoProcess of this.metadata.userInfo.process) {
        // 该步骤能够获取的字段
        const processFields = uniq([
          ...(thisUserInfoProcess.fields ?? []),
          ...Object.keys(thisUserInfoProcess.selectors ?? {}),
        ]);
        // 检查相关元素是否均已有
        const existField = intersection(processFields, Object.keys(flushUserInfo));
        if (existField.length === processFields.length) {
          continue; // 如果全部数据都有则直接跳过本轮
        }

        // 更新请求字段，如果字段缺失则跳出循环
        let requestConfig: AxiosRequestConfig = toMerged(
          { url: "/", params: {}, data: {}, responseType: "document" },
          thisUserInfoProcess.requestConfig,
        );
        if (thisUserInfoProcess.assertion) {
          for (const [requiredField, pathKey] of Object.entries(thisUserInfoProcess.assertion)) {
            if (flushUserInfo[requiredField]) {
              if (has(requestConfig, pathKey as string)) {
                let oldData = get(requestConfig, pathKey as string);
                if (oldData && typeof oldData === "string") {
                  oldData = oldData.replace(`$${requiredField}$`, flushUserInfo[requiredField]);
                  set(requestConfig, pathKey as string, oldData);
                }
              } else {
                set(requestConfig, pathKey as string, flushUserInfo[requiredField]);
              }
            } else {
              // noinspection ExceptionCaughtLocallyJS
              throw new Error(`断言字段 ${requiredField} 缺失`);
            }
          }
        }

        // 如果有 requestConfigTransformer，则会在最后一步对请求配置进行处理
        if (typeof thisUserInfoProcess.requestConfigTransformer === "function") {
          requestConfig = thisUserInfoProcess.requestConfigTransformer(requestConfig, flushUserInfo as IUserInfo, this);
        }

        const { data: dataDocument } = await this.request<any>(requestConfig);

        for (const key of difference(processFields, Object.keys(flushUserInfo)) as string[]) {
          const dynamicParseFuncKey = `parseUserInfoFor${pascalCase(key)}` as keyof this;
          if (dynamicParseFuncKey in this && typeof this[dynamicParseFuncKey] === "function") {
            flushUserInfo = await this[dynamicParseFuncKey](flushUserInfo, dataDocument, requestConfig);
          } else {
            // 优先使用本步骤定义的选择器，如果没有则使用 userInfo 全局的选择器
            let elementQuery = thisUserInfoProcess.selectors?.[key] ?? this.metadata.userInfo?.selectors?.[key];
            if (elementQuery) {
              flushUserInfo[key] = this.getFieldData(dataDocument, elementQuery as IElementQuery);
            } else {
              // noinspection ExceptionCaughtLocallyJS
              // throw new Error(`字段 ${key} 未设置 selector 或 ${String(dynamicParseFuncKey)} 方法`);
            }
          }
        }
      }

      // 如果前面没有获取到用户等级的id，则尝试通过定义的 levelRequirements 来获取
      if (this.metadata.levelRequirements && flushUserInfo.levelName && typeof flushUserInfo.levelId === "undefined") {
        flushUserInfo.levelId = this.guessUserLevelId(flushUserInfo as IUserInfo);
      }

      flushUserInfo.status = EResultParseStatus.success;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }

      flushUserInfo.status = EResultParseStatus.parseError;

      if (error instanceof NeedLoginError) {
        flushUserInfo.status = EResultParseStatus.needLogin;
      }
    }

    return flushUserInfo;
  }

  // 允许子类覆盖
  protected guessUserLevelId(userInfo: IUserInfo): TLevelId {
    return guessUserLevelId(userInfo, this.metadata.levelRequirements ?? []);
  }
}
