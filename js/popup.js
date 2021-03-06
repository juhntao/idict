function makeRequest(method, url, data, callback){
    console.log('request url', url);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.open(method, url, true);
    xhr.send(data);
}

function renderUser(){
    function callback(user){
        var user_link = document.getElementById('home');
        user_link.href = 'http://www.shanbay.com/user/list/'+user.username;
        user_link.onclick=function(){
            chrome.tabs.create({url:this.href})
        };

        document.getElementById('logout').onclick = function(){
            bg.oauth.clearToken();
            delete bg.User;
            window.close();
        }
        
        var img = document.getElementById('avatar');
        img.src = user.avatar;
        
        var nickname = document.getElementById('nickname');
        nickname.innerText = user.nickname;
        bg.User = user;
    }
    
    var bg = chrome.extension.getBackgroundPage();
    if (bg.User){
        callback(bg.User);
        return;
    }

    if (bg.oauth.token_valid()){
        var account_api = bg.oauth.conf.api_root + '/account/?access_token=' + bg.oauth.access_token();
        makeRequest('GET', account_api, null, callback);
    } else {
        chrome.runtime.sendMessage({action:'authorize'}, function(){
            renderUser();
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // renderUser();
    document.querySelector("#searchInput").onkeydown = function(event){
        if(this.value=="") return;
        if(event.keyCode == 13){
            document.querySelector("#contentContainer .error").style.display="none";
            document.querySelector("#contentContainer .result").style.display="none";
            document.querySelector("#contentContainer .tip").style.display="";
            document.querySelector("#contentContainer .tip").innerText="正在翻译...";
            chrome.runtime.sendMessage({action:'translate', q:this.value}, function(response){
                if(chrome.runtime.lastError){
                    console.log(chrome.runtime.lastError);
                }
                buildResult(response);
            });
        }
    }
});
function buildResult(response){
    if(response.status == "ok"){
        document.querySelector("#contentContainer .error").style.display="none";
        document.querySelector("#contentContainer .tip").style.display="none";
        document.querySelector("#contentContainer .result").style.display="";
        
        document.querySelector("#contentContainer .result .dict-spell").innerHTML = "";
        response.spells.forEach(function(spell){
            var p = document.createElement("p");
            var b = document.createElement("b");
            b.innerHTML = spell.phonetic;
            p.appendChild(b);
            var a = document.createElement("a");
            a.onclick=function(){
                this.querySelector('audio').play();
            }
            
            var audio = document.createElement("audio");
            audio.src = spell.sound;
            a.appendChild(audio);
            p.appendChild(a);
            document.querySelector("#contentContainer .result .dict-spell").appendChild(p);
        });
        
        document.querySelector("#contentContainer .result .dict-comment").innerHTML = "";
        response.comments.forEach(function(comment){
            var p = document.createElement("p");
            p.innerHTML = comment;
            document.querySelector("#contentContainer .result .dict-comment").appendChild(p);
        });
    }else{
        document.querySelector("#contentContainer .error").innerText = response.message;
        document.querySelector("#contentContainer .error").style.display="";
        document.querySelector("#contentContainer .tip").style.display="none";
        document.querySelector("#contentContainer .result").style.display="none";
    }
}

