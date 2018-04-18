var message = {};

addLoadScript = function (scriptList) {
    scriptList.push("https://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.3.1/purl.min.js");
    scriptList.push("https://cdn.jsdelivr.net/npm/jdenticon@1.8.0");
    scriptList.push("https://cdnjs.cloudflare.com/ajax/libs/cropper/3.1.4/cropper.min.js");
    return scriptList;
}
addLoadStyleSheet = function (styleList) {
    styleList.push("https://demo.personium.io/HomeApplication/__/appcell-resources/css/cropper/cropper.min.css");
    styleList.push("https://demo.personium.io/HomeApplication/__/appcell-resources/css/cropper/cropper_circle_mask.css");
    return styleList;
}

addNamesapces = function (ns) {
    ns.push('message');
    return ns;
};

init = function () {
    ut.loadStyleSheet();
    ut.loadScript(message.init);
}
message.init = function () {
    message.dispReciveMsgCnt();

    // delete message session
    sessionStorage.removeItem("createMsgType");
    sessionStorage.removeItem("sendMsgList");
}
message.dispReciveMsgCnt = function () {
    personium.getReceivedMessageCntAPI(cm.getMyCellUrl(), cm.getAccessToken()).done(function (res) {
        var results = res.d.results;
        var cnt = 0;
        for (var i in results) {
            if (!results[i]["_Box.Name"]) {
                cnt++;
            }
        }

        if (cnt > 0) {
            $("#receiveCnt").html(cnt);
        } else {
            $("#receiveCnt").html("");
        }
    })
}