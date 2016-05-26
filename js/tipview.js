function initTipView(){
    var url = chrome.extension.getURL("/TipView.html");
    $.get(url,function(d){
        $("body").append(d);
    });
}

function hideTipView(){
    $("#idict").hide();
}

function showLoadingTipView(selectRange, text){
    if(text.trim() === "") return;
    $("#idict").attr("data-text", text);
    $("#idict .title span").html(text);
    $("#idict .loading-tip").show();
    $("#idict .error-tip").hide();
    $("#idict .result").hide();
    $("#idict .more").hide();
    $("#idict").show();
    setTipViewLocation(selectRange);
}
function showErrorTipView(error){
    if(error.trim() === "") return;
    $("#idict .loading-tip").hide();
    $("#idict .error-tip").show();
    $("#idict .error-tip").html(error)
    $("#idict .result").hide();
    $("#idict .more").hide();
    $("#idict").show();
}

function setTipViewLocation(selectRange){
    var showNearPosition = {};
    var resultNearContainer = $("#idict")[0];
    var arrowMain = $("#idict .tip-arrow")[0];
    
    var containerWidth = resultNearContainer.offsetWidth;
    var rangeWidth = selectRange.right - selectRange.left;
    var left = selectRange.left + window.pageXOffset;
    var top = selectRange.top + window.pageYOffset;
    var rangeMiddle = rangeWidth/2 + left;
    var containerLeft = left - (containerWidth - rangeWidth)/2;
    if (containerLeft < window.pageXOffset) {
        containerLeft = window.pageXOffset;
    } else if (containerLeft + containerWidth > window.pageXOffset + document.documentElement.clientWidth) {
        containerLeft = window.pageXOffset + document.documentElement.clientWidth - containerWidth;
    }
    var clientHeight = 0;
    clientHeight = (document.documentElement.clientHeight > document.body.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    if (clientHeight === 0) {
        clientHeight = document.documentElement.clientHeight;
    }
    showNearPosition = {
        left: containerLeft,
        top: (top + selectRange.height + 12)
    };
    console.log(showNearPosition);
    
    resultNearContainer.style.left = showNearPosition.left + "px";
    resultNearContainer.style.top = showNearPosition.top + "px";
}

function setTipViewContent(content){
    if(!content) return;
    
    $("#idict .loading-tip").hide();
    $("#idict .error-tip").hide();
    $("#idict .result").show();
    $("#idict .more").show();
    $("#idict .result .dict-spell").html("");
    $("#idict .result .dict-comment").html("");
    content.spells.forEach(function(spell){
        var p = $("<p />");
        p.append("<b />");
        p.append("<a href='javascript:void(0);' onclick='this.querySelector(\"audio\").play();'><audio/></a>");
        p.find("b").html(spell.phonetic);
        p.find("a audio").attr("src", spell.sound);
        $("#idict .result .dict-spell").append(p);
    });
    content.comments.forEach(function(comment){
        $("#idict .result .dict-comment").append("<p>"+comment+"</p>");
    });
    $("#idict .content .more a").attr("href","http://fanyi.baidu.com/#en/zh/" + getTextWord());
    $("#idict").show();
}

function getTextWord(){
    var text = $("#idict").attr("data-text");
    return text;
}