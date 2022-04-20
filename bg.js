const modeIcons = [
  'icons/icon@64.png'
];
const modeName = [
  '옛날 방법 (드래그)',
  '표준 (기능키 + 클릭)'
];

function initBrowserAction(wordSelectMode) {
  browser.browserAction.setIcon({
    path: modeIcons[wordSelectMode]
  });
  browser.browserAction.setTitle({
    title: `Naver English Dictionary (Unofficial)\n${modeName[wordSelectMode]}`
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
      prefs['wordSelectMode'] = prefs['wordSelectMode'] == 0 ? 1 : 0;
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
