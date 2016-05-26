var shanbayApi = function(){
    var self = this;
    var config = {};
    
    self.parseWebResult = function (result) {
        var web = result.web;
        var webExplainsContent = "";
        var i;
        for (i = 0; i < web.length ; i++) {
            var webExplain = fmt(frame.webExplain, web[i].key, web[i].value);
            webExplainsContent += webExplain;
        }
        return fmt(frame.webExplainsContainer, fmt(frame.webExplainsList, webExplainsContent));
    };
    
    function parseResultCode(code) {
        var response = {
            "status": "ok",
            "message": ""
        };
        switch (code) {
            case 0:
                response.message = "查询成功";
                status = "ok";
                break;
            case 1:
                response.message = "failed";
                response.status = "error";
                break;
            case 400:
                response.message = "请求数据有问题";
                response.status = "error";
                break;
            case 401:
                response.message = "权限不够";
                response.status = "error";
                break;
            case 404:
                response.message = "请求资源不存在";
                response.status = "error";
                break;
            case 409:
                response.message = "重复创建资源";
                response.status = "error";
                break;
        }
        return response;
    }
    
    function parseResult(result) {
        var resultObj = parseResultCode(result.errorCode);
        resultObj._rawResult = result;
        resultObj.spells = [];
        resultObj.comments = [];
        if (resultObj.status == "ok") {
            resultObj.spells.push({phonetic:result.data.pronunciation,sound:result.data.audio});
            resultObj.comments = result.data.definition.split("\n");
        }
        return resultObj;
    }
    
    self.setConfig = function(k, v){
        config[k] = v;
    }
    
    self.translate = function(q, callback){
        var url = "https://api.shanbay.com/bdc/search/?word=" + encodeURIComponent(q);
        $.get(url, function(resp){
            var ret = parseResult(resp);
            callback(ret);
        });
    };
}