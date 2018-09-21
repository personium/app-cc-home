var message = {};

// Load message screen
message.loadMessage = function () {
    personium.loadContent(cm.homeAppUrl + "__/html/message.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        message.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
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