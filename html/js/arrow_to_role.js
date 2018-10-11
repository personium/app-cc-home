var atr = {};

// Load arrow_to_role screen
atr.loadArrowToRole = function () {
    personium.loadContent(homeAppUrl + "html/arrow_to_role.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        atr.init();
        atr.Add_Btn_Event(id);
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

atr.init = function () {
    // Initialization
    atr.extCellUrl = sessionStorage.getItem("extCellUrl");
    atr.extCellUrl = ut.changeLocalUnitToUnitUrl(atr.extCellUrl);
    
    cm.i18nSetTargetProfile(atr.extCellUrl);

    atr.displayMyImage();
    atr.displayTargetImage();
    atr.displayArrowToRole();
}

atr.Add_Btn_Event = function (id) {
    $(id + ' .header-btn-right').click(function () {
        link_info.loadExtCellLinkRoleList();
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
    // Get Box list
    personium.getBoxList(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
        $("#appendRoleList").empty();
        // Specify Box to get assigned Role
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
    // Create application headers
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
    
    $("#appendRoleList").append([
        '<div class="title" id="role_' + id + '" style="display:none;">',
            '<img class="ins-app-img title-icon" data-i18n="[src]' + imgName + '" alt="">',
            '<span style="margin-left:0.43rem;" data-i18n="' + dispName + '"></span>',
        '</div>',
        '<div class="role-list thin-border">',
            '<ul id="role_list_' + id + '">',
            '</ul>',
        '</div>'
    ].join("")).localize();

    // Get assigned Role
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
                    // If Role is, application header display
                    $("#role_" + id).show();
                    createFlg = true;
                }
                
                // Show assigned Role
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
            // If there is no Role, delete the application header
            $("#role_" + id).remove();
            $("#role_list_" + id).parent().remove();
        }
    })
        
}