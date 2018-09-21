var create_msg = {};

// Load create_message screen
create_msg.loadCreateMessage = function () {
    personium.loadContent(cm.homeAppUrl + "__/html/create_message.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        create_msg.init();
        create_msg.Add_Btn_Event();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

create_msg.init = function () {
    create_msg.cellUrlList = [];
    if (sessionStorage.getItem("sendMsgList")) {
        create_msg.cellUrlList = JSON.parse(sessionStorage.getItem("sendMsgList"));
    }

    if (sessionStorage.getItem("createMsgType")) {
        if (sessionStorage.getItem("createMsgType") == "reply") {
            create_msg.displayMsg("RE:");
        } else {
            create_msg.displayMsg("FW:");
        }
    }
    create_msg.displayAddress();
}
create_msg.Add_Btn_Event = function () {
    $('.double-btn-modal .ok-btn').click(function () {
        create_msg.sendMessage();
    });
    $('#create_send_btn').click(function () {
        create_msg.confirmSendMessage();
    });
    $('#add-to-account').click(function () {
        create_msg.loadSearchCell();
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
        create_msg.disableSendIcon();
    }
}
create_msg.activeSendIcon = function () {
    $('.to-address-title').hide();
    $('.to-address-info').show();
    $('.send-icon').removeClass('disable');
    $('.send-icon').addClass('active');
}
create_msg.disableSendIcon = function () {
    $('.to-address-title').show();
    $('.to-address-info').hide();
    $('.send-icon').removeClass('active');
    $('.send-icon').addClass('disable');
}
/*
 * Display Receive Message
 */
create_msg.displayMsg = function (headStr) {
    let msg = '\n' + sessionStorage.getItem("msgBody");

    $(".create-title").html(headStr + sessionStorage.getItem("msgTitle"));
    $(".create-msg").html("\n" + msg.replace(/\r?\n/g, '\n>'));
}

/*
 * Display of address part
 */
create_msg.displayAddress = function () {
    let urlList = create_msg.cellUrlList;

    $('.to-address-info').empty();
    if (urlList.length) {
        create_msg.activeSendIcon();
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

    $('#confSendMsg_modal').modal('show');
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
                personium.backSubContent();
            }
        }).fail(function (data) {
            $("#main").prepend('<div class="alert alert-warning alert-dismissable"><a href="JavaScript:void(0)" class="close" data-dismiss="alert" aria-label="close">&times;</a><span data-i18n="message:failSendMessage"></span></div>').localize();
            console.log(data);
        }).always(function () {
            $("#confSendMsg_modal").modal("hide");
        });
    }
}