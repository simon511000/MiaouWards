import * as browser from "webextension-polyfill";

browser.browserAction.onClicked.addListener(async function() {
    const data = [
        {
            name: 'tifacfaatcs',
            domain: 'rewards.bing.com',
            value: (await browser.cookies.get({name: 'tifacfaatcs', url: 'https://rewards.bing.com'})).value
        },
        {
            name: '_U',
            domain: '.bing.com',
            value: (await browser.cookies.get({name: '_U', url: 'https://bing.com'})).value
        }
    ]

    var blob = new Blob([JSON.stringify(data)], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    browser.downloads.download({
        url
    });
});