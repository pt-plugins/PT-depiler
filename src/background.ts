import { browser } from 'webextension-polyfill-ts'
import BtClientFactory from '@/background/factory/btclients'
import Site from '@/background/factory/sites'

class Background {
  public f = BtClientFactory
  public s = Site
}

(window as any).b = new Background()

browser.browserAction.onClicked.addListener(async () => {
  await browser.runtime.openOptionsPage()
})
