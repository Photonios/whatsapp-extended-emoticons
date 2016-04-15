/* inject the script with the actual code into the web page
because normally, chrome extension code runs in a sandbox, but
we need to modify the DOM.... */

var script = document.createElement('script');
script.src = chrome.extension.getURL('code.js');
document.head.appendChild(script);
