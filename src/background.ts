import { browser } from 'webextension-polyfill-ts'
import buildClient from '@/background/factory/btclients'

(window as any).f = buildClient

browser.browserAction.onClicked.addListener(async () => {
  await browser.runtime.openOptionsPage()
})
