// Since We build background to js folder, it might register fail, so we wrapper it

var window = self;

// create offscreen for DOM_PARSER and other reason ( f**k google )
chrome.offscreen.createDocument({
  url: "offscreen.html",
  reasons: [chrome.offscreen.Reason.DOM_PARSER, chrome.offscreen.Reason.CLIPBOARD, chrome.offscreen.Reason.BLOBS],
  justification: "Allow DOM_PARSER, CLIPBOARD, BLOBS in background.",
});

importScripts("js/background.js");
