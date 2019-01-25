var st = {};
st.updUser = null;
st.insAppList = new Array();
st.insAppBoxList = new Array();
st.nowInstalledID = null;

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

    $('#dvTextConfirmation').text(i18next.t("confirmChangeContentEnter"));
    $('#modal-confirmation-title').text(i18next.t("EditAccount"));
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
        var html = '<a href="javascript:void(0)" class="ins-app-icon" onClick="st.dispViewApp(\'' + schema + '\',\'' + dispName + '\',\'' + imageSrc + '\',\'' + description + '\',\'' + schemaJson.BarUrl + '\',\'' + schemaJson.BoxName + '\',true)"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div class="ins-app-name">' + dispName + '</div>';
        $('#' + pAppId).append(html);
   });
};
st.dispViewApp = function(schema, dispName, imageSrc, description, barUrl, barBoxName, insFlag) {
    $("#setting-panel2").empty();
    cm.setBackahead(true);
    var html = '<div class="panel-body">';
    html += '<div class="app-info"><div class="app-icon"><img src="' + imageSrc + '"></div><div class="app-data"><div>' + dispName + '</div><div>提供元：</div></div></div><section class="detail-section"><h2>概要</h2><div class="overview">' + description + '</div>';
    if (insFlag) {
        html += '<div class="app-install"><button class="round-btn"href="javascript:void(0)" onClick="st.confBarInstall(\'' + schema + '\',\'' + barUrl + '\',\'' + barBoxName + '\', \'' + dispName + '\');return(false);">' + i18next.t("Install") + '</button></div></section>';
    } else {
        html += '<div class="app-install"><button class="round-btn"href="javascript:void(0)" onClick="return(false);">' + i18next.t("Uninstall") + '</button></div></section>';
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
    $("#dvTextConfirmation").text(i18next.t("confirmInstallation"));
    //$("#modal-confirmation-title").html(dispName);
    $("#modal-confirmation-title").attr("data-i18n", dispName).localize();
    $('#b-ins-bar-ok').css("display","");
    $('#modal-confirmation').modal('show');
};

/////////////////////////
// Application Manager //
/////////////////////////

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
    html += '<td style="width: 15%;"><a href="javascript:void(0)" class="edit-button list-group-item" href="#" onClick="st.createEditRole(\'' + objRole.Name + '\',\'' + boxName + '\');return(false)">' + i18next.t("Edit") + '</a></td>';
    html += '<td style="width: 15%;"><a href="javascript:void(0)" class="del-button list-group-item" href="#" onClick="st.dispDelRoleModal(\'' + objRole.Name + '\',\'' + boxName + '\');return(false)">' + i18next.t("Del") + '</a></td>';
    html += '</tr>';
    html += '</table></div>';
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="javascript:void(0)" onClick="st.createAddRole()" data-i18n="CreateRolePlus"></a></div>';
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
    $('#dvTextConfirmation').text(i18next.t("confirmDeleteRole", {value1:name, value2:box}));
    $('#modal-confirmation-title').text(i18next.t("DeleteRole"));
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
      $("#addRoleBoxMessage").text(i18next.t("selectBox"));
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
    html += '<td style="width: 80%;"><a href="javascript:void(0)" id="relationLinkToRoleToggle' + i + '" onClick="st.createRelationRole(\'' + objRelation.Name + '\',\'' + boxName + '\',\'' + i + '\')">';
    html += '<table class="table-fixed"><tr><td><p class="ellipsisText">' + objRelation.Name + '(' + boxName + ')</p></td></tr></table>';
    html += '</a></td>';
    html += '<td style="width: 10%;"><a class="edit-button list-group-item" href="javascript:void(0)" onClick="st.createEditRelation(\'' + objRelation.Name + '\',\'' + boxName + '\');return(false)">' + i18next.t("Edit") + '</a></td>';
    html += '<td style="width: 10%;"><a class="del-button list-group-item" href="javascript:void(0)" onClick="st.dispDelRelationModal(\'' + objRelation.Name + '\',\'' + boxName + '\');return(false)">' + i18next.t("Del") + '</a></td>';
    html += '</tr></table></div>';
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="javascript:void(0)" onClick="st.createAddRelation()" data-i18n="CreateRelationPlus"></a></div>';
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
    html += '<td style="width: 10%;"><a class="del-button list-group-item" href="javascript:void(0)" onClick="st.dispDelRelationRoleModal(\'' + relName + '\',\'' + relBoxName + '\',\'' + name + '\',\'' + boxName + '\',\'' + no + '\');return(false)">' + i18next.t("Detach") + '</a></td>';
    html += '</tr></table></div>';
  }

  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="javascript:void(0)" onClick="cm.dispAssignRole(\'rel\', true)" data-i18n="AssigningRolesPlus"></a></div>';
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
    $("#dvTextConfirmation").text(i18next.t("removeAssociationRole", {value1:roleName, value2:boxName})).localize();
    $("#modal-confirmation-title").text(i18next.t("DeleteAssigningRole"));
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
    $('#dvTextConfirmation').text(i18next.t("confirmChangeContentEnter"));
    $('#modal-confirmation-title').text(i18next.t("EditRelation"));
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
    $('#dvTextConfirmation').text(i18next.t("confirmDeleteRelation", {value1:name, value2:box}));
    $('#modal-confirmation-title').text(i18next.t("DeleteRelation"));
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
      $("#addRelationBoxMessage").text(i18next.t("selectBox"));
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
        $("#popupAddRelationLinkErrorMsg").text(i18next.t("selectRole"));
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
        $("#addRelationBoxMessage").text(i18next.t("selectBox"));
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

// API
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
