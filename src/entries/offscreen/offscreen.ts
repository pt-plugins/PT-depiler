chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message, sender);
  switch (message.action) {
    case "getSearchResult": {
      const { plan } = message;

      sendResponse({});
    }
  }
});
