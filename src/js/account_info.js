var accinfo = {};

accinfo.accountName = sessionStorage.getItem("accountName");
if (!accinfo.accountName) {
    location.href = "./account.html";
}
accinfo.accountName = ut.changeLocalUnitToUnitUrl(accinfo.accountName);

addLoadScript = function (scriptList) {
    scriptList.push("https://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.3.1/purl.min.js");
    scriptList.push("https://cdn.jsdelivr.net/npm/jdenticon@1.8.0");
    return scriptList;
}
addLoadStyleSheet = function (styleList) {
    return styleList;
}

function init() {
    ut.loadStyleSheet();
    ut.loadScript(accinfo.init);
}

accinfo.init = function () {
    // Initialization
    cm.i18nSetProfile();
    cm.i18nSetRole();
    cm.i18nSetBox();
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
    // Box一覧取得
    personium.getBoxList(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
        $(".app-and-service").empty();
        // Boxを指定して割り当てRoleを取得
        var res = data.d.results;
        for (var i in res) {
            var schema = res[i].Schema;
            var boxName = res[i].Name;
            if (schema && schema.length > 0) {
                cm.registerProfI18n(schema, boxName, "profile", "App");
            }
            accinfo.createBoxRoleHeader(boxName);
            accinfo.appendBoxRole(boxName);
        }
    }).always(function (data) {
        // カスタムロールを取得
        accinfo.createBoxRoleHeader("");
        let createFlg = false;
        personium.getAccountRoleList(cm.getMyCellUrl(), cm.getAccessToken(), accinfo.accountName).done(function (data) {
            var results = data.d.results;
            results.sort(function (val1, val2) {
                return (val1.uri < val2.uri ? 1 : -1);
            });
            let profTrans = "profTrans";
            for (var i = 0; i < results.length; i++) {
                if (results[i].uri.indexOf("null") > -1) {
                    if (!createFlg) {
                        // Roleがアレば、アプリヘッダー表示
                        $("#role_header_").css("display", "block");
                        createFlg = true;
                    }

                    // 割り当てRoleを表示
                    var url = results[i].uri;
                    var matchName = url.match(/\(Name='(.+)',/);
                    var name = matchName[1];
                    $("#role_list_").append([
                        '<li class="ellipsisText">',
                        name,
                        '</li>'
                    ].join("")).localize();
                }
            }
        }).always(function () {
            if (!createFlg) {
                $("#role_header_").remove();
            }

            $("footer>div>span").attr("data-i18n", "EditRole");
        })
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
    $(".app-and-service").append([
        '<span id="role_header_' + boxName + '" style="display:none;">',
        '<div class="title">',
        '<img class="title-icon" data-i18n="[src]' + imgName + '" alt="">',
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
    // 割り当てRoleを取得
    let createFlg = false;
    personium.getAccountRoleList(cm.getMyCellUrl(), cm.getAccessToken(), accinfo.accountName).done(function (data) {
        var results = data.d.results;
        results.sort(function (val1, val2) {
            return (val1.uri < val2.uri ? 1 : -1);
        });
        let profTrans = "profTrans";
        for (var i = 0; i < results.length; i++) {
            if (results[i].uri.indexOf("\'" + boxName + "\'") > -1) {
                if (!createFlg) {
                    // Roleがアレば、アプリヘッダー表示
                    $("#role_header_" + boxName).css("display", "block");
                    createFlg = true;
                }

                // 割り当てRoleを表示
                var url = results[i].uri;
                var matchName = url.match(/\(Name='(.+)',/);
                var name = matchName[1];
                let transName = profTrans + ":" + name + "_" + boxName + "_DisplayName";
                let transImage = profTrans + ":" + name + "_" + boxName + "_Image";
                $("#role_list_" + boxName).append([
                    '<li class="ellipsisText">',
                    '<img class="image-circle-small" data-i18n="[src]' + transImage + '">',
                    '<span data-i18n="' + transName + '"></span>',
                    '</li>'
                ].join("")).localize();
            }
        }
    }).always(function () {
        if (!createFlg) {
            $("#role_header_" + boxName).remove();
        }
    })
}