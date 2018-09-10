var inc_msg_list = {};

// Load incoming_message_list screen
inc_msg_list.loadIncomingMessageList = function () {
    personium.loadContent(cm.homeAppUrl + "__/html/incoming_message_list.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        inc_msg_list.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

inc_msg_list.init = function () {
    inc_msg_list.msgInfoList = [];
    inc_msg_list.displayReceivedMsgList();
}
/*
 * Display Receive Message List
 */
inc_msg_list.displayReceivedMsgList = function () {
    $("#messageList").empty();
    var count = 0
    // create Receive Message List
    personium.getReceivedMessageAPI(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
        var results = data.d.results;
        for (var i = 0; i < results.length; i++) {
            if (results[i]["_Box.Name"]) continue;
            var title = results[i].Title;
            if (title == null) {
                title = i18next.t("message:notSubject");
            }
            var body = results[i].Body;
            var id = results[i].__id;
            var from = results[i].From;
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
                "url": from
            }
            inc_msg_list.msgInfoList.push(msgInfo);
            var html = [
                '<li>',
                    '<a href="#" onclick="inc_msg_list.transitionMessage(' + count + ');">',
                    '<div class="pn-list">',
                        '<div class="pn-list-icon">',
                            '<img id="msgIcon' + count + '">',
                        '</div>',
                        '<div class="message-list">',
                            '<div id="msgTitle' + count + '" class="message-list-title text-hidden ' + unreadCss + '">',
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
            cm.displayProfile(from, count);
            count++;
        }
    }).fail(function (data) {
        html = '<li data-i18n="message:errorReceivedMessage"></li>';
        $("#messageList").append(html).localize();
        count++;
    }).always(function (data) {
        if (count == 0) {
            html = '<li data-i18n="message:notReceivedMessage"></li>';
            $("#messageList").append(html).localize();
        }
    });
}
inc_msg_list.transitionMessage = function (count) {
    personium.readMessageAPI(cm.getMyCellUrl(), cm.getAccessToken(), inc_msg_list.msgInfoList[count].id).always(function () {
        sessionStorage.setItem("msgBody", inc_msg_list.msgInfoList[count].body);
        sessionStorage.setItem("msgTitle", inc_msg_list.msgInfoList[count].title);
        sessionStorage.setItem("msgDate", inc_msg_list.msgInfoList[count].date);
        sessionStorage.setItem("msgUrl", inc_msg_list.msgInfoList[count].url);
        sessionStorage.setItem("msgId", inc_msg_list.msgInfoList[count].id);
        sessionStorage.setItem("messageType", "incomming");
        $("#msgUserName" + count).addClass("read-msg");
        $("#msgTitle" + count).addClass("read-msg");
        msg_info.loadMessageInfo();
    })
}