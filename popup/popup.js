
// chrome.tabs.executeScript(null, {
//   file: "/content_scripts/script.js"
// });

// document.querySelector("form").addEventListener("submit", click);
//

// function hello() {
//   chrome.tabs.executeScript({
//     file: 'alert.js'
//   });
// }

var backgroundPage = chrome.extension.getBackgroundPage();
var title = "";
var url = "";
var tags = "";
var XHR = new XMLHttpRequest();

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    document.querySelector("input[name='title']").value = tabs[0].title;
    title = tabs[0].title;
    document.querySelector("input[name='url']").value = tabs[0].url;
    url = tabs[0].url;
  });

document.querySelector('button').addEventListener('click', function(e) {
  e.preventDefault();
  title = document.querySelector("input[name='title']").value;
  url = document.querySelector("input[name='url']").value;
  tags = document.querySelector("input[name='tags']").value;
  var obj = {
    "title": title,
    "url": url,
    "tags": tags
  }

  XHR.open('POST', 'http://bookmarku.herokuapp.com/api/bookmarks/');
  XHR.setRequestHeader('Content-Type', 'application/json');
  XHR.onreadystatechange = function () {
        if(XHR.readyState === XMLHttpRequest.DONE && XHR.status === 200) {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            // var opts = {format: "jpeg", quality: 80};
            // chrome.tabs.captureVisibleTab(null, {format: "jpeg", quality: 80}, function(dataURL) {
            //   console.log(dataURL);
            // });

            chrome.tabs.remove(tabs[0].id);
            window.close();
          });
          
        }
    };
  XHR.send(JSON.stringify(obj));
  // chrome.tabs.captureVisibleTab(null, {format: "jpeg", quality: 80}, function(dataURL) {
  //             console.log(dataURL);
  //           });
});



// $("#but").click(function() {
//   e.preventDefault();
//   chrome.tabs.query({'active': true,'currentWindow':true},function(tab){
//     chrome.tabs.sendMessage(tab[0].id,"stuff", function(response){
//       //assuming that info was html markup then you could do
//       document.body.innerhtml = "test";
//       //I personally wouldn't do it like this but you get the idea
//     });
//   });
// });

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.sendMessage(tabs[0].id, {tab: tabs[0]});
// });

// function click(e) {
//   e.preventDefault();
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {tab: tabs[0]});
//   });
//   // var title = document.getElementById("title");
//   //   var url = document.getElementById("url");
//   //   title.value = request.tab.title;
//   //   url.value = request.tab.url;
//   $('#title').val("test");
// }
/*
Listen for clicks in the popup.

If the click is not on one of the beasts, return early.

Otherwise, the text content of the node is the name of the beast we want.

Inject the "beastify.js" content script in the active tab.

Then get the active tab and send "beastify.js" a message
containing the URL to the chosen beast's image.
*/
  // document.addEventListener("click", function(e) {
  //   if (e.target.classList.contains("inp")) {
  //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //       chrome.tabs.sendMessage(tabs[0].id, {beastURL: "http://www.google.com"});
  //   })}

  //   var chosenBeast = e.target.textContent;
  //   var chosenBeastURL = beastNameToURL(chosenBeast);

  //   chrome.tabs.executeScript(null, {
  //     file: "/content_scripts/beastify.js"
  //   });

  //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //     chrome.tabs.sendMessage(tabs[0].id, {beastURL: chosenBeastURL});
  //   });

  // });
