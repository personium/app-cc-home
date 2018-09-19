var ha = {};

var timer = false;
$(window).on('resize', function () {
    if (timer !== false) {
        clearTimeout(timer);
    }
    timer = setTimeout(function () {
        var container_w = $('.app-list').outerWidth(true);
        var content_w = $('div.app-list div.app-icon:eq(0)').outerWidth(true);
        var padding = (container_w % content_w) / 2;
        $('.app-list').css('padding-left', padding);
    }, 50);
}).resize();

// Load main screen
ha.loadMain = function () {
    personium.loadContent(cm.homeAppUrl + "__/html/main.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        ha.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

ha.init = function() {
    ut.loadStyleSheet();
    ut.loadScript(function () {
        personium.setMoveEventSideMunu();

        let tempMyProfile = JSON.parse(sessionStorage.getItem("myProfile")) || {};
        let isDemo = (tempMyProfile.IsDemo || false);

        //if (isDemo) {
        //    demo.createProfileHeaderMenu();
        //    demo.createSideMenu();
        //    demo.initSettings();
        //    demo.initMain();
        //    if (demoSession.insApp) {
        //        ha.dispInsAppList();
        //    }
        //    st.setBizTheme();
        //} else {
        cm.i18nSetProfile();
        cm.i18nSetRole();
        cm.i18nSetBox();
        ha.displayMyAccount();
        ha.createSideMenuList("#drawer_menu");
        ha.dispInsAppList();
        //}
    });
};

/*** new ***/
ha.displayMyAccount = function () {
    $('.user-icon').append('<img class="user-icon-small" id="imProfilePicture" data-i18n="[src]profTrans:myProfile_Image" src="" alt="user">');
    $(".account-info div.user-name").attr("data-i18n", "profTrans:myProfile_DisplayName").localize();
    $(".account-info div span.account").html(cm.user.userName);
    $(".account-info div span.account").attr("title", cm.user.userName);
};

// create side menu
ha.createSideMenuList = function (sideMenuId) {
    $(sideMenuId).empty();
    $(sideMenuId).append("<ul></ul>");

    // profile edit
    let paramObj = {
        title: "EditProfile",
        callback: function () { profile.loadProfile(); }
    };
    personium.createSideMenuItem(paramObj);
    // change password
    paramObj = {
        title: "ChangePass",
        callback: function () { chg_pass.loadChangePassword(); }
    };
    personium.createSideMenuItem(paramObj);
    // setting menu
    paramObj = {
        title: "Account",
        callback: function () { account.loadAccount(); }
    };
    personium.createSideMenuItem(paramObj);
    // Application Manager
    paramObj = {
        title: "Application",
        callback: function () { chg_lang.loadAppManage(); }
    };
    personium.createSideMenuItem(paramObj);
    // Hiding role / relation management
    //paramObj = {
    //    title: "Role",
    //    callback: st.createRoleList
    //};
    //personium.createSideMenuItem(paramObj);
    //paramObj = {
    //    title: "Relation",
    //    callback: st.createRelationList
    //};
    //personium.createSideMenuItem(paramObj);
    // change language
    paramObj = {
        title: "ChangeLng",
        callback: function () { chg_lang.loadChangeLanguage(); }
    };
    personium.createSideMenuItem(paramObj);
    // log out
    paramObj = {
        title: "Logout",
        callback: function () { $('#logout_modal').modal('show'); }
    };
    personium.createSideMenuItem(paramObj);

    personium.createSessionExpirationModal(cm.logout);
    ha.createLogoutModal();
    ha.createReLoginModal();
    
    $('#dvOverlay').on('click', function () {
        cm.toggleSlide();
    });
}
ha.createLogoutModal = function () {
    // Log Out
    html = '<div id="modal-logout" class="modal fade" role="dialog">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header login-header">' +
        '<button type="button" class="close" data-dismiss="modal">x</button>' +
        '<h4 class="modal-title" data-i18n="Logout"></h4>' +
        '</div>' +
        '<div class="modal-body" data-i18n="logoutConfirm"></div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal" data-i18n="Cancel"></button>' +
        '<button type="button" class="btn btn-primary" id="b-logout-ok" >OK</button>' +
        '</div></div></div></div>';
    modal = $(html);
    $(document.body).append(modal);
    $('#b-logout-ok').on('click', function () { cm.logout(); });
}
ha.createReLoginModal = function () {
    // ReLogin
    html = '<div id="modal-relogin" class="modal fade" role="dialog" data-backdrop="static">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header login-header">' +
        '<h4 class="modal-title" data-i18n="ReLogin"></h4>' +
        '</div>' +
        '<div class="modal-body" data-i18n="[html]successChangePass">' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-primary" id="b-relogin-ok" >OK</button>' +
        '</div></div></div></div>';
    modal = $(html);
    $(document.body).append(modal);
    $('#b-relogin-ok').on('click', function () { cm.logout(); });
}

ha.dispInsAppList = function () {
    $(".app-list").empty();
    personium.getBoxList(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
        var insAppRes = data.d.results;
        insAppRes.sort(function (val1, val2) {
            return (val1.Name < val2.Name ? 1 : -1);
        })
        for (var i in insAppRes) {
            // hotfix for not showing HomeApplication/Cell Manager's box inside a data subject's cell
            if (_.contains(cm.boxIgnoreList, insAppRes[i].Schema)) {
                continue;
            };

            var schema = insAppRes[i].Schema;
            if (schema && schema.length > 0) {
                // 
                let divId = "app_icon_" + i;
                let spinner = $("<i>", {
                    class: "fa fa-spinner fa-pulse fa-3x fa-fw"
                });
                let divTag = $("<div>", {
                    class: "app-icon",
                    id: divId
                }).append(spinner);
                $(".app-list").append(divTag);

                ha.dispInsAppListSchema(schema, insAppRes[i].Name, divId);
            }
        }
    });
};

ha.dispInsAppListSchema = function (schema, boxName, id) {
    personium.getBoxStatus(cm.getMyCellUrl(), cm.getAccessToken(), boxName).done(function (data) {
        var status = data.status;
        var html = '';
        if (status.indexOf('ready') >= 0) {
            var msgCnt = '';
            personium.getNotCompMessageCnt(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
                if (data.d.__count > 0) {
                    var count = 0;
                    for (i in data.d.results) {
                        var res = data.d.results[i];
                        if (boxName == res["_Box.Name"]) {
                            count++;
                        }
                    }
                    if (count > 0) {
                        msgCnt = count;
                    }
                }
            }).fail(function (data) {
                console.log("fail");
            }).always(function (data) {
                ha.createLaunchLink(schema, boxName, msgCnt, id);
            });
        } else {
            $("#" + id).remove();
        }
    }).fail(function (data) {
        $("#" + id).remove();
    });
};

ha.createLaunchLink = function (schema, boxName, msgCnt, id) {
    let profTrans = "profTrans";
    let dispName = profTrans + ":" + boxName + "_DisplayName";
    let imgName = profTrans + ":" + boxName + "_Image";

    $.ajax({
        type: "GET",
        url: schema + "__/launch.json",
        headers: {
            'Authorization': 'Bearer ' + cm.user.access_token,
            'Accept': 'application/json'
        }
    }).done(function (data) {
        let appLaunchInfo = ut.getAppLaunchUrl(data.personal, boxName);

        let imgTag = $('<img>', {
            class: 'ins-app-img',
            'data-i18n': '[src]' + imgName
        });

        let counter = $('<span>', {
            class: 'badge',
            text: msgCnt
        });

        let iconDiv = $('<div>', {
            class: 'ins-app-icon'
        });
        iconDiv.append($(imgTag), $(counter));

        let nameDiv = $('<div>', {
            class: 'app-name',
            'data-i18n': dispName
        });

        let aTag = $('<a>', {
            href: 'javascript:void(0)',
            class: 'ins-app-icon',
            onClick: 'return cm.execApp(this)',
            'data-open-new-window': appLaunchInfo.openNewWindow, // $(this).data('openNewWindow')
            'data-app-launch-url': appLaunchInfo.appLaunchUrl, // $(this).data('appLaunchUrl')
            'data-send-refresh-token': data.personal.sendRefreshToken
        });
        aTag.append($(iconDiv), $(nameDiv));

        $("#" + id).empty().append($(aTag)).localize();
    }).fail(function (data) {
        $("#" + id).remove();
    });
};
