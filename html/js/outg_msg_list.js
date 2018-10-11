var outg_msg_list = {};

// Load outgoing_message_list screen
outg_msg_list.loadOutgoingMessageList = function () {
    personium.loadContent(homeAppUrl + "html/outgoing_message_list.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        outg_msg_list.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

outg_msg_list.init = function () {
    outg_msg_list.msgInfoList = [];
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
                    '<a href="javascript:void(0)" onclick="outg_msg_list.transitionMessage(' + count + ');">',
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
        msg_info.loadMessageInfo();
    })
}