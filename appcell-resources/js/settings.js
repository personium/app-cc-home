ha.updUser = null;
var insAppList = new Array();
var insAppBoxList = new Array();
var nowInstalledID = null;

var testProgPar = 0;

$(document).ready(function() {
    // Create Profile Menu
    createProfileHeaderMenu();
    // Create Side Menu
    createSideMenu();
    // Create Title Header
    createTitleHeader();
    // Create Back Button
    createBackMenu("main.html");
    // Set Title
    setTitleMenu(getMsg("00001"));
    setIdleTime();

    $('#b-edit-accconfirm-ok').on('click', function () { 
        ha.editAccount();
    });
    $('#b-del-account-ok').on('click', function () { ha.restDeleteAccountAPI(); });
    $('#b-del-role-ok').on('click', function () { ha.restDeleteRoleAPI(); });
    $('#b-del-acclinkrole-ok').on('click', function () { ha.restDeleteAccountLinkRole(); });
    $('#b-edit-relation-ok').on('click', function () { 

    });
    $('#b-edit-relconfirm-ok').on('click', function () { 
        ha.editRelation();
    });
    $('#b-del-relation-ok').on('click', function () { ha.restDeleteRelationAPI(); });
    $('#b-del-rellinkrole-ok').on('click', function () { ha.restDeleteRelationLinkRole(); });
    $('#b-ins-bar-ok').on('click', function() { ha.execBarInstall(); });

    $("#modal-confirmation").on("hidden.bs.modal", function () {
        ha.updUser = null;
        ha.updBox = null;
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
    $("#accountToggle.toggle").on("click", function() {
      ha.createAccountList();
    });
    $("#applicationToggle.toggle").on("click", function() {
      ha.createApplicationList();
      //testAPI();
    });
    $("#roleToggle").on("click", function() {
      ha.createRoleList();
    });
    $("#relationToggle.toggle").on("click", function() {
      ha.createRelationList();
    });
});
ha.getName = function(path) {
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
ha.slideToggle = function(id) {
    $("#" + id).slideToggle();
}
ha.checkAccLinkRole = function() {
    var value = $("#ddlAddAccLinkRoleList option:selected").val();
    if (value === undefined) {
        $("#popupAddAccountLinkRoleErrorMsg").html("Please select a role.");
        return false;
    } else {
        $("#popupAddAccountLinkRoleErrorMsg").html("");
        //ha.setLinkParam(value);
        return true;
    }
};
ha.setLinkParam = function(value) {
    var roleMatch = value.match(/(.+)\(/);
    ha.linkRoleName = roleMatch[1];
    var boxMatch = value.match(/\((.+)\)/);
    var boxName = boxMatch[1];
    if (boxName === "[main]") {
        boxName = null;
    }
    ha.linkBoxName = boxName;
};

// Account
ha.createAccountList = function() {
    $("#toggle-panel1").remove();
    setBackahead();
    ha.getAccountList().done(function(data) {
        ha.dispAccountList(data);
        $("#toggle-panel1,.panel-default").toggleClass('slide-on');
        setTitleMenu(getMsg("00028"));
    });
};
ha.getAccountList = function() {
  return $.ajax({
          type: "GET",
          url:ha.user.cellUrl + '__ctl/Account',
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  })
}
ha.dispAccountList = function(json) {
  $("#toggle-panel1").empty();
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
    html += '<td style="width: 80%;"><a class="accountToggle ellipsisText" id="accountLinkToRoleToggle' + i + '" onClick="ha.createAccountRole(\'' + acc.Name + '\',\'' + i + '\')">' + acc.Name + '&nbsp;<img class="image-circle-small" src="' + typeImg + '"></a></td>';
    if (acc.Name !== ha.user.username) {
        html += '<td style="margin-right:10px;width: 10%;"><a class="edit-button list-group-item" href="#" onClick="ha.createEditAccount(\'' + acc.Name + '\');return(false)">' + getMsg("00003") + '</a></td>'
             + '<td style="width: 10%;"><a class="del-button list-group-item" href="#" onClick="ha.dispDelModal(\'' + acc.Name + '\');return(false)">' + getMsg("00004") + '</a></td>';
    }
    html += '</tr></table></div>';
    //$("#dvAccountList").append(html);
    //ha.getAccountRoleList(acc.Name, i);
  }
  html += '<div class="list-group-item">';
  //html += '<a class="allToggle" href="#" data-toggle="modal" data-target="#modal-add-account">＋ ' + getMsg("00031") + '</a></div>';
  html += '<a class="allToggle" onClick="ha.createAddAccount()">＋ ' + getMsg("00031") + '</a></div>';
  html += '</div>';
  $("#toggle-panel1").append(html);
}
ha.setLinkAccName = function(accName, no) {
  ha.linkAccName = accName;
  ha.linkAccNameNo = no;
}
ha.createAddAccount = function() {
    $("#toggle-panel2").empty();
    setBackahead();
    getRoleList().done(function(data) {
        var html = '<div class="panel-body">';
        html += '<div id="dvAddName">' + getMsg("00035") + '</div>';
        html += '<div id="dvTextAddName" style="margin-bottom: 10px;">';
        html += '<input type="text" id="addAccountName" onblur="ha.addAccountNameBlurEvent();">';
        html += '<span class="popupAlertArea" style="color:red">';
        html += '<aside id="popupAddAccountNameErrorMsg"> </aside>';
        html += '</span></div>';
        html += '<div id="dvAddPassword">' + getMsg("00036") + '</div>';
        html += '<div id="dvTextAddNewPassword" style="margin-bottom: 10px;">';
        html += '<input type="password" placeholder="' + getMsg("I0005") + '" id="pAddNewPassword" onblur="ha.blurNewPassword(this, \'b-add-account-ok\', \'addChangeMessage\');">';
        html += '<span class="popupAlertArea" style="color:red">';
        html += '<aside id="addChangeMessage"> </aside>';
        html += '</span></div>';
        html += '<div id="dvAddConfirm">' + getMsg("I0003") + '</div>';
        html += '<div id="dvTextAddConfirm" style="margin-bottom: 10px;">';
        html += '<input type="password" placeholder="' + getMsg("I0003") + '" id="pAddConfirm" onblur="ha.blurConfirm(\'pAddNewPassword\', \'pAddConfirm\', \'addConfirmMessage\');">';
        html += '<span class="popupAlertArea" style="color:red">';
        html += '<aside id="addConfirmMessage"> </aside>';
        html += '</span></div>';
        html += '<div id="dvCheckAddAccountLinkRole" style="margin-bottom: 10px;">';
        html += '<label><input type="checkbox" id="addCheckAccountLinkRole" onChange="ha.changeCheckAccountLinkRole(this);">' + getMsg("I0015") + '</label>';
        html += '</div>';
        html += '<div id="dvSelectAddAccountLinkRole" style="margin-bottom: 10px;">';
        html += '<select name="" id="ddlAddAccLinkRoleList" onblur="ha.checkAccLinkRole();" multiple disabled><option>Select a role</option></select>';
        html += '<span class="popupAlertArea" style="color:red"><aside id="popupAddAccountLinkRoleErrorMsg"> </aside></span>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" onClick="moveBackahead();">Cancel</button>';
        html += '<button type="button" class="btn btn-primary" id="b-add-account-ok" onClick="ha.addAccount();">Add</button>';
        html += '</div></div>';
        $("#toggle-panel2").append(html);
        dispRoleList(data, "ddlAddAccLinkRoleList", true);
    });
    $("#toggle-panel2").toggleClass('slide-on');
    $("#toggle-panel1").toggleClass('slide-on-holder');
    setTitleMenu(getMsg("00031"));
};
ha.blurNewPassword = function(obj, btnId, msgId) {
    var bool = ha.charCheck($(obj), msgId);
    $('#' + btnId).prop('disabled', !bool);
};
ha.blurConfirm = function(pwid, cnid, msgid) {
    ha.changePassCheck($("#" + pwid).val(), $("#" + cnid).val(), msgid);
};
ha.changeCheckAccountLinkRole = function(obj) {
    if (obj.checked) {
        $("#ddlAddAccLinkRoleList").val("");
        $("#ddlAddAccLinkRoleList").prop('disabled', false);
    } else {
        $("#ddlAddAccLinkRoleList").val("");
        $("#popupAddAccountLinkRoleErrorMsg").html("");
        $("#ddlAddAccLinkRoleList").prop('disabled', true);
    }
};
ha.createAccountRole = function(accName, no) {
  ha.setLinkAccName(accName, no);
  $("#toggle-panel2").remove();
  setBackahead();
  ha.getAccountRoleList(accName, no).done(function(data) {
      ha.dispAccountRoleList(data, accName, no);
      $("#toggle-panel2").toggleClass('slide-on');
      $("#toggle-panel1").toggleClass('slide-on-holder');
      setTitleMenu(accName);
  });
}
ha.getAccountRoleList = function(accName, no) {
  return $.ajax({
          type: "GET",
          url:ha.user.cellUrl + '__ctl/Account(Name=\'' + accName + '\')/$links/_Role',
          //data:{'url':ha.user.cellUrl + '__ctl/Role(\'rolename\')'},
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  })
}
ha.dispAccountRoleList = function(json, accName, no) {
  $("#toggle-panel2").empty();
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })
  var html = '<div class="panel-body">';
  for (var i in results) {
    var acc = json.d.results[i];
    var url = acc.uri;
    //var re = new RegExp("\(Name='(.+)',", "g");
    //var re = new RegExp("Name");
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
    html += '<td colspan="2" style="width: 15%;"><a class="del-button list-group-item" href="#" onClick="ha.dispDelAccountRoleModal(\'' + accName + '\',\'' + name + '\',\'' + boxName + '\',\'' + no + '\');return(false)">' + getMsg("00029") + '</a></td>';
    html += '</tr>';
    html += '</table></div>';
    //$("#dvAccountRoleList" + no).append(html);
  }
  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="dispAssignRole(\'acc\')">＋ ' + getMsg("00005") + '</a></div>';
  //html += '<a class="allToggle" href="#" data-toggle="modal" data-target="#modal-add-acclinkrole">＋ ' + getMsg("00005") + '</a></div>';
  html += '</div>';
  $("#toggle-panel2").append(html);
}
ha.dispDelAccountRoleModal = function(accName, roleName, boxName, no) {
    ha.linkAccName = accName;
    ha.linkRoleName = roleName;
    if (boxName === "[main]") {
      ha.linkBoxName = null;
    } else {
      ha.linkBoxName = boxName
    }
    ha.linkAccNameNo = no;
    $("#dvTextConfirmation").html(getMsg("I0007", roleName, boxName));
    $("#modal-confirmation-title").html(getMsg("00006"));
    $('#b-del-acclinkrole-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
ha.createEditAccount = function(name) {
    ha.updUser = name;
    $("#toggle-panel2").empty();
    setBackahead();
    var html = '<div class="panel-body">';
    html += '<div id="dvEditName">' + getMsg("00035") + '</div>';
    html += '<div id="dvTextEditName" style="margin-bottom: 10px;"><input type="text" id="editAccountName" onblur="ha.editAccountNameBlurEvent();" value="' + name + '"><span class="popupAlertArea" style="color:red"><aside id="popupEditAccountNameErrorMsg"> </aside></span></div>';
    html += '<div id="dvEditPassword">' + getMsg("00036") + '</div>';
    html += '<div id="dvTextEditNewPassword" style="margin-bottom: 10px;"><input type="password" placeholder="' + getMsg("I0005") + '" id="pEditNewPassword" onblur="ha.blurNewPassword(this, \'b-edit-account-ok\', \'editChangeMessage\');"><span class="popupAlertArea" style="color:red"><aside id="editChangeMessage"> </aside></span></div>';
    html += '<div id="dvTextEditConfirm" style="margin-bottom: 10px;"><input type="password" placeholder="' + getMsg("I0003") + '" id="pEditConfirm" onblur="ha.blurConfirm(\'pEditNewPassword\', \'pEditConfirm\', \'editConfirmMessage\');"><span class="popupAlertArea" style="color:red"><aside id="editConfirmMessage"> </aside></span></div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="moveBackahead();">Cancel</button>';
    html += '<button type="button" class="btn btn-primary" id="b-edit-account-ok" onClick="ha.editAccountOk();" disabled>Edit</button>';
    html += '</div></div>';
    $("#toggle-panel2").append(html);
    $("#toggle-panel2").toggleClass('slide-on');
    $("#toggle-panel1").toggleClass('slide-on-holder');
    setTitleMenu(getMsg("00002"));
};
ha.editAccountOk = function() {
    $('#dvTextConfirmation').html(getMsg("I0006"));
    $('#modal-confirmation-title').html(getMsg("00002"));
    $('#b-edit-accconfirm-ok').css("display","");
    $('#modal-confirmation').modal('show');
};
ha.dispDelModal = function(name) {
    ha.updUser = name;
    $("#dvTextConfirmation").html(getMsg("I0008", name));
    $('#modal-confirmation-title').html(getMsg("00007"));
    $('#b-del-account-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
ha.dispBoxList = function(json, id) {
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
ha.addAccountNameBlurEvent = function() {
        var name = $("#addAccountName").val();
        var nameSpan = "popupAddAccountNameErrorMsg";
        var txtname = "#addAccountName";
        ha.validateName(name, nameSpan, txtname);
};
ha.editAccountNameBlurEvent = function() {
        var name = $("#editAccountName").val();
        var nameSpan = "popupEditAccountNameErrorMsg";
        var txtname = "#editAccountName";
        if (ha.validateName(name, nameSpan, txtname)) {
            $('#b-edit-account-ok').prop('disabled', false);
        }
};
ha.addAccount = function() {
  var name = $("#addAccountName").val();
  if (ha.validateName(name, "popupAddAccountNameErrorMsg")) {
    var pass = $("#pAddNewPassword").val();
    if (ha.passInputCheck(pass, "addChangeMessage")
     && ha.changePassCheck(pass, $("#pAddConfirm").val(), "addConfirmMessage")) {
        var jsonData = {
                        "Name" : name
        };

        // Assigning Roles
        var chkObj = document.getElementById("addCheckAccountLinkRole");
        if (chkObj.checked) {
          if (ha.checkAccLinkRole()) {
            ha.linkAccName = name;
            ha.restCreateAccountAPI(jsonData, pass);
            return true;
          }
        } else {
          ha.restCreateAccountAPI(jsonData, pass);
          return true;
        }
    }
  }

  return false;
};
ha.editAccount = function() {
  var keyName = ha.updUser;
  var name = $("#editAccountName").val();
  if (ha.validateName(name, "popupEditAccountNameErrorMsg")) {
    var pass = $("#pEditNewPassword").val();
    if (ha.changePassCheck($("#pEditNewPassword").val(), $("#pEditConfirm").val(), "editConfirmMessage")) {
        var jsonData = {
                        "Name" : name
        };

        ha.restEditAccountAPI(jsonData, pass, keyName);
        return true;
    }
  }

  return false;
}

// Application
ha.createApplicationList = function() {
    $("#toggle-panel1").remove();
    setBackahead();
    var html = '<div class="panel-body"><table><tr><td>installed<div id="insAppList"></div></td></tr><tr><td><hr>application list<div id="appList"></div></td></tr></div>';
    $("#toggle-panel1").append(html);
    // install application list
    getBoxList().done(function(data) {
        var insAppRes = data.d.results;
        insAppRes.sort(function(val1, val2) {
            return (val1.Name < val2.Name ? 1 : -1);
        })
        insAppList = new Array();
        insAppBoxList = new Array();
        for (var i in insAppRes) {
            var schema = insAppRes[i].Schema;
            if (schema && schema.length > 0) {
                insAppList.push(schema);
                insAppBoxList.push(insAppRes[i].Name);
            }
        }
        ha.dispInsAppList();

        // application list
        ha.getApplicationList().done(function(data) {
            ha.dispApplicationList(data);
            $("#toggle-panel1,.panel-default").toggleClass('slide-on');
            setTitleMenu(getMsg("00039"));
        }).fail(function(data) {
            alert(data);
        });
    });
};
ha.getApplicationList = function() {
    return $.ajax({
            type: "GET",
            url: ha.user.baseUrl + 'market/__/applist.json',
            datatype: 'json',
            headers: {
              'Accept':'application/json'
            }
    })
};
ha.dispInsAppList = function() {
    $("#insAppList").empty();
    nowInstalledID = null;
    for (var i in insAppList) {
        ha.dispInsAppListSchema(insAppList[i], insAppBoxList[i], i);
    }
};
ha.dispInsAppListSchema = function(schema, boxName, no) {
    getProfile(schema).done(function(profData) {
        var dispName = profData.DisplayName;
        var imageSrc = notImage;
        if (profData.Image) {
            imageSrc = profData.Image;
        }
        getBoxStatus(boxName).done(function(data) {
            var status = data.status;
            var html = '';
            if (status.indexOf('ready') >= 0) {
                // ready
                html = '<div class="ins-app" align="center"><a id="insAppNo_' + no + '" class="ins-app-icon" onClick="uninstallApp(\'' + schema + '\', \'' + boxName + '\')"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name">' + dispName + '</div>';

                // test -->
                //html += '<div id="nowInstallParent_' + no + '" class="progress progress-striped active" style="height: 10px;"><div name="nowInstall" id="nowInstall_' + no + '" class="progress-bar progress-bar-success" style="width: ' + testProgPar + '%;"></div></div>';
                //testProgPar = 0;
                //if (nowInstalledID === null) {
                //    nowInstalledID = setInterval(checkBoxInstallTest, 1000);
                //}
                // <-- test

                html += '</div>';
            } else if (status.indexOf('progress') >= 0) {
                // progress
                html = '<div class="ins-app" align="center"><a id="insAppNo_' + no + '" class="ins-app-icon"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name">' + dispName + '</div><div id="nowInstallParent_' + no + '" class="progress progress-striped active"><div name="nowInstall" id="nowInstall_' + no + '" class="progress-bar progress-bar-success" style="width: ' + data.progress + ';"></div></div></div>';
                if (nowInstalledID === null) {
                    setInterval(checkBoxInstall, 1000);
                }
            } else {
                // failed
                html = '<div class="ins-app" align="center"><a class="ins-app-icon"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name">' + dispName + '(<font color="red"> ! </font>)</div></div>';
            }

            $("#insAppList").append(html);
        });
    });
};
ha.dispApplicationList = function(json) {
    $("#appList").empty();
    var results = json.Apps;
    results.sort(function(val1, val2) {
      return (val1.SchemaUrl < val2.SchemaUrl ? 1 : -1);
    })
    for (var i in results) {
      var schema = results[i].SchemaUrl;
      if (insAppList.indexOf(schema) < 0) {
          ha.dispApplicationListSchema(results[i]);
      }
    }
};
ha.dispApplicationListSchema = function(schemaJson) {
    var schema = schemaJson.SchemaUrl;
    getProfile(schema).done(function(profData) {
        var dispName = profData.DisplayName;
        var description = profData.Description;
        var imageSrc = notImage;
        if (profData.Image) {
            imageSrc = profData.Image;
        }
        var html = '<div class="ins-app" align="center"><a class="ins-app-icon" onClick="ha.dispViewApp(\'' + schema + '\',\'' + dispName + '\',\'' + imageSrc + '\',\'' + description + '\',\'' + schemaJson.BarUrl + '\',\'' + schemaJson.BoxName + '\',true)"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div class="ins-app-name">' + dispName + '</div></div>';
        $("#appList").append(html);
   });
};
ha.dispViewApp = function(schema, dispName, imageSrc, description, barUrl, barBoxName, insFlag) {
    $("#toggle-panel2").empty();
    setBackahead();
    var html = '<div class="panel-body">';
    html += '<div class="app-profile" id="dvAppProfileImage"><img class="image-circle" style="margin: auto;" id="imgAppProfileImage" src="' + imageSrc + '" alt="image" /><span style="margin-left: 10px;" id="txtAppName">' + dispName + '</span><br><br><br><h5>概要</h5><span id="txtDescription">' + description + '</span></div>';
    if (insFlag) {
        html += '<br><br><div class="toggleButton" style="text-align:center;"><a class="appToggle list-group-item" href="#" onClick="ha.confBarInstall(\'' + schema + '\',\'' + barUrl + '\',\'' + barBoxName + '\');return(false);">' + getMsg("00040") + '</a></div>';
    } else {
        html += '<br><br><div class="toggleButton" style="text-align:center;"><a class="appToggle list-group-item" href="#" onClick="return(false);">' + getMsg("00041") + '</a></div>';
    }

    $("#toggle-panel2").append(html);
    setTitleMenu(getMsg("00042"));
    $("#toggle-panel2").toggleClass('slide-on');
    $("#toggle-panel1").toggleClass('slide-on-holder');
};
ha.confBarInstall = function(schema, barUrl, barBoxName) {
    ha.barSchemaUrl = schema;
    ha.barFileUrl = barUrl;
    ha.barBoxName = barBoxName;
    $("#dvTextConfirmation").html(getMsg("I0020"));
    $("#modal-confirmation-title").html(getMsg("00040"));
    $('#b-ins-bar-ok').css("display","");
    $('#modal-confirmation').modal('show');
};
ha.execBarInstall = function() {
    var barFilePath = ha.barSchemaUrl + ha.barFileUrl;
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
            url: ha.user.cellUrl + ha.barBoxName + '/',
            data: blob,
            processData: false,
            headers: {
                'Authorization':'Bearer ' + ha.user.access_token,
                'Content-type':'application/zip'
            }
        }).done(function(data) {
            getBoxList().done(function(data) {
                var insAppRes = data.d.results;
                insAppRes.sort(function(val1, val2) {
                    return (val1.Name < val2.Name ? 1 : -1);
                })
                insAppList = new Array();
                insAppBoxList = new Array();
                for (var i in insAppRes) {
                    var schema = insAppRes[i].Schema;
                    if (schema && schema.length > 0) {
                        insAppList.push(schema);
                        insAppBoxList.push(insAppRes[i].Name);
                    }
                }
                ha.dispInsAppList();

                // application list
                ha.getApplicationList().done(function(data) {
                    ha.dispApplicationList(data);
                    $("#modal-confirmation").modal("hide");
                    moveBackahead();
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
ha.createRoleList = function() {
    $("#toggle-panel1").remove();
    setBackahead();
    getRoleList().done(function(data) {
        ha.dispRoleList(data);
        $("#toggle-panel1,.panel-default").toggleClass('slide-on');
        setTitleMenu(getMsg("00032"));
    });
};
ha.dispRoleList = function(json) {
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })

  var html = "";
  $("#toggle-panel1").empty();
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
    html += '<td style="width: 15%;"><a class="edit-button list-group-item" href="#" onClick="ha.createEditRole(\'' + objRole.Name + '\',\'' + boxName + '\');return(false)">' + getMsg("00003") + '</a></td>';
    html += '<td style="width: 15%;"><a class="del-button list-group-item" href="#" onClick="ha.dispDelRoleModal(\'' + objRole.Name + '\',\'' + boxName + '\');return(false)">' + getMsg("00004") + '</a></td>';
    html += '</tr>';
    html += '</table></div>';
    //$("#dvRoleList").append(html);
  }

  html += '<div class="list-group-item">';
  //html += '<a class="allToggle" href="#" data-toggle="modal" data-target="#modal-add-role">＋ ' + getMsg("00030") + '</a></div>';
  html += '<a class="allToggle" href="#" onClick="ha.createAddRole()">＋ ' + getMsg("00030") + '</a></div>';
  html += '</div>';
  $("#toggle-panel1").append(html);
};
ha.createAddRole = function() {
    ha.updUser = null;
    ha.updBox = null;
    ha.operationRole();
};
ha.operationRole = function() {
    var name = "";
    if (ha.updUser !== null) {
        name = ha.updUser;
    }
    $("#toggle-panel2").empty();
    setBackahead();
    var html = '<div class="panel-body">';
    html += '<div id="dvAddRoleName">' + getMsg("00035") + '</div>';
    html += '<div id="dvTextAddRoleName" style="margin-bottom: 10px;"><input type="text" id="addRoleName" value="' + name + '" onblur="ha.addRoleNameBlurEvent();"><span class="popupAlertArea" style="color:red"><aside id="popupAddRoleNameErrorMsg"> </aside></span></div>';
    html += '<div id="dvAddRoleBox">' + getMsg("I0017") + '</div>';
    html += '<div id="dvSelectAddRoleBox" style="margin-bottom: 10px;"><select name="" id="ddlRoleBoxList"><option>Please select a Box.</option></select><span class="popupAlertArea" style="color:red"><aside id="addRoleBoxMessage"> </aside></span></div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="moveBackahead();">Cancel</button>';
    if (ha.updUser !== null) {
        html += '<button type="button" class="btn btn-primary" id="b-add-role-ok" onClick="ha.addRole();">Edit</button>';
    } else {
        html += '<button type="button" class="btn btn-primary" id="b-add-role-ok" onClick="ha.addRole();">Add</button>';
    }
    
    html += '</div></div>';
    $("#toggle-panel2").append(html);
    getBoxList().done(function(data) {
        ha.dispBoxList(data, "ddlRoleBoxList", false);
        if (ha.updUser !== null) {
            var box = ha.updBox;
            if (ha.updBox === null) {
                box = "[main]";
            }
            $("#ddlRoleBoxList").val(box);
        }
    });

    $("#toggle-panel2").toggleClass('slide-on');
    $("#toggle-panel1").toggleClass('slide-on-holder');
    if (ha.updUser !== null) {
        setTitleMenu(getMsg("00043"));
    } else {
        setTitleMenu(getMsg("00030"));
    }
};
ha.createEditRole = function(name, box) {
    ha.updUser = name;
    if (box === "[main]") {
      ha.updBox = null;
    } else {
      ha.updBox = box;
    }
    ha.operationRole();
}
ha.dispDelRoleModal = function(name, box) {
    ha.updUser = name;
    if (box === "[main]") {
      ha.updBox = null;
    } else {
      ha.updBox = box;
    }
    $('#dvTextConfirmation').html(getMsg("I0009", name, box));
    $('#modal-confirmation-title').html(getMsg("00008"));
    $('#b-del-role-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
ha.addRoleNameBlurEvent = function() {
        var name = $("#addRoleName").val();
        var nameSpan = "popupAddRoleNameErrorMsg";
        var txtname = "#addRoleName";
        ha.validateName(name, nameSpan, txtname);
};
ha.addRole = function() {
  var name = $("#addRoleName").val();
  var box = $("#ddlRoleBoxList option:selected").val();
  if (box === "") {
      $("#addRoleBoxMessage").html("Please Select Box");
      return false;
  } else if (box === "[main]") {
      box = null;
  }
  //if (ha.validateName(name, "popupAddExtCellUrlErrorMsg")) {
    var jsonData = {
                    "Name" : name,
                    "_Box.Name" : box
    };

    if (ha.updUser === null) {
        ha.restCreateRoleAPI(jsonData);
    } else {
        ha.restEditRoleAPI(jsonData);
    }
  //}
};

// Relation
ha.createRelationList = function() {
    $("#toggle-panel1").remove();
    setBackahead();
    getRelationList().done(function(data) {
        ha.dispRelationList(data, null, false);
        $("#toggle-panel1,.panel-default").toggleClass('slide-on');
        setTitleMenu(getMsg("00033"));
    });
};
ha.dispRelationList = function(json) {
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })
  
  var html = '';
  $("#toggle-panel1").empty();
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
    html += '<td style="width: 80%;"><a class="accountToggle" id="relationLinkToRoleToggle' + i + '" onClick="ha.createRelationRole(\'' + objRelation.Name + '\',\'' + boxName + '\',\'' + i + '\')">';
    html += '<table class="table-fixed"><tr><td><p class="ellipsisText">' + objRelation.Name + '(' + boxName + ')</p></td></tr></table>';
    html += '</a></td>';
    html += '<td style="width: 10%;"><a class="edit-button list-group-item" href="#" onClick="ha.createEditRelation(\'' + objRelation.Name + '\',\'' + boxName + '\');return(false)">' + getMsg("00003") + '</a></td>';
    html += '<td style="width: 10%;"><a class="del-button list-group-item" href="#" onClick="ha.dispDelRelationModal(\'' + objRelation.Name + '\',\'' + boxName + '\');return(false)">' + getMsg("00004") + '</a></td>';
    html += '</tr></table></div>';
    //$("#dvRelationList").append(html);
    //ha.getRelationRoleList(objRelation.Name, objRelation["_Box.Name"], i);
  }

  html += '<div class="list-group-item">';
  //html += '<a class="allToggle" href="#" data-toggle="modal" data-target="#modal-add-relation">＋ ' + getMsg("00034") + '</a></div>';
  html += '<a class="allToggle" href="#" onClick="ha.createAddRelation()">＋ ' + getMsg("00034") + '</a></div>';
  html += '</div>';
  $("#toggle-panel1").append(html);
};
ha.setLinkRelName = function(relName, boxName, no) {
    ha.linkRelName = relName;
    ha.linkRelBoxName = boxName;
    ha.linkRelNo = no;
};
ha.createAddRelation = function() {
    ha.updUser = null;
    $("#toggle-panel2").empty();
    setBackahead();
    getRoleList().done(function(data) {
        var html = '<div class="panel-body">';
        html += '<div id="dvAddRelationName">' + getMsg("00035") + '</div>';
        html += '<div id="dvTextAddRelationName" style="margin-bottom: 10px;"><input type="text" id="addRelationName"><span class="popupAlertArea" style="color:red"><aside id="popupAddRelationNameErrorMsg"> </aside></span></div>';
        html += '<div id="dvAddRelationBox">' + getMsg("I0016") + '</div>';
        html += '<div id="dvSelectAddRelationBox" style="margin-bottom: 10px;"><select name="ddlRelationBoxList" id="ddlAddRelationBoxList"><option>Please select a Box.</option></select><span class="popupAlertArea" style="color:red"><aside id="addRelationBoxMessage"> </aside></span></div>';
        html += '<div id="dvCheckAddRelationLinkRole" style="margin-bottom: 10px;"><label><input type="checkbox" id="addCheckRelationLinkRole" onChange="ha.changeCheckRelationLinkRole(this);">' + getMsg("I0015") + '</label></div>';
        html += '<div id="dvSelectAddRelationLinkRole" style="margin-bottom: 10px;"><select name="" id="ddlAddRelLinkRoleList" multiple disabled><option>Select a role</option></select><span class="popupAlertArea" style="color:red"><aside id="popupAddRelationLinkRoleErrorMsg"> </aside></span></div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" onClick="moveBackahead();">Cancel</button>';
        html += '<button type="button" class="btn btn-primary" id="b-add-relation-ok" onClick="ha.addRelation();">Add</button>';
        html += '</div></div>';
        $("#toggle-panel2").append(html);
        dispRoleList(data, "ddlAddRelLinkRoleList", true);
        getBoxList().done(function(data) {
            ha.dispBoxList(data, "ddlAddRelationBoxList", false);
        });
    });
    $("#toggle-panel2").toggleClass('slide-on');
    $("#toggle-panel1").toggleClass('slide-on-holder');
    setTitleMenu(getMsg("00034"));
};
ha.changeCheckRelationLinkRole = function(obj) {
    if (obj.checked) {
        $("#ddlAddRelLinkRoleList").prop('disabled', false);
    } else {
        $("#ddlAddRelLinkRoleList").prop('disabled', true);
    }
};
ha.createRelationRole = function(relName, boxName, no) {
    var relBoxName = boxName;
    if (boxName === "[main]") {
      boxName = null;
    }
    ha.setLinkRelName(relName, boxName, no);
    $("#toggle-panel2").remove();
    setBackahead();
    ha.getRelationRoleList(relName, boxName, no).done(function(data) {
        ha.dispRelationRoleList(data, relName, boxName, no);
        $("#toggle-panel2").toggleClass('slide-on');
        $("#toggle-panel1").toggleClass('slide-on-holder');
        setTitleMenu(relName + '(' + relBoxName + ')');
    });
}
ha.getRelationRoleList = function(relName, boxName, no) {
  var uri = ha.user.cellUrl + '__ctl/Relation';
  if (boxName === null) {
     uri += '(\'' + relName + '\')/$links/_Role';
  } else {
     uri += '(Name=\'' + relName + '\',_Box.Name=\'' + boxName + '\')/$links/_Role';
  }
  return $.ajax({
          type: "GET",
          url:uri,
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  })
};
ha.dispRelationRoleList = function(json, relName, relBoxName, no) {
  $("#toggle-panel2").empty();
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
    html += '<td style="width: 95%;">' + name + '(' + boxName + ')</td>';
    html += '<td colspan="2" style="width: 5%;"><a class="del-button list-group-item" href="#" onClick="ha.dispDelRelationRoleModal(\'' + relName + '\',\'' + relBoxName + '\',\'' + name + '\',\'' + boxName + '\',\'' + no + '\');return(false)">' + getMsg("00029") + '</a></td>';
    html += '</tr></table></div>';
    //$("#dvRelationRoleList" + no).append(html);
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="dispAssignRole(\'rel\')">＋ ' + getMsg("00005") + '</a></div>';
  //html += '<a class="allToggle" href="#" data-toggle="modal" data-target="#modal-add-rellinkrole">＋ ' + getMsg("00005") + '</a></div>';
  html += '</div>';
  $("#toggle-panel2").append(html);
}
ha.dispDelRelationRoleModal = function(relName, relBoxName, roleName, boxName, no) {
    ha.linkRelName = relName;
    if (relBoxName === "null") {
      ha.linkRelBoxName = null;
    } else {
      ha.linkRelBoxName = relBoxName;
    }
    ha.linkRoleName = roleName;
    if (boxName === "[main]") {
      ha.linkBoxName = null;
    } else {
      ha.linkBoxName = boxName
    }
    ha.linkRelNameNo = no;
    $("#dvTextConfirmation").html(getMsg("I0007", roleName, boxName));
    $("#modal-confirmation-title").html(getMsg("00006"));
    $('#b-del-rellinkrole-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
ha.createEditRelation = function(name, box) {
    ha.updUser = name;
    if (box === "[main]") {
      ha.updBox = null;
    } else {
      ha.updBox = box;
    }
    $("#toggle-panel2").empty();
    setBackahead();
    var html = '<div class="panel-body">';
    html += '<div id="dvEditRelationName">' + getMsg("00035") + '</div>';
    html += '<div id="dvTextEditRelationName" style="margin-bottom: 10px;"><input type="text" id="editRelationName" onblur="ha.editRelationNameBlurEvent();" value="' + name + '"><span class="popupAlertArea" style="color:red"><aside id="popupEditRelationNameErrorMsg"> </aside></span></div>';
    html += '<div id="dvEditRelationBox">' + getMsg("I0016") + '</div>';
    html += '<div id="dvSelectEditRelationBox" style="margin-bottom: 10px;"><select id="ddlEditRelationBoxList" onChange="ha.changeRelationSelect();"><option>Please select a Box.</option></select><span class="popupAlertArea" style="color:red"><aside id="editRelationBoxMessage"> </aside></span>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="moveBackahead();">Cancel</button>';
    html += '<button type="button" class="btn btn-primary" id="b-edit-relation-ok" onClick="ha.editRelationOk();" disabled>Edit</button>';
    html += '</div>';
    $("#toggle-panel2").append(html);
    getBoxList().done(function(data) {
        ha.dispBoxList(data, "ddlEditRelationBoxList", false);
        $('#ddlEditRelationBoxList').val(box);
    });

    
    //$("#header-relation").html(getMsg("00017"));
    //$("#b-edit-relation-ok").html("Edit");
    //$('#modal-edit-relation').modal('show');
    $("#toggle-panel2").toggleClass('slide-on');
    $("#toggle-panel1").toggleClass('slide-on-holder');
    setTitleMenu(getMsg("00017"));
}
ha.editRelationOk = function() {
    $('#dvTextConfirmation').html(getMsg("I0006"));
    $('#modal-confirmation-title').html(getMsg("00017"));
    $('#b-edit-relconfirm-ok').css("display","");
    $('#modal-confirmation').modal('show');
};
ha.dispDelRelationModal = function(name, box) {
    ha.updUser = name;
    if (box === "[main]") {
      ha.updBox = null;
    } else {
      ha.updBox = box;
    }
    $('#dvTextConfirmation').html(getMsg("I0013", name, box));
    $('#modal-confirmation-title').html(getMsg("00020"));
    $('#b-del-relation-ok').css("display","");
    $('#modal-confirmation').modal('show');
}
ha.editRelationNameBlurEvent = function() {
        var name = $("#editRelationName").val();
        var nameSpan = "popupEditRelationNameErrorMsg";
        var txtname = "#editRelationName";
        if (ha.validateName(name, nameSpan, txtname)) {
            $('#b-edit-relation-ok').prop('disabled', false);
        }
};
ha.changeRelationSelect = function() {
    var value = $("#ddlEditRelationBoxList option:selected").val();
    if (value === "") {
        $("#b-edit-relation-ok").prop('disabled', true);
    } else {
        $("#b-edit-relation-ok").prop('disabled', false);
    }
};
ha.addRelation = function() {
  var name = $("#addRelationName").val();
  var box = $("#ddlAddRelationBoxList option:selected").val();
  if (box === "") {
      $("#addRelationBoxMessage").html(getMsg("E0016"));
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
      if (ha.checkRelationLinkRole()) {
          ha.linkRelName = name;
          ha.linkRelBoxName = box;
          ha.restCreateRelationAPI(jsonData);
      }
  } else {
      ha.restCreateRelationAPI(jsonData);
  }
};
ha.checkRelationLinkRole = function() {
    var value = $("#ddlAddRelLinkRoleList option:selected").val();
    if (value === undefined) {
        $("#popupAddRelationLinkErrorMsg").html(getMsg("E0014"));
        return false;
    } else {
        $("#popupAddRelationLinkErrorMsg").html("");
        return true;
    }
};
ha.restCreateRelationAPI = function(json) {
  $.ajax({
          type: "POST",
          url: ha.user.cellUrl + '__ctl/Relation',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
    if (document.getElementById("addCheckRelationLinkRole").checked) {
        $("#ddlAddRelLinkRoleList option:selected").each(function(index, option) {
          ha.setLinkParam($(option).text());
          ha.restAddRelationLinkRole(false);
        });
    }
    getRelationList().done(function(data) {
        ha.dispRelationList(data, null, false);
    });
    moveBackahead();
    //$("#modal-add-relation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
ha.restAddRelationLinkRole = function(moveFlag) {
  var uri = ha.user.cellUrl + '__ctl/Role';
  if (ha.linkBoxName === null) {
    uri += '(\'' + ha.linkRoleName + '\')';
  } else {
    uri += '(Name=\'' + ha.linkRoleName + '\',_Box\.Name=\'' + ha.linkBoxName + '\')';
  }
  var json = {"uri":uri};

  var rel = "";
  if (ha.linkRelBoxName === null) {
      rel = "'" + ha.linkRelName + "'";
  } else {
      rel = "Name='" + ha.linkRelName + "',_Box.Name='" + ha.linkRelBoxName + "'";
  }
  $.ajax({
          type: "POST",
          url: ha.user.cellUrl + '__ctl/Relation(' + rel + ')/$links/_Role',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
    ha.getRelationRoleList(ha.linkRelName, ha.linkRelBoxName, ha.linkRelNo).done(function(data) {
        ha.dispRelationRoleList(data, ha.linkRelName, ha.linkRelBoxName, ha.linkRelNo);
    });
    //$("#modal-add-rellinkrole").modal("hide");
    if (moveFlag) {
        moveBackahead();
    }
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
}
ha.editRelation = function() {
    var name = $("#editRelationName").val();
    var box = $("#ddlEditRelationBoxList option:selected").val();
    if (box === "") {
        $("#addRelationBoxMessage").html(getMsg("E0016"));
        return false;
    } else if (box === "[main]") {
        box = null;
    }
    var jsonData = {
                    "Name" : name,
                    "_Box.Name" : box
    };
    ha.restEditRelationAPI(jsonData);
};
ha.restEditRelationAPI = function(json) {
  var uri = ha.user.cellUrl + '__ctl/Relation';
  if (ha.updBox === null) {
      uri += "('" + ha.updUser + "')";
  } else {
      uri += "(Name='" + ha.updUser + "',_Box.Name='" + ha.updBox + "')";
  }
  $.ajax({
          type: "PUT",
          url: uri,
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
    getRelationList().done(function(data) {
        ha.dispRelationList(data, null, false);
    });
    moveBackahead();
    //$("#modal-edit-relation").modal("hide");
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};

// Validation Check
ha.validateName = function (displayName, displayNameSpan,txtID) {
        var MINLENGTH = 1;
        var MAXLENGTH = 128;
        var letters = /[0-9a-zA-Z-_!\$\*=\^`\{\|\}~\.@]+$/;
        var specialchar = /^[-_!\$\*=\^`\{\|\}~\.@]*$/;
        var allowedLetters = /[0-9a-zA-Z-_!\$\*=\^`\{\|\}~\.@]+$/;
        var lenDisplayName = displayName.length;
        //this.removeStatusIcons(txtID);
        document.getElementById(displayNameSpan).innerHTML = "";
        if(lenDisplayName < MINLENGTH || displayName == undefined || displayName == null || displayName == "") {
                document.getElementById(displayNameSpan).innerHTML =  getMsg("E0003");
                //this.showErrorIcon(txtID);
                //uCellProfile.spinner.stop();
                return false;
        } else if (lenDisplayName >= MAXLENGTH) {
                document.getElementById(displayNameSpan).innerHTML = getMsg("E0004");
                //uCellProfile.spinner.stop();
                //this.showErrorIcon(txtID);
                return false;
        } else if (lenDisplayName != 0 && ! (displayName.match(letters))){
                document.getElementById(displayNameSpan).innerHTML = getMsg("E0005");
                //this.showErrorIcon(txtID);
                return false;
        } else if (lenDisplayName != 0 && !(displayName.match(allowedLetters))) {
                document.getElementById(displayNameSpan).innerHTML = getMsg("E0006");
                //this.showErrorIcon(txtID);
                return false;
        } else if(lenDisplayName != 0 && (specialchar.toString().indexOf(displayName.substring(0,1)) >= 0)){
                document.getElementById(displayNameSpan).innerHTML = getMsg("E0006");
                //this.showErrorIcon(txtID);
                //uCellProfile.spinner.stop();
                return false;
        }
        //this.showValidValueIcon(txtID);
        return true;
};
ha.validateSchemaURL = function(schemaURL, schemaSpan, txtID) {
  var isHttp = schemaURL.substring(0, 5);
  var isHttps = schemaURL.substring(0, 6);
  var minURLLength = schemaURL.length;
  var validMessage = getMsg("E0007");
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
    //removeStatusIcons(txtID);
    return true;
	} else if ((isHttp != "http:" && isHttps != "https:")
            || (minURLLength <= 8)) {
    document.getElementById(schemaSpan).innerHTML = validMessage;
    //showErrorIcon(txtID);
    return false;
  } else if (urlLength > 1024) {
    document.getElementById(schemaSpan).innerHTML = getMsg("E0008");
    //showErrorIcon(txtID);
    return false;
  } else if (domainName.match(startHyphenUnderscore)) {
    document.getElementById(schemaSpan).innerHTML = getMsg("E0009");
    //showErrorIcon(txtID);
    return false;
  } else if (!(domainName.match(letters))) {
    document.getElementById(schemaSpan).innerHTML = getMsg("E0005");
    //showErrorIcon(txtID);
    return false;
  } else if (isDot == -1) {
    document.getElementById(schemaSpan).innerHTML = validMessage;
    //showErrorIcon(txtID);
    return false;
  } else if ((domainName.indexOf(".."))>-1 || (domainName.indexOf("//"))>-1) {
    document.getElementById(schemaSpan).innerHTML = validMessage;
    //showErrorIcon(txtID);
    return false;
  }
  //showValidValueIcon(txtID);
  document.getElementById(schemaSpan).innerHTML = "";
  return true;
};
ha.validateURL = function(domainName,errorSpan,txtID) {
	var letters = /^[0-9a-zA-Z-_.]+$/;
	var startHyphenUnderscore = /^[-_!@#$%^&*()=+]/;
	if (domainName == undefined){
		document.getElementById(errorSpan).innerHTML = getMsg("E0011");
		//cellpopup.showErrorIcon(txtID);
		return false;
	}
	var lenCellName = domainName.length;
	if (domainName.match(startHyphenUnderscore)) {
		document.getElementById(errorSpan).innerHTML = getMsg("E0009");
		//cellpopup.showErrorIcon(txtID);
		return false;
	} else if (lenCellName != 0 && !(domainName.match(letters))) {
		document.getElementById(errorSpan).innerHTML = getMsg("E0005");
		//cellpopup.showErrorIcon(txtID);
		return false;
	} 
	document.getElementById(errorSpan).innerHTML = "";
	//cellpopup.showValidValueIcon(txtID);
	return true;
};
ha.doesUrlContainSlash = function(schemaURL, schemaSpan,txtID,message) {
	if (schemaURL != undefined) {
		if (!schemaURL.endsWith("/")) {
			document.getElementById(schemaSpan).innerHTML = message;
			//cellpopup.showErrorIcon(txtID);
			return false;
		}
		document.getElementById(schemaSpan).innerHTML = "";
		//cellpopup.showValidValueIcon(txtID);
		return true;
	}
};
ha.charCheck = function(check, displayNameSpan) {
  var passLen = check.val().length;
  var msg = "";
  var bool = true;

  if (passLen !== 0) {
    if (passLen < 6 || passLen > 36) {
      msg = getMsg("E0012");
      bool = false;
    } else if (check.val().match(/[^0-9a-zA-Z_-]+/)) {
      msg = getMsg("E0013");
      bool = false;
    }

    $('#' + displayNameSpan).html(msg);
  }

  return bool;
};
ha.changePassCheck = function(newpass, confirm, displayNameSpan) {
  $('#' + displayNameSpan).html("");
  if (newpass !== confirm) {
    $('#' + displayNameSpan).html(getMsg("E0002"));
    return false
  }

  return true;
};
ha.passInputCheck = function(newpass, displayNameSpan) {
  $('#' + displayNameSpan).html("");
  if (newpass.length == 0) {
    $('#' + displayNameSpan).html(getMsg("E0010"));
    return false;
  }

  return true;
}

// API
ha.restCreateAccountAPI = function(json, pass) {
  $.ajax({
          type: "POST",
          url: ha.user.cellUrl + '__ctl/Account',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'X-Dc-Credential': pass
          }
  }).done(function(data) {
    if (document.getElementById("addCheckAccountLinkRole").checked) {
      $("#ddlAddAccLinkRoleList option:selected").each(function(index, option) {
        ha.setLinkParam($(option).text());
        ha.restAddAccountLinkRole(false);
      });
    }
    ha.getAccountList().done(function(data) {
        ha.dispAccountList(data);
    });
    moveBackahead();
    //$("#modal-add-account").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
ha.restEditAccountAPI = function(json, pass, updUser) {
  var headers = {};
  headers["Authorization"] = 'Bearer ' + ha.user.access_token;
  if (pass.length > 0) {
    headers["X-Dc-Credential"] = pass;
  }
  $.ajax({
          type: "PUT",
          url: ha.user.cellUrl + '__ctl/Account(\'' + updUser + '\')',
          data: JSON.stringify(json),
          headers: headers
  }).done(function(data) {
    ha.getAccountList().done(function(data) {
        ha.dispAccountList(data);
    });
    moveBackahead();
    //$("#modal-edit-account").modal("hide");
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
ha.restDeleteAccountAPI = function() {
  $.ajax({
          type: "DELETE",
          url: ha.user.cellUrl + '__ctl/Account(\'' + ha.updUser + '\')',
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
    ha.getAccountList().done(function(data) {
        ha.dispAccountList(data);
    });
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
ha.restCreateRoleAPI = function(json) {
  $.ajax({
          type: "POST",
          url: ha.user.cellUrl + '__ctl/Role',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
    getRoleList().done(function(data) {
        ha.dispRoleList(data);
    });
    //$("#modal-add-role").modal("hide");
    moveBackahead();
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
ha.restEditRoleAPI = function(json) {
  var api = '__ctl/Role';
  if (ha.updBox === null) {
    api += '(\'' + ha.updUser + '\')';
  } else {
    api += '(Name=\'' + ha.updUser + '\',_Box.Name=\'' + ha.updBox + '\')';
  }

  $.ajax({
          type: "PUT",
          url: ha.user.cellUrl + api,
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
    getRoleList().done(function(data) {
        ha.dispRoleList(data);
    });
    //$("#modal-add-role").modal("hide");
    moveBackahead();
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
ha.restDeleteRoleAPI = function() {
  var api = '__ctl/Role';
  if (ha.updBox === null) {
    api += '(\'' + ha.updUser + '\')';
  } else {
    api += '(Name=\'' + ha.updUser + '\',_Box.Name=\'' + ha.updBox + '\')';
  }

  $.ajax({
          type: "DELETE",
          url: ha.user.cellUrl + api,
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
    getRoleList().done(function(data) {
        ha.dispRoleList(data);
    });
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
ha.restAddAccountLinkRole = function(moveFlag) {
  var uri = ha.user.cellUrl + '__ctl/Role';
  if (ha.linkBoxName === null) {
    uri += '(\'' + ha.linkRoleName + '\')';
  } else {
    uri += '(Name=\'' + ha.linkRoleName + '\',_Box\.Name=\'' + ha.linkBoxName + '\')';
  }
  var json = {"uri":uri};

  $.ajax({
          type: "POST",
          url: ha.user.cellUrl + '__ctl/Account(Name=\'' + ha.linkAccName + '\')/$links/_Role',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
    ha.getAccountRoleList(ha.linkAccName, ha.linkAccNameNo).done(function(data) {
        ha.dispAccountRoleList(data, ha.linkAccName, ha.linkAccNameNo);
    });
    //$("#modal-add-acclinkrole").modal("hide");
    if (moveFlag) {
        moveBackahead();
    }
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
}
ha.restDeleteAccountLinkRole = function() {
  var api = '__ctl/Account(Name=\'' + ha.linkAccName + '\')/$links/_Role';
  if (ha.linkBoxName === null) {
    api += '(\'' + ha.linkRoleName + '\')';
  } else {
    api += '(Name=\'' + ha.linkRoleName + '\',_Box.Name=\'' + ha.linkBoxName + '\')';
  }

  $.ajax({
          type: "DELETE",
          url: ha.user.cellUrl + api,
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
    ha.getAccountRoleList(ha.linkAccName, ha.linkAccNameNo).done(function(data) {
        ha.dispAccountRoleList(data, ha.linkAccName, ha.linkAccNameNo);
    });
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
ha.restDeleteRelationAPI = function() {
  var uri = ha.user.cellUrl + '__ctl/Relation';
  if (ha.updBox === null) {
      uri += "('" + ha.updUser + "')";
  } else {
      uri += "(Name='" + ha.updUser + "',_Box.Name='" + ha.updBox + "')";
  }
  $.ajax({
          type: "DELETE",
          url: uri,
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
    getRelationList().done(function(data) {
        ha.dispRelationList(data, null, false);
    });
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
ha.restDeleteRelationLinkRole = function() {
  var api = '__ctl/Relation';
  if (ha.linkRelBoxName === null) {
    api += '(\'' + ha.linkRelName + '\')/$links/_Role';
  } else {
    api += '(Name=\'' + ha.linkRelName + '\',_Box.Name=\'' + ha.linkRelBoxName + '\')/$links/_Role';
  }
  if (ha.linkBoxName === null) {
    api += '(\'' + ha.linkRoleName + '\')';
  } else {
    api += '(Name=\'' + ha.linkRoleName + '\',_Box.Name=\'' + ha.linkBoxName + '\')';
  }

  $.ajax({
          type: "DELETE",
          url: ha.user.cellUrl + api,
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
    ha.getRelationRoleList(ha.linkRelName, ha.linkRelBoxName, ha.linkRelNameNo).done(function(data) {
        ha.dispRelationRoleList(data, ha.linkRelName, ha.linkRelBoxName, ha.linkRelNo);
    });
    $("#modal-confirmation").modal("hide");
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
}

function checkBoxInstall() {
    var elements = document.getElementsByName("nowInstall");
    for (var i in elements) {
        var ele = elements[i];
        var no = ele.id.split("_")[1];
        updateProgress(no, ele.id);
    }
};
function updateProgress(no, id) {
    getBoxStatus(insAppBoxList[no]).done(function(data) {
        var status = data.status;
        if (status.indexOf('ready') >= 0) {
            $("#nowInstallParent_" + no).remove();
            $("#insAppNo_" + no).on('click', function() { ha.uninstallApp(insAppList[no],insAppBoxList[no]) });
        } else if (status.indexOf('progress') >= 0) {
            $('#' + id).css("width", data.progress);
        } else {
            $('#nowInstallParent_' + no).remove();
            $('#appid_' + no).append('(<font color="red"> ! </font>)');
        }
        var elements = document.getElementsByName("nowInstall");
        if (elements.length = 0) {
            clearInterval(nowInstalledID);
        }
    });
};
function checkBoxInstallTest() {
    var elements = document.getElementsByName("nowInstall");
    for (var i in elements) {
        var ele = elements[i];
        testProgPar += 1;
        if (testProgPar > 100) {
            var no = ele.id.split("_")[1];
            $("#nowInstallParent_" + no).remove();
            clearInterval(nowInstalledID);
        } else {
            $('#' + ele.id).css("width", testProgPar + "%");
        }
    }
};