var backgroundPage = chrome.extension.getBackgroundPage();
var title = "";
var url = "";
var tags = "";
var XHR = new XMLHttpRequest();
var loginForm = document.querySelector("#login-form");
var loginButton = document.querySelector("#login-button");
var loginInfo = {
  "userId": "",
  "authToken": ""
}
// chrome.cookies.set({
//   "url": "http://130.211.140.213",
//   "name": "bookmarkr",
//   "value": "aasdasd",
//   "expirationDate": 9999999999,
// }, (cookie) => {
//   alert(cookie.value);
// });

var hideLoginForm = function() {
  document.querySelector("#login-reg-form").style.display = "none";
  document.querySelector(".wrapper").style.display = "inherit"; 
}

// chrome.cookies.get({
//   "url": "http://localhost:3000",
//   "name": "bookmarkr-authTken",
// }, (cookie) => {
//   if(cookie) {
//     authToken = cookie.value;
//     chrome.cookies.get({
//       "url": "http://localhost:3000",
//       "name": "bookmarkr-userId",
//     }, (cookie) => {
//       if(cookie) {
//         userId = cookie.value;
//       }
//     });
//     hideLoginForm();
//   }
// });
// 
// chrome.cookies.remove({
//   "url": "http://localhost:3000",
//   "name": "bookmarkr-authToken"
// });
// chrome.cookies.remove({
//   "url": "http://localhost:3000",
//   "name": "bookmarkr-userId"
// });
chrome.cookies.getAll({
  "url": "http://localhost:3000"
}, (cookie) => {
  if(cookie != "") {
    cookie.map(function(element) {
      if(element.name == "bookmarkr-userId")
        loginInfo.userId = element.value;
      if(element.name == "bookmarkr-authToken")
        loginInfo.authToken = element.value;
    });
    hideLoginForm();
  }
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    document.querySelector("input[name='title']").value = tabs[0].title;
    document.querySelector("input[name='url']").value = tabs[0].url;
    title = tabs[0].title;
    url = tabs[0].url;
});

document.querySelector('#submit-button').addEventListener('click', function(e) {
  e.preventDefault();
  title = document.querySelector("input[name='title']").value;
  url = document.querySelector("input[name='url']").value;
  tags = document.querySelector("input[name='tags']").value;

  var body = {
    title,
    url,
    tags
  }

  XHR.open('POST', 'http://130.211.140.213:8010/api/bookmarks/');
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
  XHR.send(JSON.stringify(body));
  // chrome.tabs.captureVisibleTab(null, {format: "jpeg", quality: 80}, function(dataURL) {
  //             console.log(dataURL);
  //           });
});

document.querySelector('#login-button').addEventListener('click', function(e) {
  e.preventDefault();

  email = document.querySelector("input[name='email']").value;
  password = document.querySelector("input[name='password']").value;

  var body = {
    email, 
    password
  }

  XHR.open('POST', 'http://localhost:3000/api/login/');
  XHR.setRequestHeader('Content-Type', 'application/json');
  XHR.onreadystatechange = function () {
        if(XHR.readyState === XMLHttpRequest.DONE && XHR.status === 200) {
          var response = JSON.parse(XHR.responseText);
          hideLoginForm();
          chrome.cookies.set({
            "url": "http://localhost:3000",
            "name": "bookmarkr-userId",
            "value": response.data.userId,
            "expirationDate": 9999999999,
          });
          chrome.cookies.set({
            "url": "http://localhost:3000",
            "name": "bookmarkr-authToken",
            "value": response.data.authToken,
            "expirationDate": 9999999999,
          });
        }
        else {
          loginForm.classList.toggle("error");
          loginButton.classList.remove("loading");
        }
    };
  XHR.send(JSON.stringify(body));
  loginButton.classList.add("loading");
});