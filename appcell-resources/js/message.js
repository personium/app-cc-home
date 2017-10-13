var ms = {};

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
        var html = '';
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
            html += '<li class="' + unreadCss + '">';
            html += '<a href="javascript:void(0)">';
            html += '<div class="list-icon">';
            html += '<img id="requestIcon" width="24" height="24"/>';
            html += '</div>';
            html += '<div class="list-body">';
            html += '<div class="sizeBody">' + _.escape(title) + '</div>';
            html += '<div class="sizeCaption" id="requestName" ></div>';
            html += '<div class="sizeCaption">' + changedDate + '</div>';
            html += '</div>';
            html += '</a>';
            html += '</li>';
            ms.profileList.push(cm.getProfile(from));
            count++;
        }
        ms.setProfile();
        if (html.length > 0) {
            $("#messageList").append(html);
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
        var html = '';
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
            html += '<li class="' + unreadCss + '">';
            html += '<a href="javascript:void(0)">';
            html += '<div class="list-icon">';
            html += '<img id="requestIcon" width="24" height="24"/>';
            html += '</div>';
            html += '<div class="list-body">';
            html += '<div class="sizeBody">' + _.escape(title) + '</div>';
            html += '<div class="sizeCaption" id="requestName" ></div>';
            html += '<div class="sizeCaption">' + changedDate + '</div>';
            html += '</div>';
            html += '</a>';
            html += '</li>';
            ms.profileList.push(cm.getProfile(from));
            count++;
        }
        ms.setProfile();
        if (html.length > 0) {
            $("#messageList").append(html);
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

ms.setProfile = function () {
    $.when.apply($, ms.profileList).done(function () {
        for (var i = 0; i < arguments.length; i++) {
            var result = arguments[i];
            if (result.length > 0) {
                $('#requestName').html('<div class="sizeCaption">' + _.escape(result[0].DisplayName) + '</div>');
                $('#requestName').attr({ "id": "requestNameSet" });
                $('#requestIcon').attr({ "src": result[0].Image });
                $('#requestIcon').attr({ "id": "requestIconSet" });
            } else {
                $('#requestName').html('<div class="sizeCaption">' + _.escape(result.DisplayName) + '</div>');
                $('#requestName').attr({ "id": "requestNameSet" });
                $('#requestIcon').attr({ "src": result.Image });
                $('#requestIcon').attr({ "id": "requestIconSet" });
            }
        }
    });
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