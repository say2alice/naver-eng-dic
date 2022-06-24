const qs  = window.location.search.replace('?', ''),
  _q  = qs.split('&'),
  q = {};

for (let i in _q) {
  let p = _q[i].split('=');
  q[p[0]] = p[1];
}

const domParser = new DOMParser();
const htmlStringToNode = htmlStr => domParser.parseFromString(htmlStr, 'text/html').body.childNodes

getWordMeaning(q['text']).then( result => {
  htmlStringToNode(result.strHtml).forEach(node => {
    document.body.append(node.cloneNode(true))
  })

  for (const i in result.pronounceUrls) {
    let btn = document.body.querySelector(`#pron-${i}`);
    btn.addEventListener('click', function () {
      let audio = new Audio(result.pronounceUrls[i]);
      audio.play();
    })
  }
});

async function getWordMeaning(word) {
  const dicUrl = 'https://en.dict.naver.com'

  const dictUrl = `${dicUrl}/api3/enko/search?m=mobile&range=wordpage=1&lang=ko&query=${word}`
  const dictPageUrl = `${dicUrl}/#/search?range=all&query=${word}`
  
  const init = {
    headers: {
      'User-Agent': `${window.navigator.userAgent} NotAndroid`,
      'Accept': 'application/json'
    },
  }

  const jsonDict = await fetch(dictUrl, init).then(response => response.json())
  const rsltDict = jsonDict.searchResultMap.searchResultListMap.WORD

  let resultHtmlString = ''
  const pronounceUrls = []

  if(rsltDict) {
    const title = rsltDict.query
    const items = rsltDict.items

    resultHtmlString += `<dl><dt><b>${title}</b></dt>`
  
    for(let counter = 0; counter < items.length; counter++ ) {
      resultHtmlString += '<dd>'
      if(counter > 0) break

      //발음기호
      const searchPhoneticSymbolList = items[counter].searchPhoneticSymbolList
      searchPhoneticSymbolList.forEach(phonetic => {
        if(phonetic.symbolValue) {
          phonetic.symbolType ? resultHtmlString += ` <span class="tag">${phonetic.symbolType}</span> [${phonetic.symbolValue}]`
                              : resultHtmlString += ` [${phonetic.symbolValue}]`
          if(phonetic.symbolFile) {
            resultHtmlString += `<input id="pron-${pronounceUrls.length}" type="image" alt="발음듣기" src="icons/speech.png">`
            pronounceUrls.push(phonetic.symbolFile)
          }
        }
      })

      resultHtmlString += '</dd><dd>'

      // 뜻
      const meansCollector = items[counter].meansCollector
      meansCollector.forEach(meansItem => {
        // if(!meansItem.partOfSpeech) meansItem.partOfSpeech = '-'

        resultHtmlString += '<ol>'
        meansItem.means.forEach(mean => {
          if(!mean.order) mean.order = 1
          meansItem.partOfSpeech ? resultHtmlString += `<li>[${meansItem.partOfSpeech}] ${mean.value}</li>`
                                 : resultHtmlString += `${mean.value}</li>`
        })
        resultHtmlString += '</ol>'
      })

      resultHtmlString += '</dd>'
    }
    resultHtmlString += '</dl>'
    resultHtmlString += `<p class="naver-link"><a href="${dictPageUrl}" target="_blank" rel="noopener noreferrer">네이버 사전 열기</a></p>`
    
  } else {
    throw Error('No Result')
  }
  
  return {strHtml: resultHtmlString, pronounceUrls: pronounceUrls}
}
