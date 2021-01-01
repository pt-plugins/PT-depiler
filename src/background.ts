import { browser } from 'webextension-polyfill-ts'
import BtClientFactory from '@/background/factory/btclients'

(window as any).f = BtClientFactory

browser.browserAction.onClicked.addListener(async () => {
  await browser.runtime.openOptionsPage()
})
