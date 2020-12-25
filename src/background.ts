import axios from 'axios'
import { browser } from 'webextension-polyfill-ts'

browser.runtime.onMessage.addListener((msg, sender): Promise<any> => {
  console.log('BG page received message', msg, 'from', sender)
  if (msg.type === 'axiosMessagingAdapterRequest') {
    return Promise.resolve(axios(msg.config))
  }
  return Promise.resolve()
})

browser.browserAction.onClicked.addListener(async () => {
  await browser.runtime.openOptionsPage()
})
