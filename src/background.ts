import { browser } from 'webextension-polyfill-ts'
import BtClientFactory from '@/background/factory/btclients'
import Site from '@/background/factory/sites'
import Sizzle from 'sizzle'
import axios from 'axios'

class Background {
  public f = BtClientFactory
  public s = Site
}

Object.assign(window as any, {
  b: new Background(),
  axios,
  browser,
  Sizzle
})

browser.browserAction.onClicked.addListener(async () => {
  await browser.runtime.openOptionsPage()
})
