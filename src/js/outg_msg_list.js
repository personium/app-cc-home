var outg_msg_list = {};
outg_msg_list.msgInfoList = [];

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
    ut.loadScript(outg_msg_list.init);
}
outg_msg_list.init = function () {

    outg_msg_list.displaySentMsgList();
}
/*
 * Display Receive Message List
 */
outg_msg_list.displaySentMsgList = function () {
    $("#messageList").empty();
    var count = 0
    // create Receive Message List
    personium.getSentMessageAPI(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
        var results = data.d.results;
        for (var i = 0; i < results.length; i++) {
            if (results[i]["_Box.Name"]) continue;
            var title = results[i].Title;
            if (title == null) {
                title = i18next.t("message:notSubject");
            }
            var body = results[i].Body;
            var id = results[i].__id;
            var to = results[i].To;
            let msgDate = moment(results[i].__updated).format("YYYY/MM/DD hh:mm");
            var unreadCss = "";
            if (results[i].Status != "unread" && results[i].Status != "none") {
                unreadCss = "read-msg";
            }

            let msgInfo = {
                "id": id,
                "body": body,
                "title": title,
                "date": msgDate,
                "url": to
            }
            outg_msg_list.msgInfoList.push(msgInfo);
            var html = [
                '<li>',
                    '<a href="#" onclick="outg_msg_list.transitionMessage(' + count + ');">',
                    '<div class="pn-list">',
                        '<div class="pn-list-icon">',
                            '<img id="msgIcon' + count + '">',
                        '</div>',
                        '<div class="message-list">',
                            '<div class="message-list-title text-hidden ' + unreadCss + '">',
                                title,
                            '</div>',
                            '<div class="received-info">',
                                '<span class="font-weight-bold ' + unreadCss+'" id="msgUserName' + count + '"></span>',
                                '<span class="received-date">' + msgDate + '</span>',
                            '</div>',
                            '<div class="message-list-text text-hidden">',
                                body,
                            '</div>',
                        '</div>',
                    '</div>',
                '</li>'
            ].join("");

            $("#messageList").append(html);
            cm.displayProfile(to, count);
            count++;
        }
    }).fail(function (data) {
        html = '<li data-i18n="message:errorSentMessage"></li>';
        $("#messageList").append(html).localize();
        count++;
    }).always(function (data) {
        if (count == 0) {
            html = '<li data-i18n="message:notSentMessage"></li>';
            $("#messageList").append(html).localize();
        }
    });
}
outg_msg_list.transitionMessage = function (count) {
    personium.readMessageAPI(cm.getMyCellUrl(), cm.getAccessToken(), outg_msg_list.msgInfoList[count].id).always(function () {
        sessionStorage.setItem("msgBody", outg_msg_list.msgInfoList[count].body);
        sessionStorage.setItem("msgTitle", outg_msg_list.msgInfoList[count].title);
        sessionStorage.setItem("msgDate", outg_msg_list.msgInfoList[count].date);
        sessionStorage.setItem("msgUrl", outg_msg_list.msgInfoList[count].url);
        sessionStorage.setItem("messageType", "outgoing");
        location.href = "message_info.html";
    })
}