import { browser } from 'webextension-polyfill-ts'

browser.browserAction.onClicked.addListener(async () => {
  await browser.runtime.openOptionsPage()
})
