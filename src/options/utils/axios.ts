import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
import { browser } from 'webextension-polyfill-ts'

type AxiosRequestConfigKeys = keyof AxiosRequestConfig

const unsupportedConfigs : AxiosRequestConfigKeys[] = [
  'paramsSerializer',
  'onUploadProgress',
  'onDownloadProgress',
  'cancelToken',
  'validateStatus',
  'transformRequest',
  'transformResponse'
]

function filterUnsupportedConfig (config: AxiosRequestConfig) {
  return Object.keys(config)
    .filter((key) => {
      return !unsupportedConfigs.includes(key as AxiosRequestConfigKeys)
    })
    .reduce((acc: any, key) => {
      acc[key] = config[key as AxiosRequestConfigKeys]
      return acc
    }, {})
}

function adapter (config: AxiosRequestConfig): AxiosPromise {
  return browser.runtime.sendMessage({
    type: 'axiosMessagingAdapterRequest',
    config: filterUnsupportedConfig(config)
  })
}

export default axios.create({
  adapter
})
