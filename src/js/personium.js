var personium = {};

personium.setMoveEventSideMunu = function () {
    $('#drawer_btn').on('click', function () {
        $('#menu-background').show();
        $('#drawer_menu').animate({
            width: 'show'
        }, 300);
        return false;
    });

    $('#menu-background').click(function () {
        $('#drawer_menu').animate({
            width: 'hide'
        }, 300, function () {
            $('#menu-background').hide();
            return false;
        });
    });

    $('#drawer_menu').click(function (event) {
        event.stopPropagation();
    });
}

personium.createSideMenuItem = function (paramObj) {
    let title = (paramObj.title) ? paramObj.title : "";
    let sideId = (paramObj.parentId) ? paramObj.parentId : "#drawer_menu";
    let eleLen = $(sideId + " ul li").length

    let liTag = $("<li>", {
        class: (paramObj.showModal) ? "menu-list" : "menu-list slideArrow"
    });
    let aTag = $("<a>", {
        class: "allToggle",
        href: "javascript:void(0)",
        "data-i18n": title,
    });
    if ((typeof paramObj.callback !== "undefined") && $.isFunction(paramObj.callback)) {
        aTag.click(function () {
            paramObj.callback();
        });
    };
    liTag.append(aTag);
    $(sideId + " ul").append(liTag);
};

personium.createSessionExpirationModal = function (callback) {
    // Session Expiration
    html = '<div id="modal-session-expired" class="modal fade" role="dialog" data-backdrop="static">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header login-header">' +
        '<h4 class="modal-title" data-i18n="ReLogin"></h4>' +
        '</div>' +
        '<div class="modal-body" data-i18n="[html]expiredSession"></div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-primary" id="b-session-relogin-ok" >OK</button>' +
        '</div></div></div></div>';
    modal = $(html);
    $(document.body).append(modal);
    if ((typeof callback !== "undefined") && $.isFunction(callback)) {
        $('#b-session-relogin-ok').on('click', function () { callback(); });
    };
};

// API
personium.getProfile = function (url) {
    return $.ajax({
        type: "GET",
        url: url + '__/profile.json',
        dataType: 'json',
        headers: { 'Accept': 'application/json' }
    })
};
personium.getTargetProfile = function (schemaUrl, fileName) {
    return $.ajax({
        type: "GET",
        url: schemaUrl + "__/" + fileName + ".json",
        dataType: 'json',
        headers: { 'Accept': 'application/json' }
    });
}
personium.getTargetProfileLng = function (cellUrl, lng, fileName) {
    return $.ajax({
        type: "GET",
        url: cellUrl + "__/locales/" + lng + "/" + fileName + ".json",
        dataType: 'json',
        headers: { 'Accept': 'application/json' }
    });
}
// アカウントリストの取得
personium.getAccountList = function (cellUrl, token) {
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/Account',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
}
// アカウント割り当てロール一覧取得
personium.getAccountRoleList = function (cellUrl, token, accName, no) {
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/Account(Name=\'' + accName + '\')/$links/_Role',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
}
// 外部セル割り当てロール一覧取得
personium.getExtCellRoleList = function (cellUrl, token, extUrl) {
    var extCellUrl = encodeURIComponent(extUrl);
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/ExtCell(\'' + extCellUrl + '\')/$links/_Role',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
};
personium.restDeleteAccountAPI = function (cellUrl, token, name) {
    return $.ajax({
        type: "DELETE",
        url: cellUrl + '__ctl/Account(\'' + name + '\')',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
};
personium.getExtCellList = function (cellUrl, token, filter) {
    let query = "";
    if (filter) {
        query = "?$filter=substringof%28%27" + filter +"%27%2C+Url%29"
    }
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/ExtCell' + query,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    });
}
personium.getBoxList = function (cellUrl, token) {
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/Box',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
}
personium.getExtCellRoleList = function (cellUrl, token, extCellUrl, query) {
    let que = "";
    if (query) que = query;
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/ExtCell(\'' + encodeURIComponent(extCellUrl) + '\')/$links/_Role' + que,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
};
// アカウント割り当てロール一覧取得
personium.getAccountRoleList = function (cellUrl, token, accName) {
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/Account(Name=\'' + accName + '\')/$links/_Role',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
}

personium.getReceivedMessageCntAPI = function (cellUrl, token) {
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/ReceivedMessage?$filter=Type+eq+%27message%27+and+Status+eq+%27unread%27&$inlinecount=allpages',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    });
};
personium.getReceivedMessageAPI = function (cellUrl, token) {
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/ReceivedMessage?$orderby=__published%20desc&$filter=Type+eq+%27message%27',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    });
};
personium.getSentMessageAPI = function (cellUrl, token) {
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/SentMessage?$orderby=__published%20desc',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    });
};
personium.getCell = function (cellUrl) {
    if (!cellUrl) cellUrl = "https";

    return $.ajax({
        type: "GET",
        url: cellUrl,
        headers: {
            'Accept': 'application/xml'
        }
    });
};
personium.readMessageAPI = function (cellUrl, token, id) {
    var cmd = {
        "Command": "read"
    }
    return $.ajax({
        type: "POST",
        url: cellUrl + '__message/received/' + id,
        data: JSON.stringify(cmd),
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
}
personium.getRoleList = function (cellUrl, token) {
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/Role',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
}
personium.getReceivedMessageCntAPI = function (cellUrl, token) {
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/ReceivedMessage?$filter=Type+eq+%27message%27+and+Status+eq+%27unread%27&$inlinecount=allpages',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    });
};
personium.getProfile = function (cellUrl) {
    return $.ajax({
        type: "GET",
        url: cellUrl + '__/profile.json',
        dataType: 'json',
        headers: { 'Accept': 'application/json' }
    })
};
personium.getBoxStatus = function (cellUrl, token, boxName) {
    return $.ajax({
        type: "GET",
        url: cellUrl + boxName,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
}
personium.getNotCompMessageCnt = function (cellUrl, token) {
    return $.ajax({
        type: "GET",
        url: cellUrl + '__ctl/ReceivedMessage?$inlinecount=allpages&$filter=Type+ne+%27message%27+and+Status+eq+%27none%27',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    });
};
personium.refreshTokenAPI = function (cellUrl, refToken) {
    return $.ajax({
        type: "POST",
        url: cellUrl + '__token',
        processData: true,
        dataType: 'json',
        data: {
            grant_type: "refresh_token",
            refresh_token: refToken,
            p_cookie: true
        },
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
        }
    })
}
personium.getTargetToken = function (cellUrl, refToken, extCellUrl) {
    return $.ajax({
        type: "POST",
        url: cellUrl + '__token',
        processData: true,
        dataType: 'json',
        data: {
            grant_type: "refresh_token",
            refresh_token: refToken,
            p_target: extCellUrl
        },
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
        }
    });
};
personium.getBoxInfo = function (cellUrl, token, boxName) {
    return $.ajax({
        type: "GET",
        url: cellUrl + "__ctl/Box('" + boxName + "')",
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    });
}
personium.restAddAccountLinkRoleAPI = function (cellUrl, token, accName, boxName, roleName) {
    var uri = cellUrl + '__ctl/Role';
    if (!boxName) {
        uri += '(\'' + roleName + '\')';
    } else {
        uri += '(Name=\'' + roleName + '\',_Box\.Name=\'' + boxName + '\')';
    }
    var json = { "uri": uri };

    return $.ajax({
        type: "POST",
        url: cellUrl + '__ctl/Account(Name=\'' + accName + '\')/$links/_Role',
        data: JSON.stringify(json),
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    });
}
personium.restDeleteAccountLinkRoleAPI = function (cellUrl, token, accName, boxName, roleName) {
    var api = '__ctl/Account(Name=\'' + accName + '\')/$links/_Role';
    if (!boxName) {
        api += '(\'' + roleName + '\')';
    } else {
        api += '(Name=\'' + roleName + '\',_Box.Name=\'' + boxName + '\')';
    }

    return $.ajax({
        type: "DELETE",
        url: cellUrl + api,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
};
personium.restCreateExtCellAPI = function (cellUrl, token, json) {
    return $.ajax({
        type: "POST",
        url: cellUrl + '__ctl/ExtCell',
        data: JSON.stringify(json),
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
};
personium.restDeleteExtCellAPI = function (cellUrl, token, extUrl) {
    var extCellUrl = encodeURIComponent(extUrl);
    return $.ajax({
        type: "DELETE",
        url: cellUrl + '__ctl/ExtCell(\'' + extCellUrl + '\')',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
};
personium.restAddExtCellLinkRoleAPI = function (cellUrl, token, extUrl, boxName, roleName) {
    var extCellUrl = encodeURIComponent(extUrl);
    var uri = cellUrl + '__ctl/Role';
    if (!boxName) {
        uri += '(\'' + roleName + '\')';
    } else {
        uri += '(Name=\'' + roleName + '\',_Box\.Name=\'' + boxName + '\')';
    }
    var json = { "uri": uri };

    return $.ajax({
        type: "POST",
        url: cellUrl + '__ctl/ExtCell(\'' + extCellUrl + '\')/$links/_Role',
        data: JSON.stringify(json),
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    });
};
personium.restDeleteExtCellLinkRoleAPI = function (cellUrl, token, extUrl, boxName, roleName) {
    var extCellUrl = encodeURIComponent(extUrl);
    var api = '__ctl/ExtCell(\'' + extCellUrl + '\')/$links/_Role';
    if (!boxName) {
        api += '(\'' + roleName + '\')';
    } else {
        api += '(Name=\'' + roleName + '\',_Box.Name=\'' + boxName + '\')';
    }

    return $.ajax({
        type: "DELETE",
        url: cellUrl + api,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
};
personium.changePassAPI = function (cellUrl, token, newpass) {
    return $.ajax({
        type: "PUT",
        url: cellUrl + '__mypassword',
        headers: {
            'Authorization': 'Bearer ' + token,
            'X-Personium-Credential': newpass
        }
    });
};
personium.postSendAPI = function (cellUrl, token, dataObj) {
    return $.ajax({
        type: 'POST',
        url: cellUrl + '__message/send',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        },
        data: JSON.stringify(dataObj)
    });
}
personium.getExtCellLinksRole = function (cellUrl, token, extCellUrl) {
    let encExtUrl = encodeURIComponent(extCellUrl);
    return $.ajax({
        type: 'GET',
        url: cellUrl + '__ctl/ExtCell(\'' + encExtUrl + '\')/_Role',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    });
}
personium.getApplicationList = function () {
    return $.ajax({
        type: "GET",
        url: cm.getAppListURL(),
        datatype: 'json',
        headers: {
            'Accept': 'application/json'
        }
    })
};
personium.recursiveDeleteBoxAPI = function (cellUrl, token, boxName) {
    let header = {
        "Accept": "application/json",
        "Authorization": "Bearer " + token,
        "X-Personium-Recursive": true
    }

    return $.ajax({
        type: "DELETE",
        url: cellUrl + boxName,
        headers: header
    });
}

/* Transition method */
personium.init = function () {
    if (!cm.user) {
        var match = location.search.match(/id_token=(.*?)(&|$)/);
        if (match) {
            var gToken = decodeURIComponent(match[1]);
            lg.googleLogin(gToken);
        } else {
            cm.user = {};
            lg.loadLogin();
        }
    } else {
        ha.loadMain();
    }
}
personium.loadContent = function (contentUrl) {
    return $.ajax({
        url: contentUrl,
        type: "GET",
        dataType: "html"
    });
}
personium.createSubContent = function (html, notSlide) {
    let no = $(".subContent").length;
    if (no == 0) {
        $("#loadContent").show();
    }

    let aDiv = $("<div>", {
        id: "subContent" + no,
        class: "subContent subContent" + no,
        style: "z-index: " + (10 + no)
    }).append(html);

    $("#loadContent").append($(aDiv)).localize();
    personium.slideShow('.subContent' + no, notSlide);
    return '.subContent' + no;
};
personium.backSubContent = function (backCnt) {
    let result = "";
    if (backCnt) {
        let no = $(".subContent").length - 1;
        personium.slideHide(".subContent" + no, "right", function () {
            $(".subContent" + no).remove();
            if (no <= 0) {
                $("#loadContent").hide();
            }
            let next = backCnt - 1;
            if (next > 1) {
                personium.backSubContent(next);
            } else {
                personium.backSubContent();
            }
            
        });
        result = ".subContent" + (no - 1);
    } else {
        let no = $(".subContent").length - 1;
        personium.slideHide(".subContent" + no, "right", function () {
            $(".subContent" + no).remove();
            if (no <= 0) {
                $("#loadContent").hide();
            }
        });
        result = ".subContent" + (no - 1);
    }

    return result;
}
personium.slideShow = function (id, notSlide) {
    $(id).show();
    let moveSec = 300;
    if (notSlide) {
        moveSec = 0;
    }
    $(id).animate({
        left: 0
    }, moveSec);
}
personium.slideHide = function (id, direction, callback) {
    let m = "100%";
    if (direction == "left") {
        m = "200%";
    }

    $(id).animate({
        "left": m
    }, 300, function () {
        $(id).hide();
        if ((typeof callback !== "undefined") && $.isFunction(callback)) {
            callback();
        }
    });
}