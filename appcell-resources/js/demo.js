var demo = {};
var demoSession = {};

demo.showModal = function(id) {
  if (!demoSession || !demoSession.demoend) {
    $(id).modal('show');
  }
};

demo.initTarget = function() {
  $('#errorCellUrl').html("");
  lg.targetCellLogin("");

  demoSession = JSON.parse(sessionStorage.getItem("demoSession"));
  if (!demoSession || !demoSession.demoend) {
     $('#modal-demo-start').modal('show');
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

  if (!demoSession.social && !demoSession.sideMenu) {
      demo.showModal('#modal-logined-start');
  } else if (demoSession.social && !demoSession.sideMenu) {
      demo.showModal('#modal-socialed-start');
  } else if (!demoSession.social && demoSession.sideMenu) {
      //$('#modal-menued-start').modal('show');
  } else {
      demo.showModal('#modal-logout-start');
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
  $('#b-application-start-ok').on('click', function () {
     $('#modal-application-start').modal('hide');
  });
  $('#b-applicationlist-start-ok').on('click', function () {
     $('#modal-applicationlist-start').modal('hide');
  });
  $('#b-installed-start-ok').on('click', function () {
     $('#modal-installed-start').modal('hide');
  });
  $('#b-sidemenu-start-ok').on('click', function () {
     $('#modal-sidemenu-start').modal('hide');
     demo.showModal('#modal-application-start');
  });
  $('#b-logout-start-ok').on('click', function () {
     $('#modal-logout-start').modal('hide');
     demoSession.demoend = true;
     sessionStorage.setItem("demoSession", JSON.stringify(demoSession));
  });
  $('#dvOverlay').on('click', function() {
     $(".overlay").removeClass('overlay-on');
     $(".slide-menu").removeClass('slide-on');
     demoSession.sideMenu = true;
     sessionStorage.setItem("demoSession", JSON.stringify(demoSession));
     if (!demoSession.social && !demoSession.sideMenu) {
         demo.showModal('#modal-logined-start');
     } else if (demoSession.social && !demoSession.sideMenu) {
         demo.showModal('#modal-socialed-start');
     } else if (!demoSession.social && demoSession.sideMenu) {
         //$('#modal-menued-start').modal('show');
     } else {
         demo.showModal('#modal-logout-start');
     }
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
    var html = '<div class="header-rightside">';
    html += '<table class="list-inline table-fixed">';
    html += '<tr><td rowspan="2" class="profile-header">';
    html += '<img class="icon-profile" id="imProfilePicture" src="' + cm.imgBinaryFile + '" alt="user">';
    html += '</td><td width="70%" class="sizeBody1">';
    html += '<span id="tProfileDisplayName">' + cm.user.profile.DisplayName + '</span>';
    //html += '</td><td width="30%">&nbsp;</td>';
    html += '</td><td rowspan="2" style="text-align:right;"><a onClick="demo.openSlide();">';
    html += '<img src="https://demo.personium.io/HomeApplication/__/icons/ico_menu.png">';
    //html += '<p class="headerAccountNameText">' + cm.user.userName + '</p>';
    //html += '<p class="headerAccountNameText">aiueokakikukekosasisuseso</p>Бе';
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
            var html = cm.user.userName + 'Бе';

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
                $clone.html(html + '...Бе');
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
};

demo.createApplicationList = function() {
    $("#setting-panel1").remove();
    cm.setBackahead(true);
    var html = '<div class="panel-body"><table><tr><td>installed<div id="insAppList"></div></td></tr><tr><td><hr>application list<div id="appList"></div></td></tr></div>';
    $("#setting-panel1").append(html);
    // install application list
    cm.getBoxList().done(function(data) {
        var insAppRes = data.d.results;
        insAppRes.sort(function(val1, val2) {
            return (val1.Name < val2.Name ? 1 : -1);
        })
        st.insAppList = new Array();
        st.insAppBoxList = new Array();

        if (demoSession.insApp) {
            for (var i in insAppRes) {
                var schema = insAppRes[i].Schema;
                if (schema && schema.length > 0) {
                    st.insAppList.push(schema);
                    st.insAppBoxList.push(insAppRes[i].Name);
                }
            }
            st.dispInsAppListSetting();
        }

        // application list
        st.getApplicationList().done(function(data) {
            st.dispApplicationList(data);
            $(".setting-menu").toggleClass('slide-on');
            cm.setTitleMenu(mg.getMsg("00039"), true);
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
            demo.showModal('#modal-installed-start');
        }).fail(function(data) {
            alert(data);
        });
    });
};