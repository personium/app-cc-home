var extcell_link_role = {};
extcell_link_role.extCellUrl = sessionStorage.getItem("extCellUrl");
extcell_link_role.roleList = JSON.parse(sessionStorage.getItem("roleList"));
if (!extcell_link_role.extCellUrl && !extcell_link_role.roleList) {
    location.href = "./arrow_to_role.html";
}

if (sessionStorage.getItem("linksList")) {
    extcell_link_role.linksList = JSON.parse(sessionStorage.getItem("linksList"));
} else {
    extcell_link_role.linksList = [];
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
    ut.loadScript(extcell_link_role.init);
}

extcell_link_role.init = function () {
    // Initialization
    cm.i18nSetProfile();
    cm.i18nSetRole();
    cm.i18nSetBox();

    extcell_link_role.displayTitle();
    extcell_link_role.displayRoleList();

    extcell_link_role.Add_Check_Mark();
}
extcell_link_role.displayTitle = function () {
    let boxName = sessionStorage.getItem("boxName");
    if (boxName) {
        $("header span").attr("data-i18n", "profTrans:" + boxName + "_DisplayName").localize();
        $("header img").attr("data-i18n", "[src]profTrans:" + boxName + "_Image").localize();
    } else {
        $("header span").attr("data-i18n", "UserCustomRole").localize();
        $("header img").attr("data-i18n", "[src]profTrans:myProfile_Image").localize();
    }
    $("header img").css("border-radius", "10px");
}

extcell_link_role.displayRoleList = function () {
    $("#check-list ul").empty();
    let boxName = sessionStorage.getItem("boxName");
    if (!boxName) {
        boxName = "[main]";
    }
    for (var i in extcell_link_role.roleList) {
        let roleName = extcell_link_role.roleList[i];
        let markStyle = "";
        if ($.inArray(roleName, extcell_link_role.linksList) >= 0) {
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
extcell_link_role.Add_Check_Mark = function() {
    $('.pn-check-list').click(function (event) {
        //CASE: check list
        if ($(this).parents('#check-list').length != 0) {
            // Disable click event
            $(this).css("pointer-events", "none");
            if ($(this).hasClass('check-mark-left')) {
                extcell_link_role.deleteExtCellLink($(this));
            } else {
                extcell_link_role.addExtCellLink($(this));
            }
        }
    });
}
extcell_link_role.addExtCellLink = function (obj) {
    let roleName = obj.data("role-name");
    let boxName = sessionStorage.getItem("boxName");
    personium.restAddExtCellLinkRoleAPI(cm.getMyCellUrl(), cm.getAccessToken(), extcell_link_role.extCellUrl, boxName, roleName).done(function (data) {
        let linksNo = $.inArray(roleName, extcell_link_role.linksList);
        if (linksNo < 0) {
            extcell_link_role.linksList.push(roleName);
            sessionStorage.setItem("linksList", JSON.stringify(extcell_link_role.linksList));
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
extcell_link_role.deleteExtCellLink = function (obj) {
    let roleName = obj.data("role-name");
    let boxName = sessionStorage.getItem("boxName");
    personium.restDeleteExtCellLinkRoleAPI(cm.getMyCellUrl(), cm.getAccessToken(), extcell_link_role.extCellUrl, boxName, roleName).done(function (data) {
        let linksNo = $.inArray(roleName, extcell_link_role.linksList);
        if (linksNo >= 0) {
            extcell_link_role.linksList.splice(linksNo, 1);
            sessionStorage.setItem("linksList", JSON.stringify(extcell_link_role.linksList));
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