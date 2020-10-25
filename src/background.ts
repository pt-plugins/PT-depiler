import { browser } from 'webextension-polyfill-ts'

browser.runtime.onMessage.addListener(async (msg, sender) => {
  console.log('BG page received message', msg, 'from', sender)
  console.log('Stored data', await browser.storage.local.get())
})

browser.browserAction.onClicked.addListener(async () => {
  await browser.runtime.openOptionsPage()
})
