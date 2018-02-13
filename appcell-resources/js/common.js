var cm = {};
cm.imgBinaryFile = null;
cm.user = JSON.parse(sessionStorage.getItem("sessionData"));

// Do not display the following boxes in the installed list section
cm.boxIgnoreList = ['io_personium_demo_HomeApplication', 'home'];

// Logout
cm.logout = function() {
  sessionStorage.setItem("sessionData", null);
  var mode = sessionStorage.getItem("mode");
  if (mode) {
      location.href = "./login.html?mode=" + mode;
  } else {
      location.href = "./login.html";
  }
};

if (!cm.user) {
  cm.logout();
}
/*
 * When isAdvancedMode is false, do not display the followings:
 * 1. Create External Cell Dialog - Assign checkbox
 * 2. Create External Cell Dialog - Role/Relation radio buttons
 * 3. Create External Cell Dialog - Role/Relation options
 */ 
cm.user.isAdvancedMode = false;
cm.user.nowPage = 0;
cm.user.nowTitle = {};
cm.user.settingNowPage = 0;
cm.user.settingNowTitle = {};
cm.notImage = "https://demo.personium.io/HomeApplication/__/icons/profile_image.png";
cm.notAppImage = "https://demo.personium.io/HomeApplication/__/icons/no_app_image.png";

// Icon quality
cm.ICON_QUALITY = 0.8;
// Icon Size
cm.ICON_WIDTH = 172;
cm.ICON_HEIGHT = 172;
// Icon Size limit(KB)
cm.ICON_SIZELIMIT = 500;
// Default timeout limit - 60 minutes.
cm.IDLE_TIMEOUT =  3600000;
// cm.IDLE_TIMEOUT =  10000;
// Records last activity time.
cm.LASTACTIVITY = new Date().getTime();

// Class "profile-menu" in create
// and Modal create
cm.createProfileHeaderMenu = function() {
    // get profile image
    if (cm.user.profile && cm.user.profile.Image) {
        cm.imgBinaryFile = cm.user.profile.Image;
    } else {
        // if there is no image, set default image
        cm.imgBinaryFile = cm.notImage;
    }

    // create a profile menu in to "profile-menu" class
    var html = '<div>';
    html += '<a class="allToggle" href="#" data-toggle="modal" data-target="#modal-edit-profile">';
    html += '<img class="icon-profile" id="imProfilePicture" data-i18n="[src]profTrans:myProfile_Image" src="" alt="user">';
    html += '</a>';
    html += '</div>';
    html += '<div class="header-body">';
    html += '<div id="tProfileDisplayName" class="sizeBody" data-i18n="profTrans:myProfile_DisplayName"></div>';
    html += '<div id="accountTitle" class="sizeCaption" data-i18n="AccountTitle"></div>';
    html += '</div>';
    html += '<a href="#" onClick="cm.toggleSlide();">';
    html += '<img src="https://demo.personium.io/HomeApplication/__/icons/ico_menu.png">';
    html += '</a>';
    $(".profile-menu").html(html);
    $('#accountTitle').attr("data-i18n-options", ["{ \"title\": \"", cm.user.userName, "\" }"].join(''));

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

// Create title header in "header-menu" class
// settingFlg true: Settings false: Default
// menuFlg true: show menu false: hide menu
cm.createTitleHeader = function(settingFlg, menuFlg) {
    var setHtmlId = ".header-menu";
    var backMenuId = "backMenu";
    var backTitleId = "backTitle";
    var titleMenuId = "titleMenu";
    if (settingFlg) {
        setHtmlId = ".setting-header";
        backMenuId = "settingBackMenu";
        backTitleId = "settingBackTitle";
        titleMenuId = "settingTitleMenu";
    }

    var menuHtml = '';
    if (menuFlg) {
        menuHtml = '<a href="#" onClick="cm.toggleSlide();"><img src="https://demo.personium.io/HomeApplication/__/icons/ico_menu.png"></a>';
    }

    var html = '<div class="col-xs-1" id="' + backMenuId + '"></div>';
        html += '<div class="col-xs-2"><table class="table-fixed back-title"><tr style="vertical-align: middle;"><td class="ellipsisText" id="' + backTitleId + '" align="left"></td></tr></table></div>';
        html += '<div class="col-xs-6 text-center title" id="' + titleMenuId + '"></div>';
        html += '<div class="col-xs-3 text-right">' + menuHtml + '</div>';

    $(setHtmlId).html(html);
}

cm.closeSetting = function() {
    $(".setting-menu").toggleClass("slide-on");
    $("#settingboard").empty();
    $("#settingBackTitle").empty();
    cm.user.settingNowPage = 0;
    cm.toggleSlide();
}

cm.createSettingArea = function() {
    var html = '<div class="col-md-12 col-sm-12 display-table-cell v-align setting-menu">';
    html += '<div class="row header-menu setting-header"></div>';
    html += '<div class="row" id="settingboard" style="overflow:auto;height:90%;"></div>';
    html += '<div id="modal-confirmation" class="modal fade" role="dialog" data-backdrop="static">';
    html += '<div class="modal-dialog">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header login-header">';
    html += '<button type="button" class="close" data-dismiss="modal">x</button>';
    html += '<h4 class="modal-title" id="modal-confirmation-title"></h4>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += '<div id="dvTextConfirmation"></div>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" data-dismiss="modal" data-i18n="Cancel"></button>';
    html += '<button type="button" class="btn btn-primary text-capitalize" id="b-edit-relconfirm-ok" style="display:none" data-i18n="Edit"></button>';
    html += '<button type="button" class="btn btn-primary text-capitalize" id="b-edit-accconfirm-ok" style="display:none" data-i18n="Edit"></button>';
    html += '<button type="button" class="btn btn-primary text-capitalize" id="b-del-acclinkrole-ok" style="display:none" data-i18n="Del"></button>';
    html += '<button type="button" class="btn btn-primary text-capitalize" id="b-del-role-ok" style="display:none" data-i18n="Del"></button>';
    html += '<button type="button" class="btn btn-primary text-capitalize" id="b-del-account-ok" style="display:none" data-i18n="Del"></button>';
    html += '<button type="button" class="btn btn-primary text-capitalize" id="b-del-relation-ok" style="display:none" data-i18n="Del"></button>';
    html += '<button type="button" class="btn btn-primary text-capitalize" id="b-del-rellinkrole-ok" style="display:none" data-i18n="Del"></button>';
    html += '<button type="button" class="btn btn-primary" id="b-del-extcell-ok" style="display:none" data-i18n="Del"></button>';
    html += '<button type="button" class="btn btn-primary" id="b-del-extcelllinkrole-ok" style="display:none" data-i18n="Del"></button>';
    html += '<button type="button" class="btn btn-primary" id="b-del-extcelllinkrelation-ok" style="display:none" data-i18n="Del"></button>';
    html += '<button type="button" class="btn btn-primary" id="b-ins-bar-ok" style="display:none">OK</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $("#displayParentDiv").append(html);
};

// Back ahead Setting
// true: Settings false: Default
cm.setBackahead = function(flg) {
    var boardId = "dashboard";
    if (flg) {
        cm.user.settingNowPage = cm.user.settingNowPage + 1;
        boardId = "settingboard";
        var toggleClass = "toggle-panel";
        if (cm.user.settingNowPage == 1) {
            // first page
            toggleClass = "panel-default";
        }
        if (document.getElementById('setting-panel' + cm.user.settingNowPage) == null) {
            $("#" + boardId).append('<div class="list-group ' + toggleClass + '" id="setting-panel' + cm.user.settingNowPage + '"></div>');
        }
        if (document.getElementById('setting-panel' + (cm.user.settingNowPage + 1)) == null) {
            $("#" + boardId).append('<div class="list-group toggle-panel" id="setting-panel' + (cm.user.settingNowPage + 1) + '"></div>');
        }
    } else {
        cm.user.nowPage = cm.user.nowPage + 1;
        if (document.getElementById('toggle-panel' + cm.user.nowPage) == null) {
            $("#" + boardId).append('<div class="list-group toggle-panel" id="toggle-panel' + cm.user.nowPage + '"></div>');
        }
        if (document.getElementById('toggle-panel' + (cm.user.nowPage + 1)) == null) {
            $("#" + boardId).append('<div class="list-group toggle-panel" id="toggle-panel' + (cm.user.nowPage + 1) + '"></div>');
        }
    }
    
}

// Back ahead move
// true: Settings false: Default
cm.moveBackahead = function(flg) {
    if (flg) {
        var no = cm.user.settingNowPage;
        switch (no) {
            case 0:
                window.location.href = cm.user.prevUrl;
                break;
            case 1:
                cm.closeSetting();
                break;
            default:
                $("#setting-panel" + no).toggleClass("slide-on");
                $("#setting-panel" + (no - 1)).toggleClass("slide-on-holder");
                break;
        }

        cm.user.settingNowPage = no - 1;
        if (cm.user.settingNowPage >= 1) {
            cm.setTitleMenu(cm.user.settingNowTitle[cm.user.settingNowPage], true);
        }
    } else {
        var no = cm.user.nowPage;
        switch (no) {
            case 0:
                window.location.href = cm.user.prevUrl;
                break;
            case 1:
                $(".panel-default,#toggle-panel1").toggleClass("slide-on");
                break;
            default:
                $("#toggle-panel" + no).toggleClass("slide-on");
                $("#toggle-panel" + (no - 1)).toggleClass("slide-on-holder");
                break;
        }

        cm.user.nowPage = no - 1;
        if (cm.user.nowPage >= 0) {
            cm.setTitleMenu(cm.user.nowTitle[cm.user.nowPage]);
        }
    }
}

// create side menu
cm.createSideMenu = function() {
    var html = '<div class="slide-menu">';
    html += '<nav class="slide-nav">';
    html += '<ul>';

    // Menu Title
    html += '<li class="menu-title" data-i18n="Menu"></li>';
    // profile edit
    html += '<li><a class="allToggle" id="editProfToggle" href="#" data-i18n="EditProfile"></a></li>';
    html += '<li class="menu-separator"><a class="allToggle" id="changePassword" href="#" data-i18n="ChangePass"></a></li>';
    // setting menu
    html += '<li><a class="allToggle" id="accountToggle" href="#" data-i18n="Account"></a></li>';
    html += '<li><a class="allToggle" id="applicationToggle" href="#" data-i18n="Application"></a></li>';
    // Hiding role / relation management
    //html += '<li><a class="allToggle" id="roleToggle" href="#" data-i18n="Role"></a></li>';
    //html += '<li class="menu-separator"><a class="allToggle" id="relationToggle" href="#" data-i18n="Relation"></a></li>';
    // change language
    html += '<li class="menu-separator"><a class="allToggle" id="changeLanguage" href="#" data-i18n="ChangeLng"></a></li>'
    // log out
    html += '<li class="menu-separator"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-logout" data-i18n="Logout"></a></li>';

    html += '</ul>';
    html += '</nav>';
    html += '</div>';
    html += '<div class="overlay" id="dvOverlay"></div>';

    $(".display-parent-div").append(html);

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

    // Set Event
    $('#b-logout-ok,#b-relogin-ok,#b-session-relogin-ok').on('click', function() { cm.logout(); });    
    $('#dvOverlay').on('click', function() {
//        $(".overlay").removeClass('overlay-on');
//        $(".slide-menu").removeClass('slide-on');
        cm.toggleSlide();
    });

    // Register my profile in data-i18n
    let defProf = cm.user.profile;
    cm.getProfile(cm.user.cellUrl).done(function (prof) {
        defProf = {
            DisplayName: prof.DisplayName,
            Description: prof.Description,
            Image: prof.Image
        }
    }).always(function () {
        let transName = "myProfile";
        cm.i18nAddProfile("en", "profTrans", transName, defProf, cm.user.cellUrl, "profile");
        cm.i18nAddProfile("ja", "profTrans", transName, defProf, cm.user.cellUrl, "profile");
    });

    // Register role/relation in data-i18n
    cm.getRoleList().done(function (data) {
        var results = data.d.results;
        for (var i = 0; i < results.length; i++) {
            var res = results[i];
            var name = res.Name;
            var boxName = res["_Box.Name"];
            if (boxName != null) {
                cm.registerRoleRelProfI18n(name, boxName, "roles");
            }
        }
    });
    cm.getRelationList().done(function (data) {
        var results = data.d.results;
        for (var i = 0; i < results.length; i++) {
            var res = results[i];
            var name = res.Name;
            var boxName = res["_Box.Name"];
            if (boxName != null) {
                cm.registerRoleRelProfI18n(name, boxName, "relations");
            }
        }
    });

    // Register Schema Profile in data-i18n
    cm.getBoxList().done(function (data) {
        var insAppRes = data.d.results;
        for (var i in insAppRes) {
            var schema = insAppRes[i].Schema;
            var boxName = insAppRes[i].Name;
            if (schema && schema.length > 0) {
                cm.registerProfI18n(schema, boxName, "profile");
            }
        }
    })

    // Time Out Set
    cm.setIdleTime();
}
cm.registerRoleRelProfI18n = function (name, boxName, fileName) {
    cm.getBoxInfo(boxName).done(function (boxRes) {
        let schemaUrl = boxRes.d.results.Schema;
        let transName = name + "_" + boxName;
        let defProf = {
            DisplayName: name + '(' + boxName + ')',
            Description: "",
            Image: cm.notImage
        }
        cm.getTargetProfile(schemaUrl, fileName).done(function (defRes) {
            if (defRes[name]) {
                defProf = {
                    DisplayName: defRes[name].DisplayName,
                    Description: defRes[name].Description,
                    Image: defRes[name].Image
                }
            }
        }).always(function () {
            cm.i18nAddProfile("en", "profTrans", transName, defProf, schemaUrl, fileName, name);
            cm.i18nAddProfile("ja", "profTrans", transName, defProf, schemaUrl, fileName, name);
        });
    });
}

cm.registerProfI18n = function (schema, boxName, fileName) {
    let defProf = {
        DisplayName: ut.getName(schema),
        Description: "",
        Image: cm.notAppImage
    }
    cm.getProfile(schema).done(function (defRes) {
        defProf = {
            DisplayName: defRes.DisplayName,
            Description: defRes.Description,
            Image: defRes.Image
        }
    }).always(function () {
        cm.i18nAddProfile("en", "profTrans", boxName, defProf, schema, fileName, null, true);
        cm.i18nAddProfile("ja", "profTrans", boxName, defProf, schema, fileName, null, true);
    });
}

cm.createQRCodeImg = function(url) {
    let googleAPI = 'https://chart.googleapis.com/chart?cht=qr&chs=177x177&chl=';
    let qrURL = googleAPI + url;
    let aImg = $('<img>', {
        src: qrURL,
        alt: url,
        style: 'margin: auto; width: 180px; height: 180px; padding: 1px;'
    })

    return aImg;
};

cm.toggleSlide = function() {
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
    } else {
        // hide menu
        menu.animate({'right' : -menuWidth }, 300);
        overlay.fadeOut();
    }
}

// Create Backahead
// true: Settings false: Default
cm.createBackMenu = function(moveUrl, flg) {
    if (flg) {
        var html = '<a href="#" class="allToggle prev-icon" style="float:left;" onClick="cm.moveBackahead(true);return false;"><img id="imSettingBack" src="https://demo.personium.io/HomeApplication/__/icons/ico_back.png" alt="user"></a>';
        $("#settingBackMenu").html(html);
    } else {
        var html = '<a href="#" class="allToggle" style="float:left;" onClick="cm.moveBackahead();return false;"><img id="imBack" src="https://demo.personium.io/HomeApplication/__/icons/ico_back.png" alt="user"></a>';
        $("#backMenu").html(html);
    }
    cm.user.prevUrl = moveUrl;
}

// true: SettingTitle false: MainTitle
cm.setTitleMenu = function(title, flg) {
    if (flg) {
        if (i18next.exists(title)) {
            $("#settingTitleMenu").html('<h4 class="ellipsisText" data-i18n="' + title + '"></h4>').localize();
        } else {
            $("#settingTitleMenu").html('<h4 class="ellipsisText">' + title + '</h4>');
        }
        var titles = cm.user.settingNowTitle;
        titles[cm.user.settingNowPage] = title;
        cm.user.settingNowTitle = titles;
    } else {
        if (i18next.exists(title)) {
            $("#titleMenu").html('<h4 class="ellipsisText" data-i18n="' + title + '"></h4>').localize();
        } else {
            $("#titleMenu").html('<h4 class="ellipsisText">' + title + '</h4>');
        }
        var titles = cm.user.nowTitle;
        titles[cm.user.nowPage] = title;
        cm.user.nowTitle = titles;
    }
}

// Role
cm.getRoleList = function() {
  return $.ajax({
          type: "GET",
          url:cm.user.cellUrl + '__ctl/Role',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  })
}
cm.dispRoleList = function(json, id, multiFlag) {
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })

  var objSel = document.getElementById(id);
  if (objSel.hasChildNodes()) {
    while (objSel.childNodes.length > 0) {
      objSel.removeChild(objSel.firstChild);
    }
  }

  if (!multiFlag) {
      $("#" + id).append('<option value="" data-i18n="selectRole"></option>');
  }
  for (var i = 0; i < results.length; i++) {
    var objRole = results[i];
    var boxName = objRole["_Box.Name"];
    if (boxName === null) {
      boxName = "[main]";
    }

    // role list(selectBox)
    $("#" + id).append('<option data-i18n="profTrans:' + objRole.Name + '_' + boxName + '_DisplayName" value="' + objRole.Name + '(' + boxName + ')">' + objRole.Name + '(' + boxName + ')</option>').localize();
  }
}
cm.dispAssignRole = function(type, flg) {
    var panelId = "toggle";
    var settingId = "";
    if (flg) {
        panelId = "setting";
        settingId = "_S";
    }

    $("#" + panelId + "-panel3").empty();
    cm.setBackahead(flg);
    var html = '<div class="panel-body">';
    html += '<div id="dvAddAccLinkRole' + settingId + '" data-i18n="selectRoleAssign"></div>';
    html += '<div id="dvSelectAddAccLinkRole' + settingId + '" style="margin-bottom: 10px;">';
    html += '<select class="form-control" name="" id="ddlLinkRoleList' + settingId + '" onChange="cm.changeRoleSelect(\'' + settingId + '\');"></select>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-primary" id="b-linkrole-ok' + settingId + '" onClick="';
    switch (type) {
        case "acc":
            html += 'st.restAddAccountLinkRole(true);';
            break;
        case "rel":
            html += 'st.restAddRelationLinkRole(true);';
            break;
        case "ext":
            html += 'sg.restAddExtCellLinkRole(true);';
            break;
    }
    html += '" data-i18n="Assign"></button>';
    html += '</div></div>';
    $("#" + panelId + "-panel3").append(html).localize();
    cm.getRoleList().done(function(data) {
        cm.dispRoleList(data, "ddlLinkRoleList" + settingId, false);
    });
    
    $("#" + panelId + "-panel3").toggleClass('slide-on');
    $("#" + panelId + "-panel2").toggleClass('slide-on-holder');
    cm.setTitleMenu("AssigningRoles", flg);
};
cm.changeRoleSelect = function(settingId) {
    var value = $("#ddlLinkRoleList" + settingId + " option:selected").val();
    if (value === "") {
        $("#b-linkrole-ok" + settingId).prop('disabled', true);
    } else {
        cm.setLinkParam(value);
        $("#b-linkrole-ok" + settingId).prop('disabled', false);
    }
};
cm.setLinkParam = function(value) {
    var roleMatch = value.match(/(.+)\(/);
    cm.linkName = roleMatch[1];
    var boxMatch = value.match(/\((.+)\)/);
    var boxName = boxMatch[1];
    if (boxName === "[main]") {
        boxName = null;
    }
    cm.linkBoxName = boxName;
};

// Relation
cm.getRelationList = function() {
  return $.ajax({
          type: "GET",
          url:cm.user.cellUrl + '__ctl/Relation',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  })
};
cm.dispRelationList = function(json, id, multiFlag) {
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })
  
  var objSel = document.getElementById(id);
  if (objSel.hasChildNodes()) {
    while (objSel.childNodes.length > 0) {
      objSel.removeChild(objSel.firstChild);
    }
  }

  if (!multiFlag) {
      $("#" + id).append('<option value="" data-i18n="selectRelation"></option>');
  }

  for (var i = 0; i < results.length; i++) {
    var objRelation = results[i];
    var boxName = objRelation["_Box.Name"];
    if (boxName === null) {
      boxName = "[main]";
    }

    // relation list(selectBox)
    $("#" + id).append('<option data-i18n="profTrans:' + objRelation.Name + '_' + boxName + '_DisplayName" value="' + objRelation.Name + '(' + boxName + ')">' + objRelation.Name + '(' + boxName + ')</option>').localize();
  }
};

// Initialization
cm.populateProfileEditData = function() {
  $("#editDisplayName").val(i18next.t("profTrans:myProfile_DisplayName"));
  document.getElementById("popupEditDisplayNameErrorMsg").innerHTML = "";
  $("#editDescription").val(i18next.t("profTrans:myProfile_Description"));
  document.getElementById("popupEditDescriptionErrorMsg").innerHTML = "";
  document.getElementById("popupEditUserPhotoErrorMsg").innerHTML = "";
  
  $("#editImgLbl").html("");
  $('#editImgFile').replaceWith($('#editImgFile').clone());
  if (i18next.t("profTrans:myProfile_Image")) {
      cm.imgBinaryFile = i18next.t("profTrans:myProfile_Image");
      $("#idImgFile").attr('src', cm.imgBinaryFile);
  } else {
      $("#idImgFile").attr('src', "https://demo.personium.io/HomeApplication/__/appcell-resources/icons/profile_image.png");
  }

};

// File Save
cm.updateCellProfile = function() {
  var displayName = $("#editDisplayName").val();
  var description = $("#editDescription").val();
  var fileData = null;
  var profileBoxImageName = $('#lblEditFileName').text();
  var validDisplayName = cm.validateDisplayName(displayName, "popupEditDisplayNameErrorMsg",'#editDisplayName');
  if(validDisplayName){
    $('#popupEditDisplayNameErrorMsg').html('');
    var validDesciption = cm.validateDescription(description,"popupEditDescriptionErrorMsg");
    if (validDesciption){
      fileData = {
          "CellType": cm.getCellType(),
          "DisplayName" : displayName,
          "Description" : description,
          "Image" : cm.imgBinaryFile,
          "ProfileImageName" : profileBoxImageName
      };
      cm.retrieveCollectionAPIResponse(fileData);
    }
  }
};

// File Read
cm.attachFile = function(popupImageErrorId, fileDialogId) {
  var file = document.getElementById(fileDialogId).files[0];
  cm.fileName = document.getElementById(fileDialogId).value;
  if (file) {
    var imageFileSize = file.size / 1024;
    if (cm.validateFileType(cm.fileName, imageFileSize, popupImageErrorId)) {
      $("#editImgLbl").html(ut.getName(cm.fileName));
      cm.getAsBinaryString(file);
    }
  }
};
cm.getAsBinaryString = function(readFile) {
	try {
		var reader = new FileReader();
	} catch (e) {
		//uCellProfile.spinner.stop();
		//document.getElementById('successmsg').innerHTML = "Error: seems File API is not supported on your browser";
		return;
	}
	reader.readAsDataURL(readFile, "UTF-8");
	reader.onload = cm.loaded;
	reader.onerror = cm.errorHandler;
};
cm.loaded = function(evt) {
    cm.imgBinaryFile = null;
    var image = new Image();
    image.src = evt.target.result;
    // Get file size(KB)
    var imageFileSize = evt.total / 1024;
    if (imageFileSize <= cm.ICON_SIZELIMIT) {
        cm.imgBinaryFile = evt.target.result;
        $("#idImgFile").attr('src', cm.imgBinaryFile);
    } else {
        // Clipping Canvas
        cm.clipImage(image);
    }
};
cm.clipImage = function(image) {
    //Create temporary canvas
    var tmpCvs = document.createElement('canvas');
    var tmpCxt = tmpCvs.getContext('2d');
    image.onload = function () {
        // Original size
        var origSize = {
            width: image.naturalWidth,
            height: image.naturalHeight
        };
        // Icon size
        tmpCvs.width = cm.ICON_WIDTH;
        tmpCvs.height = cm.ICON_HEIGHT;
        /*
         * 1.The file size of the image is limited to 500 KB
         * 2.Images of 500 KB or more are resized to 172 * 172 after shaping into squares.
         *   (172 * 172 is supposed to be 500 KB or less)
         */
        if (origSize.width - origSize.height >= 0) {
            // Horizontal image, Square image
            // Calculate the starting point of the image
            var d = (origSize.width - origSize.height) / 2;
            // Draw on the canvas
            tmpCxt.drawImage(image, d, 0, origSize.height, origSize.height, 0, 0, cm.ICON_WIDTH, cm.ICON_HEIGHT);
        } else {
            // Vertical image
            // Calculate the starting point of the image
            var d = (origSize.height - origSize.width) / 2;
            // Draw on the canvas
            tmpCxt.drawImage(image, 0, d, origSize.width, origSize.width, 0, 0, cm.ICON_WIDTH, cm.ICON_HEIGHT);
        }
        // Convert the image drawn on the canvas to base64
        var base64 = tmpCvs.toDataURL('image/jpeg', cm.ICON_QUALITY);
        // Display image
        cm.imgBinaryFile = base64;
        $("#idImgFile").attr('src', cm.imgBinaryFile);
    }
}
cm.errorHandler = function(evt) {
	if (evt.target.error.code == evt.target.error.NOT_READABLE_ERR) {
		cm.spinner.stop();
		alert("Error reading file...");
		//document.getElementById('successmsg').innerHTML = "Error reading file...";
	}
};
cm.editDisplayNameBlurEvent = function() {
	var displayName = $("#editDisplayName").val();
	var displayNameSpan = "popupEditDisplayNameErrorMsg";
	var txtDisplayName = "#editDisplayName";
	cm.validateDisplayName(displayName, displayNameSpan, txtDisplayName);
};
cm.editDescriptionBlurEvent = function() {
	document.getElementById("popupEditDescriptionErrorMsg").innerHTML = "";
	var descriptionDetails = document.getElementById("editDescription").value;
	var descriptionSpan = "popupEditDescriptionErrorMsg";
	cm.validateDescription(descriptionDetails, descriptionSpan);
};

// Validation Check
cm.charCheck = function(check) {
  var passLen = check.val().length;
  var msg = "";
  var bool = false;

  if (passLen !== 0) {
    bool = true;
    if (passLen < 6 || passLen > 36) {
      msg = i18next.t("pleaseBetweenCharacter");
      bool = false;
    } else if (check.val().match(/[^0-9a-zA-Z_-]+/)) {
      msg = i18next.t("pleaseCharacterType");
      bool = false;
    }

    $('#changeMessage').html(msg);
  }

  $('#b-change-password-ok').prop('disabled', !bool);
};
cm.validateFileType = function(filePath, imageSize, popupImageErrorId) {
	var fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1)
			.toLowerCase();
	if (fileExtension.toLowerCase() == "jpg"
			|| fileExtension.toLowerCase() == "jpeg"
                        || fileExtension.toLowerCase() == "png"
                        || fileExtension.toLowerCase() == "gif"
                        || fileExtension.toLowerCase() == "bmp"
	) {
		document.getElementById(popupImageErrorId).innerHTML = "";
		return true;
	} else {
		cm.imgBinaryFile = null;
		document.getElementById(popupImageErrorId).innerHTML = "";
		document.getElementById(popupImageErrorId).innerHTML = "Failed to upload image; format not supported";
		return false;
	}
};
cm.validateDisplayName = function(displayName, displayNameSpan) {
	var MINLENGTH = 1;
        var lenDisplayName = displayName.length;
        if(lenDisplayName < MINLENGTH || displayName == undefined || displayName == null || displayName == "") {
            $("#" + displayNameSpan).html(i18next.t("pleaseEnterName"));
            return false;
	}

	var MAXLENGTH = 128;
        $("#" + displayNameSpan).html("");
        if (lenDisplayName > MAXLENGTH) {
            $("#" + displayNameSpan).html(i18next.t("errorValidateNameLength"));
            return false;
        }
        return true;
};
cm.validateDescription = function(descriptionDetails, descriptionSpan) {
	var isValidDescription = true;
	var lenDescription = descriptionDetails.length;
	if (lenDescription > 51200) {
		isValidDescription = false;
		document.getElementById(descriptionSpan).innerHTML = i18next.t("errorValidateMaxLengthOver");
	}
	return isValidDescription;
};
// Validation Check
cm.validateCellURL = function (cellURL, span) {
    var isHttp = cellURL.substring(0, 5);
    var isHttps = cellURL.substring(0, 6);
    var minURLLength = cellURL.length;
    var validMessage = "pleaseValidSchemaURL";
    var letters = /^[0-9a-zA-Z-_.\/]+$/;
    var startHyphenUnderscore = /^[-_!@#$%^&*()=+]/;
    var urlLength = cellURL.length;
    var schemaSplit = cellURL.split("/");
    var isDot = -1;
    if (cellURL.split("/").length > 2) {
        if (schemaSplit[2].length > 0) {
            isDot = schemaSplit[2].indexOf(".");
        }
    }
    var domainName = cellURL.substring(8, urlLength);
    if (cellURL == "" || cellURL == null || cellURL == undefined) {
        return true;
    } else if ((isHttp != "http:" && isHttps != "https:")
        || (minURLLength <= 8)) {
        $("#" + span).attr("data-i18n", validMessage).localize();
        return false;
    } else if (urlLength > 1024) {
        $("#" + span).attr("data-i18n", "maxUrlLengthError").localize();
        return false;
    } else if (isDot == -1) {
        $("#" + span).attr("data-i18n", validMessage).localize();
        return false;
    } else if ((domainName.indexOf("..")) > -1 || (domainName.indexOf("//")) > -1) {
        $("#" + span).attr("data-i18n", validMessage).localize();
        return false;
    }
    document.getElementById(span).innerHTML = "";
    return true;
};
cm.validateBoxName = function(boxName, span) {
    var minURLLength = cellURL.length;
    var validMessage = "pleaseValidSchemaURL";
    var letters = /^[0-9a-zA-Z-_.\/]+$/;
    var startHyphenUnderscore = /^[-_!@#$%^&*()=+]/;
    var urlLength = cellURL.length;
    var schemaSplit = cellURL.split("/");
    var isDot = -1;
    if (cellURL.split("/").length > 2) {
        if (schemaSplit[2].length > 0) {
            isDot = schemaSplit[2].indexOf(".");
        }
    }
    var domainName = cellURL.substring(8, urlLength);
    if (cellURL == "" || cellURL == null || cellURL == undefined) {
        return true;
    } else if ((proto != "http" && proto != "https")
        || (minURLLength <= 8)) {
        $("#" + span).attr("data-i18n", validMessage).localize();
        return false;
    } else if (urlLength > 1024) {
        $("#" + span).attr("data-i18n", "maxUrlLengthError").localize();
        return false;
    } else if (isDot == -1) {
        $("#" + span).attr("data-i18n", validMessage).localize();
        return false;
    } else if ((domainName.indexOf("..")) > -1 || (domainName.indexOf("//")) > -1) {
        $("#" + span).attr("data-i18n", validMessage).localize();
        return false;
    }
    document.getElementById(span).innerHTML = "";
    return true;
};
cm.doesUrlContainSlash = function (cellURL, span, message) {
    if (cellURL != undefined) {
        if (!cellURL.endsWith("/")) {
            document.getElementById(span).innerHTML = message;
            return false;
        }
        document.getElementById(span).innerHTML = "";
        return true;
    }
};

cm.i18nAddProfile = function (lng, ns, transName, defJson, schemaUrl, fileName, typeName, appFlag) {
    let defImage = cm.notImage;
    if (appFlag) {
        defImage = cm.notAppImage;
    }
    if (defJson.Image) {
        defImage = defJson.Image;
    }

    cm.getTargetProfileLng(schemaUrl, lng, fileName).done(function (profRes) {
        var profJson = {};
        if (typeName) {
            if (profRes[typeName]) {
                profJson = {
                    DisplayName: profRes[typeName].DisplayName,
                    Description: profRes[typeName].Description,
                    Image: profRes[typeName].Image
                }
            }
        } else {
            profJson = {
                DisplayName: profRes.DisplayName,
                Description: profRes.Description,
                Image: profRes.Image
            }
        }

        if (profJson.DisplayName) {
            i18next.addResource(lng, ns, transName + "_DisplayName", profJson.DisplayName);
        } else {
            i18next.addResource(lng, ns, transName + "_DisplayName", defJson.DisplayName);
        }
        if (profJson.Description) {
            i18next.addResource(lng, ns, transName + "_Description", profJson.Description);
        } else {
            i18next.addResource(lng, ns, transName + "_Description", defJson.Description);
        }
        if (profJson.Image) {
            i18next.addResource(lng, ns, transName + "_Image", profJson.Image);
        } else {
            i18next.addResource(lng, ns, transName + "_Image", defImage);
        }
    }).fail(function () {
        if (defJson.DisplayName[lng]) {
            i18next.addResource(lng, ns, transName + "_DisplayName", defJson.DisplayName[lng]);
        } else {
            i18next.addResource(lng, ns, transName + "_DisplayName", defJson.DisplayName);
        }

        if (defJson.Description[lng]) {
            i18next.addResource(lng, ns, transName + "_Description", defJson.Description[lng]);
        } else {
            i18next.addResource(lng, ns, transName + "_Description", defJson.Description);
        }
        i18next.addResource(lng, ns, transName + "_Image", defImage);
    }).always(function () {
        updateContent();
    });
};

// This method checks idle time
// Check 5 minutes before session expires
cm.setIdleTime = function() {
    cm.refreshToken();
    setInterval(cm.checkIdleTime, 3300000);
    document.onclick = function() {
      cm.LASTACTIVITY = new Date().getTime();
    };
    document.onmousemove = function() {
      cm.LASTACTIVITY = new Date().getTime();
    };
    document.onkeypress = function() {
      cm.LASTACTIVITY = new Date().getTime();
    };
}
cm.checkIdleTime = function() {
  if (new Date().getTime() > cm.LASTACTIVITY + cm.IDLE_TIMEOUT) {
    $('#modal-session-expired').modal('show');
  } else {
      cm.refreshToken();
  }
};
cm.refreshToken = function() {
  cm.refreshTokenAPI().done(function(data) {
      cm.user.access_token = data.access_token;
      cm.user.refresh_token = data.refresh_token;
      sessionStorage.setItem("sessionData", JSON.stringify(cm.user));
  });
};
cm.changePassCheck = function(newpass, confirm) {
  if (newpass === confirm) {
    $('#confirmMessage').html("");
    cm.changePass(newpass);
  } else {
    $('#confirmMessage').html(i18next.t("passwordNotMatch"));
  }
};

// API
cm.refreshTokenAPI = function() {
    return $.ajax({
        type: "POST",
        url: cm.user.cellUrl + '__token',
        processData: true,
        dataType: 'json',
        data: {
               grant_type: "refresh_token",
               refresh_token: cm.user.refresh_token
        },
        headers: {'Accept':'application/json'}
    })
}
cm.appRefreshTokenAPI = function(appCellUrl, appCellToken) {
    return $.ajax({
        type: "POST",
        url: cm.user.cellUrl + '__token',
        processData: true,
        dataType: 'json',
        data: {
               grant_type: "refresh_token",
               refresh_token: cm.user.refresh_token,
               client_id: appCellUrl,
               client_secret: appCellToken
        },
        headers: {'Accept':'application/json'}
    })
}
cm.appGetTargetToken = function(appCellUrl, id, pw) {
  return $.ajax({
                type: "POST",
                url: appCellUrl + '__token',
                processData: true,
		dataType: 'json',
                data: {
                        grant_type: "password",
			username: id,
			password: pw,
                        p_target: cm.user.cellUrl
                },
		headers: {'Accept':'application/json'}
         });
}
//cm.getTargetToken = function(extCellUrl) {
//  return $.ajax({
//                type: "POST",
//                url: cm.user.cellUrl + '__token',
//                processData: true,
//		dataType: 'json',
//                data: {
//                        grant_type: "password",
//                        username: cm.user.userName,
//			password: cm.user.pass,
//                        p_target: extCellUrl
//                },
//		headers: {'Accept':'application/json'}
//         });
//};
cm.getTargetToken = function(extCellUrl) {
  return $.ajax({
                type: "POST",
                url: cm.user.cellUrl + '__token',
                processData: true,
		dataType: 'json',
                data: {
                        grant_type: "refresh_token",
                        refresh_token: cm.user.refresh_token,
                        p_target: extCellUrl
                },
		headers: {'Accept':'application/json'}
         });
};
cm.getProfile = function(url) {
    return $.ajax({
	type: "GET",
	url: url + '__/profile.json',
	dataType: 'json',
        headers: {'Accept':'application/json'}
    })
};
cm.getBoxList = function() {
  return $.ajax({
          type: "GET",
          url: cm.user.cellUrl + '__ctl/Box',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  })
}
cm.getBoxInfo = function (boxName) {
    return $.ajax({
        type: "GET",
        url: cm.user.cellUrl + "__ctl/Box('" + boxName + "')",
        headers: {
            'Authorization': 'Bearer ' + cm.user.access_token,
            'Accept': 'application/json'
        }
    });
}
cm.getTargetProfile = function (schemaUrl, fileName) {
    return $.ajax({
        type: "GET",
        url: schemaUrl + "__/" + fileName + ".json",
        dataType: 'json',
        headers: { 'Accept': 'application/json' }
    });
}
cm.getTargetProfileLng = function (schemaUrl, lng, fileName) {
    return $.ajax({
        type: "GET",
        url: schemaUrl + "__/locales/" + lng + "/" + fileName + ".json",
        dataType: 'json',
        headers: { 'Accept': 'application/json' }
    });
}
cm.getBoxStatus = function(boxName) {
  return $.ajax({
          type: "GET",
          url: cm.user.cellUrl + boxName,
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  })
}
cm.changePass = function(newpass) {
  $.ajax({
          type: "PUT",
          url: cm.user.cellUrl + '__mypassword',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'X-Personium-Credential': newpass
          }
  }).done(function(data) {
          $('#modal-relogin').modal('show');
  }).fail(function(data) {
          var res = JSON.parse(data.responseText);
          alert("An error has occurred.\n" + res.message.value);
  });
};
cm.retrieveCollectionAPIResponse = function (json) {
    let profileUrl = cm.user.cellUrl + '__/profile.json';
    // Check if there is locales folder
    ut.confirmExistenceOfURL(cm.user.cellUrl + '__/locales').done(function (res) {
        profileUrl = cm.user.cellUrl + '__/locales/' + i18next.language + '/profile.json';

        // Check if there is a target language folder
        ut.confirmExistenceOfURL(cm.user.cellUrl + '__/locales/' + i18next.language).fail(function (res) {
           $.ajax({
                type: "MKCOL",
                url: cm.user.cellUrl + '__/locales/' + i18next.language,
                data: '<?xml version="1.0" encoding="utf-8"?><D:mkcol xmlns:D="DAV:" xmlns:p="urn:x-personium:xmlns"><D:set><D:prop><D:resourcetype><D:collection/></D:resourcetype></D:prop></D:set></D:mkcol>',
                processData: false,
                headers: {
                    'Authorization': 'Bearer ' + cm.user.access_token,
                    'Accept': 'application/json'
                }
           }).done(function (res) {
               cm.putFileProcess(profileUrl, json);
           }).fail(function (res) {
               console.log(res);
           })
        }).done(function (res) {
            cm.putFileProcess(profileUrl, json);
        });
    }).fail(function (res) {
        cm.putFileProcess(profileUrl, json);
    });
};
cm.putFileProcess = function (profileUrl, json) {
    ut.putFileAPI(profileUrl, json).done(function (data) {
        cm.moveBackahead(true);
        cm.i18nAddProfile(i18next.language, "profTrans", "myProfile", json, cm.user.cellUrl, "profile");
        cm.editProfileHeaderMenu();
        sessionStorage.setItem("sessionData", JSON.stringify(cm.user));
    }).fail(function () {
        alert("fail");
    });
}
cm.editProfileHeaderMenu = function() {
    $("#imProfilePicture").attr('src', cm.imgBinaryFile);
    $("#tProfileDisplayName").html(cm.user.profile.DisplayName);
}

cm.execApp = function(aDom) {
    let launchUrl = $(aDom).data('appLaunchUrl');
    let openNewWindow = $(aDom).data('openNewWindow');
    let childWindow;
    // https://stackoverflow.com/questions/20696041/window-openurl-blank-not-working-on-imac-safari
    if (openNewWindow) {
        childWindow = window.open('about:blank');
    }    
        
    cm.refreshTokenAPI().done(function(data) {
        let tempMyProfile = JSON.parse(sessionStorage.getItem("myProfile")) || {};
        let isDemo = (tempMyProfile.IsDemo || false);

        var url = launchUrl;
        url += '?lng=' + i18next.language;
        url += '#cell=' + cm.user.cellUrl;
        url += '&refresh_token=' + data.refresh_token;

        /*
         * Launch App according to device type if supported.
         * If App is native, launch.json should specify "android" and "ios" key/value pairs.
         * If native App is not defined, launch the web App as usual.
         */
        if (openNewWindow) {
            childWindow.location.href = url;
            childWindow = null;
        } else {
            window.location.href = url; // launch native App
        }

        if (isDemo && launchUrl.startsWith('https://demo.personium.io/app-myboard/')) {
            demoSession.sideMenu = true;
            sessionStorage.setItem("demoSession", JSON.stringify(demoSession));
            demo.showModal('#modal-logout-start');
        }
    }).fail(function(error){
        console.log(error);

        if (openNewWindow) {
            childWindow.close();
            childWindow = null;
        }
    });

    return false;
};

cm.getReceivedMessageCntAPI = function () {
    return $.ajax({
        type: "GET",
        url: cm.user.cellUrl + '__ctl/ReceivedMessage?$filter=Type+eq+%27message%27+and+Status+eq+%27unread%27&$inlinecount=allpages',
        headers: {
            'Authorization': 'Bearer ' + cm.user.access_token,
            'Accept': 'application/json'
        }
    });
};

cm.getNotCompMessageCnt = function() {
    return $.ajax({
                type: "GET",
                url: cm.user.cellUrl + '__ctl/ReceivedMessage?$inlinecount=allpages&$filter=Type+ne+%27message%27+and+Status+eq+%27none%27',
                headers: {
                    'Authorization':'Bearer ' + cm.user.access_token,
                    'Accept':'application/json'
                }
  });
};

cm.setAppMarketTitle = function() {
    /*
     * For older profile.json that might not have CellType key,
     * assign default cell type (Person) to it.
     */
    let cellType = cm.getCellType();

    /*
     * Since setTitleMenu does not support i18next context,
     * need to use either "AppMarket" or "AppMarket_Organization" directly.
     */
    let appMarketTitle = "AppMarket";
    if (cellType == "Organization") {
        appMarketTitle = [appMarketTitle, "_", cellType].join("");
    }

    cm.setTitleMenu(appMarketTitle);
};

cm.getCellType = function() {
    return (JSON.parse(sessionStorage.getItem("myProfile")).CellType || "Person");
};

cm.getAppListURL = function() {
    /*
     * For older profile.json that might not have CellType key,
     * assign default cell type (Person) to it.
     */
    let cellType = cm.getCellType();
    let filter = "?$filter=Type%20eq%20null%20or%20Type%20eq%20'Person'%20";

    if (cellType == "Organization") {
        filter = "?$filter=Type%20eq%20null%20or%20Type%20eq%20'Organization'%20";
    }

    let appListURL = ['https://demo.personium.io/market/__/applist/Apps', filter].join("");

    return appListURL;
};

// TEST
function testBinary() {
    var file = document.getElementById("testFile").files[0];
    if (file) {
        try {
             var reader = new FileReader();
        } catch (e) {
             return;
        }

        reader.readAsDataURL(file, "UTF-8");
        reader.onload = testAPI;
    }
}
function testAPI(evt) {
    var file = document.getElementById("testFile");
    var form_data = new FormData(file);

    var url = cm.user.cellUrl;
    //var url = "https://demo.personium.io/ksakamoto/";
    var urlArray = [];
    urlArray[0] = "https";
    urlArray[1] = "demo.personium.io";
    urlArray[2] = "kyouhei-sakamoto";
    var apiUrl = "https://demo.personium.io/app-myboard/__/MyBoard.bar";
    //urlArray[2] = "ksakamoto";
    var oReq = new XMLHttpRequest();
    oReq.open("GET", "https://demo.personium.io/app-myboard/__/MyBoard.bar", true);
    //oReq.open("GET", "https://demo.personium.io/app-myboard/__/V1_1_2_bar_webdav_odata.bar", true);
    oReq.responseType = "arraybuffer";
    oReq.setRequestHeader("Content-Type", "application/zip");
    //oReq.responseType = "blob";
    oReq.onload = function(e) {
        //var blob = new Blob([oReq.response], {type: "application/octet-stream"});
        //var formData = new FormData(); 
        //formData.append('zip', blob);
        //console.log(blob);
        //var r = new FileReader();
        //r.onload = function() {
        //    console.log(r.result.substr(r.result.indexOf(',')+1));
        //}
        //r.readAsDataURL(blob);
        //var view = new DataView(arrayBuffer);
        var arrayBuffer = oReq.response;
        var view = new Uint8Array(arrayBuffer);
        var blob = new Blob([view], {"type" : "application/zip"})
        //if (arrayBuffer) {
        //    var byteArray = new Uint8Array(arrayBuffer);
        //    var binaryData = "";
        //    for (var i = 0; i < byteArray.byteLength; i++) {
        //        binaryData += String.fromCharCode(byteArray[i]);
        //    }
        //}
        //var binary = evt.target.result.substr(evt.target.result.indexOf(',')+1);
        $.ajax({
                type: "MKCOL",
                url: url + 'MyBoard/', // 作成ボックス名
                data: blob,
                //data: 'C:\Users\coe\Desktop\V1_1_2_bar_webdav_odata.bar',
                processData: false,
                headers: {
                    'Authorization':'Bearer ' + cm.user.access_token,
                    //'Content-type':'application/zip'
                    'Content-type':'application/zip'
                }
        }).done(function(data) {
            alert(data);
        }).fail(function(data) {
            alert(data);
        });
    }
    oReq.send();
};
function testAPI2() {
    $.ajax({
            //type: "GET",
            //url: 'https://demo.personium.io/HomeApplication/io_personium_demo_app-myboard',
            //headers: {
            //    'Authorization':'Bearer ' + cm.user.access_token
            //}
            type: "PROPFIND",
            url: 'https://demo.personium.io/HomeApplication/io_personium_demo_app-myboard/MyBoardBox/my-board.json',
            headers: {
                'Authorization':'Bearer ' + cm.user.access_token,
                'Depth': 1
            }
    }).done(function(data) {
        alert(data);
    }).fail(function(data) {
        alert(data);
    });
};
 
