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
    $('#b-ins-bar-ok').on('click', function () { st.execBarInstall(); });
    $('#b-unins-box-ok').on('click', function () { st.execUninstallBox(); });

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
        $('#b-ins-bar-ok').css("display", "none");
        $('#b-unins-box-ok').css("display", "none");
    });

    // menu-toggle
    $("#editProfToggle").on("click", function () {
        st.createEditProfScreen();
    });
    $("#changePassword").on("click", function () {
        st.createChgPassScreen();
    });
    $("#changeLanguage").on("click", function () {
        st.createChgLngScreen();
    });
    $("#accountToggle").on("click", function() {
      st.createAccountList();
    });
    $("#applicationToggle").on("click", function () {
      st.createApplicationMgr();
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
        $("#popupAddAccountLinkRoleErrorMsg").empty();
        //cm.setLinkParam(value);
        return true;
    }
};

// Creating a profile editing screen
st.createEditProfScreen = function () {
    $("#setting-panel1").remove();
    cm.setBackahead(true);
    st.dispEditProf();
    $(".setting-menu").toggleClass('slide-on');
    cm.setTitleMenu("EditProfile", true);
    cm.populateProfileEditData();
}
// View profile edit screen
st.dispEditProf = function () {
    $("#setting-panel1").empty();
    var html = [
        '<div class="modal-body">',
            '<form class="form-horizontal">',
                '<div class="form-group">',
                    '<div class="col-sm-12">',
                        '<div calss="checkbox">',
                            '<label>',
                                '<input type="checkbox" name="onlyUploadChk" value="">',
                                '<span data-i18n="langOnlyUpload"></span>',
                            '</label>',
                        '</div>',
                    '</div>',
                '</div>',
            '</form>',
            '<div id="dvDisplayName" data-i18n="DisplayName"></div>',
            '<div id="dvTextDisplayName">',
                '<input type="text" id="editDisplayName" onblur="cm.editDisplayNameBlurEvent();">',
            '</div>',
            '<span class="popupAlertArea" style="color:red">',
                '<aside id="popupEditDisplayNameErrorMsg"></aside>',
            '</span>',
            '<div id="dvDescription" data-i18n="Description"></div>',
            '<div id="dvTextDescription">',
                '<textarea onblur="cm.editDescriptionBlurEvent();" name="" cols="" rows=""  id="editDescription"></textarea>',
            '</div>',
            '<span style="padding-top: 3px;height:11px;color:red;">',
                '<aside id="popupEditDescriptionErrorMsg"></aside>',
            '</span>',
            '<div class="row">',
                '<div class="col-sm-6">',
                    '<div id="dvPhoto" data-i18n="ProfileImage"></div>',
                    '<div id="dvBrowseButtonSection">',
                    '<input type="file" class="fileUpload" onclick="cm.clearInput(this);" onchange="cm.attachFile(\'popupEditUserPhotoErrorMsg\', \'editImgFile\');" id="editImgFile" accept="image/*" style="display: none">',
                    '<button class="btn btn-primary" id="editImgButton" type="button" data-i18n="SelectFile"></button>',
                    '<label id="editImgLbl" style="margin-left:10px;"></label>',
                '</div>',
                '<div id="dvBoxProfileImage" style="margin-top: 10px;">',
                    '<figure id="figEditCellProfile" class="boxProfileImage">',
                        '<img class="image-circle-large" style="margin: auto;" id="idImgFile" data-i18n="[src]profTrans:myProfile_Image" src="#" alt="image" />',
                    '</figure>',
                '</div>',
                '<span style="padding-top: 3px;height:11px;color:red;">',
                    '<aside id="popupEditUserPhotoErrorMsg"></aside>',
                '</span>',
            '</div>',
            '<div class="col-sm-6">',
                '<div data-i18n="QRCode"></div>',
                '<div style="margin-top: 10px;">',
                    '<figure id="qrcodeEditCellProfile" class="boxProfileImage"></figure>',
                '</div>',
            '</div>',
            '<div class="modal-footer">',
                '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);" data-i18n="Cancel"></button>',
                '<button type="button" class="btn btn-primary" id="b-edit-profile-ok" onClick="cm.updateCellProfile();" data-i18n="Register"></button>',
            '</div>',
        '</div>'
    ].join("");
    $("#setting-panel1").append(html).localize();
    var aImg;
    aImg = cm.createQRCodeImg('https://chart.googleapis.com/chart?cht=qr&chs=177x177&chl=' + sessionStorage.targetCellUrl);
    $("#qrcodeEditCellProfile").append($(aImg));

    $("#editImgButton,#editImgLbl").on('click', function () {
        $("#editImgFile").click();
    });
}

// Creating a change password screen
st.createChgPassScreen = function () {
    $("#setting-panel1").remove();
    cm.setBackahead(true);
    st.dispChgPass();
    $(".setting-menu").toggleClass('slide-on');
    cm.setTitleMenu("ChangePass", true);
}
// View change password screen
st.dispChgPass = function () {
    $("#setting-panel1").empty();
    var html = [
        '<div class="modal-body">',
            '<input type="password" data-i18n="[placeholder]newPassPlaceHolder" id="pNewPassword" onblur="cm.charCheck($(this));">',
            '<span id="changeMessage" style="color:red"></span>',
            '<input type="password" data-i18n="[placeholder]confirmNewPass" id="pConfirm">',
            '<span id="confirmMessage" style="color:red"></span>',
        '</div>',
        '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);" data-i18n="Cancel"></button>',
            '<button type="button" class="btn btn-primary" id="b-change-password-ok" data-i18n="Update" disabled></button>',
        '</div>'
    ].join("");
    $("#setting-panel1").append(html).localize();

    $('#b-change-password-ok').on('click', function () {
        cm.changePassCheck($("#pNewPassword").val(), $("#pConfirm").val());
    });
}

// Creating a change language screen
st.createChgLngScreen = function () {
    $("#setting-panel1").remove();
    cm.setBackahead(true);
    st.dispChgLng();
    $(".setting-menu").toggleClass('slide-on');
    cm.setTitleMenu("ChangeLng", true);
}
// View change language screen
st.dispChgLng = function () {
    $("#setting-panel1").empty();
    var html = [
        '<div class="modal-body">',
            '<span data-i18n="changeLanguageDescription"></span>',
            '<select class="form-control" id="selectLng">',
                '<option value="en" data-i18n="English"></option>',
                '<option value="ja" data-i18n="Japanese"></option>',
            '</select>',
            '<span id="selectLngMessage" style="color:red"></span>',
        '</div>',
        '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);" data-i18n="Cancel"></button>' +
            '<button type="button" class="btn btn-primary" id="b-setlng-ok" data-i18n="Setup"></button>' +
        '</div>'
    ].join("");
    $("#setting-panel1").append(html).localize();
    $("#selectLng").val(i18next.language);
    $("#b-setlng-ok").on('click', function () {
        $("#selectLng option:selected").each(function (index, option) {
            i18next.changeLanguage($(option).val(), function (err, t) { updateContent(); })
            cm.moveBackahead(true);
        });
    });
}

/////////////
// Account //
/////////////
// アカウント追加画面作成
st.createAddAccount = function() {
    $("#setting-panel2").empty();
    cm.setBackahead(true);
    cm.getRoleList().done(function (data) {
     var html = '<div class="modal-body">';
        html += '   <div id="dvAccType" data-i18n="AuthType"></div>';
        html += '   <div class="row" id="dvRadioAccType" style="margin-bottom: 10px;">';
        html += '       <div class="row col-xs-12 col-sm-6 radio-inline">';
        html += '           <div class="col-xs-2 col-sm-2"><input type="radio" value="basic" name="accType" id="accType_password" checked></div>';
        html += '           <div class="col-xs-10 col-sm-10"><label for="accType_password" data-i18n="authType.basic"></label></div>';
        html += '       </div>';
        html += '       <div class="row col-xs-12 col-sm-6">';
        html += '           <div class="col-xs-2 col-sm-2"><input type="radio" value="oidc:google" name="accType" id="accType_google"></div>';
        html += '           <div class="col-xs-10 col-sm-10"><label for="accType_google" data-i18n="authType.google"></label></div>';
        html += '       </div>';
        html += '   </div>';

        html += '   <div id="dvAddName">' + i18next.t("AccountName") + '</div>';
        html += '   <div id="dvTextAddName" style="margin-bottom: 10px;">';
        html += '       <input type="text" id="addAccountName" placeholder="' + i18next.t("accountNamePlaceHolder") + '" onblur="st.addAccountNameBlurEvent();">';
        html += '       <span class="popupAlertArea" style="color:red">';
        html += '           <aside id="popupAddAccountNameErrorMsg"> </aside>';
        html += '       </span>';
        html += '   </div>';
        html += '   <div id="passField">';
        html += '       <div id="dvAddPassword">' + i18next.t("Password") + '</div>';
        html += '       <div id="dvTextAddNewPassword" style="margin-bottom: 10px;">';
        html += '           <input type="password" placeholder="' + i18next.t("newPassPlaceHolder") + '" id="pAddNewPassword" onblur="st.blurNewPassword(this, \'b-add-account-ok\', \'addChangeMessage\');">';
        html += '           <span class="popupAlertArea" style="color:red">';
        html += '               <aside id="addChangeMessage"> </aside>';
        html += '           </span>';
        html += '       </div>';
        html += '       <div id="dvAddConfirm">' + i18next.t("confirmNewPass") + '</div>';
        html += '       <div id="dvTextAddConfirm" style="margin-bottom: 10px;">';
        html += '           <input type="password" placeholder="' + i18next.t("confirmNewPass") + '" id="pAddConfirm" onblur="st.blurConfirm(\'pAddNewPassword\', \'pAddConfirm\', \'addConfirmMessage\');">';
        html += '           <span class="popupAlertArea" style="color:red">';
        html += '               <aside id="addConfirmMessage"> </aside>';
        html += '           </span>';
        html += '       </div>';
        html += '   </div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '   <button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">' + i18next.t("Cancel") + '</button>';
        html += '   <button type="button" class="btn btn-primary" id="b-add-account-ok" onClick="st.addAccount();">' + i18next.t("Create") + '</button>';
        html += '</div>';
        $("#setting-panel2").append(html).localize();
        $("input[name=accType]").change(function () {
            $("#addAccountName").val("");
            $("#popupAddAccountNameErrorMsg").html("");
            if ($("input[name=accType]:checked").val() == "basic") {
                $("#passField").css("display", "block");
                $("#dvAddName").html(i18next.t("AccountName"));
                $("#addAccountName").attr("placeholder", i18next.t("accountNamePlaceHolder"));
            } else {
                $("#passField").css("display", "none");
                $("#dvAddName").html(i18next.t("GMailAddress"));
                $("#addAccountName").attr("placeholder", i18next.t("gmailPlaceHolder"));
            }
        });
    });
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu("CreateAccount", true);
};

// アカウント作成時、ロール割り当て選択時処理
st.changeCheckAccountLinkRole = function(obj) {
    if (obj.checked) {
        $("#ddlAddAccLinkRoleList").val("");
        $("#ddlAddAccLinkRoleList").prop('disabled', false);
    } else {
        $("#ddlAddAccLinkRoleList").val("");
        $("#popupAddAccountLinkRoleErrorMsg").empty();
        $("#ddlAddAccLinkRoleList").prop('disabled', true);
    }
};
// アカウント割り当てロール一覧表示
st.dispAccountRoleList = function(json, accName, no) {
  $("#setting-panel2").empty();
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })
  var html = '<div class="panel-body" id="accRoleList">';
  html += '</div>';
  $("#setting-panel2").append(html);
  var html = '<div class="panel-body">';
  for (var i = 0; i < results.length; i++) {
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

    var profTag = "";
    if (matchBox) {
        profTag = [
            '<tr>',
            '<td>',
            '<img class="image-circle-small" data-i18n="[src]profTrans:' + boxName + '_Image" src="' + ut.getJdenticon(boxName) + '" alt="user">',
            '<font color="LightGray" data-i18n="profTrans:' + boxName + '_DisplayName"></font>',
            '</td>',
            '</tr>'
        ].join("");
    }

    var tempHTML = [
        '<table class="table-fixed">',
        '<tr>',
        '<td rowspan="3" style="width: 25%;"><img class="image-circle" data-i18n="[src]profTrans:' + name + '_' + boxName + '_Image" src="' + ut.getJdenticon(boxName) + '" alt="user"></td>',
        '<td class="ellipsisText" data-i18n="profTrans:' + name + '_' + boxName + '_DisplayName">' + name + '(' + boxName + ')</td>',
        '</tr>',
        '<tr>',
        '<td><p class="ellipsisText"><font color="LightGray" data-i18n="profTrans:' + name + '_' + boxName + '_Description"></font></p></td>',
        '</tr>',
        profTag,
        '</table>'
    ].join("");
    var firstCell = $('<td>', {
        style: 'width: 90%;'
    }).append(tempHTML);

    var html = '';
    var anotherTag = $('<a>', {
        class: 'del-button list-group-item',
        style: 'top:25%;',
        onClick: 'st.dispDelAccountRoleModal(\'' + accName + '\',\'' + name + '\',\'' + boxName + '\',\'' + no + '\')',
        'data-i18n': 'Del'
    });
    var secondCell = $('<td>', {
        style: 'width: 10%;'
    }).append($(anotherTag));

    var aRow = $('<tr>').append($(firstCell), $(secondCell));

    var aTable = $('<table>', {
        style: 'width: 100%;'
    }).append($(aRow));

    var aDiv = $('<div>', {
        class: 'list-group-item'
    }).append($(aTable));
    $("#accRoleList").append($(aDiv)).localize();

    //html += '<div class="list-group-item">';
    //html += '<table class="table-fixed"><tr>';
    //html += '<td style="width: 85%;"><p class="ellipsisText" data-i18n="profTrans:' + name + '_' + boxName + '_DisplayName">' + name + '(' + boxName + ')</p></td>';
    //html += '<td colspan="2" style="width: 15%;"><a class="del-button list-group-item" href="#" onClick="st.dispDelAccountRoleModal(\'' + accName + '\',\'' + name + '\',\'' + boxName + '\',\'' + no + '\');return(false)">' + i18next.t("Detach") + '</a></td>';
    //html += '</tr>';
    //html += '</table></div>';
  }
  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="cm.dispAssignRole(\'acc\', true)" data-i18n="AssigningRolesPlus"></a></div>';
  $("#accRoleList").append(html).localize();
}
st.dispDelAccountRoleModal = function(accName, roleName, boxName, no) {
    st.linkAccName = accName;
    cm.linkName = roleName;
    if (boxName === "[main]") {
        cm.linkBoxName = null;
        $("#dvTextConfirmation").html(i18next.t("removeAssociationRole", { value1: roleName, value2: boxName })).localize();
    } else {
        cm.linkBoxName = boxName;
        $("#dvTextConfirmation").html(i18next.t("removeAssociationRole", { value1: i18next.t("profTrans:" + roleName + "_" + boxName + "_DisplayName"), value2: "" })).localize();
    }
    st.linkAccNameNo = no;
    
    $("#modal-confirmation-title").html(i18next.t("DeleteAssigningRole"));
    $('#b-del-acclinkrole-ok').css("display","");
    $('#modal-confirmation').modal('show');
}


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
  for (var i = 0; i < results.length; i++) {
    var objBox = json.d.results[i];
    var boxName = objBox.Name;
    $("#" + id).append('<option value="' + boxName + '">' + boxName + '</option>');
  }
}

st.editAccountNameBlurEvent = function() {
        var name = $("#editAccountName").val();
        var nameSpan = "popupEditAccountNameErrorMsg";
        $('#b-edit-account-ok').prop('disabled', !st.validateName(name, nameSpan, "-_!\$\*=^`\{\|\}~.@", ""));
};

st.validateEditedInfo = function() {
  var name = $("#editAccountName").val();
  var type = $("#editAccountName").data('accType');
  if (st.validateName(name, "popupEditAccountNameErrorMsg", "-_!\$\*=^`\{\|\}~.@", "")) {
    var pass = $("#pEditNewPassword").val();

    if (type === "basic" && !st.passInputCheck(pass, "editChangeMessage")) {
        return false;
    }
    if (type === "basic" && !st.changePassCheck(pass, $("#pEditConfirm").val(), "editConfirmMessage")) {
        return false;
    }

    $('#dvTextConfirmation').html(i18next.t("confirmChangeContentEnter"));
    $('#modal-confirmation-title').html(i18next.t("EditAccount"));
    $('#b-edit-accconfirm-ok').css("display", "");
    $('#modal-confirmation').modal('show');
  }

  return false;
}

// Application
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
    var results = json.d.results;
    results.sort(function(val1, val2) {
      return (val1.SchemaUrl < val2.SchemaUrl ? 1 : -1);
    })
    for (var i = 0; i < results.length; i++) {
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
            url: cm.getMyCellUrl() + st.barBoxName + '/',
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
                am.insAppList = new Array();
                am.insAppBoxList = new Array();
                for (var i in insAppRes) {
                    var schema = insAppRes[i].Schema;
                    if (schema && schema.length > 0) {
                        am.insAppList.push(schema);
                        // hotfix for not showing HomeApplication/Cell Manager's box inside a data subject's cell
                        if (!_.contains(cm.boxIgnoreList, insAppRes[i].Schema)) {
                            am.insAppBoxList.push(insAppRes[i].Name);
                        };
                    }
                }
                am.dispInsAppListSetting();

                // application list
                st.getApplicationList().done(function(data) {
                    am.dispApplicationList(data);
                    $("#modal-confirmation").modal("hide");
                    cm.moveBackahead();
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
st.confUninstallApp = function (boxName) {
    st.barBoxName = boxName;
    $("#dvTextConfirmation").html(i18next.t("confirmUninstallation"));
    //$("#modal-confirmation-title").html(dispName);
    $("#modal-confirmation-title").attr("data-i18n", "profTrans:" + boxName + "_DisplayName").localize();
    $('#b-unins-box-ok').css("display", "");
    $('#modal-confirmation').modal('show');
};
st.execUninstallBox = function () {
    cm.recursiveDeleteBoxAPI(st.barBoxName).done(function () {
        cm.getBoxList().done(function (data) {
            var insAppRes = data.d.results;
            insAppRes.sort(function (val1, val2) {
                return (val1.Name < val2.Name ? 1 : -1);
            })
            am.insAppList = new Array();
            am.insAppBoxList = new Array();
            for (var i in insAppRes) {
                var schema = insAppRes[i].Schema;
                if (schema && schema.length > 0) {
                    am.insAppList.push(schema);
                    // hotfix for not showing HomeApplication/Cell Manager's box inside a data subject's cell
                    if (!_.contains(cm.boxIgnoreList, insAppRes[i].Schema)) {
                        am.insAppBoxList.push(insAppRes[i].Name);
                    };
                }
            }
            am.dispInsAppListSetting();

            // application list
            st.getApplicationList().done(function (data) {
                am.dispApplicationList(data);
                $("#modal-confirmation").modal("hide");
                cm.moveBackahead();
            }).fail(function (data) {
                var res = JSON.parse(data.responseText);
                alert("An error has occurred.\n" + res.message.value);
            });
        }).fail(function (data) {
            var res = JSON.parse(data.responseText);
            alert("An error has occurred.\n" + res.message.value);
        });
    }).fail(function (data) {
        var res = JSON.parse(data.responseText);
        alert("An error has occurred.\n" + res.message.value);
    });
}

/////////////////////////
// Application Manager //
/////////////////////////
st.createApplicationMgr = function () {
    $("#setting-panel1").remove();
    cm.setBackahead(true);

    var html = [
        '<div class="panel-body">',
        '<ul class="list menu-list">',
        '<li>',
        '<a href="#" class="list-group-item disabled" onclick="st.openAppliDelPanel(); return false;" data-i18n="ApplicationDelete"></a>',
        '<span class="badge" id="receiveBadge"></span>',
        '</li>',
        '<li>',
        '<a href="#" class="list-group-item" onclick="st.openBoxInstall(); return false;" data-i18n="BoxInstall"></a>',
        '<span class="badge" id="receiveBadge"></span>',
        '</li>',
        '</ul>',
        '</div>'
    ].join("");
    $("#setting-panel1").append(html).localize();

    $(".setting-menu").toggleClass('slide-on');
    cm.setTitleMenu("Application", true);
}
st.openAppliDelPanel = function () {
    return false;
}
st.openBoxInstall = function () {
    $("#setting-panel2").empty();
    cm.setBackahead(true);

    html = [
        '<div class="modal-body">',
          '<div>',
            '<span data-i18n="BoxInstall" style="margin-right:10px;"></span>',
            '<input id="boxInstallSwitch" style="margin-left: auto;" type="checkbox">',
          '</div>',
          '<div>',
            '<p class="text-danger" id="boxInsWarningMsg" data-i18n="warningBoxInstallNotAllowed"></p>',
          '</div>',
          '<div class="container" id="dvBoxInstall" style="display:none;">',
            '<div class="row">',
              '<div class="col-xs-2 col-sm-1">',
                '<div style="margin-top:10px;">',
                  '<input type="radio" value="typeSelect" name="boxInsType" id="boxInsType_select" checked>',
                '</div>',
              '</div>',
              '<div class="col-xs-10 col-sm-11">',
                '<fieldset id="boxInsSelect">',
                  '<input class="resetField" type="file" class="fileUpload" onchange="st.attachBarFile();" id="selectBarFile" accept="bar/*" style="display: none">',
                  '<button class="btn btn-primary" id="selectBarButton" type="button" data-i18n="SelectBar"></button>',
                  '<label id="selectBarFileLbl" style="margin-left:10px;"></label>',
                '</fieldset>',
                '<span id="selectBarErrorMsg" style="color:red"></span>',
              '</div>',
            '</div>',
            '<div class="row">',
              '<div class="col-xs-2 col-sm-1">',
                '<div style="margin-top:15px;">',
                  '<input type="radio" value="typeInput" name="boxInsType" id="boxInsType_input">',
                '</div>',
              '</div>',
              '<div class="col-xs-10 col-sm-11">',
                '<fieldset id="boxInsInput" disabled>',
                  '<input class="resetField" type="text" value="" id="input_barUrl" onblur="st.inputBarUrlBlurEvent();" data-i18n="[placeholder]barfileUrlInput">',
                '</fieldset>',
                '<span id="inputBarErrorMsg" style="color:red"></span>',
              '</div>',
            '</div>',
            '<div class="row">',
              '<div class="col-xs-2 col-sm-1">',
                '<div style="margin-top:15px;" data-i18n="BoxName">',
                '</div>',
              '</div>',
              '<div class="col-xs-10 col-sm-11">',
                '<input class="resetField" type="text" value="" id="inputBoxName" onblur="st.inputBoxNameBlurEvent();">',
                '<span id="inputBoxErrorMsg" style="color:red"></span>',
              '</div>',
            '</div>',
            '<div class="row">',
              '<button type="button" id="unofficialBoxInsBtn" class="btn btn-primary text-capitalize" data-i18n="Install" onClick="st.unofficialBoxInstall();" disabled>',
            '</div>',
            '<div>',
              '<hr />',
              '<span data-i18n="Status"></span>',
            '</div>',
            '<div class="container" id="installStatus">',
            '</div>',
          '</div>',
        '</div>'
    ].join("");
    $("#setting-panel2").append(html).localize();
    $("#boxInstallSwitch").bootstrapSwitch();
    if (cm.user.boxInstallAuth) {
        $("#boxInstallSwitch").bootstrapSwitch("state", cm.user.boxInstallAuth);
        $("#boxInsWarningMsg").attr("data-i18n", "warningBoxInstallAllow").localize();
        $("#dvBoxInstall").css("display", "block");
    }

    // set events
    $("#boxInstallSwitch").on('switchChange.bootstrapSwitch', function (event, state) {
        $("#dvBoxInstall").toggle(state);
        cm.user.boxInstallAuth = state;
        sessionStorage.setItem("sessionData", JSON.stringify(cm.user));
        if (state) {
            $("#boxInsWarningMsg").attr("data-i18n", "warningBoxInstallAllow").localize();
        } else {
            $("#boxInsWarningMsg").attr("data-i18n", "warningBoxInstallNotAllowed").localize();
        }
        
    });
    $("input[name=boxInsType]").change(function () {
        if ($("input[name=boxInsType]:checked").val() == "typeSelect") {
            // select bar file
            $("#boxInsSelect").attr("disabled", false);
            $("#boxInsInput").attr("disabled", true);
            $("#selectBarErrorMsg").css("display", "block");
            $("#inputBarErrorMsg").css("display", "none");
        } else {
            // input bar file
            $("#boxInsSelect").attr("disabled", true);
            $("#boxInsInput").attr("disabled", false);
            $("#selectBarErrorMsg").css("display", "none");
            $("#inputBarErrorMsg").css("display", "block");
        }
        st.checkUnofficialBoxInsConditions();
    });
    $("#selectBarButton,#selectBarFileLbl").on('click', function () {
        $("#selectBarFile").click();
    });

    // box Installation status display
    var insArray = sessionStorage.getItem("insBarList");
    if (insArray) {
        insArray = JSON.parse(insArray);
        for (var no in insArray) {
            var boxname = insArray[no];
            var html = [
                '<div class="row">',
                '<div class="col-xs-6 barEllipsis" title="' + boxname + '">',
                no + '. ' + boxname,
                '</div>',
                '<div class="col-xs-6 barEllipsis" id="boxIns_' + boxname + '" data-no="' + no + '">',
                '</div>',
                '</div>'
            ].join("");
            $("#installStatus").append(html);
            st.dispUnofficialBoxInsProgress(boxname);
        }
    }

    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu("BoxInstall", true);
}
st.attachBarFile = function () {
    $("#selectBarErrorMsg").empty();
    st.barFileArrayBuffer = null;
    var file = document.getElementById("selectBarFile").files[0];
    var fileUrl = document.getElementById("selectBarFile").value;
    if (st.checkBarUrl(fileUrl)) {
        try {
            var reader = new FileReader();
        } catch (e) {
            // reading error
            st.displayUnofficialBoxInsMsg("selectBarErrorMsg", "errorReadingFile");
            return;
        }
        reader.readAsArrayBuffer(file);
        reader.onload = function (evt) {
            st.barFileArrayBuffer = evt.target.result;
            $("#selectBarFileLbl").html(fileUrl);
            $("#inputBoxName").val(ut.getName(fileUrl, true));
            st.checkUnofficialBoxInsConditions();
        }
        reader.onerror = function (evt) {
            // reading error
            st.displayUnofficialBoxInsMsg("selectBarErrorMsg", "errorReadingFile");
        }
    } else {
        // FileFormat error
        st.displayUnofficialBoxInsMsg("selectBarErrorMsg", "errorFileFormat");
    }
}
st.inputBarUrlBlurEvent = function () {
    $("#inputBarErrorMsg").empty();
    var fileUrl = $("#input_barUrl").val();
    if (!fileUrl) {
        st.displayUnofficialBoxInsMsg("inputBarErrorMsg", "barfileUrlInput");
        return;
    }

    if (st.checkBarUrl(fileUrl)) {
        $("#inputBoxName").val(ut.getName(fileUrl, true));
        st.checkUnofficialBoxInsConditions();
    } else {
        // FileFormat error
        st.displayUnofficialBoxInsMsg("inputBarErrorMsg", "errorFileFormat");
    }
}
st.inputBoxNameBlurEvent = function() {
    var name = $("#inputBoxName").val();
    var nameSpan = "inputBoxErrorMsg";
    if (st.validateName(name, nameSpan, "-_", "")) {
        $("#nameSpan").empty();
        st.checkUnofficialBoxInsConditions();
    } else {
        $("#unofficialBoxInsBtn").prop("disabled", true);
    }
}
st.checkBarUrl = function (fileUrl) {
    var fileName = ut.getName(fileUrl);
    var ext = _.last(_.compact(fileName.split("\.")));
    if ("bar" == ext) {
        return true;
    } else {
        return false;
    }
}
st.unofficialBoxInstall = function () {
    var boxName = $("#inputBoxName").val();
    if (!$("#inputBoxName").val()) {
        // Box name not entered
        st.displayUnofficialBoxInsMsg("inputBoxErrorMsg", "pleaseEnterName");
        return;
    }

    if ($("input[name=boxInsType]:checked").val() == "typeSelect") {
        // select
        if (st.barFileArrayBuffer) {
            st.execUnofficialBoxInstall();
        } else {
            // File not selected
            st.displayUnofficialBoxInsMsg("selectBarErrorMsg", "errorBarFileNotSelected");
        }
    } else {
        // input
        var url = $("#input_barUrl").val();
        if (url && boxName) {
            var barFilePath = url;
            var oReq = new XMLHttpRequest();
            oReq.open("GET", barFilePath);
            oReq.responseType = "arraybuffer";
            oReq.setRequestHeader("Content-Type", "application/zip");
            oReq.onload = function (e) {
                st.barFileArrayBuffer = oReq.response;
                st.execUnofficialBoxInstall();
            }
            oReq.send();
        } else {
            // bar File URL is not entered
            st.displayUnofficialBoxInsMsg("inputBarErrorMsg", "errorBarFileUrlNotEntered");
        }
    }
}
st.execUnofficialBoxInstall = function () {
    var view = new Uint8Array(st.barFileArrayBuffer);
    var blob = new Blob([view], { "type": "application/zip" });
    var boxName = $("#inputBoxName").val();
    $.ajax({
        type: "MKCOL",
        url: cm.getMyCellUrl() + boxName + '/',
        data: blob,
        processData: false,
        headers: {
            'Authorization': 'Bearer ' + cm.user.access_token,
            'Content-type': 'application/zip'
        }
    }).done(function(data) {
        var insArray = sessionStorage.getItem("insBarList");
        if (!insArray) {
            insArray = [];
        } else {
            try {
                insArray = JSON.parse(insArray);
            } catch (e) {
                console.log(e);
            }
        }
        var no = insArray.length;
         
        // Add installation list
        var html = [
            '<div class="row">',
            '<div class="col-xs-6 barEllipsis" title="' + boxName + '">',
            no + '. ' + boxName,
            '</div>',
            '<div class="col-xs-6 barEllipsis" id="boxIns_' + boxName + '" data-no="' + no + '">',
            '</div>',
            '</div>'
        ].join("");
        $("#installStatus").append(html);
        st.dispUnofficialBoxInsProgress(boxName);
        insArray.push(boxName);
        sessionStorage.setItem("insBarList", JSON.stringify(insArray));
        
    }).fail(function (data) {
        // box installation failure
        var res = JSON.parse(data.responseText);
        alert("An error has occurred.\n" + res.message.value);
    }).always(function (data) {
        st.resetInputFields();
    });
}
st.resetInputFields = function () {
    $("#dvBoxInstall .resetField").val("");
    $("#selectBarFileLbl").empty();
    st.barFileArrayBuffer = null;
    $("#boxInsType_select").click();
}
st.displayUnofficialBoxInsMsg = function (id, msgId) {
    $("#" + id).attr("data-i18n", msgId).localize();
    $("#unofficialBoxInsBtn").prop("disabled", true);
}
st.checkUnofficialBoxInsConditions = function () {
    var insFlg = true;
    if ($("input[name=boxInsType]:checked").val() == "typeSelect") {
        // select bar file
        if ($("#selectBarErrorMsg").html()) {
            insFlg = false;
        }
        if (!st.barFileArrayBuffer) {
            insFlg = false;
        }
    } else {
        // input bar file
        if ($("#inputBarErrorMsg").html()) {
            insFlg = false;
        }
        if (!$("#input_barUrl").val()) {
            insFlg = false;
        }
    }
    if ($("#inputBoxErrorMsg").html()) {
        insFlg = false;
    }

    if (insFlg) {
        $("#unofficialBoxInsBtn").prop("disabled", false);
    } else {
        $("#unofficialBoxInsBtn").prop("disabled", true);
    }
}
st.dispUnofficialBoxInsProgress = function (boxname) {
    var no = $("#boxIns_" + boxname).data("no");
    cm.getBoxStatus(boxname).done(function (data) {
        var status = data.status;
        var resHtml = "";
        if (status.indexOf('ready') >= 0) {
            // ready
            resHtml = "<span data-i18n='Success'></span>";
            if (typeof (ha) != "undefined") {
                // Redraw the application list if it is the main screen
                // Register Schema Profile in data-i18n
                cm.getBoxList().done(function (data) {
                    var insAppRes = data.d.results;
                    for (var i in insAppRes) {
                        var schema = insAppRes[i].Schema;
                        var boxName = insAppRes[i].Name;
                        if (schema && schema.length > 0) {
                            cm.registerProfI18n(schema, boxName, "profile", "App");
                        }
                    }
                })
                ha.dispInsAppList();
            }
        } else if (status.indexOf('progress') >= 0) {
            // progress
            resHtml = [
                '<div id="boxInsParent_' + no + '" class="progress progress-striped active">',
                  '<div id="nowInstall_' + no + '" class="progress-bar progress-bar-success" style="width: ' + data.progress + ';">',
                  '</div>',
                '</div>',
            ].join("");
        } else {
            // failed
            resHtml = "<span data-i18n='Failed' title='" + data.message.message.value + "'></span>";
        }

        $("#boxIns_" + boxname).html(resHtml).localize();
        if (status.indexOf('progress') >= 0) {
            setTimeout(function () { st.updateUnofficialBoxInsProgress(no)}, 1000);
        }
    }).fail(function (data) {
        if (data.status == "404") {
            // Box Not Found
            resHtml = "<span data-i18n='[title]errorBoxStatusNotFound'><span data-i18n='errorBoxStatusNotFound'></span></span>";
            $("#boxIns_" + boxname).html(resHtml).localize();
        } else {
            // Communication error
            resHtml = "<span data-i18n='[title]errorBoxStatusCommunication'><span data-i18n='errorBoxStatusCommunication'></span></span>";
            $("#boxIns_" + boxname).html(resHtml).localize();
        }
    })
}
st.updateUnofficialBoxInsProgress = function(no) {
    var insArray = JSON.parse(sessionStorage.getItem("insBarList"));
    cm.getBoxStatus(insArray[no]).done(function(data) {
        var status = data.status;
        if (status.indexOf('ready') >= 0) {
            $("#boxInsParent_" + no).remove();
            var html = "<span data-i18n='Success'></span>";
            $("#boxIns_" + insArray[no]).html(html).localize();
            if (typeof (ha) != "undefined") {
                // Redraw the application list if it is the main screen
                ha.dispInsAppList();
            }
        } else if (status.indexOf('progress') >= 0) {
            $('#nowInstall_' + no).css("width", data.progress);
            setTimeout(function () { st.updateUnofficialBoxInsProgress(no) }, 1000);
        } else {
            $('#boxInsParent_' + no).remove();
            var html = "<span data-i18n='Failed' title='" + data.message.message.value + "'></span>";
            $("#boxIns_" + insArray[no]).html(html).localize();
        }
    });
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
  for (var i = 0; i < results.length; i++) {
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

  for (var i = 0; i < results.length; i++) {
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
    var uri = cm.getMyCellUrl() + '__ctl/Relation';
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
  for (var i = 0; i < results.length; i++) {
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
        $("#popupAddRelationLinkErrorMsg").empty();
        return true;
    }
};
st.restCreateRelationAPI = function(json) {
  $.ajax({
          type: "POST",
          url: cm.getMyCellUrl() + '__ctl/Relation',
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
    var uri = cm.getMyCellUrl() + '__ctl/Role';
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
          url: cm.getMyCellUrl() + '__ctl/Relation(' + rel + ')/$links/_Role',
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
    var uri = cm.getMyCellUrl() + '__ctl/Relation';
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




// API


st.restDeleteAccountAPI = function() {
  $.ajax({
          type: "DELETE",
          url: cm.getMyCellUrl() + '__ctl/Account(\'' + st.updUser + '\')',
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
          url: cm.getMyCellUrl() + '__ctl/Role',
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
          url: cm.getMyCellUrl() + api,
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
          url: cm.getMyCellUrl() + api,
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
    var uri = cm.getMyCellUrl() + '__ctl/Role';
  if (cm.linkBoxName === null) {
    uri += '(\'' + cm.linkName + '\')';
  } else {
    uri += '(Name=\'' + cm.linkName + '\',_Box\.Name=\'' + cm.linkBoxName + '\')';
  }
  var json = {"uri":uri};

  $.ajax({
          type: "POST",
          url: cm.getMyCellUrl() + '__ctl/Account(Name=\'' + st.linkAccName + '\')/$links/_Role',
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
          url: cm.getMyCellUrl() + api,
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
    var uri = cm.getMyCellUrl() + '__ctl/Relation';
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
          url: cm.getMyCellUrl() + api,
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
    if (_.isEmpty(elements)) {
        clearInterval(st.nowInstalledID);
    } else {
        _.each(elements, function(ele, i, list) {
            let no = ele.id.split('_')[1];
            st.updateProgress(no, ele.id);
        });
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
