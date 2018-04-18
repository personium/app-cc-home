var atr = {};
atr.extCellUrl = sessionStorage.getItem("extCellUrl");
if (!atr.extCellUrl) {
    location.href = "./links.html";
}
atr.extCellUrl = ut.changeLocalUnitToUnitUrl(atr.extCellUrl);

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
    ut.loadScript(atr.init);
}

atr.init = function () {
    // Initialization
    atr.Add_Btn_Event();
    cm.i18nSetProfile();
    cm.i18nSetTargetProfile(atr.extCellUrl);
    cm.i18nSetRole();
    cm.i18nSetBox();

    atr.displayMyImage();
    atr.displayTargetImage();
    atr.displayArrowToRole();
}

atr.Add_Btn_Event = function () {
    $('.header-btn-right').click(function () {
        location.href = "extcell_link_role_list.html";
    });
}

atr.displayMyImage = function () {
    $(".arrow-to-img .font-weight-bold").eq(0).attr("data-i18n", "profTrans:myProfile_DisplayName").localize();
    $(".arrow-to-img .user-icon").eq(0).append('<img class="user-icon-large" data-i18n="[src]profTrans:myProfile_Image" src="" alt="user">');
}
atr.displayTargetImage = function () {
    var transName = cm.getTargetProfTransName(atr.extCellUrl);
    $(".arrow-to-img .font-weight-bold").eq(1).attr("data-i18n", "profTrans:"+transName+"_DisplayName").localize();
    $(".arrow-to-img .user-icon").eq(1).append('<img class="user-icon-large" data-i18n="[src]profTrans:'+transName+'_Image" src="" alt="user">');
}
atr.displayArrowToRole = function () {
    // Box一覧取得
    personium.getBoxList(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
        $(".app-and-service").empty();
        // Boxを指定して割り当てRoleを取得
        var res = data.d.results;
        for (var i in res) {
            var boxName = res[i].Name;
            atr.appendBoxRole(boxName);
        }
    }).always(function () {
        atr.appendBoxRole(null);
    });
}
atr.appendBoxRole = function (boxName) {
    // アプリヘッダー作成
    let profTrans = "profTrans";
    let dispName = profTrans + ":" + boxName + "_DisplayName";
    let imgName = profTrans + ":" + boxName + "_Image";
    let id = boxName;
    let transId = boxName;
    if (!boxName) {
        dispName = "UserCustomRole";
        imgName = "profTrans:myProfile_Image";
        id = "";
        transId = "[main]";
        transImgTag = '';
    }
    
    $(".app-and-service").append([
        '<div class="title" id="role_' + id + '" style="display:none;">',
            '<img class="title-icon" data-i18n="[src]' + imgName + '" alt="">',
            '<span style="margin-left:0.43rem;" data-i18n="' + dispName + '"></span>',
        '</div>',
        '<div class="role-list thin-border">',
            '<ul id="role_list_' + id + '">',
            '</ul>',
        '</div>'
    ].join("")).localize();

    // 割り当てRoleを取得
    personium.getExtCellRoleList(cm.getMyCellUrl(), cm.getAccessToken(), sessionStorage.getItem("extCellUrl")).done(function (data) {
        var results = data.d.results;
        results.sort(function (val1, val2) {
            return (val1.uri < val2.uri ? 1 : -1);
        });
        let createFlg = false;
        for (var i = 0; i < results.length; i++) {
            var uri = results[i].uri;
            var matchBox = uri.match(/_Box\.Name='(.+)'/);
            var roleBox = "";
            if (matchBox != null) {
                roleBox = matchBox[1];
            } else {
                roleBox = null;
            }
            if (boxName == roleBox) {
                if (!createFlg) {
                    // Roleがアレば、アプリヘッダー表示
                    $("#role_" + id).show();
                    createFlg = true;
                }
                
                // 割り当てRoleを表示
                var matchName = uri.match(/\(Name='(.+)',/);
                var name = matchName[1];
                let transName = profTrans + ":" + name + "_" + transId + "_DisplayName";
                let transImage = profTrans + ":" + name + "_" + boxName + "_Image";
                let transImgTag = '<img class="image-circle-small" data-i18n="[src]' + transImage + '">';
                if (!boxName) {
                    transImgTag = '';
                }
                $("#role_list_" + id).append([
                    '<li class="ellipsisText">',
                        transImgTag,
                        '<span  data-i18n="' + transName + '">',
                            name,
                        '</span>',
                    '</li>'
                ].join("")).localize();
            }
        }
        if (!createFlg) {
            // Roleが無ければ、アプリヘッダー削除
            $("#role_" + id).remove();
            $("#role_list_" + id).parent().remove();
        }
    })
        
}