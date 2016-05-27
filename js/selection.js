var m_is_dict_box_show = false;
$(function(){
    createSelectBox();
    initTipView();
})

$("body").on("mousedown", function(event){
    if(!m_is_dict_box_show)
        hideSelectBox();
});

$("body").on("mouseup", function(event){
    if (m_is_dict_box_show) return;
    var selectText = window.getSelection().toString().trim();
    if(selectText == "") return;
    var x = event.clientX + window.scrollX + 5;
    var y = event.clientY + window.scrollY + 10;
    showSelectBox(x, y);
});

function createSelectBox(){
    var html = '<div class="selectbox" style="display:none;">' + 
                    '<img class="icon" src="' + chrome.extension.getURL("img/icon19.png") + '"/>' + 
                '</div>';
    $("body").append(html);
    
    $(".selectbox").on("mousedown", function(){
        m_is_dict_box_show = true;
        showDictBox();
    });
}

function showSelectBox(x, y){
    $(".selectbox").css("left", x + "px");
    $(".selectbox").css("top", y + "px");
    $(".selectbox").show();
}
function hideSelectBox(){
    $(".selectbox").hide();
}

function showDictBox(){
    hideSelectBox();
    var selection = window.getSelection();
    if(!selection) return hideDictBox();
    var selectRange = selection.getRangeAt(0).getBoundingClientRect();
    var selectText = selection.toString().trim();

    console.log("select text:",selectText);
    showLoadingTipView(selectRange, selectText);
    $("#idict").on("mouseleave", function() {
        hideDictBox();
    });
    
    if (!(/^[^\u4e00-\u9fa5]+$/.test(selectText))){ 
        //如果选择的是汉字
    }else{
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
    }
}

function hideDictBox(){
    hideTipView();
    m_is_dict_box_show = false;
}