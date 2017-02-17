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
        $("#popupAddAccountLinkRoleErrorMsg").html("Please select a role.");
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
        cm.setTitleMenu(mg.getMsg("00028"), true);
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
    html += '<td style="width: 80%;"><a class="accountToggle ellipsisText" id="accountLinkToRoleToggle' + i + '" onClick="st.createAccountRole(\'' + acc.Name + '\',\'' + i + '\')">' + acc.Name + '&nbsp;<img class="image-circle-small" src="' + typeImg + '"></a></td>';
    if (acc.Name !== cm.user.username) {
        html += '<td style="margin-right:10px;width: 10%;"><a class="edit-button list-group-item" href="#" onClick="st.createEditAccount(\'' + acc.Name + '\');return(false)">' + mg.getMsg("00003") + '</a></td>'
             + '<td style="width: 10%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelModal(\'' + acc.Name + '\');return(false)">' + mg.getMsg("00004") + '</a></td>';
    }
    html += '</tr></table></div>';
  }
  html += '<div class="list-group-item">';
  html += '<a class="allToggle" onClick="st.createAddAccount()">＋ ' + mg.getMsg("00031") + '</a></div>';
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
        html += '<div id="dvAddName">' + mg.getMsg("00035") + '</div>';
        html += '<div id="dvTextAddName" style="margin-bottom: 10px;">';
        html += '<input type="text" id="addAccountName" onblur="st.addAccountNameBlurEvent();">';
        html += '<span class="popupAlertArea" style="color:red">';
        html += '<aside id="popupAddAccountNameErrorMsg"> </aside>';
        html += '</span></div>';
        html += '<div id="dvAddPassword">' + mg.getMsg("00036") + '</div>';
        html += '<div id="dvTextAddNewPassword" style="margin-bottom: 10px;">';
        html += '<input type="password" placeholder="' + mg.getMsg("I0005") + '" id="pAddNewPassword" onblur="st.blurNewPassword(this, \'b-add-account-ok\', \'addChangeMessage\');">';
        html += '<span class="popupAlertArea" style="color:red">';
        html += '<aside id="addChangeMessage"> </aside>';
        html += '</span></div>';
        html += '<div id="dvAddConfirm">' + mg.getMsg("I0003") + '</div>';
        html += '<div id="dvTextAddConfirm" style="margin-bottom: 10px;">';
        html += '<input type="password" placeholder="' + mg.getMsg("I0003") + '" id="pAddConfirm" onblur="st.blurConfirm(\'pAddNewPassword\', \'pAddConfirm\', \'addConfirmMessage\');">';
        html += '<span class="popupAlertArea" style="color:red">';
        html += '<aside id="addConfirmMessage"> </aside>';
        html += '</span></div>';
        html += '<div id="dvCheckAddAccountLinkRole" style="margin-bottom: 10px;">';
        html += '<label><input class="widthAuto" type="checkbox" id="addCheckAccountLinkRole" onChange="st.changeCheckAccountLinkRole(this);">' + mg.getMsg("I0015") + '</label>';
        html += '</div>';
        html += '<div id="dvSelectAddAccountLinkRole" style="margin-bottom: 10px;">';
        html += '<select name="" id="ddlAddAccLinkRoleList" onblur="st.checkAccLinkRole();" multiple disabled><option>Select a role</option></select>';
        html += '<span class="popupAlertArea" style="color:red"><aside id="popupAddAccountLinkRoleErrorMsg"> </aside></span>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">Cancel</button>';
        html += '<button type="button" class="btn btn-primary" id="b-add-account-ok" onClick="st.addAccount();">Add</button>';
        html += '</div></div>';
        $("#setting-panel2").append(html);
        cm.dispRoleList(data, "ddlAddAccLinkRoleList", true);
    });
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu(mg.getMsg("00031"), true);
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
    html += '<td colspan="2" style="width: 15%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelAccountRoleModal(\'' + accName + '\',\'' + name + '\',\'' + boxName + '\',\'' + no + '\');return(false)">' + mg.getMsg("00029") + '</a></td>';
    html += '</tr>';
    html += '</table></div>';
  }
  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="cm.dispAssignRole(\'acc\', true)">＋ ' + mg.getMsg("00005") + '</a></div>';
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
    $("#dvTextConfirmation").html(mg.getMsg("I0007", roleName, boxName));
    $("#modal-confirmation-title").html(mg.getMsg("00006"));
    $('#b-del-acclinkrole-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
st.createEditAccount = function(name) {
    st.updUser = name;
    $("#setting-panel2").empty();
    cm.setBackahead(true);
    var html = '<div class="modal-body">';
    html += '<div id="dvEditName">' + mg.getMsg("00035") + '</div>';
    html += '<div id="dvTextEditName" style="margin-bottom: 10px;"><input type="text" id="editAccountName" onblur="st.editAccountNameBlurEvent();" value="' + name + '"><span class="popupAlertArea" style="color:red"><aside id="popupEditAccountNameErrorMsg"> </aside></span></div>';
    html += '<div id="dvEditPassword">' + mg.getMsg("00036") + '</div>';
    html += '<div id="dvTextEditNewPassword" style="margin-bottom: 10px;"><input type="password" placeholder="' + mg.getMsg("I0005") + '" id="pEditNewPassword" onblur="st.blurNewPassword(this, \'b-edit-account-ok\', \'editChangeMessage\');"><span class="popupAlertArea" style="color:red"><aside id="editChangeMessage"> </aside></span></div>';
    html += '<div id="dvTextEditConfirm" style="margin-bottom: 10px;"><input type="password" placeholder="' + mg.getMsg("I0003") + '" id="pEditConfirm" onblur="st.blurConfirm(\'pEditNewPassword\', \'pEditConfirm\', \'editConfirmMessage\');"><span class="popupAlertArea" style="color:red"><aside id="editConfirmMessage"> </aside></span></div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">Cancel</button>';
    html += '<button type="button" class="btn btn-primary" id="b-edit-account-ok" onClick="st.editAccountOk();" disabled>Edit</button>';
    html += '</div></div>';
    $("#setting-panel2").append(html);
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu(mg.getMsg("00002"), true);
};
st.editAccountOk = function() {
    $('#dvTextConfirmation').html(mg.getMsg("I0006"));
    $('#modal-confirmation-title').html(mg.getMsg("00002"));
    $('#b-edit-accconfirm-ok').css("display","");
    $('#modal-confirmation').modal('show');
};
st.dispDelModal = function(name) {
    st.updUser = name;
    $("#dvTextConfirmation").html(mg.getMsg("I0008", name));
    $('#modal-confirmation-title').html(mg.getMsg("00007"));
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
  $("#" + id).append('<option value="">Please select a Box</option>');
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
            cm.setTitleMenu(mg.getMsg("00039"), true);
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
};
st.dispInsAppListSchemaSetting = function(schema, boxName, no) {
    cm.getProfile(schema).done(function(profData) {
        var dispName = profData.DisplayName;
        var imageSrc = cm.notImage;
        if (profData.Image) {
            imageSrc = profData.Image;
        }
        cm.getBoxStatus(boxName).done(function(data) {
            var status = data.status;
            var html = '';
            if (status.indexOf('ready') >= 0) {
                // ready
                html = '<div class="ins-app" align="center"><a id="insAppNo_' + no + '" class="ins-app-icon" onClick="uninstallApp(\'' + schema + '\', \'' + boxName + '\')"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name">' + dispName + '</div>';

                html += '</div>';
            } else if (status.indexOf('progress') >= 0) {
                // progress
                html = '<div class="ins-app" align="center"><a id="insAppNo_' + no + '" class="ins-app-icon"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name">' + dispName + '</div><div id="nowInstallParent_' + no + '" class="progress progress-striped active"><div name="nowInstall" id="nowInstall_' + no + '" class="progress-bar progress-bar-success" style="width: ' + data.progress + ';"></div></div></div>';
                if (st.nowInstalledID === null) {
                    st.nowInstalledID = setInterval(st.checkBoxInstall, 1000);
                }
            } else {
                // failed
                html = '<div class="ins-app" align="center"><a class="ins-app-icon"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name">' + dispName + '(<font color="red"> ! </font>)</div></div>';
            }

            $("#insAppList").append(html);
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
          st.dispApplicationListSchema(results[i]);
      }
    }
};
st.dispApplicationListSchema = function(schemaJson) {
    var schema = schemaJson.SchemaUrl;
    cm.getProfile(schema).done(function(profData) {
        var dispName = profData.DisplayName;
        var description = profData.Description;
        var imageSrc = cm.notImage;
        if (profData.Image) {
            imageSrc = profData.Image;
        }
        var html = '<div class="ins-app" align="center"><a class="ins-app-icon" onClick="st.dispViewApp(\'' + schema + '\',\'' + dispName + '\',\'' + imageSrc + '\',\'' + description + '\',\'' + schemaJson.BarUrl + '\',\'' + schemaJson.BoxName + '\',true)"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div class="ins-app-name">' + dispName + '</div></div>';
        $("#appList").append(html);
   });
};
st.dispViewApp = function(schema, dispName, imageSrc, description, barUrl, barBoxName, insFlag) {
    $("#setting-panel2").empty();
    cm.setBackahead(true);
    var html = '<div class="panel-body">';
    html += '<div class="app-profile" id="dvAppProfileImage"><img class="image-circle" style="margin: auto;" id="imgAppProfileImage" src="' + imageSrc + '" alt="image" /><span style="margin-left: 10px;" id="txtAppName">' + dispName + '</span><br><br><br><h5>概要</h5><span id="txtDescription">' + description + '</span></div>';
    if (insFlag) {
        html += '<br><br><div class="toggleButton" style="text-align:center;"><a class="appToggle list-group-item" href="#" onClick="st.confBarInstall(\'' + schema + '\',\'' + barUrl + '\',\'' + barBoxName + '\');return(false);">' + mg.getMsg("00040") + '</a></div>';
    } else {
        html += '<br><br><div class="toggleButton" style="text-align:center;"><a class="appToggle list-group-item" href="#" onClick="return(false);">' + mg.getMsg("00041") + '</a></div>';
    }

    $("#setting-panel2").append(html);
    cm.setTitleMenu(mg.getMsg("00042"), true);
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
};
st.confBarInstall = function(schema, barUrl, barBoxName) {
    st.barSchemaUrl = schema;
    st.barFileUrl = barUrl;
    st.barBoxName = barBoxName;
    $("#dvTextConfirmation").html(mg.getMsg("I0020"));
    $("#modal-confirmation-title").html(mg.getMsg("00040"));
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
        cm.setTitleMenu(mg.getMsg("00032"), true);
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
    html += '<td style="width: 15%;"><a class="edit-button list-group-item" href="#" onClick="st.createEditRole(\'' + objRole.Name + '\',\'' + boxName + '\');return(false)">' + mg.getMsg("00003") + '</a></td>';
    html += '<td style="width: 15%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelRoleModal(\'' + objRole.Name + '\',\'' + boxName + '\');return(false)">' + mg.getMsg("00004") + '</a></td>';
    html += '</tr>';
    html += '</table></div>';
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="st.createAddRole()">＋ ' + mg.getMsg("00030") + '</a></div>';
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
    html += '<div id="dvAddRoleName">' + mg.getMsg("00035") + '</div>';
    html += '<div id="dvTextAddRoleName" style="margin-bottom: 10px;"><input type="text" id="addRoleName" value="' + name + '" onblur="st.addRoleNameBlurEvent();"><span class="popupAlertArea" style="color:red"><aside id="popupAddRoleNameErrorMsg"> </aside></span></div>';
    html += '<div id="dvAddRoleBox">' + mg.getMsg("I0017") + '</div>';
    html += '<div id="dvSelectAddRoleBox" style="margin-bottom: 10px;"><select name="" id="ddlRoleBoxList"><option>Please select a Box.</option></select><span class="popupAlertArea" style="color:red"><aside id="addRoleBoxMessage"> </aside></span></div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">Cancel</button>';
    if (st.updUser !== null) {
        html += '<button type="button" class="btn btn-primary" id="b-add-role-ok" onClick="st.addRole();">Edit</button>';
    } else {
        html += '<button type="button" class="btn btn-primary" id="b-add-role-ok" onClick="st.addRole();">Add</button>';
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
        cm.setTitleMenu(mg.getMsg("00043"), true);
    } else {
        cm.setTitleMenu(mg.getMsg("00030"), true);
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
    $('#dvTextConfirmation').html(mg.getMsg("I0009", name, box));
    $('#modal-confirmation-title').html(mg.getMsg("00008"));
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
      $("#addRoleBoxMessage").html("Please Select Box");
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
        cm.setTitleMenu(mg.getMsg("00033"), true);
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
    html += '<td style="width: 80%;"><a class="accountToggle" id="relationLinkToRoleToggle' + i + '" onClick="st.createRelationRole(\'' + objRelation.Name + '\',\'' + boxName + '\',\'' + i + '\')">';
    html += '<table class="table-fixed"><tr><td><p class="ellipsisText">' + objRelation.Name + '(' + boxName + ')</p></td></tr></table>';
    html += '</a></td>';
    html += '<td style="width: 10%;"><a class="edit-button list-group-item" href="#" onClick="st.createEditRelation(\'' + objRelation.Name + '\',\'' + boxName + '\');return(false)">' + mg.getMsg("00003") + '</a></td>';
    html += '<td style="width: 10%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelRelationModal(\'' + objRelation.Name + '\',\'' + boxName + '\');return(false)">' + mg.getMsg("00004") + '</a></td>';
    html += '</tr></table></div>';
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="st.createAddRelation()">＋ ' + mg.getMsg("00034") + '</a></div>';
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
        html += '<div id="dvAddRelationName">' + mg.getMsg("00035") + '</div>';
        html += '<div id="dvTextAddRelationName" style="margin-bottom: 10px;"><input type="text" id="addRelationName"><span class="popupAlertArea" style="color:red"><aside id="popupAddRelationNameErrorMsg"> </aside></span></div>';
        html += '<div id="dvAddRelationBox">' + mg.getMsg("I0016") + '</div>';
        html += '<div id="dvSelectAddRelationBox" style="margin-bottom: 10px;"><select name="ddlRelationBoxList" id="ddlAddRelationBoxList"><option>Please select a Box.</option></select><span class="popupAlertArea" style="color:red"><aside id="addRelationBoxMessage"> </aside></span></div>';
        html += '<div id="dvCheckAddRelationLinkRole" style="margin-bottom: 10px;"><label><input  class="widthAuto" type="checkbox" id="addCheckRelationLinkRole" onChange="st.changeCheckRelationLinkRole(this);">' + mg.getMsg("I0015") + '</label></div>';
        html += '<div id="dvSelectAddRelationLinkRole" style="margin-bottom: 10px;"><select name="" id="ddlAddRelLinkRoleList" multiple disabled><option>Select a role</option></select><span class="popupAlertArea" style="color:red"><aside id="popupAddRelationLinkRoleErrorMsg"> </aside></span></div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">Cancel</button>';
        html += '<button type="button" class="btn btn-primary" id="b-add-relation-ok" onClick="st.addRelation();">Add</button>';
        html += '</div></div>';
        $("#setting-panel2").append(html);
        cm.dispRoleList(data, "ddlAddRelLinkRoleList", true);
        cm.getBoxList().done(function(data) {
            st.dispBoxList(data, "ddlAddRelationBoxList", false);
        });
    });
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu(mg.getMsg("00034"), true);
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
    html += '<td style="width: 10%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelRelationRoleModal(\'' + relName + '\',\'' + relBoxName + '\',\'' + name + '\',\'' + boxName + '\',\'' + no + '\');return(false)">' + mg.getMsg("00029") + '</a></td>';
    html += '</tr></table></div>';
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="cm.dispAssignRole(\'rel\', true)">＋ ' + mg.getMsg("00005") + '</a></div>';
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
    $("#dvTextConfirmation").html(mg.getMsg("I0007", roleName, boxName));
    $("#modal-confirmation-title").html(mg.getMsg("00006"));
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
    html += '<div id="dvEditRelationName">' + mg.getMsg("00035") + '</div>';
    html += '<div id="dvTextEditRelationName" style="margin-bottom: 10px;"><input type="text" id="editRelationName" onblur="st.editRelationNameBlurEvent();" value="' + name + '"><span class="popupAlertArea" style="color:red"><aside id="popupEditRelationNameErrorMsg"> </aside></span></div>';
    html += '<div id="dvEditRelationBox">' + mg.getMsg("I0016") + '</div>';
    html += '<div id="dvSelectEditRelationBox" style="margin-bottom: 10px;"><select id="ddlEditRelationBoxList" onChange="st.changeRelationSelect();"><option>Please select a Box.</option></select><span class="popupAlertArea" style="color:red"><aside id="editRelationBoxMessage"> </aside></span>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">Cancel</button>';
    html += '<button type="button" class="btn btn-primary" id="b-edit-relation-ok" onClick="st.editRelationOk();" disabled>Edit</button>';
    html += '</div>';
    $("#setting-panel2").append(html);
    cm.getBoxList().done(function(data) {
        st.dispBoxList(data, "ddlEditRelationBoxList", false);
        $('#ddlEditRelationBoxList').val(box);
    });

    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu(mg.getMsg("00017"), true);
}
st.editRelationOk = function() {
    $('#dvTextConfirmation').html(mg.getMsg("I0006"));
    $('#modal-confirmation-title').html(mg.getMsg("00017"));
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
    $('#dvTextConfirmation').html(mg.getMsg("I0013", name, box));
    $('#modal-confirmation-title').html(mg.getMsg("00020"));
    $('#b-del-relation-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
st.editRelationNameBlurEvent = function() {
        var name = $("#editRelationName").val();
        var nameSpan = "popupEditRelationNameErrorMsg";
        var txtname = "#editRelationName";
        if (st.validateName(name, nameSpan, txtname)) {
            $('#b-edit-relation-ok').prop('disabled', false);
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
      $("#addRelationBoxMessage").html(mg.getMsg("E0016"));
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
        $("#popupAddRelationLinkErrorMsg").html(mg.getMsg("E0014"));
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
        $("#addRelationBoxMessage").html(mg.getMsg("E0016"));
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
st.validateName = function (displayName, displayNameSpan,txtID) {
        var MINLENGTH = 1;
        var MAXLENGTH = 128;
        var letters = /[0-9a-zA-Z-_!\$\*=\^`\{\|\}~\.@]+$/;
        var specialchar = /^[-_!\$\*=\^`\{\|\}~\.@]*$/;
        var allowedLetters = /[0-9a-zA-Z-_!\$\*=\^`\{\|\}~\.@]+$/;
        var lenDisplayName = displayName.length;
        document.getElementById(displayNameSpan).innerHTML = "";
        if(lenDisplayName < MINLENGTH || displayName == undefined || displayName == null || displayName == "") {
                document.getElementById(displayNameSpan).innerHTML =  mg.getMsg("E0003");
                return false;
        } else if (lenDisplayName >= MAXLENGTH) {
                document.getElementById(displayNameSpan).innerHTML = mg.getMsg("E0004");
                return false;
        } else if (lenDisplayName != 0 && ! (displayName.match(letters))){
                document.getElementById(displayNameSpan).innerHTML = mg.getMsg("E0005");
                return false;
        } else if (lenDisplayName != 0 && !(displayName.match(allowedLetters))) {
                document.getElementById(displayNameSpan).innerHTML = mg.getMsg("E0006");
                return false;
        } else if(lenDisplayName != 0 && (specialchar.toString().indexOf(displayName.substring(0,1)) >= 0)){
                document.getElementById(displayNameSpan).innerHTML = mg.getMsg("E0006");
                return false;
        }
        return true;
};
st.validateSchemaURL = function(schemaURL, schemaSpan, txtID) {
  var isHttp = schemaURL.substring(0, 5);
  var isHttps = schemaURL.substring(0, 6);
  var minURLLength = schemaURL.length;
  var validMessage = mg.getMsg("E0007");
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
    document.getElementById(schemaSpan).innerHTML = mg.getMsg("E0008");
    return false;
  } else if (domainName.match(startHyphenUnderscore)) {
    document.getElementById(schemaSpan).innerHTML = mg.getMsg("E0009");
    return false;
  } else if (!(domainName.match(letters))) {
    document.getElementById(schemaSpan).innerHTML = mg.getMsg("E0005");
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
		document.getElementById(errorSpan).innerHTML = mg.getMsg("E0011");
		return false;
	}
	var lenCellName = domainName.length;
	if (domainName.match(startHyphenUnderscore)) {
		document.getElementById(errorSpan).innerHTML = mg.getMsg("E0009");
		return false;
	} else if (lenCellName != 0 && !(domainName.match(letters))) {
		document.getElementById(errorSpan).innerHTML = mg.getMsg("E0005");
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
      msg = mg.getMsg("E0012");
      bool = false;
    } else if (check.val().match(/[^0-9a-zA-Z_-]+/)) {
      msg = mg.getMsg("E0013");
      bool = false;
    }

    $('#' + displayNameSpan).html(msg);
  }

  return bool;
};
st.changePassCheck = function(newpass, confirm, displayNameSpan) {
  $('#' + displayNameSpan).html("");
  if (newpass !== confirm) {
    $('#' + displayNameSpan).html(mg.getMsg("E0002"));
    return false
  }

  return true;
};
st.passInputCheck = function(newpass, displayNameSpan) {
  $('#' + displayNameSpan).html("");
  if (newpass.length == 0) {
    $('#' + displayNameSpan).html(mg.getMsg("E0010"));
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