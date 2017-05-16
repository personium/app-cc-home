var demo = {};
var demoSession = {};

demo.showModal = function(id) {
  if (!demoSession || !demoSession.demoend) {
    $(id).modal('show');
  }
};

demo.initAppMarket = function() {
  demoSession = JSON.parse(sessionStorage.getItem("demoSession"));
  demo.showModal("#modal-applicationlist-start");

  am.createTitleHeader();
  cm.createSideMenu();
  cm.createBackMenu("main.html");
  cm.setTitleMenu(mg.getMsg("00050"));
  demo.initSettings();
  $("#dashboard").append('<div class="panel list-group toggle-panel" id="toggle-panel1"></div>');

  demo.createApplicationList();
  // menu-toggle
  $(".appInsMenu").css("display", "none");
  $("#appInsToggle.toggle").on("click", function() {
    $(this).toggleClass("active");
    $(".appInsMenu").slideToggle();
  });

  $('#b-applicationlist-start-ok').on('click', function () {
     $('#modal-applicationlist-start').modal('hide');
  });
};

demo.initTarget = function() {
  $('#errorCellUrl').html("");
  lg.targetCellLogin("");

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
     $("#pCellUrl").val("https://demo.personium.io/democell/")
  });
  $('#modal-input-cell').on('hidden.bs.modal', function() {
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

demo.initMain = function() {
  demoSession = JSON.parse(sessionStorage.getItem("demoSession"));

  if (!demoSession.insApp) {
      demo.showModal('#modal-logined-start');
  } else {
      demo.showModal('#modal-installed-start');
  }

  $('#b-logined-start-ok').on('click', function () {
     $('#modal-logined-start').modal('hide');
  });
  $('#b-socialed-start-ok').on('click', function () {
     $('#modal-socialed-start').modal('hide');
  });
  $('#b-menued-start-ok').on('click', function () {
     $('#modal-menued-start').modal('hide');
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
     $(".overlay").removeClass('overlay-on');
     $(".slide-menu").removeClass('slide-on');
     demo.showModal('#modal-appmarket-start');
     demoSession.moveAppMarket = true;
  });
  $('#b-appmarket-start-ok').on('click', function () {
     $('#modal-appmarket-start').modal('hide');
  });
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
    html += '<a class="allToggle" href="#" data-toggle="modal" data-target="#modal-edit-profile">';
    html += '<img class="icon-profile" id="imProfilePicture" src="' + cm.imgBinaryFile + '" alt="user">';
    html += '</a>';
    html += '</div>';
    html += '<div class="header-body">';
    html += '<div id="tProfileDisplayName" class="sizeBody">' + cm.user.profile.DisplayName + '</div>';
    html += '<div class="sizeCaption">' + mg.getMsg("00028") + ': ' + cm.user.userName +  '</div>';
    html += '</div>';
    html += '<a href="#" onClick="demo.openSlide();">';
    html += '<img src="https://demo.personium.io/HomeApplication/__/icons/ico_menu.png">';
    html += '</a>';
    $(".profile-menu").html(html);

    // Processing when resized
    $(window).on('load resize', function(){
        $('.headerAccountNameText').each(function() {
            var $target = $(this);

            // get a account name
            var html = cm.user.userName + '��';

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
                $clone.html(html + '...��');
            }

            $target.html($clone.html());
            $clone.remove();
        });
    });
}

demo.openSlide = function() {
    $(".overlay").toggleClass('overlay-on');
    $(".slide-menu").toggleClass('slide-on');
    if (!demoSession.sideMenu) {
        demo.showModal('#modal-sidemenu-start');
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
    cm.createTitleHeader(true);
    // Create Back Button
    cm.createBackMenu("main.html", true);
    // Set Title
    cm.setTitleMenu(mg.getMsg("00001"), true);
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

    $("#modal-confirmation").on("hidden.bs.modal", function () {
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
    html += '<tr>';
    html += '<td rowspan="2" class="sidemenu-itemEmpty">&nbsp;</td>';
    html += '<td valign="middle" class="sidemenu-item sizeBody1"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-edit-profile">' + itemName.EditProf + '</a></td>';
    html += '</tr><tr>';
    html += '<td class="sidemenu-lastitem sizeBody1"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-change-password">' + itemName.ChgPass + '</a></td>';
    html += '</tr><tr>';
    html += '</tr></table>';

    // setting menu
    html += '<table class="menu-title"><tr>';
    html += '<td rowspan="4" class="sidemenu-itemEmpty">&nbsp;</td>';
    html += '<td class="sidemenu-item sizeBody1"><a class="allToggle" id="accountToggle" href="#">' + mg.getMsg("00028") + '</a></td></tr>';
    html += '<tr><td class="sidemenu-item sizeBody1"><a class="allToggle" id="applicationToggle" href="#">' + mg.getMsg("00039") + '</a></td></tr>';
    html += '<tr><td class="sidemenu-item sizeBody1"><a class="allToggle" id="roleToggle" href="#">' + mg.getMsg("00032") + '</a></td></tr>';
    html += '<tr><td class="sidemenu-lastitem sizeBody1"><a class="allToggle" id="relationToggle" href="#">' + mg.getMsg("00033") + '</a></td></tr>';
    html += '</table>';

    // log out
    html += '<table class="menu-title"><tr>';
    html += '<td rowspan="4" class="sidemenu-itemEmpty">&nbsp;</td>';
    html += '<td class="sidemenu-item sizeBody1"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-logout">' + itemName.Logout + '</a></td>';
    html += '</tr></table></div>';
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
           '<button type="button" class="close" data-dismiss="modal">�~</button>' +
           '<h4 class="modal-title">' + itemName.Logout + '</h4>' +
           '</div>' +
           '<div class="modal-body">' +
           mg.getMsg("I0002") +
           '</div>' +
           '<div class="modal-footer">' +
           '<button type="button" class="btn btn-default" data-dismiss="modal">' + mg.getMsg("00045") + '</button>' +
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

    // Time Out Set
    cm.setIdleTime();
}

demo.createApplicationList = function() {
    $("#dashboard").empty();
    $("#dashboard").append('<div class="panel list-group toggle-panel" id="toggle-panel1"></div>');
    var html = '<div class="panel-body" id="app-panel"><section class="dashboard-block" id="installed-app"><h2>' + mg.getMsg("00047") + '</h2><div id="insAppList1"></div></section><section class="dashboard-block" id="all-app"><h2>' + mg.getMsg("00048") + '</h2><div id="appList1"></div></section></div>';
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

demo.execApp = function(schema,boxName) {
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
        cm.refreshTokenAPI().done(function(data) {
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
                    if (launch.indexOf('MyBoard')) {
                        demoSession.sideMenu = true;
                        sessionStorage.setItem("demoSession", JSON.stringify(demoSession));
                        demo.showModal('#modal-logout-start');
                    }
                    break;
            }
        });
    }).fail(function(data) {
        childWindow.close();
        childWindow = null;
    });
};