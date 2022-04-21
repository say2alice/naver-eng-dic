const defaultPrefs = {
  wordSelectMode: 0,
  useCtrl: false,
  useAlt: true,
  useMeta: false
}

const modeIcons = [
  'icons/icon@64.png'
];
const modeName = [
  '기능키+클릭',
  'Mouse Drag'
];

function initBrowserAction(wordSelectMode) {
  chrome.action.setIcon({
    path: modeIcons[wordSelectMode]
  });
  chrome.action.setTitle({
    title: `English Korean Dictionary\n${modeName[wordSelectMode]}`
  });
}

/* global defaultPrefs */
chrome.storage.local.get({prefs: defaultPrefs}, results => {
  const { prefs } = results;
  initBrowserAction(prefs.wordSelectMode);
});

chrome.storage.onChanged.addListener((changes, area) => {
  const wordSelectMode = changes.prefs.newValue.wordSelectMode;
  initBrowserAction(wordSelectMode);
});

chrome.action.onClicked.addListener( _ => {
  chrome.runtime.openOptionsPage();
});

// chrome.browserAction.onClicked.addListener((tab) => {
//   chrome.runtime.openOptionsPage();
// });

chrome.commands.onCommand.addListener((cmd) => {
  if (cmd === 'toggle-mode') {
    chrome.storage.local.get({prefs: defaultPrefs}, results => {
      const { prefs } = results;
      prefs['wordSelectMode'] = prefs['wordSelectMode'] === 0 ? 1 : 0;
      chrome.storage.local.set({prefs: prefs});
    });

  }
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    // chrome.tabs.create({
    //   url: 'https://bitbucket.org/jb-tutorial/naver-eng-dic'
    // })
  }
});
