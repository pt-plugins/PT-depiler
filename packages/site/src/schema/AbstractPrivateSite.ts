// 适用于PT站点
import type { IUserInfo, transPostDataTo } from "../types";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import BittorrentSite from "../schema/AbstractBittorrentSite";
import { difference, intersection, merge, pick } from "lodash-es";
import { ISiteMetadata } from "../types";

export default class PrivateSite extends BittorrentSite {
  protected override readonly initConfig: Partial<ISiteMetadata> = {
    search: {},
    userInfo: {}
  };

  get allowQueryUserInfo() : boolean {
    return this.isOnline && !(this.config.allowQueryUserInfo === false);
  }

  /**
   * 获得当前站点最新的用户信息用于更新
   * 这里获取 lastUserInfo 以及 保存/更新 UserInfo 均由调用的上层完成
   */
  public async flushUserInfo(
    lastUserInfo: Partial<IUserInfo> = {}
  ): Promise<IUserInfo> {
    if (!this.config.userInfo?.process) {
      throw new Error("尚不支持，未定义 userInfo 属性或处理流程");
    } else {
      let flushUserInfo: Partial<IUserInfo> = {};

      if (!this.allowQueryUserInfo) {
        return flushUserInfo as IUserInfo;
      }

      if (this.config.userInfo.pickLast) {
        flushUserInfo = {
          ...flushUserInfo,
          ...pick(lastUserInfo, this.config.userInfo.pickLast),
        };
      }

      for (let i = 0; i < this.config.userInfo.process.length; i++) {
        const thisUserInfo = this.config.userInfo.process[i];

        // 检查相关元素是否已有
        const existField = intersection(
          thisUserInfo.fields,
          Object.keys(flushUserInfo)
        );
        if (existField.length === thisUserInfo.fields.length) {
          continue; // 如果全部数据都有则直接跳过本轮
        }

        // 更新请求字段，如果字段缺失则跳出循环
        const requestConfig = merge<
          AxiosRequestConfig,
          AxiosRequestConfig & { transferPostData?: transPostDataTo }
        >(
          { url: "/", params: {}, responseType: "document" },
          thisUserInfo.requestConfig
        );
        if (thisUserInfo.assertion) {
          for (const [requiredField, paramsKey] of Object.entries(
            thisUserInfo.assertion
          )) {
            if (flushUserInfo[requiredField]) {
              if (requestConfig.url?.includes(`$${paramsKey}$`)) {
                requestConfig.url = requestConfig.url.replace(
                  `$${paramsKey}$`,
                  flushUserInfo[requiredField]
                );
              } else {
                requestConfig.params[paramsKey!] = flushUserInfo[requiredField];
              }
            } else {
              throw new Error(`断言字段 ${requiredField} 缺失`);
            }
          }
        }

        if (requestConfig.method?.toLowerCase() === "post") {
          const transferPostData: transPostDataTo =
            requestConfig.transferPostData || "raw";
          requestConfig.data = this.transferPostData(
            requestConfig.params,
            transferPostData
          );
          if (transferPostData !== "raw") {
            requestConfig.params = {}; // 清空 params 参数
          }
        }

        const { data: dataDocument } = await this.request<any>(requestConfig);
        flushUserInfo = {
          ...flushUserInfo,
          ...this.getFieldsData(
            dataDocument,
            "userInfo",
            difference(thisUserInfo.fields, Object.keys(flushUserInfo))
          ),
        };
      }

      return flushUserInfo as IUserInfo;
    }
  }

  /**
   * 这是一个比较通用的检查是否登录方法，如果不行请考虑覆写扩展
   */
  protected override loggedCheck(
    res: AxiosResponse,
    strict: boolean = false
  ): boolean {
    const request = res.request as XMLHttpRequest;
    try {
      if (
        /doLogin|login|verify|checkpoint|returnto/gi.test(request.responseURL)
      ) {
        return false; // 检查最终的URL看是不是需要登陆
      } else if (
        res.headers.refresh &&
        /\d+; url=.+(login|verify|checkpoint|returnto).+/gi.test(
          res.headers.refresh
        )
      ) {
        return false; // 检查responseHeader有没有重定向
      } else if (strict) {
        const responseText =
          request.responseType === "document"
            ? request.responseXML?.documentElement.outerHTML
            : request.responseText;
        if (typeof responseText === "undefined") {
          return false; // 检查最终的Text，如果什么都没有也可能说明需要登陆
        } else if (
          responseText.length < 800 &&
          /login|auth_form|not authorized/.test(responseText)
        ) {
          return false; // 对Text进行检查，断言 “过短，且中间出现login等字段“ 说明可能需要登陆
        }
      }
    } catch (e) {
      // Catch Nothing
    }

    return true;
  }
}
