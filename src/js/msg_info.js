var msg_info = {};

// Load message_info screen
msg_info.loadMessageInfo = function () {
    personium.loadContent(cm.homeAppUrl + "__/html/message_info.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        msg_info.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

msg_info.init = function () {
    if (sessionStorage.getItem("messageType") === "outgoing") {
        $("header span").attr("data-i18n", "message:SentMessage").localize();
        $("footer").hide();
    } else {
        $("header span").attr("data-i18n", "message:ReceiveMessage").localize();
    }
    msg_info.displayReceivedMsg();

    // reset create message session
    sessionStorage.removeItem("sendList");
}
/*
 * Display Receive Message
 */
msg_info.displayReceivedMsg = function () {
    $(".message-title").html(sessionStorage.getItem("msgTitle"));
    $(".message-text").html(sessionStorage.getItem("msgBody").replace(/\r?\n/g, '<br>'));
    $("#msgDate").html(sessionStorage.getItem("msgDate"));
    cm.displayProfile(sessionStorage.getItem("msgUrl"), "");
}

msg_info.transitionReplyMessage = function () {
    sessionStorage.setItem("createMsgType", "reply");
    let msgCellList = [sessionStorage.getItem("msgUrl")];
    sessionStorage.setItem("sendMsgList", JSON.stringify(msgCellList));
    create_msg.loadCreateMessage();
}

msg_info.transitionTransferMessage = function () {
    sessionStorage.setItem("createMsgType", "transfer");
    sessionStorage.removeItem("sendMsgList");
    create_msg.loadCreateMessage();
}