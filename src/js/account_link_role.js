var acc_link_role = {};
acc_link_role.accountName = sessionStorage.getItem("accountName");
acc_link_role.roleList = JSON.parse(sessionStorage.getItem("roleList"));
if (!acc_link_role.accountName && !acc_link_role.roleList) {
    location.href = "./account.html";
}

if (sessionStorage.getItem("linksList")) {
    acc_link_role.linksList = JSON.parse(sessionStorage.getItem("linksList"));
} else {
    acc_link_role.linksList = [];
}

addLoadScript = function (scriptList) {
    scriptList.push("https://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.3.1/purl.min.js");
    scriptList.push("https://cdn.jsdelivr.net/npm/jdenticon@1.8.0");
    return scriptList;
}
addLoadStyleSheet = function (styleList) {
    return styleList;
}

/*** new ***/
function init() {
    ut.loadStyleSheet();
    ut.loadScript(acc_link_role.init);
}

acc_link_role.init = function () {
    // Initialization
    cm.i18nSetProfile();
    cm.i18nSetRole();
    cm.i18nSetBox();

    acc_link_role.displayTitle();
    acc_link_role.displayRoleList();

    acc_link_role.Add_Check_Mark();
}
acc_link_role.displayTitle = function () {
    let boxName = sessionStorage.getItem("boxName");
    if (boxName) {
        $("header span").attr("data-i18n", "profTrans:" + boxName + "_DisplayName").localize();
        $("header img").attr("data-i18n", "[src]profTrans:" + boxName + "_Image").localize();
    } else {
        $("header span").attr("data-i18n", "UserCustomRole").localize();
        $("header img").attr("data-i18n", "[src]profTrans:myProfile_Image").localize();
    }
}

acc_link_role.displayRoleList = function () {
    $("#check-list ul").empty();
    let boxName = sessionStorage.getItem("boxName");
    if (!boxName) {
        boxName = "[main]";
    }
    for (var i in acc_link_role.roleList) {
        let roleName = acc_link_role.roleList[i];
        let markStyle = "";
        if ($.inArray(roleName, acc_link_role.linksList) >= 0) {
            markStyle = "check-mark-left";
        }
        let html = [
            '<li class="pn-check-list check-position-l '+markStyle+'" data-role-name="'+roleName+'">',
                '<div class="pn-list pn-list-no-arrow">',
                    '<div class="account-info">',
                        '<div class="user-name">',
                        '<img class="image-circle-small" style="margin-top:0px;" data-i18n="[src]profTrans:' + roleName + '_' + boxName + '_Image" src="' + cm.defaultRoleIcon + '">',
                            '<span data-i18n="profTrans:' + roleName + '_' + boxName + '_DisplayName">' + roleName + '</span>',
                        '</div>',
                        '<div data-i18n="profTrans:' + roleName + '_' + boxName + '_Description"></div>',
                    '</div>',
                '</div>',
            '</li > '
        ].join("");
        $("#check-list ul").append(html).localize();
    }
}
/**
   * Add_Check_Mark
   * param:none
   */
acc_link_role.Add_Check_Mark = function() {
    $('.pn-check-list').click(function (event) {
        //CASE: check list
        if ($(this).parents('#check-list').length != 0) {
            // Disable click event
            $(this).css("pointer-events", "none");
            if ($(this).hasClass('check-mark-left')) {
                acc_link_role.deleteAccountLink($(this));
            } else {
                acc_link_role.addAccountLink($(this));
            }
        }
    });
}
acc_link_role.addAccountLink = function (obj) {
    let roleName = obj.data("role-name");
    let boxName = sessionStorage.getItem("boxName");
    personium.restAddAccountLinkRoleAPI(cm.getMyCellUrl(), cm.getAccessToken(), acc_link_role.accountName, boxName, roleName).done(function (data) {
        let linksNo = $.inArray(roleName, acc_link_role.linksList);
        if (linksNo < 0) {
            acc_link_role.linksList.push(roleName);
            sessionStorage.setItem("linksList", JSON.stringify(acc_link_role.linksList));
        }
        obj.addClass('check-mark-left');
    }).fail(function (data) {
        var res = JSON.parse(data.responseText);
        alert("An error has occurred.\n" + res.message.value);
    }).always(function () {
        // Enable click event
        obj.css("pointer-events", "auto");
    });
}
acc_link_role.deleteAccountLink = function (obj) {
    let roleName = obj.data("role-name");
    let boxName = sessionStorage.getItem("boxName");
    personium.restDeleteAccountLinkRoleAPI(cm.getMyCellUrl(), cm.getAccessToken(), acc_link_role.accountName, boxName, roleName).done(function (data) {
        let linksNo = $.inArray(roleName, acc_link_role.linksList);
        if (linksNo >= 0) {
            acc_link_role.linksList.splice(linksNo, 1);
            sessionStorage.setItem("linksList", JSON.stringify(acc_link_role.linksList));
        }
        obj.removeClass('check-mark-left');
    }).fail(function (data) {
        var res = JSON.parse(data.responseText);
        alert("An error has occurred.\n" + res.message.value);
    }).always(function () {
        // Enable click event
        obj.css("pointer-events", "auto");
    });
};