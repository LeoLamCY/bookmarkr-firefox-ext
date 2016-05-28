function listener(request, sender, sendResponse) {
    // while (document.body.firstChild) {
    //     document.body.firstChild.remove();
    // }

    // var btn = document.createElement("h1");
    // var t = document.createTextNode(request.tab.title);
    // btn.appendChild(t);
    // document.body.appendChild(btn);

    var title = document.getElementById("title");
    var url = document.getElementById("url");
    title.value = request.tab.title;
    url.value = request.tab.url;

}

chrome.runtime.onMessage.addListener(listener);
