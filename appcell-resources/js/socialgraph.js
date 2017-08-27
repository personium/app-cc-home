var sg = {};

// Common
sg.resetExtCellLink = function() {
  $("#addRadioExtCellLinkRole").prop('checked', true);
  $("#addRadioExtCellLinkRole").prop('disabled', true);
  $("#addRadioExtCellLinkRelation").prop('disabled', true);
  $("#ddlAddExtCellLinkRoleList").val("");
  $("#ddlAddExtCellLinkRoleList").prop('disabled', true);
  $("#ddlAddExtCellLinkRoleList").css('display', '');
  $("#ddlAddExtCellLinkRelationList").val("");
  $("#ddlAddExtCellLinkRelationList").prop('disabled', true);
  $("#ddlAddExtCellLinkRelationList").css('display', 'none');
  $("#popupAddExtCellLinkErrorMsg").html("");
};
sg.getName = function(path) {
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
sg.slideToggle = function(id) {
    $("#" + id).slideToggle();
}
sg.setLinkParamName = function(relName, relBoxName) {
    cm.linkName = relName;
    if (relBoxName === "[main]") {
        cm.linkBoxName = null;
    } else {
        cm.linkBoxName = relBoxName;
    }
};
sg.setLinkUrl = function(url, no) {
  sg.linkExtCellUrl = url;
  sg.linkExtCellNo = no;
};

// ExternalCell
sg.getExternalCellInfo = function(uri) {
  // function getExternalCellName(uri) {
  var arrUri = uri.split("/");
  if (arrUri.length < 6) {
      var arrExtCellInfo = new Array();
      arrExtCellInfo.push(arrUri[2]);
      var externalCellName = arrUri[3];
      if (externalCellName != undefined && externalCellName.length == 0) {
          externalCellName = undefined;
      }
      arrExtCellInfo.push(externalCellName);
      return arrExtCellInfo;
  }
  return false;
};
sg.checkExtCellLinkRole = function() {
    var value = $("#ddlAddExtCellLinkRoleList option:selected").val();
    if (value === undefined) {
        $("#popupAddExtCellLinkErrorMsg").attr("data-i18n", "selectRole").localize();
        return false;
    } else {
        $("#popupAddExtCellLinkErrorMsg").html("");
        return true;
    }
};
sg.checkExtCellLinkRelation = function() {
    var value = $("#ddlAddExtCellLinkRelationList option:selected").val();
    if (value === undefined) {
        $("#popupAddExtCellLinkErrorMsg").attr("data-i18n", "selectRelation").localize();
        return false;
    } else {
        $("#popupAddExtCellLinkErrorMsg").html("");
        return true;
    }
};
sg.getExtCellList = function() {
  $.ajax({
          type: "GET",
          url:cm.user.cellUrl + '__ctl/ExtCell',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
            sg.dispExtCellList(data);
  }).fail(function(data) {
  });
}
sg.dispExtCellList = function(json) {
  // ExternalCell Not Link Relation List Initialization
  $('#dvExtCellRelList').empty();

  var objSel = document.getElementById("ddlExtCellLinkRelationList");
  if (objSel.hasChildNodes()) {
    while (objSel.childNodes.length > 0) {
      objSel.removeChild(objSel.firstChild);
    }
  }
  $("#ddlExtCellLinkRelationList").append('<option value="" data-i18n="selectExternalCell"></option>');

  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Url < val2.Url ? 1 : -1);
  })
  for (var i in results) {
    var extCell = json.d.results[i];

    $("#ddlExtCellLinkRelationList").append('<option value="' + extCell.Url + '">' + sg.getName(extCell.Url) + '</option>');

    sg.getExtCellRelationList(extCell.Url);
  }
}
sg.addExtCell = function() {
  var url = $("#addExtCellUrl").val();
  sg.checkUrlCell(url);
};
sg.checkUrlCell = function(url) {
  $.ajax({
          type: "GET",
          url: url
  }).done(function(data) {
    var jsonData = {
                    "Url" : url
    };

    // Assinginig Roles Or Relations
    sg.setLinkUrl(url, null);
    var chkObj = document.getElementById("addCheckExtCellLinkRoleAndRelation");
    if (chkObj.checked) {
      if ($('input[name="addRadioExtCellLink"]:checked').val() === "role") {
        if (sg.checkExtCellLinkRole()) {
          sg.restCreateExtCellAPI(jsonData);
        }
      } else {
        if (sg.checkExtCellLinkRelation()) {
          sg.restCreateExtCellAPI(jsonData);
        }
      }
    } else {
      sg.restCreateExtCellAPI(jsonData);
    }
  }).fail(function(data) {
    //alert("The specified cell does not exist.");
    $("#popupAddExtCellUrlErrorMsg").attr("data-i18n", "notExistTargetCell").localize();
  });
}
sg.dispDelExtCellModal = function() {
    $("#dvTextConfirmation").html(i18next.t("confirmDeleteExternalCell", {value:sg.linkExtCellUrl}));
    $("#modal-confirmation-title").html(i18next.t("DeleteExternalCell"));
    $('#b-del-extcell-ok').css("display","");
    $('#b-cancel').css("display","");
    $('#modal-confirmation').modal('show');
}
sg.urlBlurEvent = function() {
        var schemaURL = $("#addExtCellUrl").val();
        var extCellInfo = sg.getExternalCellInfo(schemaURL);
        if (extCellInfo == false) {
            $("#popupAddExtCellUrlErrorMsg").attr("data-i18n", "invalidURL").localize();
            return false;
        }
        var extCellName = extCellInfo[1];
        var extCellURL = extCellInfo[0];
        if (sg.validateSchemaURL(schemaURL, "popupAddExtCellUrlErrorMsg", "#addExtCellUrl")
          && sg.doesUrlContainSlash(schemaURL, "popupAddExtCellUrlErrorMsg", "#addExtCellUrl", i18next.t("errorValidateEndWithExternalCell"))) {

          return true;
        }
        
        return false;
};
sg.dispDelExtCellRoleModal = function(url, roleName, boxName, no) {
    sg.linkExtCellUrl = url;
    cm.linkName = roleName;
    if (boxName === "[main]") {
      cm.linkBoxName = null;
    } else {
      cm.linkBoxName = boxName
    }
    sg.linkExtCellNo = no;
    $("#dvTextConfirmation").html(i18next.t("removeAssociationRole", {value1:roleName, value2:boxName}));
    $("#modal-confirmation-title").html(i18next.t("DeleteAssigningRole"));
    $('#b-cancel').css("display","");
    $('#b-del-extcelllinkrole-ok').css("display","");
    $('#modal-confirmation').modal('show');
};
sg.dispExtCellLinkRelation = function(json, extUrl) {
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.url < val2.url ? 1 : -1);
  })

  if (results.length === 0) {
      var dispName = sg.getName(extUrl);
      var description = "";
      var imageSrc = cm.notImage;
      var extRelID = "dvExtCellRelList";
      cm.getProfile(extUrl).done(function(profData) {
          if (profData !== null) {
              dispName = profData.DisplayName;
              description = profData.Description;
              if (profData.Image) {
                  imageSrc = profData.Image;
              }
          }
          sg.appendRelationLinkExtCell(extUrl, dispName, description, imageSrc, extRelID, false);
      }).fail(function() {
          sg.appendRelationLinkExtCell(extUrl, dispName, description, imageSrc, extRelID, false);
      });
  }
};
sg.dispRelationLinkExtCell = function(json, relName, relBoxName) {
    var results = json.d.results;
    results.sort(function(val1, val2) {
      return (val1.url < val2.url ? 1 : -1);
    })

    // External Cell Link Relation List Initialization
    var extRelID = "";
    if (relBoxName === null) {
      extRelID = "dvExt-" + relName;
    } else {
      extRelID = "dvExt-" + relName + "-" + relBoxName;
    }
    $("#" + extRelID).empty();

    for (var i in results) {
      var uri = results[i].uri;
      var matchUrl = uri.match(/\(\'(.+)\'\)/);
      var extUrl = matchUrl[1];

      sg.appendRelationLinkExtCellAfter(extUrl, extRelID);
    }
    
};
sg.appendRelationLinkExtCellAfter = function(extUrl, extRelID) {
    cm.getProfile(extUrl).done(function(profData) {
          var dispName = sg.getName(extUrl);
          var description = "";
          var imageSrc = cm.notImage;
          if (profData !== null) {
              dispName = profData.DisplayName;
              description = profData.Description;
              if (profData.Image) {
                  imageSrc = profData.Image;
              }
          }
          sg.appendRelationLinkExtCell(extUrl, dispName, description, imageSrc, extRelID, true);
      }).fail(function() {
          var dispName = sg.getName(extUrl);
          var description = "";
          var imageSrc = cm.notImage;
          sg.appendRelationLinkExtCell(extUrl, dispName, description, imageSrc, extRelID, true);
      });
};
sg.appendRelationLinkExtCell = function(url, dispName, description, imageSrc, extRelID, delFlag) {
    var html = '<div class="list-group-item">';
    html += '<table style="width: 100%;"><tr>';
    //html += '<td style="width: 90%;"><a class="accountToggle" onClick="sg.showRoleList(\'' + url + '\')"">';
    html += '<td style="width: 90%;"><a class="allToggle" onClick="sg.createExtCellProfile(\'' + url + '\',\'' + dispName + '\',\'' + description + '\',\'' + imageSrc + '\')"">';
    html += '<table class="table-fixed"><tr><td rowspan="2" style="width: 25%;"><img class="image-circle" src="' + imageSrc + '" alt="user"></td>';
    html += '<td>' + dispName + '</td></tr>';
    html += '<tr><td><p class="ellipsisText"><font color="LightGray">' + description + '</font></p></td>';
    html += '</a></td></tr></table>';
    if (delFlag) {
        var splitID = extRelID.split("-");
        var relName = splitID[1];
        var boxName = "[main]";
        if (splitID.length > 2) {
            boxName = splitID[2];
        }
        html += '<td style="width: 10%;"><a class="del-button list-group-item" style="top:25%" href="#" onClick="sg.dispDelExtCellRelationModal(\'' + url + '\',\'' + relName + '\',\'' + boxName + '\');return(false)" data-i18n="Del"></a></td>';
    } else {
        html += '<td style="width: 10%;"></td>';
    }
    html += '</tr></table></div>';
    $("#" + extRelID).append(html).localize();
};
sg.showExtCellProfile = function(url, dispName, description, imagesrc) {
    sg.linkExtCellUrl = url;
    $("#imgExtProfileImage").attr("src", imagesrc);
    $("#txtExtName").html(dispName);
    $("#txtDescription").html(description);
    $('#modal-profile-extcell').modal('show');
};
sg.createExtCellProfile = function(url, dispName, description, imagesrc) {
    sg.linkExtCellUrl = url;
    $("#toggle-panel1").empty();
    cm.setBackahead();
    var html = '<div class="panel-body">';
    html += '<div class="extcell-profile" id="dvExtProfileImage"><img class="image-circle-large" style="margin: auto;" id="imgExtProfileImage" src="' + imagesrc + '" alt="image" /><span id="txtExtUrl">' + url + '</span><h5><span id="txtDescription">' + description + '</span></h5></div>';
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="sg.showExtPublicBoxList();return(false);" data-i18n="WatchPublicBOX"></a></div>';
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="sg.createRoleList(\'' + url + '\');return(false);" data-i18n="RoleList"></a></div>';
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="sg.dispDelExtCellModal();return(false);" data-i18n="DeleteExternalCell"></a></div>';
    html += '</div>';
    $("#toggle-panel1").append(html).localize();
    $("#toggle-panel1,.panel-default").toggleClass('slide-on');
    cm.setTitleMenu(dispName);
};
sg.showRoleList = function(url) {
    sg.linkExtCellUrl = url;
    sg.getExtCellRoleList(sg.linkExtCellUrl);
    $('#modal-show-extcelllinkrole').modal('show');
};
sg.createRoleList = function(url) {
    sg.linkExtCellUrl = url;
    $("#toggle-panel2").remove();
    cm.setBackahead();
    sg.getExtCellRoleList(sg.linkExtCellUrl).done(function(data) {
        sg.dispExtCellRoleList(data, sg.linkExtCellUrl);
        $("#toggle-panel2").toggleClass('slide-on');
        $("#toggle-panel1").toggleClass('slide-on-holder');
        cm.setTitleMenu("RoleList");
    });
};
sg.getExtCellRoleList = function(url) {
  var urlArray = url.split("/");
  var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
  var fqdn = urlArray[2];
  var cellName = urlArray[3];
  return $.ajax({
          type: "GET",
          url:cm.user.cellUrl + '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')/$links/_Role',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  })
};
sg.dispExtCellRoleList = function(json, exturl) {
  $("#toggle-panel2").empty();
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.url < val2.url ? 1 : -1);
  })

  var html = '<div class="panel-body">';
  for (var i in results) {
    var res = results[i];
    var url = res.uri;
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
    html += '<td colspan="2" style="width: 15%;"><a class="del-button list-group-item" href="#" onClick="sg.dispDelExtCellRoleModal(\'' + exturl + '\',\'' + name + '\',\'' + boxName + '\');return(false)" data-i18n="Del"></a></td>';
    //html += '</tr><tr>';
    //html += '<td>' + boxName + '</td>';
    html += '</tr></table></div>';
    //$("#dvExtCellLinkRole").append(html);
  }
  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="cm.dispAssignRole(\'ext\')" data-i18n="AddRolePlus"></a></div>';
  //html = '<a class="list-group-item" href="#" data-toggle="modal" data-target="#modal-add-extcelllinkrole">＋ ' + i18next.t("AddRole") + '</a>';
  html += '</div>';
  $("#toggle-panel2").append(html).localize();
};
sg.showExtPublicBoxList = function() {
    cm.getTargetToken(sg.linkExtCellUrl).done(function(data) {
        var urlArray = sg.linkExtCellUrl.split("/");
        var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
        var fqdn = urlArray[2];
        var cellName = urlArray[3];
        $.ajax({
                type: "GET",
                url: sg.linkExtCellUrl + "__ctl/Box" ,
                headers: {
                  'Authorization':'Bearer ' + data.access_token,
                  'Accept':'application/json'
                }
        }).done(function(data) {
                  sg.checkBoxPublic(data);
        }).fail(function(data) {
                  $('#dvTextConfirmation').html(i18next.t("notPermissionView"));
                  $('#modal-confirmation-title').html(i18next.t("WatchPublicBOX"));
                  $('#b-cancel').css("display","");
                  $('#modal-confirmation').modal('show');
        });
    }).fail(function(data) {
        alert(data);
    });
};
sg.checkBoxPublic = function(json) {
    $("#toggle-panel2").empty();
    cm.setBackahead();
    var results = json.d.results;
    results.sort(function(val1, val2) {
      return (val1.Name < val2.Name ? 1 : -1);
    })
    var html = '<div class="panel-body">';
    html += '<p data-i18n="Document"></p><HR>';
    for (var i in results) {
        var boxName = json.d.results[i].Name;
        html += '<p style="margin-top: 10px;">' + boxName + '</p>';
    }
    html += '</div>';
    $("#toggle-panel2").append(html);
    $("#toggle-panel2").toggleClass('slide-on');
    $("#toggle-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu("WatchPublicBOX");
    //$('#modal-public-extbox').modal('show');
};
sg.dispDelExtCellRelationModal = function(url, relationName, boxName, no) {
    sg.linkExtCellUrl = url;
    sg.linkRelationName = relationName;
    if (boxName === "[main]") {
      cm.linkBoxName = null;
    } else {
      cm.linkBoxName = boxName
    }
    sg.linkExtCellNo = no;
    $("#dvTextConfirmation").html(i18next.t("confirmDeleteRelationAssign", {value1:relationName, value2:boxName}));
    $("#modal-confirmation-title").html(i18next.t("DeleteAssigningRelation"));
    $('#b-cancel').css("display","");
    $('#b-del-extcelllinkrelation-ok').css("display","");
    $('#modal-confirmation').modal('show');
};

// Relation
sg.getRelationList = function() {
  $("#dvExtCellList").empty();
  $.ajax({
          type: "GET",
          url:cm.user.cellUrl + '__ctl/Relation',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
            sg.dispRelationList(data);
  }).fail(function(data) {
  });
};
sg.dispRelationList = function(json) {
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })
  
  var html = '';
  var extRelID = "";
  for (var i in results) {
    var objRelation = json.d.results[i];
    var boxName = objRelation["_Box.Name"];
    var relBoxName = boxName;
    if (boxName === null) {
      boxName = "[main]";
      extRelID = "dvExt-" + objRelation.Name;
    } else {
      extRelID = "dvExt-" + objRelation.Name + "-" + boxName;
    }

    // External Cell Relation List
    html = '<div class="list-group-item relation-menu">';
    html += '<table style="width: 100%;"><tr>';
    html += '<td style="width: 100%;"><a class="accountToggle" id="relationLinkToRoleToggle' + i + '" onClick="sg.slideToggle(\'extCellRelMenu' + i + '\')">';
    html += '<table class="table-fixed"><tr><td><p class="ellipsisText">' + objRelation.Name + '(' + boxName + ')</p></td></tr></table>';
    //html += '<table><tr><td>' + boxName + '</td></tr></table>';
    html += '</a></td>';
    html += '</tr></table></div>';
    html += '<nav id="extCellRelMenu' + i + '"><ul class="extCellRelMenu"><div name="dvExtCellRelList" id="' + extRelID + '"></div><div class="list-group-item">';
    html += '<a class="allToggle" href="#" onClick="sg.setLinkParamName(\'' + objRelation.Name + '\',\'' + boxName + '\')" data-toggle="modal" data-target="#modal-add-extcelllinkrelation" data-i18n="AddExternalCellPlus"></a></div></ul></nav>';
    $("#dvExtCellList").append(html).localize();
    sg.getRelLinkExtCell(objRelation.Name, relBoxName);
  }

  // Independent
  html = '<div class="list-group-item relation-menu">';
  html += '<a class="accountToggle" id="relationLinkToRoleToggle" onClick="sg.slideToggle(\'extCellRelMenu\')" data-i18n="Independent"></a>';
  html += '</div>';
  html += '<nav id="extCellRelMenu"><ul class="extCellRelMenu"><div name="dvExtCellRelList" id="dvExtCellRelList"></div>';
  //html += '<div><a class="list-group-item" href="#" data-toggle="modal" data-target="#modal-add-extcell">＋' + i18next.t("CreateExternalCell") + '</a></div>';
  html += '<div class="list-group-item"><a class="allToggle" href="#" onClick="sg.createAddExtCell()" data-i18n="CreateExternalCellPlus"></a></div>';
  html += '</ul></nav>';
  $("#dvExtCellList").append(html).localize();
  sg.getExtCellList();

  $(".relationRoleMenu").css("display", "none");
};
sg.createAddExtCell = function() {
    $("#toggle-panel1").empty();
    cm.setBackahead();
    cm.getRoleList().done(function(data) {
        var html = '<div class="modal-body">';
        html += '<div id="dvSelectedCell">URL</div>';
        html += '<div id="dvTextSelectedCell" style="margin-bottom: 10px;"><input type="text" id="addExtCellUrl" onblur="sg.blurAddExtCellUrl();"><span class="popupAlertArea" style="color:red"><aside id="popupAddExtCellUrlErrorMsg"> </aside></span></div>';
        html += '<div id="dvCheckAddExtCellLinkRoleAndRelation" style="margin-bottom: 10px;"><label><input type="checkbox" id="addCheckExtCellLinkRoleAndRelation" onChange="sg.changeCheckExtCellLinkRoleAndRelation(this);"><span data-i18n="AssignMulti"></span></label></div>';
        html += '<div id="dvSelectAddExtCellLink" style="margin-bottom: 10px;"><table>';
        html += '<tr><td><label><input type="radio" name="addRadioExtCellLink" id="addRadioExtCellLinkRole" onChange="sg.changeRadioExtCellLink();" value="role" disabled><span data-i18n="Role"></span></label></td><td><label><input type="radio" name="addRadioExtCellLink" id="addRadioExtCellLinkRelation" onChange="sg.changeRadioExtCellLink();" value="relation" disabled><span data-i18n="Relation"></span></label></td></tr>';
        html += '<tr><td colspan="2"><select class="form-control" name="" id="ddlAddExtCellLinkRoleList" multiple disabled><option>Select a role</option></select><select class="form-control" name="" id="ddlAddExtCellLinkRelationList" multiple disabled style="display:none;"><option>Select a relation</option></select></td></tr>';
        html += '<tr><td colspan="2"><span class="popupAlertArea" style="color:red"><aside id="popupAddExtCellLinkErrorMsg"> </aside></span></td></tr>';
        html += '</table></div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead();" data-i18n="Cancel"></button>';
        html += '<button type="button" class="btn btn-primary" id="b-add-extcell-ok" onClick="sg.addExtCell();" data-i18n="Add"></button>';
        html += '</div></div>';
        $("#toggle-panel1").append(html).localize();
        cm.dispRoleList(data, "ddlAddExtCellLinkRoleList", true);
        cm.getRelationList().done(function(data) {
            cm.dispRelationList(data, "ddlAddExtCellLinkRelationList", true);
            $("#toggle-panel1,.panel-default").toggleClass('slide-on');
            cm.setTitleMenu("CreateExternalCell");
        });
    });
};
sg.blurAddExtCellUrl = function() {
    var bool = sg.urlBlurEvent();
    $('#b-add-extcell-ok').prop('disabled', !bool);
};
sg.changeCheckExtCellLinkRoleAndRelation = function(obj) {
    if (obj.checked) {
        $("#addRadioExtCellLinkRole").prop('disabled', false);
        $("#addRadioExtCellLinkRole").prop('checked', true);
        $("#addRadioExtCellLinkRelation").prop('disabled', false);
        $("#ddlAddExtCellLinkRoleList").val("");
        $("#ddlAddExtCellLinkRoleList").prop('disabled', false);
        $("#ddlAddExtCellLinkRoleList").css('display', '');
        $("#ddlAddExtCellLinkRelationList").val("");
        $("#ddlAddExtCellLinkRelationList").prop('disabled', true);
        $("#ddlAddExtCellLinkRelationList").css('display', 'none');
    } else {
        sg.resetExtCellLink();
    }
};
sg.changeRadioExtCellLink = function() {
    if ($('input[name="addRadioExtCellLink"]:checked').val() === "role") {
      $("#ddlAddExtCellLinkRoleList").css('display', '');
      $("#ddlAddExtCellLinkRelationList").css('display', 'none');
      $("#ddlAddExtCellLinkRoleList").prop('disabled', false);
      $("#ddlAddExtCellLinkRelationList").prop('disabled', true);
    } else {
      $("#ddlAddExtCellLinkRoleList").css('display', 'none');
      $("#ddlAddExtCellLinkRelationList").css('display', ''); 
      $("#ddlAddExtCellLinkRoleList").prop('disabled', true);
      $("#ddlAddExtCellLinkRelationList").prop('disabled', false);
    }
};

// Validation Check
sg.validateSchemaURL = function(schemaURL, schemaSpan, txtID) {
  var isHttp = schemaURL.substring(0, 5);
  var isHttps = schemaURL.substring(0, 6);
  var minURLLength = schemaURL.length;
  var validMessage = "pleaseValidSchemaURL";
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
    $("#" + schemaSpan).attr("data-i18n", validMessage).localize();
    //showErrorIcon(txtID);
    return false;
  } else if (urlLength > 1024) {
    $("#" + schemaSpan).attr("data-i18n", "maxUrlLengthError").localize();
    //showErrorIcon(txtID);
    return false;
  } else if (isDot == -1) {
    $("#" + schemaSpan).attr("data-i18n", validMessage).localize();
    //showErrorIcon(txtID);
    return false;
  } else if ((domainName.indexOf(".."))>-1 || (domainName.indexOf("//"))>-1) {
    $("#" + schemaSpan).attr("data-i18n", validMessage).localize();
    //showErrorIcon(txtID);
    return false;
  }
  //showValidValueIcon(txtID);
  document.getElementById(schemaSpan).innerHTML = "";
  return true;
};
sg.doesUrlContainSlash = function(schemaURL, schemaSpan,txtID,message) {
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

// API
sg.restCreateExtCellAPI = function(json) {
  $.ajax({
          type: "POST",
          url: cm.user.cellUrl + '__ctl/ExtCell',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
    if (document.getElementById("addCheckExtCellLinkRoleAndRelation").checked) {
      if ($('input[name="addRadioExtCellLink"]:checked').val() === "role") {
        $("#ddlAddExtCellLinkRoleList option:selected").each(function(index, option) {
          cm.setLinkParam($(option).text());
          sg.restAddExtCellLinkRole(false);
        });
        sg.getExtCellList();
      } else {
        $("#ddlAddExtCellLinkRelationList option:selected").each(function(index, option) {
          cm.setLinkParam($(option).text());
          sg.restAddExtCellLinkRelation(false);
        });
      }
    } else {
      sg.getExtCellList();
    }

    //$("#modal-add-extcell").modal("hide");
    cm.moveBackahead();
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
sg.restDeleteExtCellAPI = function() {
  var urlArray = sg.linkExtCellUrl.split("/");
  var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
  var fqdn = urlArray[2];
  var cellName = urlArray[3];
  $.ajax({
          type: "DELETE",
          url: cm.user.cellUrl + '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
    sg.getExtCellList();
    $("#modal-confirmation").modal("hide");
    //$("#modal-profile-extcell").modal("hide");
    cm.moveBackahead();
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
sg.restAddExtCellLinkRole = function(moveFlag) {
  var urlArray = sg.linkExtCellUrl.split("/");
  var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
  var fqdn = urlArray[2];
  var cellName = urlArray[3];
  var uri = cm.user.cellUrl + '__ctl/Role';
  if (cm.linkBoxName === null) {
    uri += '(\'' + cm.linkName + '\')';
  } else {
    uri += '(Name=\'' + cm.linkName + '\',_Box\.Name=\'' + cm.linkBoxName + '\')';
  }
  var json = {"uri":uri};

  $.ajax({
          type: "POST",
          url: cm.user.cellUrl + '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')/$links/_Role',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
    sg.getExtCellRoleList(sg.linkExtCellUrl).done(function(data) {
        sg.dispExtCellRoleList(data, sg.linkExtCellUrl);
    });
    //$("#modal-add-extcelllinkrole").modal("hide");
    if (moveFlag) {
        cm.moveBackahead();
    }
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
}
sg.restDeleteExtCellLinkRole = function() {
    var urlArray = sg.linkExtCellUrl.split("/");
    var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
    var fqdn = urlArray[2];
    var cellName = urlArray[3];
    var api = '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')/$links/_Role';
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
      sg.getExtCellRoleList(sg.linkExtCellUrl).done(function(data) {
        sg.dispExtCellRoleList(data, sg.linkExtCellUrl);
      });
      $("#modal-confirmation").modal("hide");
    }).fail(function(data) {
      var res = JSON.parse(data.responseText);
      alert("An error has occurred.\n" + res.message.value);
    });
};
sg.getExtCellRelationList = function(url) {
  var urlArray = url.split("/");
  var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
  var fqdn = urlArray[2];
  var cellName = urlArray[3];
  $.ajax({
          type: "GET",
          url:cm.user.cellUrl + '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')/$links/_Relation',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
            sg.dispExtCellLinkRelation(data, url);
  });
};
sg.getRelLinkExtCell = function(relName, relBoxName) {
  var uri = cm.user.cellUrl + '__ctl/Relation';
  if (relBoxName !== null) {
    uri += '(Name=\'' + relName + '\',_Box.Name=\'' + relBoxName + '\')';
  } else {
    uri += '(\'' + relName + '\')';
  }
  uri += '/$links/_ExtCell';

  $.ajax({
          type: "GET",
          url:uri,
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
            sg.dispRelationLinkExtCell(data, relName, relBoxName);
  }).fail(function(data) {
  });
};
sg.restAddExtCellLinkRelation = function(moveFlag) {
  var urlArray = sg.linkExtCellUrl.split("/");
  var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
  var fqdn = urlArray[2];
  var cellName = urlArray[3];
  var uri = cm.user.cellUrl + '__ctl/Relation';
  var linkName = cm.linkName;
  var linkBoxName = cm.linkBoxName;
  if (cm.linkBoxName === null) {
    uri += '(\'' + cm.linkName + '\')';
  } else {
    uri += '(Name=\'' + linkName + '\',_Box\.Name=\'' + linkBoxName + '\')';
  }
  var json = {"uri":uri};

  $.ajax({
          type: "POST",
          url: cm.user.cellUrl + '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')/$links/_Relation',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
    sg.getRelLinkExtCell(linkName, linkBoxName);
    //cm.getProfile(sg.linkExtCellUrl)
    //sg.getExtCellRelationList(sg.linkExtCellUrl, sg.linkExtCellNo);
    $("#modal-add-extcelllinkrelation").modal("hide");
    if (moveFlag) {
        cm.moveBackahead();
    }
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
sg.restDeleteExtCellLinkRelation = function() {
    var urlArray = sg.linkExtCellUrl.split("/");
    var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
    var fqdn = urlArray[2];
    var cellName = urlArray[3];
    var api = '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')/$links/_Relation';
    if (cm.linkBoxName === null) {
      api += '(\'' + sg.linkRelationName + '\')';
    } else {
      api += '(Name=\'' + sg.linkRelationName + '\',_Box.Name=\'' + cm.linkBoxName + '\')';
    }

    $.ajax({
            type: "DELETE",
            url: cm.user.cellUrl + api,
            headers: {
              'Authorization':'Bearer ' + cm.user.access_token
            }
    }).done(function(data) {
      sg.getRelLinkExtCell(sg.linkRelationName, cm.linkBoxName);
      sg.getExtCellList();
      //sg.getExtCellRelationList(sg.linkExtCellUrl, sg.linkExtCellNo);
      $("#modal-confirmation").modal("hide");
    }).fail(function(data) {
      var res = JSON.parse(data.responseText);
      alert("An error has occurred.\n" + res.message.value);
    });
};

sg.initSocialGraph = function() {
    cm.createSideMenu();
    cm.createTitleHeader(false, true);
    cm.createBackMenu("main.html");
    cm.setTitleMenu("Community");
    st.initSettings();
    $("#dashboard").append('<div class="panel list-group toggle-panel" id="toggle-panel1"></div>');

    // Initialization
    sg.getRelationList();

    // click event
    $('#b-add-extcell-ok').on('click', function () { sg.addExtCell(); });
    $('#b-del-extcell-ok').on('click', function () { sg.restDeleteExtCellAPI(); });
    $('#b-add-extcelllinkrole-ok').on('click', function () { sg.restAddExtCellLinkRole(); });
    $('#b-del-extcelllinkrole-ok').on('click', function () { sg.restDeleteExtCellLinkRole(); });
    $('#b-add-extcelllinkrelation-ok').on('click', function () { 
        sg.restAddExtCellLinkRelation();
        sg.getExtCellList();
    });
    $('#b-del-extcelllinkrelation-ok').on('click', function () { sg.restDeleteExtCellLinkRelation(); });

    // change event
    $('#ddlExtCellLinkRoleList').on('change', function () {
        var value = $("#ddlExtCellLinkRoleList option:selected").val();
        if (value === "") {
            $("#b-add-extcelllinkrole-ok").prop('disabled', true);
        } else {
            cm.setLinkParam(value);
            $("#b-add-extcelllinkrole-ok").prop('disabled', false);
        }
    });
    $('#ddlExtCellLinkRelationList').on('change', function () {
        var value = $("#ddlExtCellLinkRelationList option:selected").val();
        if (value === "") {
            $("#b-add-extcelllinkrelation-ok").prop('disabled', true);
        } else {
            sg.linkExtCellUrl = value;
            $("#b-add-extcelllinkrelation-ok").prop('disabled', false);
        }
    });
    $('#addCheckExtCellLink').on('change', function () {
        if (this.checked) {
            $("#ddlAddAccLinkRoleList").val("");
            $("#ddlAddAccLinkRoleList").prop('disabled', false);
        } else {
            $("#ddlAddAccLinkRoleList").val("");
            $("#popupAddAccountLinkRoleErrorMsg").html("");
            $("#ddlAddAccLinkRoleList").prop('disabled', true);
        }
    });
    $('#addCheckExtCellLinkRoleAndRelation').on('change', function () {

    });
    $('input[name="addRadioExtCellLink"]:radio').on('change', function() {
        
    });

    // blur event
    $('#addExtCellUrl').blur(function() {
        
    });
    $('#ddlAddExtCellLinkRoleList').blur(function() { sg.checkExtCellLinkRole(); });
    $('#ddlAddExtCellLinkRelationList').blur(function() { sg.checkExtCellLinkRelation(); });

    // modal show event
    $("#modal-add-extcell").on("show.bs.modal", function () {
        $("#addExtCellUrl").val("");
        $("#popupAddExtCellUrlErrorMsg").html("");
        $("#addCheckExtCellLinkRoleAndRelation").prop('checked', false);
        sg.resetExtCellLink();
    });
    $("#modal-add-extcelllinkrole").on("show.bs.modal", function () {

    });
    $("#modal-add-extcelllinkrelation").on("show.bs.modal", function () {
        $("#ddlExtCellLinkRelationList").val("");
        $("#b-add-extcelllinkrelation-ok").prop('disabled', true);
    });

    // modal hidden event
    $("#modal-add-extcell").on("hidden.bs.modal", function () {
        $("#addExtCellUrl").val("");
        $("#popupAddExtCellUrlErrorMsg").html("");
    });
    $("#modal-confirmation").on("hidden.bs.modal", function () {
        $('#b-cancel').css("display","none");
        $('#b-del-extcell-ok').css("display","none");
        $('#b-del-extcelllinkrole-ok').css("display","none");
        $('#b-del-extcelllinkrelation-ok').css("display","none");
    });

    // menu-toggle
    $(".extcellMenu").css("display", "none");
    $("#extcellToggle.toggle").on("click", function() {
      $(this).toggleClass("active");
      $(".extcellMenu").slideToggle();
    });
};

// API DEBUG
//sg.testAPI = function() {
//    var url = cm.user.cellUrl;
//    //var url = "https://demo.personium.io/ksakamoto/";
//    var urlArray = [];
//    urlArray[0] = "https";
//    urlArray[1] = "demo.personium.io";
//    urlArray[2] = "kyouhei-sakamoto";
//    //urlArray[2] = "ksakamoto";
//    $.ajax({
//            type: "GET",
//            //url: url + '__box?schema=' + urlArray[0] + '%3A%2F%2F' + urlArray[1] + '%2F' + urlArray[2] + '%2F',
//            url: url + '__ctl/Box',
//            headers: {
//                'Authorization':'Bearer ' + cm.user.access_token,
//                'Accept':'application/json'
//            }
//    }).done(function(data) {
//        var results = data.d.results;
//        var str = "";
//        for (var i in results) {
//           str += results[i].Name + ",";
//        }
//        alert(str);
//    }).fail(function(data) {
//        alert(data);
//    });
//};

sg.testAPI2 = function() {
    $.ajax({
            type: "GET",
            url: cm.user.cellUrl + '/MyBoardBox',
            headers: {
                'Authorization':'Bearer ' + cm.user.access_token,
                'Accept':'application/json'
            }
    }).done(function(data) {
        alert(data);
    });
};