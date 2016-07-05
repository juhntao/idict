(function($) {
    var m_is_dict_box_show = false; 
    $(function() {
        initTipView();

        $("body").on("mousedown", function(event) {   
           hideSelectBox();  hideDictBox();
        }).on("mouseup", function(event) { 

            if (m_is_dict_box_show) return;

            var selectText = window.getSelection().toString().trim();
            if (selectText == "") return; 
            showSelectBox(event.clientX + window.scrollX + 5,event.clientY + window.scrollY + 10 );
        }).on("mousedown", '#idict', function(e) {   
            return false;
        }).on("mousedown", '.selectbox', function(e) {  
            m_is_dict_box_show = true;
            showDictBox();
            return false;
        });
        $("body").append('<div class="selectbox" style="display:none;">' +
            '<img class="icon" src="' + chrome.extension.getURL("img/icon19.png") + '"/>' +
            '</div>');
    }); 
 
    function showSelectBox(x, y) {
        $(".selectbox").css({
            "left": x  ,
              "top": y    
        }).show(); 
    }

    function hideSelectBox() {
        $(".selectbox").hide();
    }

    function showDictBox() {
   
        var selection = window.getSelection();
        if (!selection) return hideDictBox();
        var selectRange = selection.getRangeAt(0).getBoundingClientRect();
        var selectText = selection.toString().trim();
        if (selectText === "" || !(/^[^\u4e00-\u9fa5]+$/.test(selectText)))
            return hideDictBox();

        showLoadingTipView(selectRange, selectText);

        chrome.runtime.sendMessage({
            action: 'translate',
            q: selectText
        }, function(response) {
            if (chrome.runtime.lastError) { 
            } 
            if (response.status == "ok") {
                setTipViewContent(response);
            } else {
                showErrorTipView(response.message)
            }
        });
             hideSelectBox();
    }

    function hideDictBox() {
        hideTipView();
        m_is_dict_box_show = false;
    }
})(jQuery);