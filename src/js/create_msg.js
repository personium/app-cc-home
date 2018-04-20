var create_msg = {};
create_msg.cellUrlList = [];

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
    ut.loadScript(create_msg.init);
}
create_msg.init = function () {
    create_msg.Add_Btn_Event();
    if (sessionStorage.getItem("sendMsgList")) {
        create_msg.cellUrlList = JSON.parse(sessionStorage.getItem("sendMsgList"));
    }

    if (sessionStorage.getItem("createMsgType")) {
        if (sessionStorage.getItem("createMsgType") == "reply") {
            create_msg.displayMsg("RE:");
        } else {
            create_msg.displayMsg("FW:");
        }
    } else {
        $("header a").attr("href", "message.html");
    }
    create_msg.displayAddress();
}
create_msg.Add_Btn_Event = function () {
    $('.double-btn-modal .ok-btn').click(function () {
        create_msg.sendMessage();
    });
    $('.header-btn-right').click(function () {
        create_msg.confirmSendMessage();
    });
    $('#add-to-account').click(function () {
        location.href = "search_cell.html";
    });
}
create_msg.delAddress = function (obj) {
    $(obj).parent().remove();
    let delNo = create_msg.cellUrlList.indexOf($(obj).data("cellUrl"));
    if (delNo >= 0) {
        create_msg.cellUrlList.splice(delNo, 1);
        sessionStorage.setItem("sendMsgList", JSON.stringify(create_msg.cellUrlList));
    }

    if (!$(".to-user-info").length) {
        create_msg.toggleSendIcon();
    }
}
create_msg.toggleSendIcon = function () {
    $('.to-user-info-area').toggle();
    if (!($('.to-address-info').css('display') == 'none')) {
        $('.send-icon').removeClass('disable');
        $('.send-icon').addClass('active');
    } else {
        $('.send-icon').removeClass('active');
        $('.send-icon').addClass('disable');
    }
}
/*
 * Display Receive Message
 */
create_msg.displayMsg = function (headStr) {
    let msg = '\n' + sessionStorage.getItem("msgBody");

    $(".create-title").html(headStr + sessionStorage.getItem("msgTitle"));
    $(".create-msg").html("\n" + msg.replace(/\r?\n/g, '\n>'));
    $("header a").attr("href", "message_info.html");
}

/*
 * Display of address part
 */
create_msg.displayAddress = function () {
    let urlList = create_msg.cellUrlList;

    $('.to-address-info').empty();
    if (urlList.length) {
        create_msg.toggleSendIcon();
    }
    for (var i in urlList) {
        create_msg.displayAddressInfo(urlList[i]);
    }
}
create_msg.displayAddressInfo = function (cellUrl) {
    let html;
    personium.getCell(cellUrl).done(function () {
        let cellName = ut.getName(cellUrl);
        let urlParse = $.url(cellUrl);
        let transName = urlParse.attr('host') + "_" + cellName;
        if (!i18next.exists(transName)) {
            cm.registerProfI18n(cellUrl, transName, "profile", "Person");
        }
        html = [
            '<div class="to-user-info">',
                '<img class="user-icon-xs" data-i18n="[src]profTrans:' + transName + '_Image" alt="">',
                '<div class="to-user-name" data-i18n="profTrans:' + transName + '_DisplayName"></div >',
                '<button class="pn-btn dlt-circle-btn" data-cell-url="' + cellUrl + '" onclick="create_msg.delAddress(this);">',
                    '<i class="fas fa-times-circle fa-2x user-icon-xs"></i>',
                '</button>',
            '</div>'
        ].join("");
    }).fail(function () {
        let cellName = ut.getName(cellUrl);
        let cellImage = ut.getDefaultImage(cellUrl);
        html = [
            '<div class="to-user-info">',
                '<img class="user-icon-xs" src="" alt="">',
                '<div class="to-user-name">' + cellName + '</div >',
                '<button class="pn-btn dlt-circle-btn" data-cell-url="' + cellUrl + '" onclick="create_msg.delAddress(this);">',
                    '<i class="fas fa-times-circle fa-2x user-icon-xs"></i>',
                '</button>',
            '</div>'
        ].join("");
    }).always(function () {
        $('.to-address-info').append(html);
    })
}

create_msg.confirmSendMessage = function () {
    if ($('.to-address-info').css('display') == "none") {
        return;
    }

    $('.double-btn-modal').modal('show');
}
create_msg.sendMessage = function () {
    var msg = {};
    msg.Title = $(".create-title").val();
    msg.Body = $(".create-msg").val();
    if (sessionStorage.getItem("createMsgType") == "reply") {
        msg.InReplyTo = sessionStorage.getItem("msgId");
    }
    let listCount = create_msg.cellUrlList.length;
    let sendCount = 0;
    for (var i in create_msg.cellUrlList) {
        msg.To = create_msg.cellUrlList[i];
        personium.postSendAPI(cm.getMyCellUrl(), cm.getAccessToken(), msg).done(function () {
            sendCount++;
            if (sendCount >= listCount) {
                if (sessionStorage.getItem("createMsgType")) {
                    location.href = "message_info.html";
                } else {
                    location.href = "message.html";
                }
            }
        }).fail(function (data) {
            $("#main").prepend('<div class="alert alert-warning alert-dismissable"><a href="JavaScript:void(0)" class="close" data-dismiss="alert" aria-label="close">&times;</a><span data-i18n="message:failSendMessage"></span></div>').localize();
            $(".double-btn-modal").modal("hide");
            console.log(data);
        });
    }
}