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
    cm.setTitleMenu(tran.msg("Settings"), true);

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
    $("#applicationToggle").on("click", function() {
      st.createApplicationList();
      //testAPI();
    });
    $("#roleToggle").on("click", function() {
      st.createRoleList();
    });
    $("#relationToggle").on("click", function() {
      st.createRelationList();
    });
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
        $("#popupAddAccountLinkRoleErrorMsg").html(tran.msg("selectRole"));
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
        cm.setTitleMenu(tran.msg("Account"), true);
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
        html += '<td style="margin-right:10px;width: 10%;"><a class="edit-button list-group-item" href="#" onClick="st.createEditAccount(\'' + acc.Name + '\');return(false)">' + tran.msg("Edit") + '</a></td>'
             + '<td style="width: 10%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelModal(\'' + acc.Name + '\');return(false)">' + tran.msg("Del") + '</a></td>';
    }
    html += '</tr></table></div>';
  }
  html += '<div class="list-group-item">';
  html += '<a href="#" class="allToggle" onClick="st.createAddAccount()">＋ ' + tran.msg("CreateAccount") + '</a></div>';
  html += '</div>';
  $("#setting-panel1").append(html);
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
        html += '<div id="dvAddName">' + tran.msg("Name") + '</div>';
        html += '<div id="dvTextAddName" style="margin-bottom: 10px;">';
        html += '<input type="text" id="addAccountName" onblur="st.addAccountNameBlurEvent();">';
        html += '<span class="popupAlertArea" style="color:red">';
        html += '<aside id="popupAddAccountNameErrorMsg"> </aside>';
        html += '</span></div>';
        html += '<div id="dvAddPassword">' + tran.msg("Password") + '</div>';
        html += '<div id="dvTextAddNewPassword" style="margin-bottom: 10px;">';
        html += '<input type="password" placeholder="' + tran.msg("newPassPlaceHolder") + '" id="pAddNewPassword" onblur="st.blurNewPassword(this, \'b-add-account-ok\', \'addChangeMessage\');">';
        html += '<span class="popupAlertArea" style="color:red">';
        html += '<aside id="addChangeMessage"> </aside>';
        html += '</span></div>';
        html += '<div id="dvAddConfirm">' + tran.msg("confirmNewPass") + '</div>';
        html += '<div id="dvTextAddConfirm" style="margin-bottom: 10px;">';
        html += '<input type="password" placeholder="' + tran.msg("confirmNewPass") + '" id="pAddConfirm" onblur="st.blurConfirm(\'pAddNewPassword\', \'pAddConfirm\', \'addConfirmMessage\');">';
        html += '<span class="popupAlertArea" style="color:red">';
        html += '<aside id="addConfirmMessage"> </aside>';
        html += '</span></div>';
        html += '<div id="dvCheckAddAccountLinkRole" style="margin-bottom: 10px;">';
        html += '<label><input class="widthAuto" type="checkbox" id="addCheckAccountLinkRole" onChange="st.changeCheckAccountLinkRole(this);">' + tran.msg("AssignRoleMulti") + '</label>';
        html += '</div>';
        html += '<div id="dvSelectAddAccountLinkRole" style="margin-bottom: 10px;">';
        html += '<select class="form-control" name="" id="ddlAddAccLinkRoleList" onblur="st.checkAccLinkRole();" multiple disabled><option>Select a role</option></select>';
        html += '<span class="popupAlertArea" style="color:red"><aside id="popupAddAccountLinkRoleErrorMsg"> </aside></span>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">' + tran.msg("Cancel") + '</button>';
        html += '<button type="button" class="btn btn-primary" id="b-add-account-ok" onClick="st.addAccount();">' + tran.msg("Create") + '</button>';
        html += '</div></div>';
        $("#setting-panel2").append(html);
        cm.dispRoleList(data, "ddlAddAccLinkRoleList", true);
    });
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu(tran.msg("CreateAccount"), true);
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
    html += '<td colspan="2" style="width: 15%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelAccountRoleModal(\'' + accName + '\',\'' + name + '\',\'' + boxName + '\',\'' + no + '\');return(false)">' + tran.msg("Detach") + '</a></td>';
    html += '</tr>';
    html += '</table></div>';
  }
  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="cm.dispAssignRole(\'acc\', true)">＋ ' + tran.msg("AssigningRoles") + '</a></div>';
  html += '</div>';
  $("#setting-panel2").append(html);
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
    $("#dvTextConfirmation").html(tran.msg("removeAssociationRole", {value1:roleName, value2:boxName}));
    $("#modal-confirmation-title").html(tran.msg("DeleteAssigningRole"));
    $('#b-del-acclinkrole-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
st.createEditAccount = function(name) {
    st.updUser = name;
    $("#setting-panel2").empty();
    cm.setBackahead(true);
    var html = '<div class="modal-body">';
    html += '<div id="dvEditName">' + tran.msg("Name") + '</div>';
    html += '<div id="dvTextEditName" style="margin-bottom: 10px;"><input type="text" id="editAccountName" onblur="st.editAccountNameBlurEvent();" value="' + name + '"><span class="popupAlertArea" style="color:red"><aside id="popupEditAccountNameErrorMsg"> </aside></span></div>';
    html += '<div id="dvEditPassword">' + tran.msg("Password") + '</div>';
    html += '<div id="dvTextEditNewPassword" style="margin-bottom: 10px;"><input type="password" placeholder="' + tran.msg("newPassPlaceHolder") + '" id="pEditNewPassword" onblur="st.blurNewPassword(this, \'b-edit-account-ok\', \'editChangeMessage\');"><span class="popupAlertArea" style="color:red"><aside id="editChangeMessage"> </aside></span></div>';
    html += '<div id="dvTextEditConfirm" style="margin-bottom: 10px;"><input type="password" placeholder="' + tran.msg("confirmNewPass") + '" id="pEditConfirm" onblur="st.blurConfirm(\'pEditNewPassword\', \'pEditConfirm\', \'editConfirmMessage\');"><span class="popupAlertArea" style="color:red"><aside id="editConfirmMessage"> </aside></span></div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">' + tran.msg("Cancel") + '</button>';
    html += '<button type="button" class="btn btn-primary text-capitalize" id="b-edit-account-ok" onClick="st.editAccountOk();" disabled>' + tran.msg("Edit") + '</button>';
    html += '</div></div>';
    $("#setting-panel2").append(html);
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu(tran.msg("EditAccount"), true);
};
st.editAccountOk = function() {
    $('#dvTextConfirmation').html(tran.msg("confirmChangeContentEnter"));
    $('#modal-confirmation-title').html(tran.msg("EditAccount"));
    $('#b-edit-accconfirm-ok').css("display","");
    $('#modal-confirmation').modal('show');
};
st.dispDelModal = function(name) {
    st.updUser = name;
    $("#dvTextConfirmation").html(tran.msg("confirmDeleteAccount", {value: name}));
    $('#modal-confirmation-title').html(tran.msg("DeleteAccount"));
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
  $("#" + id).append('<option value="">' + tran.msg("selectBox") + '</option>');
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
        var txtname = "#addAccountName";
        st.validateName(name, nameSpan, txtname);
};
st.editAccountNameBlurEvent = function() {
        var name = $("#editAccountName").val();
        var nameSpan = "popupEditAccountNameErrorMsg";
        var txtname = "#editAccountName";
        if (st.validateName(name, nameSpan, txtname)) {
            $('#b-edit-account-ok').prop('disabled', false);
        }
};
st.addAccount = function() {
  var name = $("#addAccountName").val();
  if (st.validateName(name, "popupAddAccountNameErrorMsg")) {
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
st.editAccount = function() {
  var keyName = st.updUser;
  var name = $("#editAccountName").val();
  if (st.validateName(name, "popupEditAccountNameErrorMsg")) {
    var pass = $("#pEditNewPassword").val();
    if (st.changePassCheck($("#pEditNewPassword").val(), $("#pEditConfirm").val(), "editConfirmMessage")) {
        var jsonData = {
                        "Name" : name
        };

        st.restEditAccountAPI(jsonData, pass, keyName);
        return true;
    }
  }

  return false;
}

// Application
st.createApplicationList = function() {
    $("#setting-panel1").remove();
    cm.setBackahead(true);
    var html = '<div class="panel-body" id="app-panel"><section class="dashboard-block" id="installed-app"><h2>' + tran.msg("Installed") + '</h2><div id="insAppList"></div></section><section class="dashboard-block" id="all-app"><h2>' + tran.msg("ApplicationList") + '</h2><div id="appList"></div></section></div>';
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
            cm.setTitleMenu(tran.msg("Application"), true);
        }).fail(function(data) {
            alert(data);
        });
    });
};
st.getApplicationList = function() {
    return $.ajax({
            type: "GET",
            url: cm.user.baseUrl + 'market/__/applist.json',
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
        html += '<div class="app-install"><button class="round-btn"href="#" onClick="st.confBarInstall(\'' + schema + '\',\'' + barUrl + '\',\'' + barBoxName + '\', \'' + dispName + '\');return(false);">' + tran.msg("Install") + '</button></div></section>';
    } else {
        html += '<div class="app-install"><button class="round-btn"href="#" onClick="return(false);">' + tran.msg("Uninstall") + '</button></div></section>';
    }

    $("#setting-panel2").append(html);
    cm.setTitleMenu(tran.msg("Details"), true);
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
};
st.confBarInstall = function(schema, barUrl, barBoxName, dispName) {
    st.barSchemaUrl = schema;
    st.barFileUrl = barUrl;
    st.barBoxName = barBoxName;
    $("#dvTextConfirmation").html(tran.msg("confirmInstallation"));
    $("#modal-confirmation-title").html(dispName);
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
        cm.setTitleMenu(tran.msg("Role"), true);
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
    html += '<td style="width: 15%;"><a href="#" class="edit-button list-group-item" href="#" onClick="st.createEditRole(\'' + objRole.Name + '\',\'' + boxName + '\');return(false)">' + tran.msg("Edit") + '</a></td>';
    html += '<td style="width: 15%;"><a href="#" class="del-button list-group-item" href="#" onClick="st.dispDelRoleModal(\'' + objRole.Name + '\',\'' + boxName + '\');return(false)">' + tran.msg("Del") + '</a></td>';
    html += '</tr>';
    html += '</table></div>';
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="st.createAddRole()">＋ ' + tran.msg("CreateRole") + '</a></div>';
  html += '</div>';
  $("#setting-panel1").append(html);
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
    html += '<div id="dvAddRoleName">' + tran.msg("Name") + '</div>';
    html += '<div id="dvTextAddRoleName" style="margin-bottom: 10px;"><input type="text" id="addRoleName" value="' + name + '" onblur="st.addRoleNameBlurEvent();"><span class="popupAlertArea" style="color:red"><aside id="popupAddRoleNameErrorMsg"> </aside></span></div>';
    html += '<div id="dvAddRoleBox">' + tran.msg("selectBoxRole") + '</div>';
    html += '<div id="dvSelectAddRoleBox" style="margin-bottom: 10px;"><select class="form-control" name="" id="ddlRoleBoxList"><option>' + tran.msg("selectBox") + '</option></select><span class="popupAlertArea" style="color:red"><aside id="addRoleBoxMessage"> </aside></span></div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">' + tran.msg("Cancel") + '</button>';
    if (st.updUser !== null) {
        html += '<button type="button" class="btn btn-primary text-capitalize" id="b-add-role-ok" onClick="st.addRole();">' + tran.msg("Edit") + '</button>';
    } else {
        html += '<button type="button" class="btn btn-primary" id="b-add-role-ok" onClick="st.addRole();">' + tran.msg("Create") + '</button>';
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
        cm.setTitleMenu(tran.msg("EditRole"), true);
    } else {
        cm.setTitleMenu(tran.msg("CreateRole"), true);
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
    $('#dvTextConfirmation').html(tran.msg("confirmDeleteRole", {value1:name, value2:box}));
    $('#modal-confirmation-title').html(tran.msg("DeleteRole"));
    $('#b-del-role-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
st.addRoleNameBlurEvent = function() {
        var name = $("#addRoleName").val();
        var nameSpan = "popupAddRoleNameErrorMsg";
        var txtname = "#addRoleName";
        st.validateName(name, nameSpan, txtname);
};
st.addRole = function() {
  var name = $("#addRoleName").val();
  var box = $("#ddlRoleBoxList option:selected").val();
  if (box === "") {
      $("#addRoleBoxMessage").html(tran.msg("selectBox"));
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
        cm.setTitleMenu(tran.msg("Relation"), true);
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
    html += '<td style="width: 10%;"><a class="edit-button list-group-item" href="#" onClick="st.createEditRelation(\'' + objRelation.Name + '\',\'' + boxName + '\');return(false)">' + tran.msg("Edit") + '</a></td>';
    html += '<td style="width: 10%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelRelationModal(\'' + objRelation.Name + '\',\'' + boxName + '\');return(false)">' + tran.msg("Del") + '</a></td>';
    html += '</tr></table></div>';
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="st.createAddRelation()">＋ ' + tran.msg("CreateRelation") + '</a></div>';
  html += '</div>';
  $("#setting-panel1").append(html);
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
        html += '<div id="dvAddRelationName">' + tran.msg("Name") + '</div>';
        html += '<div id="dvTextAddRelationName" style="margin-bottom: 10px;"><input type="text" id="addRelationName" onblur="st.addRelationNameBlurEvent();"><span class="popupAlertArea" style="color:red"><aside id="popupAddRelationNameErrorMsg"> </aside></span></div>';
        html += '<div id="dvAddRelationBox">' + tran.msg("boxUsedRelation") + '</div>';
        html += '<div id="dvSelectAddRelationBox" style="margin-bottom: 10px;"><select class="form-control" name="ddlRelationBoxList" id="ddlAddRelationBoxList"><option>' + tran.msg("selectBox") + '</option></select><span class="popupAlertArea" style="color:red"><aside id="addRelationBoxMessage"> </aside></span></div>';
        html += '<div id="dvCheckAddRelationLinkRole" style="margin-bottom: 10px;"><label><input  class="widthAuto" type="checkbox" id="addCheckRelationLinkRole" onChange="st.changeCheckRelationLinkRole(this);">' + tran.msg("AssignRoleMulti") + '</label></div>';
        html += '<div id="dvSelectAddRelationLinkRole" style="margin-bottom: 10px;"><select class="form-control" name="" id="ddlAddRelLinkRoleList" multiple disabled><option>Select a role</option></select><span class="popupAlertArea" style="color:red"><aside id="popupAddRelationLinkRoleErrorMsg"> </aside></span></div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">' + tran.msg("Cancel") + '</button>';
        html += '<button type="button" class="btn btn-primary" id="b-add-relation-ok" onClick="st.addRelation();" disabled>' + tran.msg("Create") + '</button>';
        html += '</div></div>';
        $("#setting-panel2").append(html);
        cm.dispRoleList(data, "ddlAddRelLinkRoleList", true);
        cm.getBoxList().done(function(data) {
            st.dispBoxList(data, "ddlAddRelationBoxList", false);
        });
    });
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu(tran.msg("CreateRelation"), true);
};
st.addRelationNameBlurEvent = function() {
        var name = $("#addRelationName").val();
        var nameSpan = "popupAddRelationNameErrorMsg";
        var txtname = "#addRelationName";
        if (st.validateName(name, nameSpan, txtname, "\+:", "_:")) {
            $('#b-add-relation-ok').prop('disabled', false);
        } else {
            $('#b-add-relation-ok').prop('disabled', true);
        }
};
st.changeCheckRelationLinkRole = function(obj) {
    if (obj.checked) {
        $("#ddlAddRelLinkRoleList").prop('disabled', false);
    } else {
        $("#ddlAddRelLinkRoleList").prop('disabled', true);
    }
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
    html += '<td style="width: 10%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelRelationRoleModal(\'' + relName + '\',\'' + relBoxName + '\',\'' + name + '\',\'' + boxName + '\',\'' + no + '\');return(false)">' + tran.msg("Detach") + '</a></td>';
    html += '</tr></table></div>';
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="cm.dispAssignRole(\'rel\', true)">＋ ' + tran.msg("AssigningRoles") + '</a></div>';
  html += '</div>';
  $("#setting-panel2").append(html);
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
    $("#dvTextConfirmation").html(tran.msg("removeAssociationRole", {value1:roleName, value2:boxName}));
    $("#modal-confirmation-title").html(tran.msg("DeleteAssigningRole"));
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
    html += '<div id="dvEditRelationName">' + tran.msg("Name") + '</div>';
    html += '<div id="dvTextEditRelationName" style="margin-bottom: 10px;"><input type="text" id="editRelationName" onblur="st.editRelationNameBlurEvent();" value="' + name + '"><span class="popupAlertArea" style="color:red"><aside id="popupEditRelationNameErrorMsg"> </aside></span></div>';
    html += '<div id="dvEditRelationBox">' + tran.msg("boxUsedRelation") + '</div>';
    html += '<div id="dvSelectEditRelationBox" style="margin-bottom: 10px;"><select class="form-control" id="ddlEditRelationBoxList" onChange="st.changeRelationSelect();"><option>' + tran.msg("selectBox") + '</option></select><span class="popupAlertArea" style="color:red"><aside id="editRelationBoxMessage"> </aside></span>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">' + tran.msg("Cancel") + '</button>';
    html += '<button type="button" class="btn btn-primary" id="b-edit-relation-ok" onClick="st.editRelationOk();" disabled>' + tran.msg("Edit") + '</button>';
    html += '</div>';
    $("#setting-panel2").append(html);
    cm.getBoxList().done(function(data) {
        st.dispBoxList(data, "ddlEditRelationBoxList", false);
        $('#ddlEditRelationBoxList').val(box);
    });

    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu(tran.msg("EditRelation"), true);
}
st.editRelationOk = function() {
    $('#dvTextConfirmation').html(tran.msg("confirmChangeContentEnter"));
    $('#modal-confirmation-title').html(tran.msg("EditRelation"));
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
    $('#dvTextConfirmation').html(tran.msg("confirmDeleteRelation", {value1:name, value2:box}));
    $('#modal-confirmation-title').html(tran.msg("DeleteRelation"));
    $('#b-del-relation-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
st.editRelationNameBlurEvent = function() {
        var name = $("#editRelationName").val();
        var nameSpan = "popupEditRelationNameErrorMsg";
        var txtname = "#editRelationName";
        if (st.validateName(name, nameSpan, txtname, "\+:", "_:")) {
            $('#b-edit-relation-ok').prop('disabled', false);
        } else {
            $('#b-edit-relation-ok').prop('disabled', true);
        }
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
      $("#addRelationBoxMessage").html(tran.msg("selectBox"));
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
        $("#popupAddRelationLinkErrorMsg").html(tran.msg("selectRole"));
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
        $("#addRelationBoxMessage").html(tran.msg("selectBox"));
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
st.validateName = function (displayName, displayNameSpan,txtID, addSpecial, notStartChar) {
        var addSpecialChar = "";
        var addNotStartChar = "-_";
        if (addSpecial) {
            addSpecialChar = addSpecial;
        }
        if (notStartChar) {
            addNotStartChar = notStartChar;
        }

        var MINLENGTH = 1;
        var MAXLENGTH = 128;
        //var letters = /^[一-龠ぁ-ゔ[ァ-ヴー々〆〤0-9０-９a-zA-ZＡ-Ｚ-_]+$/;
        var letters = new RegExp("^[一-龠ぁ-ゔ[ァ-ヴー々〆〤0-9０-９a-zA-ZＡ-Ｚ-_" + addSpecialChar + "]+$");
        //var specialchar = /^[]/;
        var specialchar = new RegExp("^[" + addNotStartChar + "]");
        //var allowedLetters = /^[0-9a-zA-Z-_]+$/;
        var allowedLetters = new RegExp("^[0-9a-zA-Z-_" + addSpecialChar + "]+$");
        var lenDisplayName = displayName.length;
        document.getElementById(displayNameSpan).innerHTML = "";
        if(lenDisplayName < MINLENGTH || displayName == undefined || displayName == null || displayName == "") {
                document.getElementById(displayNameSpan).innerHTML =  tran.msg("pleaseEnterName");
                return false;
        } else if (lenDisplayName >= MAXLENGTH) {
                document.getElementById(displayNameSpan).innerHTML = tran.msg("errorValidateNameLength");
                return false;
        } else if (lenDisplayName != 0 && !(displayName.match(letters))){
                document.getElementById(displayNameSpan).innerHTML = tran.msg("errorValidateSpecialCharacters");
                return false;
        } else if (lenDisplayName != 0 && !(displayName.match(allowedLetters))) {
                document.getElementById(displayNameSpan).innerHTML = tran.msg("errorValidateStartNameSpecialCharacters");
                return false;
        } else if(lenDisplayName != 0 && displayName.match(specialchar)){
                document.getElementById(displayNameSpan).innerHTML = tran.msg("errorValidateStartNameSpecialCharacters");
                return false;
        }
        return true;
};
st.validateSchemaURL = function(schemaURL, schemaSpan, txtID) {
  var isHttp = schemaURL.substring(0, 5);
  var isHttps = schemaURL.substring(0, 6);
  var minURLLength = schemaURL.length;
  var validMessage = tran.msg("pleaseValidSchemaURL");
  var letters = /^[0-9a-zA-Z-_.\/]+$/;
  var startHyphenUnderscore = /^[-_!@#$%^&*()=+]/;
  var urlLength = schemaURL.length;
  var schemaSplit = schemaURL.split("/");
  var isDot = -1;
  if(schemaURL.split("/").length > 2) {
    if (schemaSplit[2].length>0) {
      isDot = schemaSplit[2].indexOf(".");
    }
  }
  var domainName = schemaURL.substring(8, urlLength);
  if (schemaURL == "" || schemaURL == null || schemaURL == undefined) {
    return true;
	} else if ((isHttp != "http:" && isHttps != "https:")
            || (minURLLength <= 8)) {
    document.getElementById(schemaSpan).innerHTML = validMessage;
    return false;
  } else if (urlLength > 1024) {
    document.getElementById(schemaSpan).innerHTML = tran.msg("maxUrlLengthError");
    return false;
  } else if (domainName.match(startHyphenUnderscore)) {
    document.getElementById(schemaSpan).innerHTML = tran.msg("errorValidateStartDomainNameSpecialCharacters");
    return false;
  } else if (!(domainName.match(letters))) {
    document.getElementById(schemaSpan).innerHTML = tran.msg("errorValidateSpecialCharacters");
    return false;
  } else if (isDot == -1) {
    document.getElementById(schemaSpan).innerHTML = validMessage;
    return false;
  } else if ((domainName.indexOf(".."))>-1 || (domainName.indexOf("//"))>-1) {
    document.getElementById(schemaSpan).innerHTML = validMessage;
    return false;
  }
  document.getElementById(schemaSpan).innerHTML = "";
  return true;
};
st.validateURL = function(domainName,errorSpan,txtID) {
	var letters = /^[0-9a-zA-Z-_.]+$/;
	var startHyphenUnderscore = /^[-_!@#$%^&*()=+]/;
	if (domainName == undefined){
		document.getElementById(errorSpan).innerHTML = tran.msg("invalidURL");
		return false;
	}
	var lenCellName = domainName.length;
	if (domainName.match(startHyphenUnderscore)) {
		document.getElementById(errorSpan).innerHTML = tran.msg("errorValidateStartDomainNameSpecialCharacters");
		return false;
	} else if (lenCellName != 0 && !(domainName.match(letters))) {
		document.getElementById(errorSpan).innerHTML = tran.msg("errorValidateSpecialCharacters");
		return false;
	} 
	document.getElementById(errorSpan).innerHTML = "";
	return true;
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
      msg = tran.msg("pleaseBetweenCharacter");
      bool = false;
    } else if (check.val().match(/[^0-9a-zA-Z_-]+/)) {
      msg = tran.msg("pleaseCharacterType");
      bool = false;
    }

    $('#' + displayNameSpan).html(msg);
  }

  return bool;
};
st.changePassCheck = function(newpass, confirm, displayNameSpan) {
  $('#' + displayNameSpan).html("");
  if (newpass !== confirm) {
    $('#' + displayNameSpan).html(tran.msg("passwordNotMatch"));
    return false
  }

  return true;
};
st.passInputCheck = function(newpass, displayNameSpan) {
  $('#' + displayNameSpan).html("");
  if (newpass.length == 0) {
    $('#' + displayNameSpan).html(tran.msg("pleaseEnterPassword"));
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