// 所有PT站点的基类
import { IElementQuery, ISiteMetadata, IUserInfo } from "../types";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import BittorrentSite from "./AbstractBittorrentSite";
import { difference, intersection, pascalCase, pick, toMerged } from "es-toolkit";
import { get, has, set } from "es-toolkit/compat";

export const SchemaMetadata: Partial<ISiteMetadata> = {
  version: -1,
  search: {},
  userInfo: {},
};

export default class PrivateSite extends BittorrentSite {
  get allowQueryUserInfo(): boolean {
    return this.isOnline && !(this.userConfig.allowQueryUserInfo === false);
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
   * 获得当前站点最新的用户信息用于更新
   * 这里获取 lastUserInfo 以及 保存/更新 UserInfo 均由调用的上层完成
   */
  public async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    if (!this.metadata.userInfo?.process) {
      throw new Error("尚不支持，未定义 userInfo 属性或处理流程");
    } else {
      let flushUserInfo: Partial<IUserInfo> = {};

      if (!this.allowQueryUserInfo) {
        return flushUserInfo as IUserInfo;
      }

      if (this.metadata.userInfo.pickLast) {
        flushUserInfo = toMerged(flushUserInfo, pick(lastUserInfo, this.metadata.userInfo.pickLast));
      }

      for (let i = 0; i < this.metadata.userInfo.process.length; i++) {
        const thisUserInfo = this.metadata.userInfo.process[i];

        // 检查相关元素是否均已有
        const existField = intersection(thisUserInfo.fields, Object.keys(flushUserInfo));
        if (existField.length === thisUserInfo.fields.length) {
          continue; // 如果全部数据都有则直接跳过本轮
        }

        // 更新请求字段，如果字段缺失则跳出循环
        let requestConfig: AxiosRequestConfig = toMerged(
          { url: "/", params: {}, data: {}, responseType: "document" },
          thisUserInfo.requestConfig,
        );
        if (thisUserInfo.assertion) {
          for (const [requiredField, pathKey] of Object.entries(thisUserInfo.assertion)) {
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
              throw new Error(`断言字段 ${requiredField} 缺失`);
            }
          }
        }

        // 如果有 requestConfigTransformer，则会在最后一步对请求配置进行处理
        if (typeof thisUserInfo.requestConfigTransformer === "function") {
          requestConfig = thisUserInfo.requestConfigTransformer(requestConfig, flushUserInfo);
        }

        const { data: dataDocument } = await this.request<any>(requestConfig);

        for (const key of difference(thisUserInfo.fields, Object.keys(flushUserInfo)) as string[]) {
          const dynamicParseFuncKey = `parseUserInfoFor${pascalCase(key)}` as keyof this;
          if (dynamicParseFuncKey in this && typeof this[dynamicParseFuncKey] === "function") {
            flushUserInfo = this[dynamicParseFuncKey](flushUserInfo, dataDocument, requestConfig);
          } else if (this.metadata.userInfo!.selectors![key]) {
            flushUserInfo[key] = this.getFieldData(
              dataDocument,
              this.metadata.userInfo!.selectors![key] as IElementQuery,
            );
          }
        }
      }

      flushUserInfo.updateAt = +new Date();
      return flushUserInfo as IUserInfo;
    }
  }
}
