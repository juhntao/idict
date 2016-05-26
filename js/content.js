$(function(){
    initTipView();
});

window.addEventListener("resize", function(event) {
    hideTipView();
});
document.documentElement.addEventListener("mousedown", function(event) {
    hideTipView();
});

document.documentElement.addEventListener("mouseup", function (event) {
    var selection = window.getSelection();
    var selectRange = selection.getRangeAt(0).getBoundingClientRect();
    if(!selectRange.height&&!selectRange.width)
        return;
    var selectText = selection.toString().trim();
    if (selectText === "" || !(/^[^\u4e00-\u9fa5]+$/.test(selectText)))
        return;

    console.log(selection,selectText);
    showLoadingTipView(selectRange, selectText);
    
    chrome.runtime.sendMessage({action:'translate', q:selectText}, function(response){
        if(chrome.runtime.lastError){
            console.log(chrome.runtime.lastError);
        }
        console.log(response);
        if(response.status == "ok"){
            setTipViewContent(response);
        }else{
            showErrorTipView(response.message)
        }
    });
    
});

