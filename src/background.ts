import * as browser from 'webextension-polyfill';
import { surfTypes, baseUrl, PageRequest } from './const';

let requestIndex: number;
let tabSurfId: number;
let currentPageRequest: PageRequest = {url: "", userAgent: ""};

function onBeforeSendHeaders(details: browser.WebRequest.OnBeforeSendHeadersDetailsType) {
  if(details.tabId !== tabSurfId)
    return;
  for (var i = 0; i < details.requestHeaders.length; ++i) {
    if (details.requestHeaders[i].name === 'User-Agent') {
      details.requestHeaders[i].value = currentPageRequest.userAgent
      break;
    }
  }
  return {requestHeaders: details.requestHeaders};
}

function getNextRequest(): PageRequest {
  let userAgent: string; 
  let stop = true;
  
  let numberOfSearchsTotal = 0;
  let i = 0;
  while(stop && i < surfTypes.length) {
    numberOfSearchsTotal += surfTypes[i].numberOfSearchs;
    if(requestIndex < numberOfSearchsTotal) {
      userAgent = surfTypes[i].userAgent;
      stop = false;
    }
    i++;
  }

  requestIndex++;

  return stop ? null : {
    url: baseUrl + (Math.random() + 1).toString(36).substring(7),
    userAgent
  };
}

function browseNewPage(tabId: number, changeInfo: browser.Tabs.OnUpdatedChangeInfoType) {
  if(tabId !== tabSurfId || changeInfo.status !== 'complete')
    return;

  if(currentPageRequest === null) {
    browser.tabs.onUpdated.removeListener(browseNewPage);
    browser.webRequest.onBeforeRequest.removeListener(onBeforeSendHeaders);
  } else {
    let pageRequest = getNextRequest();
    let userAgentChanged = pageRequest.userAgent !== currentPageRequest.userAgent;
    currentPageRequest = pageRequest;

    if(userAgentChanged) {
      console.error('changed');

      if (browser.webRequest.onBeforeRequest.hasListener(onBeforeSendHeaders)) {
        browser.webRequest.onBeforeRequest.removeListener(onBeforeSendHeaders);
      }

      browser.webRequest.onBeforeSendHeaders.addListener(
        onBeforeSendHeaders,
        {urls: ["<all_urls>"]}, ["blocking", "requestHeaders"]
      );
    }
    browser.tabs.update(tabSurfId, {url: currentPageRequest.url});
  }
}

browser.browserAction.onClicked.addListener(function(tab) {
  requestIndex = 0;
  browser.tabs.create({}).then((tab) => {
    tabSurfId = tab.id

    browser.tabs.onUpdated.addListener(browseNewPage);
  
    browseNewPage(tabSurfId, {status: 'complete'});
  })

});