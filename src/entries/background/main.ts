// 监听 点击图标 事件
chrome.action.onClicked.addListener(async () => {
    chrome.runtime.openOptionsPage();
});




chrome.runtime.onInstalled.addListener(() => {
    console.log("Installed!");
});

// create offscreen for DOM_PARSER and other reason ( f**k google )
chrome.offscreen.hasDocument(has => {
    !has && chrome.offscreen.createDocument({
        url: 'entries/offscreen/offscreen.html',
        reasons: [chrome.offscreen.Reason.DOM_PARSER],
        justification: "Allow DOM_PARSER, CLIPBOARD, BLOBS in background.",
    });
});
