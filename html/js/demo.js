var demo = {};
var demoSession = {};

demo.showModal = function(id) {
  if (!demoSession || !demoSession.demoend) {
    $(id).modal('show');
  }
};

demo.initTarget = function() {
    demo.addTutorialDialogLogin();
    $('#errorCellUrl').html("");
    lg.targetCellLogin(""); // initialization

  demoSession = JSON.parse(sessionStorage.getItem("demoSession"));
  if (!demoSession || !demoSession.demoend) {
     $('#modal-demo-start').modal('show');
     demoSession = {};
     sessionStorage.setItem("demoSession", JSON.stringify(demoSession));
  } else {
     $('#modal-demoend-start').modal('show');
  }

  $('#b-input-cell-ok').on('click', function () {
     $('#modal-input-cell').modal('hide');
  });
  $('#modal-input-cell').on('show.bs.modal', function() {
     $("#pCellUrl").val(lg.cellUrl());
  });
  $('#modal-input-cell').on('hidden.bs.modal', function() {
     if (demoSession && demoSession.demoend) {
          sessionStorage.clear();
          location.href ="https://demo.personium.io/HomeApplication/__/box-resources/login.html?mode=global";
     };
     lg.targetCellLogin($("#pCellUrl").val());
     demo.showModal('#modal-celllogin-start');
  });
  $('#modal-celllogin-start').on('hidden.bs.modal', function() {
     $("#iAccountName").val("me");
     $("#iAccountPw").val("democell");
  });
  $('#b-demo-start-ok').on('click', function () {
     $('#modal-demo-start').modal('hide');
  });
  $('#b-celllogin-start-ok').on('click', function () {
     $('#modal-celllogin-start').modal('hide');
  });
  $('#b-demoend-start-ok').on('click', function () {
     $('#modal-demoend-start').modal('hide');
  });
  $("#bLogin").on("click", function(e){
     // send id pw to cell and get access token
     lg.sendAccountNamePw($("#iAccountName").val(), $("#iAccountPw").val());
     var session = {};
     if (demoSession) {
       session = demoSession;
     }
     sessionStorage.setItem("demoSession", JSON.stringify(session));
  });
  $("#gLogin").on("click", function(e) {
     //var url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=102363313215-408im4hc7mtsgrda4ratkro2thn58bcd.apps.googleusercontent.com&response_type=code+id_token&scope=openid%20email%20profile&redirect_uri=https%3A%2F%2Fdemo.personium.io%2FoidcTest%2Foidc%2Fdav%2Findex2.html&state=abc&display=popup&nonce=personium";
     var url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=102363313215-408im4hc7mtsgrda4ratkro2thn58bcd.apps.googleusercontent.com&response_type=code+id_token&scope=openid%20email%20profile&redirect_uri=http%3A%2F%2Fpersonium.io%2Fdemo%2Fhome-app%2Fbox-resources%2Fja%2Fhomeapp_google_auth.html&state=abc&display=popup&nonce=personium";

     window.location.href = url;
  });
};

demo.addTutorialDialogLogin = function() {
    let htmlDemoStart = [
        '<div id="modal-demo-start" class="modal fade" role="dialog" data-backdrop="static">',
            '<div class="modal-dialog">',
                '<div class="modal-content">',
                    '<div class="modal-header login-header">',
                        '<h4 class="modal-title" data-i18n="Demo.loginTitle1"></h4>',
                    '</div>',
                    '<div class="modal-body fontBlack" >',
                        '<span class="fontBlack" data-i18n="[html]Demo.loginTutorial1"></span>',
                    '</div>',
                    '<div class="modal-footer">',
                        '<button type="button" class="btn btn-primary" id="b-demo-start-ok">OK</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join("");

    let htmlCellloginStart = [
        '<div id="modal-celllogin-start" class="modal fade" role="dialog" data-backdrop="static">',
            '<div class="modal-dialog">',
                '<div class="modal-content">',
                    '<div class="modal-header login-header">',
                        '<h4 class="modal-title" data-i18n="Demo.loginTitle2"></h4>',
                    '</div>',
                    '<div class="modal-body fontBlack">',
                        '<span class="fontBlack" data-i18n="[html]Demo.loginTutorial2"></span>',
                    '</div>',
                    '<div class="modal-footer">',
                        '<button type="button" class="btn btn-primary" id="b-celllogin-start-ok">OK</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join("");

    let htmlDemoendStart = [
        '<div id="modal-demoend-start" class="modal fade" role="dialog" data-backdrop="static">',
            '<div class="modal-dialog">',
                '<div class="modal-content">',
                    '<div class="modal-header login-header">',
                        '<h4 class="modal-title" data-i18n="Demo.loginTitle3"></h4>',
                    '</div>',
                    '<div class="modal-body fontBlack" data-i18n="Demo.loginTutorial3"></div>',
                    '<div class="modal-footer">',
                        '<button type="button" class="btn btn-primary" id="b-demoend-start-ok">OK</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join("");

    $("body").append(htmlDemoStart, htmlCellloginStart, htmlDemoendStart);
};

demo.initMain = function() {
  demoSession = JSON.parse(sessionStorage.getItem("demoSession"));

  demo.addTutorialDialogMain();

  if (!demoSession.insApp) {
      demo.showModal('#modal-logined-start');
  } else {
      demo.showModal('#modal-installed-start');
  }

  $('#b-logined-start-ok').on('click', function () {
     $('#modal-logined-start').modal('hide');
  });
  $('#b-sidemenu-end-ok').on('click', function () {
     $('#modal-sidemenu-end').modal('hide');
  });
  $('#b-applicationlist-start-ok').on('click', function () {
     $('#modal-applicationlist-start').modal('hide');
  });
  $('#b-installed-start-ok').on('click', function () {
     $('#modal-installed-start').modal('hide');
  });
  $('#b-sidemenu-start-ok').on('click', function () {
     $('#modal-sidemenu-start').modal('hide');
     demo.showModal('#modal-sidemenu-end');
  });
  $('#b-logout-start-ok').on('click', function () {
     $('#modal-logout-start').modal('hide');
     demoSession.demoend = true;
     sessionStorage.setItem("demoSession", JSON.stringify(demoSession));
  });
  $('#dvOverlay').on('click', function() {
//     $(".overlay").removeClass('overlay-on');
//     $(".slide-menu").removeClass('slide-on');
     demo.toggleSlide();
     demo.showModal('#modal-appmarket-start');
     demoSession.moveAppMarket = true;
  });
  $('#b-appmarket-start-ok').on('click', function () {
     $('#modal-appmarket-start').modal('hide');
  });
};

demo.addTutorialDialogMain = function() {
    let htmlLoginedStart = [
        '<div id="modal-logined-start" class="modal fade" role="dialog" data-backdrop="static">',
            '<div class="modal-dialog">',
                '<div class="modal-content">',
                    '<div class="modal-header login-header">',
                        '<h4 class="modal-title" data-i18n="Demo.mainTitle1"></h4>',
                    '</div>',
                    '<div class="modal-body fontBlack" data-i18n="[html]Demo.mainTutorial1"></div>',
                    '<div class="modal-footer">',
                        '<button type="button" class="btn btn-primary" id="b-logined-start-ok">OK</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join("");

    let htmlSidemenuStart = [
        '<div id="modal-sidemenu-start" class="modal fade" role="dialog" data-backdrop="static">',
            '<div class="modal-dialog">',
                '<div class="modal-content">',
                    '<div class="modal-header login-header">',
                        '<h4 class="modal-title" data-i18n="Demo.mainTitle2"></h4>',
                    '</div>',
                    '<div class="modal-body fontBlack" data-i18n="[html]Demo.mainTutorial4"></div>',
                    '<div class="modal-footer">',
                        '<button type="button" class="btn btn-primary" id="b-sidemenu-start-ok">OK</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join("");

    let htmlSidemenuEnd = [
        '<div id="modal-sidemenu-end" class="modal fade" role="dialog" data-backdrop="static">',
            '<div class="modal-dialog">',
                '<div class="modal-content">',
                    '<div class="modal-header login-header">',
                        '<h4 class="modal-title" data-i18n="Demo.mainTitle2"></h4>',
                    '</div>',
                    '<div class="modal-body fontBlack" data-i18n="[html]Demo.mainTutorial5"></div>',
                    '<div class="modal-footer">',
                        '<button type="button" class="btn btn-primary" id="b-sidemenu-end-ok">OK</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join("");

    let htmlAppmarketStart = [
        '<div id="modal-appmarket-start" class="modal fade" role="dialog" data-backdrop="static">',
            '<div class="modal-dialog">',
                '<div class="modal-content">',
                    '<div class="modal-header login-header">',
                        '<h4 class="modal-title" data-i18n="Demo.mainTitle3"></h4>',
                    '</div>',
                    '<div class="modal-body fontBlack" data-i18n="[html]Demo.mainTutorial6"></div>',
                    '<div class="modal-footer">',
                        '<button type="button" class="btn btn-primary" id="b-appmarket-start-ok">OK</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join("");

    let htmlInstalledStart = [
        '<div id="modal-installed-start" class="modal fade" role="dialog" data-backdrop="static">',
            '<div class="modal-dialog">',
                '<div class="modal-content">',
                    '<div class="modal-header login-header">',
                        '<h4 class="modal-title" data-i18n="Demo.mainTitle4"></h4>',
                    '</div>',
                    '<div class="modal-body fontBlack" data-i18n="[html]Demo.mainTutorial7"></div>',
                    '<div class="modal-footer">',
                        '<button type="button" class="btn btn-primary" id="b-installed-start-ok">OK</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join("");

    let htmlLogoutStart = [
        '<div id="modal-logout-start" class="modal fade" role="dialog" data-backdrop="static">',
            '<div class="modal-dialog">',
                '<div class="modal-content">',
                    '<div class="modal-header login-header">',
                        '<h4 class="modal-title" data-i18n="Demo.mainTitle5"></h4>',
                    '</div>',
                    '<div class="modal-body fontBlack" data-i18n="[html]Demo.mainTutorial8"></div>',
                    '<div class="modal-footer">',
                        '<button type="button" class="btn btn-primary" id="b-logout-start-ok">OK</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join("");

    $("body").append(htmlLoginedStart, htmlSidemenuStart, htmlSidemenuEnd, htmlAppmarketStart, htmlInstalledStart, htmlLogoutStart);
};

// Called by App Market from am.initAppMarket
demo.addTutorialDialogAppMarket = function() {
    let html = [
        '<div id="modal-applicationlist-start" class="modal fade" role="dialog" data-backdrop="static">',
            '<div class="modal-dialog">',
                '<div class="modal-content">',
                    '<div class="modal-header login-header">',
                        '<h4 id="tutorialTitle" class="modal-title" data-i18n="[html]Demo.applicationTitle"></h4>',
                    '</div>',
                    '<div class="modal-body fontBlack" id="tutorial" data-i18n="[html]Demo.applicationTutorial"></div>',
                    '<div class="modal-footer">',
                        '<button type="button" class="btn btn-primary" id="b-applicationlist-start-ok">OK</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
    ].join("");

    $("body").append(html);
};

demo.createProfileHeaderMenu = function() {
    // get profile image
    if (cm.user.profile && cm.user.profile.Image) {
        cm.imgBinaryFile = cm.user.profile.Image;
    } else {
        // if there is no image, set default image
        cm.imgBinaryFile = cm.notImage;
    }

    // create a profile menu in to "profile-menu" class
    var html = '<div>';
    html += '<a class="allToggle" href="javascript:void(0)" data-toggle="modal" data-target="#modal-edit-profile">';
    html += '<img class="icon-profile" id="imProfilePicture" data-i18n="[src]profTrans:myProfile_Image" src="" alt="user">';
    html += '</a>';
    html += '</div>';
    html += '<div class="header-body">';
    html += '<div id="tProfileDisplayName" class="sizeBody" data-i18n="profTrans:myProfile_DisplayName"></div>';
    html += '<div class="sizeCaption">' + i18next.t("Account") + ': ' + cm.user.userName +  '</div>';
    html += '</div>';
    html += '<a href="javascript:void(0)" onClick="demo.toggleSlide();">';
    html += '<img src="' + homeAppUrl + appUseBox + '/html/img/ico_menu.png">';
    html += '</a>';
    $(".profile-menu").html(html);

    // Processing when resized
    $(window).on('load resize', function(){
        $('.headerAccountNameText').each(function() {
            var $target = $(this);

            // get a account name
            var html = cm.user.userName + '▼';

            // Duplicate the current state
            var $clone = $target.clone();

            // Set an account name on the duplicated element and hide it
            $clone
              .css({
                display: 'none',
                position: 'absolute',
                overflow: 'visible'
              })
              .width('auto')
              .html(html);
            $target.after($clone);

            // Replace sentences that exceed the display area
            while((html.length > 0) && ($clone.width() > $target.width())) {
                html = html.substr(0, html.length - 1);
                $clone.html(html + '...▼');
            }

            $target.html($clone.html());
            $clone.remove();
        });
    });
}

demo.toggleSlide = function() {
//    $(".overlay").toggleClass('overlay-on');
//    $(".slide-menu").toggleClass('slide-on');

    var menu = $('.slide-nav');
    var overlay = $('.overlay');
    var menuWidth = menu.outerWidth();

    menu.toggleClass('open');
    if(menu.hasClass('open')){
        // show menu
        menu.animate({'right' : 0 }, 300);
        overlay.fadeIn();
        if (!demoSession.sideMenu) {
            demo.showModal('#modal-sidemenu-start');
        }
    } else {
        // hide menu
        menu.animate({'right' : -menuWidth }, 300);
        overlay.fadeOut();
    }
}

demo.initSettings = function() {
    // Create Profile Menu
    //createProfileHeaderMenu();
    // Create Side Menu
    //createSideMenu();
    // Create Setting Area
    cm.createSettingArea();
    // Create Title Header
    cm.createTitleHeader(true, false);
    // Create Back Button
    cm.createBackMenu("main.html", true);
    // Set Title
    cm.setTitleMenu("Settings", true);
    cm.setIdleTime();

    $('#b-edit-accconfirm-ok').on('click', function () { 
        st.editAccount();
    });
    $('#b-del-account-ok').on('click', function () { st.restDeleteAccountAPI(); });
    $('#b-del-role-ok').on('click', function () { st.restDeleteRoleAPI(); });
    $('#b-del-acclinkrole-ok').on('click', function () { st.restDeleteAccountLinkRole(); });
    $('#b-edit-relation-ok').on('click', function () { 

    });
    $('#b-edit-relconfirm-ok').on('click', function () { 
        st.editRelation();
    });
    $('#b-del-relation-ok').on('click', function () { st.restDeleteRelationAPI(); });
    $('#b-del-rellinkrole-ok').on('click', function () { st.restDeleteRelationLinkRole(); });
    $('#b-ins-bar-ok').on('click', function() { 
        demoSession.insApp = true;
        sessionStorage.setItem("demoSession", JSON.stringify(demoSession));
        demo.execBarInstall();
    });

    $("#modal-confirmation").off().on("hidden.bs.modal", function () {
        st.updUser = null;
        st.updBox = null;
        $('#b-edit-relconfirm-ok').css("display","none");
        $('#b-del-acclinkrole-ok').css("display","none");
        $('#b-del-role-ok').css("display","none");
        $('#b-del-account-ok').css("display","none");
        $('#b-edit-accconfirm-ok').css("display","none");
        $('#b-del-relation-ok').css("display","none");
        $('#b-del-rellinkrole-ok').css("display","none");
        $('#b-ins-bar-ok').css("display","none");
    });

    // menu-toggle
/*
    $("#accountToggle").on("click", function() {
      st.createAccountList();
    });
    $("#applicationToggle").on("click", function() {
      demo.createApplicationList();
      demo.showModal('#modal-applicationlist-start');
    });
    $("#roleToggle").on("click", function() {
      st.createRoleList();
    });
    $("#relationToggle").on("click", function() {
      st.createRelationList();
    });
*/
};

demo.createSideMenu = function() {
    var itemName = {};
    itemName.EditProf = i18next.t("EditProfile");
    itemName.ChgPass = i18next.t("ChangePass");
    itemName.Logout = i18next.t("Logout");
    itemName.DispName = i18next.t("DisplayName");
    itemName.Description = i18next.t("Description");
    itemName.Photo = i18next.t("ProfileImage");
    itemName.Relogin = i18next.t("Re-Login");

    var html = '<div class="slide-menu">';
    html += '<nav class="slide-nav">';
    html += '<ul>';

    // Menu Title
    html += '<li class="menu-title">' + i18next.t("Menu") + '</li>';
    // profile edit
    html += '<li><a class="allToggle" href="javascript:void(0)" data-toggle="modal" data-target="#modal-edit-profile">' + itemName.EditProf + '</a></li>';
    html += '<li class="menu-separator"><a class="allToggle" href="javascript:void(0)" data-toggle="modal" data-target="#modal-change-password">' + itemName.ChgPass + '</a></li>';
    // setting menu
    html += '<li><a class="allToggle" id="accountToggle" href="javascript:void(0)">' + i18next.t("Account") + '</a></li>';
    html += '<li><a class="allToggle" id="applicationToggle" href="javascript:void(0)">' + i18next.t("Application") + '</a></li>';
    html += '<li><a class="allToggle" id="roleToggle" href="javascript:void(0)">' + i18next.t("Role") + '</a></li>';
    html += '<li class="menu-separator"><a class="allToggle" id="relationToggle" href="javascript:void(0)">' + i18next.t("Relation") + '</a></li>';
    // log out
    html += '<li class="menu-separator"><a class="allToggle" href="javascript:void(0)" data-toggle="modal" data-target="#modal-logout">' + itemName.Logout + '</a></li>';

    html += '</ul>';
    html += '</nav>';
    html += '</div>';
    html += '<div class="overlay" id="dvOverlay"></div>';

    $(".display-parent-div").append(html);

    // Modal
    // ReLogin
    html = '<div id="modal-relogin" class="modal fade" role="dialog" data-backdrop="static">' +
           '<div class="modal-dialog">' +
           '<div class="modal-content">' +
           '<div class="modal-header login-header">' +
           '<h4 class="modal-title">' + itemName.Relogin + '</h4>' +
           '</div>' +
           '<div class="modal-body" data-i18n="[html]successChangePass">' +
           '</div>' +
           '<div class="modal-footer">' +
           '<button type="button" class="btn btn-primary" id="b-relogin-ok" >OK</button>' +
           '</div></div></div></div>';
    modal = $(html);
    $(document.body).append(modal);

    // Log Out
    html = '<div id="modal-logout" class="modal fade" role="dialog">' +
           '<div class="modal-dialog">' +
           '<div class="modal-content">' +
           '<div class="modal-header login-header">' +
           '<button type="button" class="close" data-dismiss="modal">x</button>' +
           '<h4 class="modal-title">' + itemName.Logout + '</h4>' +
           '</div>' +
           '<div class="modal-body">' +
           i18next.t("logoutConfirm") +
           '</div>' +
           '<div class="modal-footer">' +
           '<button type="button" class="btn btn-default" data-dismiss="modal">' + i18next.t("Cancel") + '</button>' +
           '<button type="button" class="btn btn-primary" id="b-logout-ok" >OK</button>' +
           '</div></div></div></div>';
    modal = $(html);
    $(document.body).append(modal);

    // Session Expiration
    html = '<div id="modal-session-expired" class="modal fade" role="dialog" data-backdrop="static">' +
           '<div class="modal-dialog">' +
           '<div class="modal-content">' +
           '<div class="modal-header login-header">' +
           '<h4 class="modal-title">' + itemName.Relogin + '</h4>' +
           '</div>' +
           '<div class="modal-body">' +
           i18next.t("expiredSession") +
           '</div>' +
           '<div class="modal-footer">' +
           '<button type="button" class="btn btn-primary" id="b-session-relogin-ok" >OK</button>' +
           '</div></div></div></div>';
    modal = $(html);
    $(document.body).append(modal);

    // Set Event
    $('#b-logout-ok,#b-relogin-ok,#b-session-relogin-ok').on('click', function() { cm.logout(); });

    // Time Out Set
    cm.setIdleTime();
}

demo.createApplicationList = function() {
    $("#dashboard").empty();
    $("#dashboard").append('<div class="panel list-group toggle-panel" id="toggle-panel1"></div>');
    var html = '<div class="panel-body" id="app-panel"><table class="table table-striped"><tr><td>' + i18next.t("Installed") + '</td></tr><tr><td><div id="insAppList1"></div></td></tr><tr><td>' + i18next.t("ApplicationList") + '</td></tr><tr><td><div id="appList1"></div></td></tr></div>';
    $("#dashboard").append(html);
    // install application list
    cm.getBoxList().done(function(data) {
        var insAppRes = data.d.results;
        insAppRes.sort(function(val1, val2) {
            return (val1.Name < val2.Name ? 1 : -1);
        })
        am.insAppList = new Array();
        am.insAppBoxList = new Array();

        if (demoSession.insApp) {
            for (var i in insAppRes) {
                var schema = insAppRes[i].Schema;
                if (schema && schema.length > 0) {
                    am.insAppList.push(schema);
                    am.insAppBoxList.push(insAppRes[i].Name);
                }
            }
            am.dispInsAppListSetting();
        }

        // application list
        st.getApplicationList().done(function(data) {
            am.dispApplicationList(data);
        }).fail(function(data) {
            alert(data);
        });
    });
};

demo.execBarInstall = function() {
    cm.getBoxList().done(function(data) {
        var insAppRes = data.d.results;
        insAppRes.sort(function(val1, val2) {
            return (val1.Name < val2.Name ? 1 : -1);
        })
        st.insAppList = new Array();
        st.insAppBoxList = new Array();
        for (var i in insAppRes) {
            var schema = insAppRes[i].Schema;
            if (schema && schema.length > 0) {
                st.insAppList.push(schema);
                st.insAppBoxList.push(insAppRes[i].Name);
            }
        }
        st.dispInsAppListSetting();

        // application list
        st.getApplicationList().done(function(data) {
            st.dispApplicationList(data);
            $("#modal-confirmation").modal("hide");
            cm.moveBackahead(true);
        }).fail(function(data) {
            alert(data);
        });
    });
};
