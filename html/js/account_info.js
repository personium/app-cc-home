var accinfo = {};

// Load account_info screen
accinfo.loadAccountInfo = function () {
    personium.loadContent(homeAppUrl + "html/account_info.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        accinfo.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

accinfo.init = function () {
    // Initialization
    accinfo.accountName = ut.changeLocalUnitToUnitUrl(sessionStorage.getItem("accountName"));
    accinfo.displayTitle();
    accinfo.displayAccountToRole();
}

accinfo.displayTitle = function () {
    $("header").addClass("ellipsisText");
    $("header").css("padding-right", "30px");
    $("header span").css("margin-left", "30px");
    $("header span").html(accinfo.accountName);
}
accinfo.displayAccountToRole = function () {
    // Get Box list
    personium.getBoxList(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
        $("#linksRoleAccount").empty();
        // Specify Box to get assigned Role
        var res = data.d.results;
        for (var i in res) {
            var schema = res[i].Schema;
            var boxName = res[i].Name;
            accinfo.createBoxRoleHeader(boxName);
            accinfo.appendBoxRole(boxName);
        }
    }).always(function (data) {
        // Get a custom role
        accinfo.createBoxRoleHeader("");
        accinfo.appendBoxRole(null);
    });
}
accinfo.createBoxRoleHeader = function (boxName) {
    let profTrans = "profTrans";
    let dispName = profTrans + ":" + boxName + "_DisplayName";
    let imgName = profTrans + ":" + boxName + "_Image";
    if (!boxName) {
        dispName = "UserCustomRole";
        imgName = profTrans + ":myProfile_Image";
    }
    $("#linksRoleAccount").append([
        '<span id="role_header_' + boxName + '" style="display:none;">',
        '<div class="title">',
        '<img class="ins-app-img title-icon" data-i18n="[src]' + imgName + '" alt="">',
        '<span style="margin-left:0.43rem;" data-i18n="' + dispName + '"></span>',
        '</div>',
        '<div class="role-list thin-border">',
        '<ul id="role_list_' + boxName + '">',
        '</ul>',
        '</div>',
        '</span>'
    ].join("")).localize();
}
accinfo.appendBoxRole = function (boxName) {
    // Get assigned Role
    let createFlg = false;
    var key = boxName;
    var seq = "\'";
    if (!key) {
        key = seq = "";
    }
    $("#role_list_" + key).empty();
    personium.getAccountRoleList(cm.getMyCellUrl(), cm.getAccessToken(), accinfo.accountName).done(function (data) {
        var results = data.d.results;
        results.sort(function (val1, val2) {
            return (val1.uri < val2.uri ? 1 : -1);
        });
        let profTrans = "profTrans";
        for (var i = 0; i < results.length; i++) {
            if (results[i].uri.indexOf(seq + boxName + seq) > -1) {
                if (!createFlg) {
                    // If Role is, application header display
                    $("#role_header_" + key).css("display", "block");
                    createFlg = true;
                }

                // Show assigned Role
                var url = results[i].uri;
                var matchName = url.match(/\(Name='(.+)',/);
                var name = matchName[1];
                if (boxName) {
                    let transName = profTrans + ":" + name + "_" + key + "_DisplayName";
                    let transImage = profTrans + ":" + name + "_" + key + "_Image";
                    $("#role_list_" + key).append([
                        '<li class="ellipsisText">',
                        '<img class="image-circle-small" data-i18n="[src]' + transImage + '">',
                        '<span data-i18n="' + transName + '"></span>',
                        '</li>'
                    ].join("")).localize();
                } else {
                    $("#role_list_").append([
                        '<li class="ellipsisText">',
                        '<img class="image-circle-small"src="' + cm.defaultRoleIcon + '">',
                        name,
                        '</li>'
                    ].join("")).localize();
                }
                
            }
        }
    }).always(function () {
        if (!createFlg) {
            $("#role_header_" + key).remove();
        }
    })
}