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

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install' || details.reason === 'update') {
    // chrome.tabs.create({
    //   url: 'https://bitbucket.org/jb-tutorial/naver-eng-dic'
    // })
  }
});

chrome.declarativeNetRequest.getDynamicRules(rules => {
  var ruleIdx = 0;
  var existingRules = [];
  for (var i=0;i<rules.length;i++) {
      ruleIdx = rules[i].id;
      existingRules.push(rules[i].id);
  }
  ruleIdx++;
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        action: {
            type: 'modifyHeaders',
            requestHeaders: [{'header': 'Referer', 'operation': 'set', 'value': 'https://en.dict.naver.com/'}]
        },
        condition: {
          'urlFilter': '*',
          'resourceTypes': ['xmlhttprequest']
        },
        id: ruleIdx,
        priority: 1
      },
  ],
  removeRuleIds: existingRules
})
})

// chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(function (o) {
//   console.log('rule matched:', o);
// });

