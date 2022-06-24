const modeIcons = [
  'icons/icon@64.png'
];
const modeName = [
  '기능키+클릭',
  'Mouse Drag'
];

function initBrowserAction(wordSelectMode) {
  browser.browserAction.setIcon({
    path: modeIcons[wordSelectMode]
  });
  browser.browserAction.setTitle({
    title: `English Korean Dictionary\n${modeName[wordSelectMode]}`
  });
}

/* global defaultPrefs */
browser.storage.local.get({
  prefs: defaultPrefs
}).then((results) => {
  const { prefs } = results;
  initBrowserAction(prefs.wordSelectMode);
});

browser.storage.onChanged.addListener((changes, area) => {
  const wordSelectMode = changes.prefs.newValue.wordSelectMode;
  initBrowserAction(wordSelectMode);
});

browser.browserAction.onClicked.addListener((tab) => {
  browser.runtime.openOptionsPage();
});

browser.commands.onCommand.addListener((cmd) => {
  if (cmd === 'toggle-mode') {
    browser.storage.local.get({
      prefs: defaultPrefs
    }).then((results) => {
      const { prefs } = results;
      prefs['wordSelectMode'] = prefs['wordSelectMode'] === 0 ? 1 : 0;
      browser.storage.local.set({
        prefs: prefs
      });
    });
  }
});

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    // browser.tabs.create({
    //   url: 'https://bitbucket.org/jb-tutorial/naver-eng-dic'
    // })
  }
});

browser.webRequest.onBeforeSendHeaders.addListener(details => {
  details.requestHeaders.push({name: 'Referer', value:'https://en.dict.naver.com/'});
  return {requestHeaders: details.requestHeaders};
  },
  {urls: ['<all_urls>']},
  ["blocking", "requestHeaders"]
);