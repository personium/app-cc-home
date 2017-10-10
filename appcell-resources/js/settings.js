var st = {};
st.updUser = null;
st.insAppList = new Array();
st.insAppBoxList = new Array();
st.nowInstalledID = null;

var testProgPar = 0;

// 初期処理
st.initSettings = function() {
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

    $('#b-edit-accconfirm-ok').on('click', function () { 
        st.sendAjaxEditAccount();
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
    $('#b-ins-bar-ok').on('click', function() { st.execBarInstall(); });

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
    $("#applicationToggle").on("click", function () {
        return false;
      //st.createApplicationList();
      //testAPI();
    });
    $("#roleToggle").on("click", function() {
      st.createRoleList();
    });
    $("#relationToggle").on("click", function() {
      st.createRelationList();
    });
    
    st.setBizTheme();
};

st.setBizTheme = function() {
    let cellType = (JSON.parse(sessionStorage.getItem("myProfile")).CellType || "Person");
    if (cellType == "Organization") {
        $('header').addClass('header-biz');
        $('.header-menu').addClass('header-menu-biz');
    }
    $('body > div.mySpinner').hide();
    $('body > div.myHiddenDiv').show();
};

// ファイルパスからファイル名を取得する
st.getName = function(path) {
  var collectionName = path;
  var recordsCount = 0;
  if (collectionName != undefined) {
          recordsCount = collectionName.length;
          var lastIndex = collectionName.lastIndexOf("/");
          if (recordsCount - lastIndex === 1) {
                  collectionName = path.substring(0, recordsCount - 1);
                  recordsCount = collectionName.length;
                  lastIndex = collectionName.lastIndexOf("/");
          }
          collectionName = path.substring(lastIndex + 1, recordsCount);
  }
  return collectionName;
};

// スライドアニメーションクラスの付与
st.slideToggle = function(id) {
    $("#" + id).slideToggle();
}

// アカウントにロールを割り当てる際、ロールが選択されているかチェックする
st.checkAccLinkRole = function() {
    var value = $("#ddlAddAccLinkRoleList option:selected").val();
    if (value === undefined) {
        $("#popupAddAccountLinkRoleErrorMsg").html(i18next.t("selectRole"));
        return false;
    } else {
        $("#popupAddAccountLinkRoleErrorMsg").html("");
        //cm.setLinkParam(value);
        return true;
    }
};

/////////////
// Account //
/////////////
// アカウントリストの作成
st.createAccountList = function() {
    $("#setting-panel1").remove();
    cm.setBackahead(true);
    st.getAccountList().done(function(data) {
        st.dispAccountList(data);
        $(".setting-menu").toggleClass('slide-on');
        cm.setTitleMenu("Account", true);
    });
};
// アカウントリストの取得
st.getAccountList = function() {
  return $.ajax({
          type: "GET",
          url:cm.user.cellUrl + '__ctl/Account',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  })
}
// アカウントリストの表示
st.dispAccountList = function(json) {
  $("#setting-panel1").empty();
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })
  var html = '<div class="panel-body">';
  for (var i in results) {
    var acc = json.d.results[i];
    var type = acc.Type;
    var typeImg = "https://demo.personium.io/HomeApplication/__/icons/ico_user_00.png";
    if (type !== "basic") {
        typeImg = "https://demo.personium.io/HomeApplication/__/icons/ico_user_01.png";
    }

    html += '<div class="list-group-item">';
    html += '<table style="width: 100%;"><tr>';
    html += '<td style="width: 80%;"><a href="#" class="ellipsisText" id="accountLinkToRoleToggle' + i + '" onClick="st.createAccountRole(\'' + acc.Name + '\',\'' + i + '\')">' + acc.Name + '&nbsp;<img class="image-circle-small" src="' + typeImg + '"></a></td>';
    if (acc.Name !== cm.user.username) {
        html += '<td style="margin-right:10px;width: 10%;"><a class="edit-button list-group-item" href="#" onClick="st.createEditAccount(\'' + acc.Name + '\');return(false)">' + i18next.t("Edit") + '</a></td>'
             + '<td style="width: 10%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelModal(\'' + acc.Name + '\');return(false)">' + i18next.t("Del") + '</a></td>';
    }
    html += '</tr></table></div>';
  }
  html += '<div class="list-group-item">';
  html += '<a href="#" class="allToggle" onClick="st.createAddAccount()" data-i18n="CreateAccountPlus"></a></div>';
  html += '</div>';
  $("#setting-panel1").append(html).localize();
}
// 割り当て先アカウント名設定
st.setLinkAccName = function(accName, no) {
  st.linkAccName = accName;
  st.linkAccNameNo = no;
}
// アカウント追加画面作成
st.createAddAccount = function() {
    $("#setting-panel2").empty();
    cm.setBackahead(true);
    cm.getRoleList().done(function(data) {
        var html = '<div class="modal-body">';
        html += '<div id="dvAddName">' + i18next.t("Name") + '</div>';
        html += '<div id="dvTextAddName" style="margin-bottom: 10px;">';
        html += '<input type="text" id="addAccountName" onblur="st.addAccountNameBlurEvent();">';
        html += '<span class="popupAlertArea" style="color:red">';
        html += '<aside id="popupAddAccountNameErrorMsg"> </aside>';
        html += '</span></div>';
        html += '<div id="dvAddPassword">' + i18next.t("Password") + '</div>';
        html += '<div id="dvTextAddNewPassword" style="margin-bottom: 10px;">';
        html += '<input type="password" placeholder="' + i18next.t("newPassPlaceHolder") + '" id="pAddNewPassword" onblur="st.blurNewPassword(this, \'b-add-account-ok\', \'addChangeMessage\');">';
        html += '<span class="popupAlertArea" style="color:red">';
        html += '<aside id="addChangeMessage"> </aside>';
        html += '</span></div>';
        html += '<div id="dvAddConfirm">' + i18next.t("confirmNewPass") + '</div>';
        html += '<div id="dvTextAddConfirm" style="margin-bottom: 10px;">';
        html += '<input type="password" placeholder="' + i18next.t("confirmNewPass") + '" id="pAddConfirm" onblur="st.blurConfirm(\'pAddNewPassword\', \'pAddConfirm\', \'addConfirmMessage\');">';
        html += '<span class="popupAlertArea" style="color:red">';
        html += '<aside id="addConfirmMessage"> </aside>';
        html += '</span></div>';
        html += '<div id="dvCheckAddAccountLinkRole" style="margin-bottom: 10px;">';
        html += '<label><input class="widthAuto" type="checkbox" id="addCheckAccountLinkRole" onChange="st.changeCheckAccountLinkRole(this);">' + i18next.t("AssignRoleMulti") + '</label>';
        html += '</div>';
        html += '<div id="dvSelectAddAccountLinkRole" style="margin-bottom: 10px;">';
        html += '<select class="form-control" name="" id="ddlAddAccLinkRoleList" onblur="st.checkAccLinkRole();" multiple disabled><option>Select a role</option></select>';
        html += '<span class="popupAlertArea" style="color:red"><aside id="popupAddAccountLinkRoleErrorMsg"> </aside></span>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">' + i18next.t("Cancel") + '</button>';
        html += '<button type="button" class="btn btn-primary" id="b-add-account-ok" onClick="st.addAccount();">' + i18next.t("Create") + '</button>';
        html += '</div></div>';
        $("#setting-panel2").append(html);
        cm.dispRoleList(data, "ddlAddAccLinkRoleList", true);
    });
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu("CreateAccount", true);
};
// 登録パスワードチェック
st.blurNewPassword = function(obj, btnId, msgId) {
    var bool = st.charCheck($(obj), msgId);
    $('#' + btnId).prop('disabled', !bool);
};
// 確認パスワード一致確認
st.blurConfirm = function(pwid, cnid, msgid) {
    st.changePassCheck($("#" + pwid).val(), $("#" + cnid).val(), msgid);
};
// アカウント作成時、ロール割り当て選択時処理
st.changeCheckAccountLinkRole = function(obj) {
    if (obj.checked) {
        $("#ddlAddAccLinkRoleList").val("");
        $("#ddlAddAccLinkRoleList").prop('disabled', false);
    } else {
        $("#ddlAddAccLinkRoleList").val("");
        $("#popupAddAccountLinkRoleErrorMsg").html("");
        $("#ddlAddAccLinkRoleList").prop('disabled', true);
    }
};
// アカウント割り当てロール一覧作成
st.createAccountRole = function(accName, no) {
  st.setLinkAccName(accName, no);
  $("#setting-panel2").remove();
  cm.setBackahead(true);
  st.getAccountRoleList(accName, no).done(function(data) {
      st.dispAccountRoleList(data, accName, no);
      $("#setting-panel2").toggleClass('slide-on');
      $("#setting-panel1").toggleClass('slide-on-holder');
      cm.setTitleMenu(accName, true);
  });
}
// アカウント割り当てロール一覧取得
st.getAccountRoleList = function(accName, no) {
  return $.ajax({
          type: "GET",
          url:cm.user.cellUrl + '__ctl/Account(Name=\'' + accName + '\')/$links/_Role',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  })
}
// アカウント割り当てロール一覧表示
st.dispAccountRoleList = function(json, accName, no) {
  $("#setting-panel2").empty();
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })
  var html = '<div class="panel-body">';
  for (var i in results) {
    var acc = json.d.results[i];
    var url = acc.uri;
    var matchName = url.match(/\(Name='(.+)',/);
    var name = matchName[1];
    var matchBox = url.match(/_Box\.Name='(.+)'/);
    var boxName = "";
    if (matchBox != null) {
      boxName = matchBox[1];
    } else {
      boxName = "[main]";
    }
    html += '<div class="list-group-item">';
    html += '<table class="table-fixed"><tr>';
    html += '<td style="width: 85%;"><p class="ellipsisText">' + name + '(' + boxName + ')</p></td>';
    html += '<td colspan="2" style="width: 15%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelAccountRoleModal(\'' + accName + '\',\'' + name + '\',\'' + boxName + '\',\'' + no + '\');return(false)">' + i18next.t("Detach") + '</a></td>';
    html += '</tr>';
    html += '</table></div>';
  }
  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="cm.dispAssignRole(\'acc\', true)" data-i18n="AssigningRolesPlus"></a></div>';
  html += '</div>';
  $("#setting-panel2").append(html).localize();
}
st.dispDelAccountRoleModal = function(accName, roleName, boxName, no) {
    st.linkAccName = accName;
    cm.linkName = roleName;
    if (boxName === "[main]") {
      cm.linkBoxName = null;
    } else {
      cm.linkBoxName = boxName
    }
    st.linkAccNameNo = no;
    $("#dvTextConfirmation").html(i18next.t("removeAssociationRole", {value1:roleName, value2:boxName})).localize();
    $("#modal-confirmation-title").html(i18next.t("DeleteAssigningRole"));
    $('#b-del-acclinkrole-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
st.createEditAccount = function(name) {
    st.updUser = name;
    $("#setting-panel2").empty();
    cm.setBackahead(true);
    var html = '<div class="modal-body">';
    html += '<div id="dvEditName">' + i18next.t("Name") + '</div>';
    html += '<div id="dvTextEditName" style="margin-bottom: 10px;"><input type="text" id="editAccountName" onblur="st.editAccountNameBlurEvent();" value="' + name + '"><span class="popupAlertArea" style="color:red"><aside id="popupEditAccountNameErrorMsg"> </aside></span></div>';
    html += '<div id="dvEditPassword">' + i18next.t("Password") + '</div>';
    html += '<div id="dvTextEditNewPassword" style="margin-bottom: 10px;"><input type="password" placeholder="' + i18next.t("newPassPlaceHolder") + '" id="pEditNewPassword" onblur="st.blurNewPassword(this, \'b-edit-account-ok\', \'editChangeMessage\');"><span class="popupAlertArea" style="color:red"><aside id="editChangeMessage"> </aside></span></div>';
    html += '<div id="dvTextEditConfirm" style="margin-bottom: 10px;"><input type="password" placeholder="' + i18next.t("confirmNewPass") + '" id="pEditConfirm" onblur="st.blurConfirm(\'pEditNewPassword\', \'pEditConfirm\', \'editConfirmMessage\');"><span class="popupAlertArea" style="color:red"><aside id="editConfirmMessage"> </aside></span></div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">' + i18next.t("Cancel") + '</button>';
    html += '<button type="button" class="btn btn-primary text-capitalize" id="b-edit-account-ok" onClick="st.validateEditedInfo();" disabled>' + i18next.t("Edit") + '</button>';
    html += '</div></div>';
    $("#setting-panel2").append(html);
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu("EditAccount", true);
};
st.sendAjaxEditAccount = function() {
    var keyName = st.updUser;
    var jsonData = {
                    "Name" : $("#editAccountName").val()
    };

    st.restEditAccountAPI(jsonData, $("#pEditNewPassword").val(), keyName);
    return true;
};
st.dispDelModal = function(name) {
    st.updUser = name;
    $("#dvTextConfirmation").html(i18next.t("confirmDeleteAccount", {value: name}));
    $('#modal-confirmation-title').html(i18next.t("DeleteAccount"));
    $('#b-del-account-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
st.dispBoxList = function(json, id) {
  var objSel = document.getElementById(id);
  if (objSel.hasChildNodes()) {
    while (objSel.childNodes.length > 0) {
      objSel.removeChild(objSel.firstChild);
    }
  }

  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })
  $("#" + id).append('<option value="">' + i18next.t("selectBox") + '</option>');
  $("#" + id).append('<option value="[main]">[main]</option>');
  for (var i in results) {
    var objBox = json.d.results[i];
    var boxName = objBox.Name;
    $("#" + id).append('<option value="' + boxName + '">' + boxName + '</option>');
  }
}
st.addAccountNameBlurEvent = function() {
        var name = $("#addAccountName").val();
        var nameSpan = "popupAddAccountNameErrorMsg";
        st.validateName(name, nameSpan, "-_!\$\*=^`\{\|\}~.@", "")
};
st.editAccountNameBlurEvent = function() {
        var name = $("#editAccountName").val();
        var nameSpan = "popupEditAccountNameErrorMsg";
        $('#b-edit-account-ok').prop('disabled', !st.validateName(name, nameSpan, "-_!\$\*=^`\{\|\}~.@", ""));
};
st.addAccount = function() {
  var name = $("#addAccountName").val();
  if (st.validateName(name, "popupAddAccountNameErrorMsg", "-_!\$\*=^`\{\|\}~.@", "")) {
    var pass = $("#pAddNewPassword").val();
    if (st.passInputCheck(pass, "addChangeMessage")
     && st.changePassCheck(pass, $("#pAddConfirm").val(), "addConfirmMessage")) {
        var jsonData = {
                        "Name" : name
        };

        // Assigning Roles
        var chkObj = document.getElementById("addCheckAccountLinkRole");
        if (chkObj.checked) {
          if (st.checkAccLinkRole()) {
            st.linkAccName = name;
            st.restCreateAccountAPI(jsonData, pass);
            return true;
          }
        } else {
          st.restCreateAccountAPI(jsonData, pass);
          return true;
        }
    }
  }

  return false;
};
st.validateEditedInfo = function() {
  var name = $("#editAccountName").val();
  if (st.validateName(name, "popupEditAccountNameErrorMsg", "-_!\$\*=^`\{\|\}~.@", "")) {
    var pass = $("#pEditNewPassword").val();
    if (st.passInputCheck(pass, "editChangeMessage")
     && st.changePassCheck(pass, $("#pEditConfirm").val(), "editConfirmMessage")) {
        $('#dvTextConfirmation').html(i18next.t("confirmChangeContentEnter"));
        $('#modal-confirmation-title').html(i18next.t("EditAccount"));
        $('#b-edit-accconfirm-ok').css("display","");
        $('#modal-confirmation').modal('show');
    }
  }

  return false;
}

// Application
st.createApplicationList = function() {
    $("#setting-panel1").remove();
    cm.setBackahead(true);
    var html = '<div class="panel-body" id="app-panel"><section class="dashboard-block" id="installed-app"><h2>' + i18next.t("Installed") + '</h2><div id="insAppList"></div></section><section class="dashboard-block" id="all-app"><h2>' + i18next.t("ApplicationList") + '</h2><div id="appList"></div></section></div>';
    $("#setting-panel1").append(html);
    // install application list
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
            $(".setting-menu").toggleClass('slide-on');
            cm.setTitleMenu("Application", true);
        }).fail(function(data) {
            alert(data);
        });
    });
};
st.getApplicationList = function() {
    return $.ajax({
            type: "GET",
            url: cm.getAppListURL(),
            datatype: 'json',
            headers: {
              'Accept':'application/json'
            }
    })
};
st.dispInsAppListSetting = function() {
    $("#insAppList").empty();
    st.nowInstalledID = null;
    for (var i in st.insAppList) {
        st.dispInsAppListSchemaSetting(st.insAppList[i], st.insAppBoxList[i], i);
    }

    if (typeof(ha) != "undefined") {
        ha.dispInsAppList();
    }
};
st.dispInsAppListSchemaSetting = function(schema, boxName, no) {
    cm.getProfile(schema).done(function(profData) {
        var dispName = profData.DisplayName;
        var imageSrc = cm.notAppImage;
        if (profData.Image) {
            imageSrc = profData.Image;
        }
        cm.getBoxStatus(boxName).done(function(data) {
            var status = data.status;
            var html = '';
            if (status.indexOf('ready') >= 0) {
                // ready
                html = '<a href="#" id="insAppNo_' + no + '" class="ins-app-icon" onClick="uninstallApp(\'' + schema + '\', \'' + boxName + '\')"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name">' + dispName + '</div>';
            } else if (status.indexOf('progress') >= 0) {
                // progress
                html = '<a href="#" id="insAppNo_' + no + '" class="ins-app-icon"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name">' + dispName + '</div><div id="nowInstallParent_' + no + '" class="progress progress-striped active"><div name="nowInstall" id="nowInstall_' + no + '" class="progress-bar progress-bar-success" style="width: ' + data.progress + ';"></div></div>';
                if (st.nowInstalledID === null) {
                    st.nowInstalledID = setInterval(st.checkBoxInstall, 1000);
                }
            } else {
                // failed
                html = '<a href="#" class="ins-app-icon"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name">' + dispName + '(<font color="red"> ! </font>)</div>';
            }
            $("#insAppList").append('<a class="ins-app" id="ins-app-' + no + '"></a>');
            var insAppId = 'ins-app-' + no;
            $('#' + insAppId).append(html);
        });
    });
};
st.dispApplicationList = function(json) {
    $("#appList").empty();
    var results = json.Apps;
    results.sort(function(val1, val2) {
      return (val1.SchemaUrl < val2.SchemaUrl ? 1 : -1);
    })
    for (var i in results) {
      var schema = results[i].SchemaUrl;
      if (st.insAppList.indexOf(schema) < 0) {
          st.dispApplicationListSchema(results[i],i);
      }
    }
};
st.dispApplicationListSchema = function(schemaJson, no) {
    var schema = schemaJson.SchemaUrl;
    cm.getProfile(schema).done(function(profData) {
        var dispName = profData.DisplayName;
        var description = profData.Description;
        var imageSrc = cm.notAppImage;
        if (profData.Image) {
            imageSrc = profData.Image;
        }
        $("#appList").append('<a class="p-app" id="p-app-' + no + '"></a>');
        var pAppId = 'p-app-' + no;
        var html = '<a href="#" class="ins-app-icon" onClick="st.dispViewApp(\'' + schema + '\',\'' + dispName + '\',\'' + imageSrc + '\',\'' + description + '\',\'' + schemaJson.BarUrl + '\',\'' + schemaJson.BoxName + '\',true)"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div class="ins-app-name">' + dispName + '</div>';
        $('#' + pAppId).append(html);
   });
};
st.dispViewApp = function(schema, dispName, imageSrc, description, barUrl, barBoxName, insFlag) {
    $("#setting-panel2").empty();
    cm.setBackahead(true);
    var html = '<div class="panel-body">';
    html += '<div class="app-info"><div class="app-icon"><img src="' + imageSrc + '"></div><div class="app-data"><div>' + dispName + '</div><div>提供元：</div></div></div><section class="detail-section"><h2>概要</h2><div class="overview">' + description + '</div>';
    if (insFlag) {
        html += '<div class="app-install"><button class="round-btn"href="#" onClick="st.confBarInstall(\'' + schema + '\',\'' + barUrl + '\',\'' + barBoxName + '\', \'' + dispName + '\');return(false);">' + i18next.t("Install") + '</button></div></section>';
    } else {
        html += '<div class="app-install"><button class="round-btn"href="#" onClick="return(false);">' + i18next.t("Uninstall") + '</button></div></section>';
    }

    $("#setting-panel2").append(html);
    cm.setTitleMenu("Details", true);
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
};
st.confBarInstall = function(schema, barUrl, barBoxName, dispName) {
    st.barSchemaUrl = schema;
    st.barFileUrl = barUrl;
    st.barBoxName = barBoxName;
    $("#dvTextConfirmation").html(i18next.t("confirmInstallation"));
    //$("#modal-confirmation-title").html(dispName);
    $("#modal-confirmation-title").attr("data-i18n", dispName).localize();
    $('#b-ins-bar-ok').css("display","");
    $('#modal-confirmation').modal('show');
};
st.execBarInstall = function() {
    var barFilePath = st.barSchemaUrl + st.barFileUrl;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", barFilePath);
    oReq.responseType = "arraybuffer";
    oReq.setRequestHeader("Content-Type", "application/zip");
    oReq.onload = function(e) {
        var arrayBuffer = oReq.response;
        var view = new Uint8Array(arrayBuffer);
        var blob = new Blob([view], {"type":"application/zip"});
        $.ajax({
            type: "MKCOL",
            url: cm.user.cellUrl + st.barBoxName + '/',
            data: blob,
            processData: false,
            headers: {
                'Authorization':'Bearer ' + cm.user.access_token,
                'Content-type':'application/zip'
            }
        }).done(function(data) {
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
        }).fail(function(data) {
            var res = JSON.parse(data.responseText);
            alert("An error has occurred.\n" + res.message.value);
        });
    }
    oReq.send();
};

// Role
st.createRoleList = function() {
    $("#setting-panel1").remove();
    cm.setBackahead(true);
    cm.getRoleList().done(function(data) {
        st.dispRoleList(data);
        $(".setting-menu").toggleClass('slide-on');
        cm.setTitleMenu("Role", true);
    });
};
st.dispRoleList = function(json) {
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })

  var html = "";
  $("#setting-panel1").empty();
  html += '<div class="panel-body">';
  for (var i in results) {
    var objRole = json.d.results[i];
    var boxName = objRole["_Box.Name"];
    if (boxName === null) {
      boxName = "[main]";
    }

    // role list
    html += '<div class="list-group-item">';
    html += '<table class="table-fixed"><tr>';
    html += '<td style="width: 70%;"><p class="ellipsisText">' + objRole.Name + '(' + boxName + ')</p></td>';
    html += '<td style="width: 15%;"><a href="#" class="edit-button list-group-item" href="#" onClick="st.createEditRole(\'' + objRole.Name + '\',\'' + boxName + '\');return(false)">' + i18next.t("Edit") + '</a></td>';
    html += '<td style="width: 15%;"><a href="#" class="del-button list-group-item" href="#" onClick="st.dispDelRoleModal(\'' + objRole.Name + '\',\'' + boxName + '\');return(false)">' + i18next.t("Del") + '</a></td>';
    html += '</tr>';
    html += '</table></div>';
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="st.createAddRole()" data-i18n="CreateRolePlus"></a></div>';
  html += '</div>';
  $("#setting-panel1").append(html).localize();
};
st.createAddRole = function() {
    st.updUser = null;
    st.updBox = null;
    st.operationRole();
};
st.operationRole = function() {
    var name = "";
    if (st.updUser !== null) {
        name = st.updUser;
    }
    $("#setting-panel2").empty();
    cm.setBackahead(true);
    var html = '<div class="modal-body">';
    html += '<div id="dvAddRoleName">' + i18next.t("Name") + '</div>';
    html += '<div id="dvTextAddRoleName" style="margin-bottom: 10px;"><input type="text" id="addRoleName" value="' + name + '" onblur="st.addRoleNameBlurEvent();"><span class="popupAlertArea" style="color:red"><aside id="popupAddRoleNameErrorMsg"> </aside></span></div>';
    html += '<div id="dvAddRoleBox">' + i18next.t("selectBoxRole") + '</div>';
    html += '<div id="dvSelectAddRoleBox" style="margin-bottom: 10px;"><select class="form-control" name="" id="ddlRoleBoxList"><option>' + i18next.t("selectBox") + '</option></select><span class="popupAlertArea" style="color:red"><aside id="addRoleBoxMessage"> </aside></span></div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">' + i18next.t("Cancel") + '</button>';
    if (st.updUser !== null) {
        html += '<button type="button" class="btn btn-primary text-capitalize" id="b-add-role-ok" onClick="st.addRole();">' + i18next.t("Edit") + '</button>';
    } else {
        html += '<button type="button" class="btn btn-primary" id="b-add-role-ok" onClick="st.addRole();" disabled>' + i18next.t("Create") + '</button>';
    }
    
    html += '</div></div>';
    $("#setting-panel2").append(html);
    cm.getBoxList().done(function(data) {
        st.dispBoxList(data, "ddlRoleBoxList", false);
        if (st.updUser !== null) {
            var box = st.updBox;
            if (st.updBox === null) {
                box = "[main]";
            }
            $("#ddlRoleBoxList").val(box);
        }
    });

    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    if (st.updUser !== null) {
        cm.setTitleMenu("EditRole", true);
    } else {
        cm.setTitleMenu("CreateRole", true);
    }
};
st.createEditRole = function(name, box) {
    st.updUser = name;
    if (box === "[main]") {
      st.updBox = null;
    } else {
      st.updBox = box;
    }
    st.operationRole();
}
st.dispDelRoleModal = function(name, box) {
    st.updUser = name;
    if (box === "[main]") {
      st.updBox = null;
    } else {
      st.updBox = box;
    }
    $('#dvTextConfirmation').html(i18next.t("confirmDeleteRole", {value1:name, value2:box}));
    $('#modal-confirmation-title').html(i18next.t("DeleteRole"));
    $('#b-del-role-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
st.addRoleNameBlurEvent = function() {
        var name = $("#addRoleName").val();
        var nameSpan = "popupAddRoleNameErrorMsg";
        $('#b-add-role-ok').prop('disabled', !st.validateName(name, nameSpan, "-_", ""));
};
st.addRole = function() {
  var name = $("#addRoleName").val();
  var box = $("#ddlRoleBoxList option:selected").val();
  if (box === "") {
      $("#addRoleBoxMessage").html(i18next.t("selectBox"));
      return false;
  } else if (box === "[main]") {
      box = null;
  }

  var jsonData = {
                  "Name" : name,
                  "_Box.Name" : box
  };

  if (st.updUser === null) {
      st.restCreateRoleAPI(jsonData);
  } else {
      st.restEditRoleAPI(jsonData);
  }
};

// Relation
st.createRelationList = function() {
    $("#setting-panel1").remove();
    cm.setBackahead(true);
    cm.getRelationList().done(function(data) {
        st.dispRelationList(data, null, false);
        $(".setting-menu").toggleClass('slide-on');
        cm.setTitleMenu("Relation", true);
    });
};
st.dispRelationList = function(json) {
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })
  
  var html = '';
  $("#setting-panel1").empty();
  html += '<div class="panel-body">';

  for (var i in results) {
    var objRelation = json.d.results[i];
    var boxName = objRelation["_Box.Name"];
    if (boxName === null) {
      boxName = "[main]";
    }

    // relation list
    html += '<div class="list-group-item">';
    html += '<table style="width: 100%;"><tr>';
    html += '<td style="width: 80%;"><a href="#" id="relationLinkToRoleToggle' + i + '" onClick="st.createRelationRole(\'' + objRelation.Name + '\',\'' + boxName + '\',\'' + i + '\')">';
    html += '<table class="table-fixed"><tr><td><p class="ellipsisText">' + objRelation.Name + '(' + boxName + ')</p></td></tr></table>';
    html += '</a></td>';
    html += '<td style="width: 10%;"><a class="edit-button list-group-item" href="#" onClick="st.createEditRelation(\'' + objRelation.Name + '\',\'' + boxName + '\');return(false)">' + i18next.t("Edit") + '</a></td>';
    html += '<td style="width: 10%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelRelationModal(\'' + objRelation.Name + '\',\'' + boxName + '\');return(false)">' + i18next.t("Del") + '</a></td>';
    html += '</tr></table></div>';
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="st.createAddRelation()" data-i18n="CreateRelationPlus"></a></div>';
  html += '</div>';
  $("#setting-panel1").append(html).localize();
};
st.setLinkRelName = function(relName, boxName, no) {
    st.linkRelName = relName;
    st.linkRelBoxName = boxName;
    st.linkRelNo = no;
};
st.createAddRelation = function() {
    st.updUser = null;
    $("#setting-panel2").empty();
    cm.setBackahead(true);
    cm.getRoleList().done(function(data) {
        var html = '<div class="modal-body">';
        html += '<div id="dvAddRelationName">' + i18next.t("Name") + '</div>';
        html += '<div id="dvTextAddRelationName" style="margin-bottom: 10px;"><input type="text" id="addRelationName" onblur="st.addRelationNameBlurEvent();"><span class="popupAlertArea" style="color:red"><aside id="popupAddRelationNameErrorMsg"> </aside></span></div>';
        html += '<div id="dvAddRelationBox">' + i18next.t("boxUsedRelation") + '</div>';
        html += '<div id="dvSelectAddRelationBox" style="margin-bottom: 10px;"><select class="form-control" name="ddlRelationBoxList" id="ddlAddRelationBoxList"><option>' + i18next.t("selectBox") + '</option></select><span class="popupAlertArea" style="color:red"><aside id="addRelationBoxMessage"> </aside></span></div>';
        html += '<div id="dvCheckAddRelationLinkRole" style="margin-bottom: 10px;"><label><input  class="widthAuto" type="checkbox" id="addCheckRelationLinkRole" onChange="st.changeCheckRelationLinkRole(this);">' + i18next.t("AssignRoleMulti") + '</label></div>';
        html += '<div id="dvSelectAddRelationLinkRole" style="margin-bottom: 10px;"><select class="form-control" name="" id="ddlAddRelLinkRoleList" multiple disabled><option>Select a role</option></select><span class="popupAlertArea" style="color:red"><aside id="popupAddRelationLinkRoleErrorMsg"> </aside></span></div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">' + i18next.t("Cancel") + '</button>';
        html += '<button type="button" class="btn btn-primary" id="b-add-relation-ok" onClick="st.addRelation();" disabled>' + i18next.t("Create") + '</button>';
        html += '</div></div>';
        $("#setting-panel2").append(html);
        cm.dispRoleList(data, "ddlAddRelLinkRoleList", true);
        cm.getBoxList().done(function(data) {
            st.dispBoxList(data, "ddlAddRelationBoxList", false);
        });
    });
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu("CreateRelation", true);
};
st.addRelationNameBlurEvent = function() {
        var name = $("#addRelationName").val();
        var nameSpan = "popupAddRelationNameErrorMsg";
        $('#b-add-relation-ok').prop('disabled', !st.validateName(name, nameSpan, "-_\+:", "-\+"));
};
st.changeCheckRelationLinkRole = function(obj) {
    $("#ddlAddRelLinkRoleList").prop('disabled', !obj.checked);
};
st.createRelationRole = function(relName, boxName, no) {
    var relBoxName = boxName;
    if (boxName === "[main]") {
      boxName = null;
    }
    st.setLinkRelName(relName, boxName, no);
    $("#setting-panel2").remove();
    cm.setBackahead(true);
    st.getRelationRoleList(relName, boxName, no).done(function(data) {
        st.dispRelationRoleList(data, relName, boxName, no);
        $("#setting-panel2").toggleClass('slide-on');
        $("#setting-panel1").toggleClass('slide-on-holder');
        cm.setTitleMenu(relName + '(' + relBoxName + ')', true);
    });
}
st.getRelationRoleList = function(relName, boxName, no) {
  var uri = cm.user.cellUrl + '__ctl/Relation';
  if (boxName === null) {
     uri += '(\'' + relName + '\')/$links/_Role';
  } else {
     uri += '(Name=\'' + relName + '\',_Box.Name=\'' + boxName + '\')/$links/_Role';
  }
  return $.ajax({
          type: "GET",
          url:uri,
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  })
};
st.dispRelationRoleList = function(json, relName, relBoxName, no) {
  $("#setting-panel2").empty();
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })
  var html = '<div class="panel-body">';
  for (var i in results) {
    var acc = json.d.results[i];
    var url = acc.uri;
    var matchName = url.match(/\(Name='(.+)',/);
    var name = matchName[1];
    var matchBox = url.match(/_Box\.Name='(.+)'/);
    var boxName = "";
    if (matchBox != null) {
      boxName = matchBox[1];
    } else {
      boxName = "[main]";
    }
    html += '<div class="list-group-item">';
    html += '<table style="width: 100%;"><tr>';
    html += '<td style="width: 90%;"><table class="table-fixed"><tr><td><p class="ellipsisText">' + name + '(' + boxName + ')</p></td></tr></table></td>';
    html += '<td style="width: 10%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelRelationRoleModal(\'' + relName + '\',\'' + relBoxName + '\',\'' + name + '\',\'' + boxName + '\',\'' + no + '\');return(false)">' + i18next.t("Detach") + '</a></td>';
    html += '</tr></table></div>';
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="cm.dispAssignRole(\'rel\', true)" data-i18n="AssigningRolesPlus"></a></div>';
  html += '</div>';
  $("#setting-panel2").append(html).localize();
}
st.dispDelRelationRoleModal = function(relName, relBoxName, roleName, boxName, no) {
    st.linkRelName = relName;
    if (relBoxName === "null") {
      st.linkRelBoxName = null;
    } else {
      st.linkRelBoxName = relBoxName;
    }
    cm.linkName = roleName;
    if (boxName === "[main]") {
      cm.linkBoxName = null;
    } else {
      cm.linkBoxName = boxName
    }
    st.linkRelNameNo = no;
    $("#dvTextConfirmation").html(i18next.t("removeAssociationRole", {value1:roleName, value2:boxName})).localize();
    $("#modal-confirmation-title").html(i18next.t("DeleteAssigningRole"));
    $('#b-del-rellinkrole-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
st.createEditRelation = function(name, box) {
    st.updUser = name;
    if (box === "[main]") {
      st.updBox = null;
    } else {
      st.updBox = box;
    }
    $("#setting-panel2").empty();
    cm.setBackahead(true);
    var html = '<div class="modal-body">';
    html += '<div id="dvEditRelationName">' + i18next.t("Name") + '</div>';
    html += '<div id="dvTextEditRelationName" style="margin-bottom: 10px;"><input type="text" id="editRelationName" onblur="st.editRelationNameBlurEvent();" value="' + name + '"><span class="popupAlertArea" style="color:red"><aside id="popupEditRelationNameErrorMsg"> </aside></span></div>';
    html += '<div id="dvEditRelationBox">' + i18next.t("boxUsedRelation") + '</div>';
    html += '<div id="dvSelectEditRelationBox" style="margin-bottom: 10px;"><select class="form-control" id="ddlEditRelationBoxList" onChange="st.changeRelationSelect();"><option>' + i18next.t("selectBox") + '</option></select><span class="popupAlertArea" style="color:red"><aside id="editRelationBoxMessage"> </aside></span>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">' + i18next.t("Cancel") + '</button>';
    html += '<button type="button" class="btn btn-primary" id="b-edit-relation-ok" onClick="st.editRelationOk();" disabled>' + i18next.t("Edit") + '</button>';
    html += '</div>';
    $("#setting-panel2").append(html);
    cm.getBoxList().done(function(data) {
        st.dispBoxList(data, "ddlEditRelationBoxList", false);
        $('#ddlEditRelationBoxList').val(box);
    });

    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu("EditRelation", true);
}
st.editRelationOk = function() {
    $('#dvTextConfirmation').html(i18next.t("confirmChangeContentEnter"));
    $('#modal-confirmation-title').html(i18next.t("EditRelation"));
    $('#b-edit-relconfirm-ok').css("display","");
    $('#modal-confirmation').modal('show');
};
st.dispDelRelationModal = function(name, box) {
    st.updUser = name;
    if (box === "[main]") {
      st.updBox = null;
    } else {
      st.updBox = box;
    }
    $('#dvTextConfirmation').html(i18next.t("confirmDeleteRelation", {value1:name, value2:box}));
    $('#modal-confirmation-title').html(i18next.t("DeleteRelation"));
    $('#b-del-relation-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
st.editRelationNameBlurEvent = function() {
        var name = $("#editRelationName").val();
        var nameSpan = "popupEditRelationNameErrorMsg";
        $('#b-edit-relation-ok').prop('disabled', !st.validateName(name, nameSpan, "-_\+:", "-\+"));
};
st.changeRelationSelect = function() {
    var value = $("#ddlEditRelationBoxList option:selected").val();
    if (value === "") {
        $("#b-edit-relation-ok").prop('disabled', true);
    } else {
        $("#b-edit-relation-ok").prop('disabled', false);
    }
};
st.addRelation = function() {
  var name = $("#addRelationName").val();
  var box = $("#ddlAddRelationBoxList option:selected").val();
  if (box === "") {
      $("#addRelationBoxMessage").html(i18next.t("selectBox"));
      return false;
  } else if (box === "[main]") {
      box = null;
  }
  var jsonData = {
                  "Name" : name,
                  "_Box.Name" : box
  };

  var chkObj = document.getElementById("addCheckRelationLinkRole");
  if (chkObj.checked) {
      if (st.checkRelationLinkRole()) {
          st.linkRelName = name;
          st.linkRelBoxName = box;
          st.restCreateRelationAPI(jsonData);
      }
  } else {
      st.restCreateRelationAPI(jsonData);
  }
};
st.checkRelationLinkRole = function() {
    var value = $("#ddlAddRelLinkRoleList option:selected").val();
    if (value === undefined) {
        $("#popupAddRelationLinkErrorMsg").html(i18next.t("selectRole"));
        return false;
    } else {
        $("#popupAddRelationLinkErrorMsg").html("");
        return true;
    }
};
st.restCreateRelationAPI = function(json) {
  $.ajax({
          type: "POST",
          url: cm.user.cellUrl + '__ctl/Relation',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
    if (document.getElementById("addCheckRelationLinkRole").checked) {
        $("#ddlAddRelLinkRoleList option:selected").each(function(index, option) {
          cm.setLinkParam($(option).text());
          st.restAddRelationLinkRole(false);
        });
    }
    cm.getRelationList().done(function(data) {
        st.dispRelationList(data, null, false);
    });
    cm.moveBackahead(true);
    //$("#modal-add-relation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
st.restAddRelationLinkRole = function(moveFlag) {
  var uri = cm.user.cellUrl + '__ctl/Role';
  if (cm.linkBoxName === null) {
    uri += '(\'' + cm.linkName + '\')';
  } else {
    uri += '(Name=\'' + cm.linkName + '\',_Box\.Name=\'' + cm.linkBoxName + '\')';
  }
  var json = {"uri":uri};

  var rel = "";
  if (st.linkRelBoxName === null) {
      rel = "'" + st.linkRelName + "'";
  } else {
      rel = "Name='" + st.linkRelName + "',_Box.Name='" + st.linkRelBoxName + "'";
  }
  $.ajax({
          type: "POST",
          url: cm.user.cellUrl + '__ctl/Relation(' + rel + ')/$links/_Role',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
    st.getRelationRoleList(st.linkRelName, st.linkRelBoxName, st.linkRelNo).done(function(data) {
        st.dispRelationRoleList(data, st.linkRelName, st.linkRelBoxName, st.linkRelNo);
    });

    if (moveFlag) {
        cm.moveBackahead(true);
    }
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
}
st.editRelation = function() {
    var name = $("#editRelationName").val();
    var box = $("#ddlEditRelationBoxList option:selected").val();
    if (box === "") {
        $("#addRelationBoxMessage").html(i18next.t("selectBox"));
        return false;
    } else if (box === "[main]") {
        box = null;
    }
    var jsonData = {
                    "Name" : name,
                    "_Box.Name" : box
    };
    st.restEditRelationAPI(jsonData);
};
st.restEditRelationAPI = function(json) {
  var uri = cm.user.cellUrl + '__ctl/Relation';
  if (st.updBox === null) {
      uri += "('" + st.updUser + "')";
  } else {
      uri += "(Name='" + st.updUser + "',_Box.Name='" + st.updBox + "')";
  }
  $.ajax({
          type: "PUT",
          url: uri,
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
    cm.getRelationList().done(function(data) {
        st.dispRelationList(data, null, false);
    });
    cm.moveBackahead(true);
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};

// Validation Check
st.validateName = function (displayName, displayNameSpan, addSpecial, addStart) {
        var specialChar = "a-zA-Z0-9";
        var startChar = "a-zA-Z0-9";
        if (addSpecial) {
            specialChar += addSpecial;
        }
        if (addStart) {
            startChar += addStart;
        }

        var MINLENGTH = 1;
        var MAXLENGTH = 128;

        var lenDisplayName = displayName.length;
        if(lenDisplayName < MINLENGTH || displayName == undefined || displayName == null || displayName == "") {
                document.getElementById(displayNameSpan).innerHTML =  i18next.t("pleaseEnterName");
                return false;
        }

        var letters = new RegExp("^([" + startChar + "]([" + specialChar + "]){0,127})?$");
        var startReg = new RegExp("^[" + startChar + "]")
        var multibyteChar = new RegExp("[^\x00-\x7F]+");
        document.getElementById(displayNameSpan).innerHTML = "";

        if(displayName.match(letters)) {
            return true;
        } else if (lenDisplayName > MAXLENGTH) {
            document.getElementById(displayNameSpan).innerHTML = i18next.t("errorValidateNameLength");
            return false;
        } else if (displayName.match(multibyteChar)) {
            document.getElementById(displayNameSpan).innerHTML = i18next.t("errorValidateMultibyte");
            return false;
        } else if (!displayName.match(startReg)) {
            if (addStart) {
                document.getElementById(displayNameSpan).innerHTML = i18next.t("errorValidateFirstPossibleSpecialCharacters", {value: addStart});
            } else {
                document.getElementById(displayNameSpan).innerHTML = i18next.t("errorValidateStartNameSpecialCharacters");
            }
            return false;
        } else {
            document.getElementById(displayNameSpan).innerHTML = i18next.t("errorValidateSpecialCharacters", {value: addSpecial});
            return false;
        }
};
st.doesUrlContainSlash = function(schemaURL, schemaSpan,txtID,message) {
	if (schemaURL != undefined) {
		if (!schemaURL.endsWith("/")) {
			document.getElementById(schemaSpan).innerHTML = message;
			return false;
		}
		document.getElementById(schemaSpan).innerHTML = "";
		return true;
	}
};
st.charCheck = function(check, displayNameSpan) {
  var passLen = check.val().length;
  var msg = "";
  var bool = true;

  if (passLen !== 0) {
    if (passLen < 6 || passLen > 36) {
      msg = i18next.t("pleaseBetweenCharacter");
      bool = false;
    } else if (check.val().match(/[^0-9a-zA-Z_-]+/)) {
      msg = i18next.t("pleaseCharacterType");
      bool = false;
    }

    $('#' + displayNameSpan).html(msg);
  }

  return bool;
};
st.changePassCheck = function(newpass, confirm, displayNameSpan) {
  $('#' + displayNameSpan).html("");
  if (newpass !== confirm) {
    $('#' + displayNameSpan).html(i18next.t("passwordNotMatch"));
    return false
  }

  return true;
};
st.passInputCheck = function(newpass, displayNameSpan) {
  $('#' + displayNameSpan).html("");
  if (newpass.length == 0) {
    $('#' + displayNameSpan).html(i18next.t("pleaseEnterPassword"));
    return false;
  }

  return true;
}

// API
st.restCreateAccountAPI = function(json, pass) {
  $.ajax({
          type: "POST",
          url: cm.user.cellUrl + '__ctl/Account',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'X-Personium-Credential': pass
          }
  }).done(function(data) {
    if (document.getElementById("addCheckAccountLinkRole").checked) {
      $("#ddlAddAccLinkRoleList option:selected").each(function(index, option) {
        cm.setLinkParam($(option).text());
        st.restAddAccountLinkRole(false);
      });
    }
    st.getAccountList().done(function(data) {
        st.dispAccountList(data);
    });
    cm.moveBackahead(true);
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
st.restEditAccountAPI = function(json, pass, updUser) {
  var headers = {};
  headers["Authorization"] = 'Bearer ' + cm.user.access_token;
  if (pass.length > 0) {
    headers["X-Personium-Credential"] = pass;
  }
  $.ajax({
          type: "PUT",
          url: cm.user.cellUrl + '__ctl/Account(\'' + updUser + '\')',
          data: JSON.stringify(json),
          headers: headers
  }).done(function(data) {
    st.getAccountList().done(function(data) {
        st.dispAccountList(data);
    });
    cm.moveBackahead(true);
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
st.restDeleteAccountAPI = function() {
  $.ajax({
          type: "DELETE",
          url: cm.user.cellUrl + '__ctl/Account(\'' + st.updUser + '\')',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
    st.getAccountList().done(function(data) {
        st.dispAccountList(data);
    });
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
st.restCreateRoleAPI = function(json) {
  $.ajax({
          type: "POST",
          url: cm.user.cellUrl + '__ctl/Role',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
    cm.getRoleList().done(function(data) {
        st.dispRoleList(data);
    });
    cm.moveBackahead(true);
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
st.restEditRoleAPI = function(json) {
  var api = '__ctl/Role';
  if (st.updBox === null) {
    api += '(\'' + st.updUser + '\')';
  } else {
    api += '(Name=\'' + st.updUser + '\',_Box.Name=\'' + st.updBox + '\')';
  }

  $.ajax({
          type: "PUT",
          url: cm.user.cellUrl + api,
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
    cm.getRoleList().done(function(data) {
        st.dispRoleList(data);
    });
    cm.moveBackahead(true);
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
st.restDeleteRoleAPI = function() {
  var api = '__ctl/Role';
  if (st.updBox === null) {
    api += '(\'' + st.updUser + '\')';
  } else {
    api += '(Name=\'' + st.updUser + '\',_Box.Name=\'' + st.updBox + '\')';
  }

  $.ajax({
          type: "DELETE",
          url: cm.user.cellUrl + api,
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
    cm.getRoleList().done(function(data) {
        st.dispRoleList(data);
    });
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
st.restAddAccountLinkRole = function(moveFlag) {
  var uri = cm.user.cellUrl + '__ctl/Role';
  if (cm.linkBoxName === null) {
    uri += '(\'' + cm.linkName + '\')';
  } else {
    uri += '(Name=\'' + cm.linkName + '\',_Box\.Name=\'' + cm.linkBoxName + '\')';
  }
  var json = {"uri":uri};

  $.ajax({
          type: "POST",
          url: cm.user.cellUrl + '__ctl/Account(Name=\'' + st.linkAccName + '\')/$links/_Role',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
    st.getAccountRoleList(st.linkAccName, st.linkAccNameNo).done(function(data) {
        st.dispAccountRoleList(data, st.linkAccName, st.linkAccNameNo);
    });
    if (moveFlag) {
        cm.moveBackahead(true);
    }
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
}
st.restDeleteAccountLinkRole = function() {
  var api = '__ctl/Account(Name=\'' + st.linkAccName + '\')/$links/_Role';
  if (cm.linkBoxName === null) {
    api += '(\'' + cm.linkName + '\')';
  } else {
    api += '(Name=\'' + cm.linkName + '\',_Box.Name=\'' + cm.linkBoxName + '\')';
  }

  $.ajax({
          type: "DELETE",
          url: cm.user.cellUrl + api,
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
    st.getAccountRoleList(st.linkAccName, st.linkAccNameNo).done(function(data) {
        st.dispAccountRoleList(data, st.linkAccName, st.linkAccNameNo);
    });
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
st.restDeleteRelationAPI = function() {
  var uri = cm.user.cellUrl + '__ctl/Relation';
  if (st.updBox === null) {
      uri += "('" + st.updUser + "')";
  } else {
      uri += "(Name='" + st.updUser + "',_Box.Name='" + st.updBox + "')";
  }
  $.ajax({
          type: "DELETE",
          url: uri,
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
    cm.getRelationList().done(function(data) {
        st.dispRelationList(data, null, false);
    });
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
st.restDeleteRelationLinkRole = function() {
  var api = '__ctl/Relation';
  if (st.linkRelBoxName === null) {
    api += '(\'' + st.linkRelName + '\')/$links/_Role';
  } else {
    api += '(Name=\'' + st.linkRelName + '\',_Box.Name=\'' + st.linkRelBoxName + '\')/$links/_Role';
  }
  if (cm.linkBoxName === null) {
    api += '(\'' + cm.linkName + '\')';
  } else {
    api += '(Name=\'' + cm.linkName + '\',_Box.Name=\'' + cm.linkBoxName + '\')';
  }

  $.ajax({
          type: "DELETE",
          url: cm.user.cellUrl + api,
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
    st.getRelationRoleList(st.linkRelName, st.linkRelBoxName, st.linkRelNameNo).done(function(data) {
        st.dispRelationRoleList(data, st.linkRelName, st.linkRelBoxName, st.linkRelNo);
    });
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
}

st.checkBoxInstall = function() {
    var elements = document.getElementsByName("nowInstall");
    if (elements.length > 0) {
        for (var i in elements) {
            var ele = elements[i];
            var no = ele.id.split("_")[1];
            st.updateProgress(no, ele.id);
        }
    } else {
        clearInterval(st.nowInstalledID);
    }
};
st.updateProgress = function(no, id) {
    cm.getBoxStatus(st.insAppBoxList[no]).done(function(data) {
        var status = data.status;
        if (status.indexOf('ready') >= 0) {
            $("#nowInstallParent_" + no).remove();
            $("#insAppNo_" + no).on('click', function() { st.uninstallApp(st.insAppList[no],st.insAppBoxList[no]) });
            if (typeof(ha) != "undefined") {
                ha.dispInsAppList();
            }
        } else if (status.indexOf('progress') >= 0) {
            $('#' + id).css("width", data.progress);
        } else {
            $('#nowInstallParent_' + no).remove();
            $('#appid_' + no).append('(<font color="red"> ! </font>)');
        }
        var elements = document.getElementsByName("nowInstall");
        if (elements.length = 0) {
            clearInterval(st.nowInstalledID);
        }
    });
};
st.checkBoxInstallTest = function() {
    var elements = document.getElementsByName("nowInstall");
    for (var i in elements) {
        var ele = elements[i];
        testProgPar += 1;
        if (testProgPar > 100) {
            var no = ele.id.split("_")[1];
            $("#nowInstallParent_" + no).remove();
            clearInterval(st.nowInstalledID);
        } else {
            $('#' + ele.id).css("width", testProgPar + "%");
        }
    }
};
