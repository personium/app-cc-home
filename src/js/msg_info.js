var msg_info = {};

addLoadScript = function (scriptList) {
    scriptList.push("https://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.3.1/purl.min.js");
    scriptList.push("https://cdn.jsdelivr.net/npm/jdenticon@1.8.0");
    return scriptList;
}
addLoadStyleSheet = function (styleList) {
    return styleList;
}

addNamesapces = function (ns) {
    ns.push('message');
    return ns;
};

init = function () {
    ut.loadStyleSheet();
    ut.loadScript(msg_info.init);
}
msg_info.init = function () {
    if (sessionStorage.getItem("messageType") === "outgoing") {
        $("header a").attr("href", "outgoing_message_list.html");
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
    location.href = "create_message.html";
}

msg_info.transitionTransferMessage = function () {
    sessionStorage.setItem("createMsgType", "transfer");
    sessionStorage.removeItem("sendMsgList");
    location.href = "create_message.html";
}