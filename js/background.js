var oauth = ShanbayOauth.initPage();
var api = new shanbayApi();
chrome.runtime.onMessage.addListener(function(request, sender, sendReponse){
    if (request.action == 'authorize'){
        authorize(sendReponse);
    } else if(request.action == 'translate'){
        translate(request.q, function(d){
            sendReponse(d);
        });
        return true;//表明这个是异步的
    }
});

function authorize(callback){
    oauth.authorize(callback);
}

function translate(q, callback) {
    api.translate(q, callback);
}

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.tabs.create({
            url: "welcome.html"
        }, function(tab) {
            tab ? chrome.windows.update(tab.windowId, { focused: true }) : chrome.windows.create({ url: "first.html", focused: true });
        });
    }
});

