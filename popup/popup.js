var backgroundPage = chrome.extension.getBackgroundPage();
var title = "";
var url = "";
var tags = "";
var XHR = new XMLHttpRequest();
var loginForm = document.querySelector("#login-form");
var loginButton = document.querySelector("#login-button");
var loginInfo = {
  "bookmarkr-userId": "",
  "bookmarkr-authToken": ""
}
var signupForm = document.querySelector("#signup-form");
var signupButton = document.querySelector("#signup-button");
var signupPasswordError = document.querySelector(".password-error");
var signupEmailError = document.querySelector(".email-error");
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

var setCookies = function(data) {
  chrome.cookies.set({
    "url": "http://localhost:3000",
    "name": "bookmarkr-userId",
    "value": data.userId,
    "expirationDate": 9999999999,
  });
  chrome.cookies.set({
    "url": "http://localhost:3000",
    "name": "bookmarkr-authToken",
    "value": data.authToken,
    "expirationDate": 9999999999,
  });
}

var onLoginRegSuccess = function(data) {
  hideLoginForm();
  setCookies(data);
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
        loginInfo[element.name] = element.value;
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

//add bookmark
document.querySelector('#submit-button').addEventListener('click', function(e) {
  e.preventDefault();
  title = document.querySelector("input[name='title']").value;
  url = document.querySelector("input[name='url']").value;
  tags = document.querySelector("input[name='tags']").value;
  var body = {
    title,
    url,
    tags,
    "userId": loginInfo["bookmarkr-userId"]
  }

  // XHR.open('POST', 'http://130.211.140.213:8010/api/bookmarks/');
  XHR.open('POST', 'http://localhost:3000/api/bookmarks/');
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

//login
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
          onLoginRegSuccess(response.data);
        }
        else {
          loginForm.classList.toggle("error");
          loginButton.classList.remove("loading");
        }
    };
  XHR.send(JSON.stringify(body));
  loginButton.classList.add("loading");
});

//signup
document.querySelector('#signup-button').addEventListener('click', function(e) {
  e.preventDefault();

  email = document.querySelector("input[name='reg-email']").value;
  password = document.querySelector("input[name='reg-password']").value;
  confirmPassword = document.querySelector("input[name='reg-confirm-password']").value;

  if(password != confirmPassword || password.length === 0) {
    signupEmailError.style.display = 'none';
    signupPasswordError.style.display = 'inherit';
    signupForm.classList.toggle("error");
    return;
  }

  var body = {
    email, 
    password
  }

  XHR.open('POST', 'http://localhost:3000/api/users/');
  XHR.setRequestHeader('Content-Type', 'application/json');
  XHR.onreadystatechange = function () {
        if(XHR.readyState === XMLHttpRequest.DONE && XHR.status === 201) {
          var response = JSON.parse(XHR.responseText);
          onLoginRegSuccess(response.data);
        }
        else {
          signupPasswordError.style.display = 'none';
          signupEmailError.style.display = 'inherit';
          signupForm.classList.toggle("error");

          signupButton.classList.remove("loading");
        }
    };
  XHR.send(JSON.stringify(body));
  signupButton.classList.add("loading");
});