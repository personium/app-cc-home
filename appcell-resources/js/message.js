var ms = {};

ms.replyTo = null;

addNamesapces = function (ns) {
    ns.push('message');
    return ns;
};

ms.init = function () {
    cm.createTitleHeader(false, true);
    cm.createSideMenu();
    cm.createBackMenu("main.html");
    ms.setTitle();
    st.initSettings();
    $("#dashboard").append('<div class="panel list-group toggle-panel" id="toggle-panel1"></div>');

    $("#b-create-message-sent").on('click', function () {
        var msg = {};
        msg.To = $("#txtDestCellUrl").val();
        msg.Title = $("#txtMessageSubject").val();
        msg.Body = $("#txtMessageBody").val();
        if (ms.replyTo) {
            msg.InReplyTo = ms.replyTo;
        }
        ms.postSendAPI(msg).done(function () {
            $("#dashboard").prepend('<div class="alert alert-success alert-dismissable fade in"><a href="JavaScript:void(0)" class="close" data-dismiss="alert" aria-label="close">&times;</a><span data-i18n="message:successSendMessage"></span></div>').localize();
            $("#modal-create-message").modal("hide");
        }).fail(function () {
            $("#dashboard").prepend('<div class="alert alert-warning alert-dismissable fade in"><a href="JavaScript:void(0)" class="close" data-dismiss="alert" aria-label="close">&times;</a><span data-i18n="message:failSendMessage"></span></div>').localize();
            $("#modal-create-message").modal("hide");
        });
    });
}

ms.checkCellUrl = function (obj) {
    if (obj.value) {
        if (cm.validateCellURL(obj.value, "popupSendCellUrlErrorMsg")
            && cm.doesUrlContainSlash(obj.value, "popupSendCellUrlErrorMsg", i18next.t("errorValidateEndWithCell"))) {

            ms.getCell(obj.value).done(function () {
                cm.getProfile(obj.value).done(function (result) {
                    $("#txtDestProfName").val(result.DisplayName);
                }).fail(function () {
                    $("#txtDestProfName").val("");
                }).always(function () {
                    $("#popupSendCellUrlErrorMsg").html("");
                    $("#b-create-message-sent").prop('disabled', false);
                });
            }).fail(function () {
                $("#txtDestProfName").val("");
                $("#popupSendCellUrlErrorMsg").attr("data-i18n", "notExistTargetCell").localize();
                $("#b-create-message-sent").prop('disabled', true);
            })
            
        }
       
    } else {
        $("#txtDestProfName").val("");
        $("#b-create-message-sent").prop('disabled', true);
    }
}

ms.setTitle = function () {
    cm.setTitleMenu("Message");
}

/*
 * Display Receive Message List
 */
ms.openReceiveMsg = function () {
    $("#toggle-panel1").empty();
    cm.setBackahead();
    $("#toggle-panel1").html('<ul class="list" id="messageList"></ul>');

    var count = 0
    // create Receive Message List
    ms.getReceivedMessageAPI().done(function (data) {
        var results = data.d.results;
        ms.profileList = new Array();
        for (var i = 0; i < results.length; i++) {
            if (results[i]["_Box.Name"]) continue;
            var title = results[i].Title;
            if (title == null) {
                title = i18next.t("message:notSubject");
            }
            var id = results[i].__id;
            var from = results[i].From;
            var unixTime = results[i].__updated
            unixTime = parseInt(unixTime.replace(/[^0-9^]/g, ""));
            var changedDate = ms.changeUnixTime(unixTime);
            var unreadCss = "";
            if (results[i].Status == "unread" || results[i].Status == "none") {
                unreadCss = "unread-msg";
            }
            var html = '<li id="msgList' + count + '" class="' + unreadCss + '">';
            html += '<a href="javascript:void(0)">';
            html += '<div class="list-icon">';
            html += '<img id="requestIcon' + count + '" width="24" height="24"/>';
            html += '</div>';
            html += '<div class="list-body">';
            html += '<div class="sizeBody">' + _.escape(title) + '</div>';
            html += '<div class="sizeCaption" id="requestName' + count + '" ></div>';
            html += '<div class="sizeCaption">' + changedDate + '</div>';
            html += '</div>';
            html += '</a>';
            html += '</li>';
            $("#messageList").append(html);
            ms.setProfile(from, count);
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
        $("#toggle-panel1,.panel-default").toggleClass('slide-on');
        cm.setTitleMenu("message:ReceiveMessage");
    });
}

/*
 * Display Sent Message List
 */
ms.openSentMsg = function () {
    $("#toggle-panel1").empty();
    cm.setBackahead();
    $("#toggle-panel1").html('<ul class="list" id="messageList"></ul>');

    var count = 0;
    // create Sent Message List
    ms.getSentMessageAPI().done(function (data) {
        var results = data.d.results;
        ms.profileList = new Array();
        for (var i = 0; i < results.length; i++) {
            if (results[i]["_Box.Name"]) continue;
            var title = results[i].Title;
            if (title == null) {
                title = i18next.t("message:notSubject");
            }
            var id = results[i].__id;
            var to = results[i].To;
            var unixTime = results[i].__updated
            unixTime = parseInt(unixTime.replace(/[^0-9^]/g, ""));
            var changedDate = ms.changeUnixTime(unixTime);
            var unreadCss = "";
            if (results[i].Status == "unread" || results[i].Status == "none") {
                unreadCss = "unread-msg";
            }
            var html = '<li id="msgList' + count + '" class="' + unreadCss + '">';
            html += '<a href="javascript:void(0)">';
            html += '<div class="list-icon">';
            html += '<img id="requestIcon' + count + '" width="24" height="24"/>';
            html += '</div>';
            html += '<div class="list-body">';
            html += '<div class="sizeBody">' + _.escape(title) + '</div>';
            html += '<div class="sizeCaption" id="requestName' + count + '"></div>';
            html += '<div class="sizeCaption">' + changedDate + '</div>';
            html += '</div>';
            html += '</a>';
            html += '</li>';
            $("#messageList").append(html);
            ms.setProfile(to, count);
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
        $("#toggle-panel1,.panel-default").toggleClass('slide-on');
        cm.setTitleMenu("message:SentMessage");
    });
}

ms.changeUnixTime = function (unixTime) {
    var date = new Date(unixTime);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
    var min = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
    var sec = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
    changedDate = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    return changedDate;
};

ms.setProfile = function (cellUrl, num) {
    cm.getProfile(cellUrl).done(function (result) {
        $('#requestName' + num).html('<div class="sizeCaption">' + _.escape(result.DisplayName) + '</div>');
        $('#requestName' + num).attr({ "id": "requestNameSet" + num });
        $('#requestIcon' + num).attr({ "src": result.Image });
        $('#requestIcon' + num).attr({ "id": "requestIconSet" + num });
    })
}

ms.createNewMsg = function () {
    ms.replyTo = null;
    $("#create-message_h").attr("data-i18n", "message:CreateNewMessage").localize();
    $("#modal-create-message").modal("show");
}

ms.getReceivedMessageAPI = function () {
    return $.ajax({
        type: "GET",
        url: cm.user.cellUrl + '__ctl/ReceivedMessage?$orderby=__published%20desc',
        headers: {
            'Authorization': 'Bearer ' + cm.user.access_token,
            'Accept': 'application/json'
        }
    });
};

ms.getSentMessageAPI = function () {
    return $.ajax({
        type: "GET",
        url: cm.user.cellUrl + '__ctl/SentMessage?$orderby=__published%20desc',
        headers: {
            'Authorization': 'Bearer ' + cm.user.access_token,
            'Accept': 'application/json'
        }
    });
};

ms.postSendAPI = function (dataObj) {
    return $.ajax({
        type: 'POST',
        url: cm.user.cellUrl + '__message/send',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + cm.user.access_token,
            'Accept': 'application/json'
        },
        data: JSON.stringify(dataObj)
    });
}

ms.getCell = function (cellUrl) {
    return $.ajax({
        type: "GET",
        url: cellUrl,
        headers: {
            'Accept': 'application/xml'
        }
    });
};