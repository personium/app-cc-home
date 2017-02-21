var cm = {};
cm.imgBinaryFile = null;
cm.user = JSON.parse(sessionStorage.getItem("sessionData"));
if (!cm.user) {
  //location.href = "./login.html";
  cm.logout();
}
cm.user.nowPage = 0;
cm.user.nowTitle = {};
cm.user.settingNowPage = 0;
cm.user.settingNowTitle = {};
cm.notImage = "https://demo.personium.io/HomeApplication/__/icons/profile_image.png";

//Default timeout limit - 60 minutes.
cm.IDLE_TIMEOUT =  3600000;
//cm.IDLE_TIMEOUT =  10000;
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
    var html = '<div class="header-rightside">';
    html += '<table class="list-inline table-fixed">';
    html += '<tr><td rowspan="2" class="profile-header">';
    html += '<img class="icon-profile" id="imProfilePicture" src="' + cm.imgBinaryFile + '" alt="user">';
    html += '</td><td width="70%" class="sizeBody1">';
    html += '<span id="tProfileDisplayName">' + cm.user.profile.DisplayName + '</span>';
    //html += '</td><td width="30%">&nbsp;</td>';
    html += '</td><td rowspan="2" style="text-align:right;"><a onClick="cm.openSlide();">';
    html += '<img src="https://demo.personium.io/HomeApplication/__/icons/ico_menu.png">';
    //html += '<p class="headerAccountNameText">' + cm.user.userName + '</p>';
    //html += '<p class="headerAccountNameText">aiueokakikukekosasisuseso</p>▼';
    html += '</a></td></tr>';
    html += '<tr><td class="sizeCaption">';
    //html += '<p class="ellipsisText">' + cm.user.cellUrl + '</p>';
    html += '<p>Account: ' + cm.user.userName + '</p>';
    html += '</td></tr>';
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

// Create title header in "header-menu" class
// true: Settings false: Default
cm.createTitleHeader = function(flg) {
    var id = ".header-menu";
    if (flg) {
        id = ".setting-header";
    }

    var html = '<table class="table-fixed">';
    html += '<tr style="vertical-align: middle;">';
    if (flg) {
        html += '<td id="settingBackMenu" class="prev-icon" style="width: 10%;"></td>'
        html += '<td id="settingBackTitle" align="left" style="width: 30%;white-space: nowrap;"></td>';
        html += '<td id="settingTitleMenu" align="left" style="width: 50%;" class="title"></td>';
        html += '<td style="width: 10%;"><a style="padding: 0;font-size: 28px;" onClick="cm.closeSetting();return false;">×</button></td>';
    } else {
        html += '<td id="backMenu" class="prev-icon" style="width: 10%;"></td>'
        html += '<td id="backTitle" align="left" style="width: 30%;white-space: nowrap;"></td>';
        html += '<td id="titleMenu" align="left" class="title"></td>';
        html += '<td class="menu-icon header-top pull-right"></td>';
    }
    
    html += '</td></tr></table>';
    $(id).html(html);
}

cm.closeSetting = function() {
    $(".setting-menu").toggleClass("slide-on");
    $("#settingboard").empty();
    $("#settingBackTitle").empty();
    cm.user.settingNowPage = 0;
}

cm.createSettingArea = function() {
    var html = '<div class="col-md-12 col-sm-12 display-table-cell v-align setting-menu">';
    html += '<div class="row header-menu setting-header"></div>';
    html += '<div class="row" id="settingboard"></div>';
    html += '<div id="modal-confirmation" class="modal fade" role="dialog" data-backdrop="static">';
    html += '<div class="modal-dialog">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header login-header">';
    html += '<h4 class="modal-title" id="modal-confirmation-title"></h4>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += '<div id="dvTextConfirmation"></div>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
    html += '<button type="button" class="btn btn-primary" id="b-edit-relconfirm-ok" style="display:none">Edit</button>';
    html += '<button type="button" class="btn btn-primary" id="b-edit-accconfirm-ok" style="display:none">Edit</button>';
    html += '<button type="button" class="btn btn-primary" id="b-del-acclinkrole-ok" style="display:none">Delete</button>';
    html += '<button type="button" class="btn btn-primary" id="b-del-role-ok" style="display:none">Delete</button>';
    html += '<button type="button" class="btn btn-primary" id="b-del-account-ok" style="display:none">Delete</button>';
    html += '<button type="button" class="btn btn-primary" id="b-del-relation-ok" style="display:none">Delete</button>';
    html += '<button type="button" class="btn btn-primary" id="b-del-rellinkrole-ok" style="display:none">Delete</button>';
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
            $("#" + boardId).append('<div class="panel list-group ' + toggleClass + '" id="setting-panel' + cm.user.settingNowPage + '"></div>');
        }
        if (document.getElementById('setting-panel' + (cm.user.settingNowPage + 1)) == null) {
            $("#" + boardId).append('<div class="panel list-group toggle-panel" id="setting-panel' + (cm.user.settingNowPage + 1) + '"></div>');
        }
    } else {
        cm.user.nowPage = cm.user.nowPage + 1;
        if (document.getElementById('toggle-panel' + cm.user.nowPage) == null) {
            $("#" + boardId).append('<div class="panel list-group toggle-panel" id="toggle-panel' + cm.user.nowPage + '"></div>');
        }
        if (document.getElementById('toggle-panel' + (cm.user.nowPage + 1)) == null) {
            $("#" + boardId).append('<div class="panel list-group toggle-panel" id="toggle-panel' + (cm.user.nowPage + 1) + '"></div>');
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
                $("#setting-panel1").toggleClass("slide-on");
                break;
            default:
                $("#setting-panel" + no).toggleClass("slide-on");
                $("#setting-panel" + (no - 1)).toggleClass("slide-on-holder");
                break;
        }

        cm.user.settingNowPage = no - 1;
        if (cm.user.settingNowPage >= 1) {
            cm.setTitleMenu(cm.user.settingNowTitle[cm.user.settingNowPage], true);
            if (cm.user.settingNowPage > 1) {
                $("#settingBackTitle").html(cm.user.settingNowTitle[cm.user.settingNowPage - 1]);
            } else {
                $("#settingBackTitle").html("");
                $("#settingBackMenu").css("display", "none");
            }
        } else {
            $("#settingBackTitle").html("");
            $("#settingBackMenu").css("display", "none");
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
            if (cm.user.nowPage > 0) {
                $("#backTitle").html(cm.user.nowTitle[cm.user.nowPage - 1]);
            } else {
                $("#backTitle").html("");
            }
        } else {
            $("#backTitle").html("");
        }
    }
}

// create side menu
cm.createSideMenu = function() {
    var itemName = {};
    itemName.EditProf = mg.getMsg("00010");
    itemName.ChgPass = mg.getMsg("00011");
    itemName.Logout = mg.getMsg("00012");
    itemName.DispName = mg.getMsg("00013");
    itemName.Description = mg.getMsg("00014");
    itemName.Photo = mg.getMsg("00015");
    itemName.Relogin = mg.getMsg("00016");

    var html = '<div class="slide-menu"><nav>';
    // Menu Title
    html += '<div style="margin:10px;"><span class="commonLabel">' + mg.getMsg("00026") + '</span></div>';

    // profile edit
    html += '<table class="menu-title">';
    //html += '<tr class="sidemenu-list v-align-m">';
    html += '<tr>';
    //html += '<td rowspan="3" class="sidemenu-itemEmpty">&nbsp;</td><td valign="middle" class="sidemenu-item sizeBody1"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-edit-profile">' + itemName.EditProf + '<img class="moveIcon" src="https://demo.personium.io/HomeApplication/__/icons/ico_back.png" alt="user"></a></td>';
    html += '<td rowspan="2" class="sidemenu-itemEmpty">&nbsp;</td>';
    html += '<td valign="middle" class="sidemenu-item sizeBody1"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-edit-profile">' + itemName.EditProf + '</a></td>';
    //html += '</tr><tr class="sidemenu-list v-align-m">';
    html += '</tr><tr>';
    //html += '<td class="sidemenu-item sizeBody1"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-change-password">' + itemName.ChgPass + '<img class="moveIcon" src="https://demo.personium.io/HomeApplication/__/icons/ico_back.png" alt="user"></a></td>';
    html += '<td class="sidemenu-lastitem sizeBody1"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-change-password">' + itemName.ChgPass + '</a></td>';
    //html += '</tr><tr class="sidemenu-list v-align-m">';
    html += '</tr><tr>';
    //html += '<td class="sidemenu-lastitem sizeBody1"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-logout">' + itemName.Logout + '<img class="moveIcon" src="https://demo.personium.io/HomeApplication/__/icons/ico_back.png" alt="user"></a></td>';
    html += '</tr></table>';

    // setting menu
    html += '<table class="menu-title"><tr>';
    html += '<td rowspan="4" class="sidemenu-itemEmpty">&nbsp;</td>';
    html += '<td class="sidemenu-item sizeBody1"><a class="allToggle" id="accountToggle">' + mg.getMsg("00028") + '</a></td></tr>';
    html += '<tr><td class="sidemenu-item sizeBody1"><a class="allToggle" id="applicationToggle">' + mg.getMsg("00039") + '</a></td></tr>';
    html += '<tr><td class="sidemenu-item sizeBody1"><a class="allToggle" id="roleToggle">' + mg.getMsg("00032") + '</a></td></tr>';
    html += '<tr><td class="sidemenu-lastitem sizeBody1"><a class="allToggle" id="relationToggle">' + mg.getMsg("00033") + '</a></td></tr>';
    html += '</table>';

    // log out
    html += '<table class="menu-title"><tr>';
    html += '<td class="sidemenu-itemEmpty">&nbsp;</td>';
    html += '<td class="sidemenu-item sizeBody1"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-logout">' + itemName.Logout + '</a></td>';
    html += '</tr></table></div>';
    html += '<div class="overlay" id="dvOverlay"></div>';

    $(".display-parent-div").append(html);

    // Modal
    // Edit Profile
    html = '<div id="modal-edit-profile" class="modal fade" role="dialog">';
    html += '<div class="modal-dialog">';
    // Modal content
    html += '<div class="modal-content">';
    html += '<div class="modal-header login-header">';
    html += '<button type="button" class="close" data-dismiss="modal">×</button>';
    html += '<h4 class="modal-title">' + itemName.EditProf + '</h4>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += '<div id="dvDisplayName">' + itemName.DispName + '</div>';
    html += '<div id="dvTextDisplayName">';
    html += '<input type="text" id="editDisplayName" onblur="cm.editDisplayNameBlurEvent();">';
    html += '</div>';
    html += '<span class="popupAlertArea" style="color:red">';
    html += '<aside id="popupEditDisplayNameErrorMsg"></aside>';
    html += '</span>';
    html += '<div id="dvDescription">' + itemName.Description + '</div>';
    html += '<div id="dvTextDescription">';
    html += '<textarea onblur="cm.editDescriptionBlurEvent();" name="" cols="" rows=""  id="editDescription"></textarea>';
    html += '</div>';
    html += '<span style="padding-top: 3px;height:11px;color:red;">';
    html += '<aside id="popupEditDescriptionErrorMsg"></aside>';
    html += '</span>';
    html += '<div id="dvPhoto">' + itemName.Photo + '</div>';
    html += '<div id="dvBrowseButtonSection">';
    html += '<input type="file" class="fileUpload" onchange="cm.attachFile(\'popupEditUserPhotoErrorMsg\', \'editImgFile\');" id="editImgFile">';
    html += '</div>';
    html += '<div id="dvBoxProfileImage">';
    html += '<figure id="figEditCellProfile" class="boxProfileImage">';
    html += '<img class="image-circle-large" style="margin: auto;" id="idImgFile" src="#" alt="image" />';
    html += '</figure>';
    html += '</div>';
    html += '<span style="padding-top: 3px;height:11px;color:red;">';
    html += '<aside id="popupEditUserPhotoErrorMsg"></aside>';
    html += '</span>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
    html += '<button type="button" class="btn btn-primary" id="b-edit-profile-ok">Register</button>';
    html += '</div></div></div></div>';
    var modal = $(html);
    $(document.body).append(modal);

    // Change Password
    html = '<div id="modal-change-password" class="modal fade" role="dialog">' +
           '<div class="modal-dialog">' +
           // Modal content
           '<div class="modal-content">' +
           '<div class="modal-header login-header">' +
           '<button type="button" class="close" data-dismiss="modal">×</button>' +
           '<h4 class="modal-title">' + itemName.ChgPass + '</h4>' +
           '</div>' +
           '<div class="modal-body">' +
           '<input type="password" placeholder="' + mg.getMsg("I0005") + '" id="pNewPassword">' +
           '<span id="changeMessage" style="color:red"></span>' +
           '<input type="password" placeholder="' + mg.getMsg("I0003") + '" id="pConfirm">' +
           '<span id="confirmMessage" style="color:red"></span>' +
           '</div>' +
           '<div class="modal-footer">' +
           '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
           '<button type="button" class="btn btn-primary" id="b-change-password-ok" disabled>OK</button>' +
           '</div></div></div></div>';

    modal = $(html);
    $(document.body).append(modal);

    // ReLogin
    html = '<div id="modal-relogin" class="modal fade" role="dialog" data-backdrop="static">' +
           '<div class="modal-dialog">' +
           '<div class="modal-content">' +
           '<div class="modal-header login-header">' +
           '<h4 class="modal-title">' + itemName.Relogin + '</h4>' +
           '</div>' +
           '<div class="modal-body">' +
           mg.getMsg("I0001") +
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
           '<button type="button" class="close" data-dismiss="modal">×</button>' +
           '<h4 class="modal-title">' + itemName.Logout + '</h4>' +
           '</div>' +
           '<div class="modal-body">' +
           mg.getMsg("I0002") +
           '</div>' +
           '<div class="modal-footer">' +
           '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
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
           mg.getMsg("W0001") +
           '</div>' +
           '<div class="modal-footer">' +
           '<button type="button" class="btn btn-primary" id="b-session-relogin-ok" >OK</button>' +
           '</div></div></div></div>';
    modal = $(html);
    $(document.body).append(modal);

    // Set Event
    $('#b-logout-ok,#b-relogin-ok,#b-session-relogin-ok').on('click', function() { cm.logout(); });
    $('#b-change-password-ok').on('click', function() { cm.changePassCheck($("#pNewPassword").val(), $("#pConfirm").val());});
    $('#modal-change-password').on('hidden.bs.modal', function () {
      $("#pNewPassword").val("");
      $("#pConfirm").val("");
      $("#changeMessage").html("");
      $("#confirmMessage").html("");
      $('#b-change-password-ok').prop('disabled', true);
    });
    $('#modal-edit-profile').on('show.bs.modal', function () {
      cm.populateProfileEditData();
    });
    $('#pNewPassword').blur(function() {
       cm.charCheck($(this));
    });
    $('#b-edit-profile-ok').on('click', function () { cm.updateCellProfile(); });
    $('#dvOverlay').on('click', function() {
        $(".overlay").removeClass('overlay-on');
        $(".slide-menu").removeClass('slide-on');
    });

    // Time Out Set
    cm.setIdleTime();
}

cm.openSlide = function() {
    $(".overlay").toggleClass('overlay-on');
    $(".slide-menu").toggleClass('slide-on');
}

// Create Backahead
// true: Settings false: Default
cm.createBackMenu = function(moveUrl, flg) {
    if (flg) {
        var html = '<a class="allToggle" style="float:left;" onClick="cm.moveBackahead(true);return false;"><img id="imBack" src="https://demo.personium.io/HomeApplication/__/icons/ico_back.png" alt="user"></a>';
        $("#settingBackMenu").html(html);
    } else {
        var html = '<a class="allToggle" style="float:left;" onClick="cm.moveBackahead();return false;"><img id="imBack" src="https://demo.personium.io/HomeApplication/__/icons/ico_back.png" alt="user"></a>';
        $("#backMenu").html(html);
    }
    cm.user.prevUrl = moveUrl;
}

cm.setTitleMenu = function(title, flg) {
    if (flg) {
        $("#settingTitleMenu").html('<p  class="ellipsisText">' + title + '</p>');
        var titles = cm.user.settingNowTitle;
        titles[cm.user.settingNowPage] = title;
        cm.user.settingNowTitle = titles;
        if (cm.user.settingNowPage > 1) {
            var html = '<p class="ellipsisText">' + cm.user.settingNowTitle[cm.user.settingNowPage - 1] + '</p>'
            $("#settingBackTitle").html(html);
            $("#settingBackMenu").css("display", "");
        } else {
            $("#settingBackMenu").css("display", "none");
        }
    } else {
        $("#titleMenu").html('<p  class="ellipsisText">' + title + '</p>');
        var titles = cm.user.nowTitle;
        titles[cm.user.nowPage] = title;
        cm.user.nowTitle = titles;
        if (cm.user.nowPage > 0) {
            var html = '<p class="ellipsisText">' + cm.user.nowTitle[cm.user.nowPage - 1] + '</p>'
            $("#backTitle").html(html);
        }
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
      $("#" + id).append('<option value="">Please select a Role</option>');
  }
  for (var i in results) {
    var objRole = json.d.results[i];
    var boxName = objRole["_Box.Name"];
    if (boxName === null) {
      boxName = "[main]";
    }

    // role list(selectBox)
    $("#" + id).append('<option value="' + objRole.Name + '(' + boxName + ')">' + objRole.Name + '(' + boxName + ')</option>');
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
    html += '<div id="dvAddAccLinkRole' + settingId + '">' + mg.getMsg("I0014") + '</div>';
    html += '<div id="dvSelectAddAccLinkRole' + settingId + '" style="margin-bottom: 10px;">';
    html += '<select name="" id="ddlLinkRoleList' + settingId + '" onChange="cm.changeRoleSelect(\'' + settingId + '\');"></select>';
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
    html += '">Assign</button>';
    html += '</div></div>';
    $("#" + panelId + "-panel3").append(html);
    cm.getRoleList().done(function(data) {
        cm.dispRoleList(data, "ddlLinkRoleList" + settingId, false);
    });
    
    $("#" + panelId + "-panel3").toggleClass('slide-on');
    $("#" + panelId + "-panel2").toggleClass('slide-on-holder');
    cm.setTitleMenu(mg.getMsg("00005"), flg);
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
      $("#" + id).append('<option value="">Please select a Relation</option>');
  }

  for (var i in results) {
    var objRelation = json.d.results[i];
    var boxName = objRelation["_Box.Name"];
    if (boxName === null) {
      boxName = "[main]";
    }

    // relation list(selectBox)
    $("#" + id).append('<option value="' + objRelation.Name + '(' + boxName + ')">' + objRelation.Name + '(' + boxName + ')</option>');
  }
};

// Initialization
cm.populateProfileEditData = function() {
  $("#editDisplayName").val(cm.user.profile.DisplayName);
  document.getElementById("popupEditDisplayNameErrorMsg").innerHTML = "";
  $("#editDescription").val(cm.user.profile.Description);
  document.getElementById("popupEditDescriptionErrorMsg").innerHTML = "";
  document.getElementById("popupEditUserPhotoErrorMsg").innerHTML = "";
  
  $('#editImgFile').replaceWith($('#editImgFile').clone());
  if (cm.user.profile.Image) {
    $("#idImgFile").attr('src', cm.user.profile.Image);
  } else {
    $("#idImgFile").attr('src', "../../appcell-resources/icons/profile_image.png");
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
	cm.imgBinaryFile = evt.target.result;
        $("#idImgFile").attr('src', cm.imgBinaryFile);
	//document.getElementById("fileID").value = '';
};
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
      msg = "Please enter between 6 to 32 characters.";
      bool = false;
    } else if (check.val().match(/[^0-9a-zA-Z_-]+/)) {
      msg = "Please enter Character Type(Half Size Alphanumeric, '-', '_')";
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
cm.validateDisplayName = function(displayName, displayNameSpan,txtID) {
	var MINLENGTH = 1;
	var MAXLENGTH = 128;
	var letters = /^[一-龠ぁ-ゔ[ァ-ヴー々〆〤0-9a-zA-Z-_\s]+$/;
	var specialchar = /^[-_\s]*$/;
	var allowedLetters = /^[0-9a-zA-Z-_\s]+$/;
	var lenDisplayName = displayName.length;
	//this.removeStatusIcons(txtID);
        document.getElementById(displayNameSpan).innerHTML = "";
	if(lenDisplayName < MINLENGTH || displayName == undefined || displayName == null || displayName == "") {
		document.getElementById(displayNameSpan).innerHTML =  mg.getMsg("E0003");
		//this.showErrorIcon(txtID);
		//uCellProfile.spinner.stop();
		return false;
	} else if (lenDisplayName >= MAXLENGTH) {
		document.getElementById(displayNameSpan).innerHTML = mg.getMsg("E0004");
		//uCellProfile.spinner.stop();
		//this.showErrorIcon(txtID);
		return false;
	} else if (lenDisplayName != 0 && ! (displayName.match(letters))){
		document.getElementById(displayNameSpan).innerHTML = mg.getMsg("E0005");
		//this.showErrorIcon(txtID);
		return false;
	} else if (lenDisplayName != 0 && !(displayName.match(allowedLetters))) {
		document.getElementById(displayNameSpan).innerHTML = mg.getMsg("E0006");
		//this.showErrorIcon(txtID);
		return false;
	} else if(lenDisplayName != 0 && (specialchar.toString().indexOf(displayName.substring(0,1)) >= 0)){
		document.getElementById(displayNameSpan).innerHTML = mg.getMsg("E0006");
		//this.showErrorIcon(txtID);
		//uCellProfile.spinner.stop();
		return false;
	}
	//this.showValidValueIcon(txtID);
	return true;
};
cm.validateDescription = function(descriptionDetails, descriptionSpan) {
	var isValidDescription = true;
	var lenDescription = descriptionDetails.length;
	if (lenDescription > 51200) {
		isValidDescription = false;
		document.getElementById(descriptionSpan).innerHTML = mg.getMsg("E0021");
	}
	return isValidDescription;
};

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

// This method checks idle time
// Check 5 minutes before session expires
cm.setIdleTime = function() {
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
      cm.refreshToken().done(function(data) {
          cm.user.access_token = data.access_token;
          cm.user.refresh_token = data.refresh_token;
          sessionStorage.setItem("sessionData", JSON.stringify(cm.user));
      });
  }
};
cm.changePassCheck = function(newpass, confirm) {
  if (newpass === confirm) {
    $('#confirmMessage').html("");
    cm.changePass(newpass);
  } else {
    $('#confirmMessage').html(mg.getMsg("E0002"));
  }
};

// API
cm.refreshToken = function() {
    return $.ajax({
        type: "POST",
        url: cm.user.cellUrl + '__auth',
        processData: true,
        dataType: 'json',
        data: {
               grant_type: "refresh_token",
               refresh_token: cm.user.refresh_token
        },
        headers: {'Accept':'application/json'}
    })
}
//cm.getTargetToken = function(extCellUrl) {
//  return $.ajax({
//                type: "POST",
//                url: cm.user.cellUrl + '__auth',
//                processData: true,
//		dataType: 'json',
//                data: {
//                        grant_type: "password",
//                        username: cm.user.userName,
//			password: cm.user.pass,
//                        dc_target: extCellUrl
//                },
//		headers: {'Accept':'application/json'}
//         });
//};
cm.getTargetToken = function(extCellUrl) {
  return $.ajax({
                type: "POST",
                url: cm.user.cellUrl + '__auth',
                processData: true,
		dataType: 'json',
                data: {
                        grant_type: "refresh_token",
                        refresh_token: cm.user.refresh_token,
                        dc_target: extCellUrl
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
cm.retrieveCollectionAPIResponse = function(json) {
  $.ajax({
    type: "PUT",
    url: cm.user.cellUrl + '__/profile.json',
    data: JSON.stringify(json),
    dataType: 'json',
    headers: {'Accept':'application/json',
              'Authorization':'Bearer ' + cm.user.access_token}
  }).done(function(data) {
    $('#modal-edit-profile').modal('hide');
    cm.user.profile.Image = cm.imgBinaryFile;
    cm.user.profile.DisplayName = json.DisplayName;
    cm.user.profile.Description = json.Description;
    cm.editProfileHeaderMenu();
    sessionStorage.setItem("sessionData", JSON.stringify(cm.user));
  }).fail(function(){
    alert("fail");
  });
};
cm.editProfileHeaderMenu = function() {
    $("#imProfilePicture").attr('src', cm.imgBinaryFile);
    $("#tProfileDisplayName").html(cm.user.profile.DisplayName);
}

// APP
//cm.execApp = function(schema,boxName) {
//    $.ajax({
//        type: "GET",
//        url: schema + "__/launch.json",
//        headers: {
//            'Authorization':'Bearer ' + cm.user.access_token,
//            'Accept':'application/json'
//        }
//    }).done(function(data) {
//        var type = data.type;
//        var launch = data[type];
//        var target = cm.user.cellUrl + boxName;
//        refreshToken().done(function(data) {
//            switch (type) {
//                case "web":
//                    var url = launch;
//                    url += '#target=' + target;
//                    url += '&token=' + data.access_token;
//                    url += '&ref=' + data.refresh_token;
//                    url += '&expires=' + data.expires_in;
//                    url += '&refexpires=' + data.refresh_token_expires_in;
//                    window.open(url);
//                    break;
//            }
//        });
//    });
//};
cm.execApp = function(schema,boxName) {
    var childWindow = window.open('about:blank');
    $.ajax({
        type: "GET",
        url: schema + "__/launch.json",
        headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
        }
    }).done(function(data) {
        var type = data.type;
        var launch = data[type];
        var target = cm.user.cellUrl + boxName;
        cm.refreshToken().done(function(data) {
            switch (type) {
                case "web":
                    var url = launch;
                    url += '#target=' + target;
                    url += '&token=' + data.access_token;
                    url += '&ref=' + data.refresh_token;
                    url += '&expires=' + data.expires_in;
                    url += '&refexpires=' + data.refresh_token_expires_in;
                    childWindow.location.href = url;
                    childWindow = null;
                    break;
            }
        });
    }).fail(function(data) {
        childWindow.close();
        childWindow = null;
    });
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