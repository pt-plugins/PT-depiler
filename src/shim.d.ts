// 使用 axios-cache-interceptor 拓展 axios 库
// https://axios-cache-interceptor.js.org/config
import type { AxiosRequestConfig as BaseAxiosRequestConfig, AxiosResponse as BaseAxiosResponse } from "axios";
import type { CacheProperties, InternalCacheRequestConfig } from "axios-cache-interceptor";

declare module "axios" {
  interface AxiosRequestConfig extends BaseAxiosRequestConfig {
    id?: string;
    cache?: false | Partial<CacheProperties>;
  }
  interface AxiosResponse extends BaseAxiosResponse {
    config: InternalCacheRequestConfig;
    id: string;
    cached: boolean;
    stale?: boolean;
  }
}
