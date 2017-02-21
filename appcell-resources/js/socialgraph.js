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
        $("#popupAddExtCellLinkErrorMsg").html(mg.getMsg("E0014"));
        return false;
    } else {
        $("#popupAddExtCellLinkErrorMsg").html("");
        return true;
    }
};
sg.checkExtCellLinkRelation = function() {
    var value = $("#ddlAddExtCellLinkRelationList option:selected").val();
    if (value === undefined) {
        $("#popupAddExtCellLinkErrorMsg").html(mg.getMsg("E0015"));
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
  $("#ddlExtCellLinkRelationList").append('<option value="">Please select a External Cell</option>');

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
    alert("The specified cell does not exist.");
  });
}
sg.dispDelExtCellModal = function() {
    $("#dvTextConfirmation").html(mg.getMsg("I0010", sg.linkExtCellUrl));
    $("#modal-confirmation-title").html(mg.getMsg("00018"));
    $('#b-del-extcell-ok').css("display","");
    $('#b-cancel').css("display","");
    $('#modal-confirmation').modal('show');
}
sg.urlBlurEvent = function() {
        var schemaURL = $("#addExtCellUrl").val();
        var extCellInfo = sg.getExternalCellInfo(schemaURL);
        if (extCellInfo == false) {
            $("#popupAddExtCellUrlErrorMsg").html(mg.getMsg("E0011"));
            return false;
        }
        var extCellName = extCellInfo[1];
        var extCellURL = extCellInfo[0];
        if (sg.validateSchemaURL(schemaURL, "popupAddExtCellUrlErrorMsg", "#addExtCellUrl")
          && sg.validateURL(extCellURL, "popupAddExtCellUrlErrorMsg", "#addExtCellUrl")
          && sg.validateExternalCellName(extCellName)
          && sg.doesUrlContainSlash(schemaURL, "popupAddExtCellUrlErrorMsg", "#addExtCellUrl", mg.getMsg("I0011"))) {

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
    $("#dvTextConfirmation").html(mg.getMsg("I0007", roleName, boxName));
    $("#modal-confirmation-title").html(mg.getMsg("00006"));
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
        html += '<td style="width: 10%;"><a class="del-button list-group-item" style="top:25%" href="#" onClick="sg.dispDelExtCellRelationModal(\'' + url + '\',\'' + relName + '\',\'' + boxName + '\');return(false)">' + mg.getMsg("00004") + '</a></td>';
    } else {
        html += '<td style="width: 10%;"></td>';
    }
    html += '</tr></table></div>';
    $("#" + extRelID).append(html);
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
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="sg.showExtPublicBoxList();return(false);">' + mg.getMsg("00037") + '</a></div>';
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="sg.createRoleList(\'' + url + '\');return(false);">' + mg.getMsg("00038") + '</a></div>';
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="sg.dispDelExtCellModal();return(false);">' + mg.getMsg("00018") + '</a></div>';
    html += '</div>';
    $("#toggle-panel1").append(html);
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
        cm.setTitleMenu(mg.getMsg("00038"));
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
    html += '<td colspan="2" style="width: 15%;"><a class="del-button list-group-item" href="#" onClick="sg.dispDelExtCellRoleModal(\'' + exturl + '\',\'' + name + '\',\'' + boxName + '\');return(false)">' + mg.getMsg("00004") + '</a></td>';
    //html += '</tr><tr>';
    //html += '<td>' + boxName + '</td>';
    html += '</tr></table></div>';
    //$("#dvExtCellLinkRole").append(html);
  }
  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="cm.dispAssignRole(\'ext\')">＋ ' + mg.getMsg("00025") + '</a></div>';
  //html = '<a class="list-group-item" href="#" data-toggle="modal" data-target="#modal-add-extcelllinkrole">＋ ' + mg.getMsg("00025") + '</a>';
  html += '</div>';
  $("#toggle-panel2").append(html);
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
                  $('#dvTextConfirmation').html(mg.getMsg("I0019"));
                  $('#modal-confirmation-title').html(mg.getMsg("00037"));
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
    html += '<p>' + mg.getMsg("00027") + '</p><HR>';
    for (var i in results) {
        var boxName = json.d.results[i].Name;
        html += '<p style="margin-top: 10px;">' + boxName + '</p>';
    }
    html += '</div>';
    $("#toggle-panel2").append(html);
    $("#toggle-panel2").toggleClass('slide-on');
    $("#toggle-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu(mg.getMsg("00037"));
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
    $("#dvTextConfirmation").html(mg.getMsg("I0012", relationName, boxName));
    $("#modal-confirmation-title").html(mg.getMsg("00019"));
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
    html += '<td><a class="accountToggle" id="relationLinkToRoleToggle' + i + '" onClick="sg.slideToggle(\'extCellRelMenu' + i + '\')">';
    html += '<table><tr><td>' + objRelation.Name + '(' + boxName + ')</td></tr></table>';
    //html += '<table><tr><td>' + boxName + '</td></tr></table>';
    html += '</a></td>';
    html += '</tr></table></div>';
    html += '<nav id="extCellRelMenu' + i + '"><ul class="extCellRelMenu"><div name="dvExtCellRelList" id="' + extRelID + '"></div><div>';
    html += '<a class="list-group-item" href="#" onClick="sg.setLinkParamName(\'' + objRelation.Name + '\',\'' + boxName + '\')" data-toggle="modal" data-target="#modal-add-extcelllinkrelation">＋ ' + mg.getMsg("00022") + '</a></div></ul></nav>';
    $("#dvExtCellList").append(html);
    sg.getRelLinkExtCell(objRelation.Name, relBoxName);
  }

  // Independent
  html = '<div class="list-group-item relation-menu">';
  html += '<a class="accountToggle" id="relationLinkToRoleToggle" onClick="sg.slideToggle(\'extCellRelMenu\')">' + mg.getMsg("00023") + '</a>';
  html += '</div>';
  html += '<nav id="extCellRelMenu"><ul class="extCellRelMenu"><div name="dvExtCellRelList" id="dvExtCellRelList"></div>';
  //html += '<div><a class="list-group-item" href="#" data-toggle="modal" data-target="#modal-add-extcell">＋ ' + mg.getMsg("00024") + '</a></div>';
  html += '<div class="list-group-item"><a class="allToggle" href="#" onClick="sg.createAddExtCell()">＋ ' + mg.getMsg("00024") + '</a></div>';
  html += '</ul></nav>';
  $("#dvExtCellList").append(html);
  sg.getExtCellList();

  $(".relationRoleMenu").css("display", "none");
};
sg.createAddExtCell = function() {
    $("#toggle-panel1").empty();
    cm.setBackahead();
    cm.getRoleList().done(function(data) {
        var html = '<div class="panel-body">';
        html += '<div id="dvSelectedCell">URL</div>';
        html += '<div id="dvTextSelectedCell" style="margin-bottom: 10px;"><input type="text" id="addExtCellUrl" onblur="sg.blurAddExtCellUrl();"><span class="popupAlertArea" style="color:red"><aside id="popupAddExtCellUrlErrorMsg"> </aside></span></div>';
        html += '<div id="dvCheckAddExtCellLinkRoleAndRelation" style="margin-bottom: 10px;"><label><input type="checkbox" id="addCheckExtCellLinkRoleAndRelation" onChange="sg.changeCheckExtCellLinkRoleAndRelation(this);">' + mg.getMsg("I0018") + '</label></div>';
        html += '<div id="dvSelectAddExtCellLink" style="margin-bottom: 10px;"><table>';
        html += '<tr><td><label><input type="radio" name="addRadioExtCellLink" id="addRadioExtCellLinkRole" onChange="sg.changeRadioExtCellLink();" value="role" disabled>' + mg.getMsg("00032") + '</label></td><td><label><input type="radio" name="addRadioExtCellLink" id="addRadioExtCellLinkRelation" onChange="sg.changeRadioExtCellLink();" value="relation" disabled>' + mg.getMsg("00033") + '</label></td></tr>';
        html += '<tr><td colspan="2"><select name="" id="ddlAddExtCellLinkRoleList" multiple disabled><option>Select a role</option></select><select name="" id="ddlAddExtCellLinkRelationList" multiple disabled style="display:none;"><option>Select a relation</option></select></td></tr>';
        html += '<tr><td colspan="2"><span class="popupAlertArea" style="color:red"><aside id="popupAddExtCellLinkErrorMsg"> </aside></span></td></tr>';
        html += '</table></div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead();">Cancel</button>';
        html += '<button type="button" class="btn btn-primary" id="b-add-extcell-ok" onClick="sg.addExtCell();">Add</button>';
        html += '</div></div>';
        $("#toggle-panel1").append(html);
        cm.dispRoleList(data, "ddlAddExtCellLinkRoleList", true);
        cm.getRelationList().done(function(data) {
            cm.dispRelationList(data, "ddlAddExtCellLinkRelationList", true);
            $("#toggle-panel1,.panel-default").toggleClass('slide-on');
            cm.setTitleMenu(mg.getMsg("00024"));
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
sg.validateName = function (displayName, displayNameSpan,txtID) {
        var MINLENGTH = 1;
        var MAXLENGTH = 128;
        var letters = /[0-9a-zA-Z-_!\$\*=\^`\{\|\}~\.@]+$/;
        var specialchar = /^[-_!\$\*=\^`\{\|\}~\.@]*$/;
        var allowedLetters = /[0-9a-zA-Z-_!\$\*=\^`\{\|\}~\.@]+$/;
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
sg.validateSchemaURL = function(schemaURL, schemaSpan, txtID) {
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
    //removeStatusIcons(txtID);
    return true;
	} else if ((isHttp != "http:" && isHttps != "https:")
            || (minURLLength <= 8)) {
    document.getElementById(schemaSpan).innerHTML = validMessage;
    //showErrorIcon(txtID);
    return false;
  } else if (urlLength > 1024) {
    document.getElementById(schemaSpan).innerHTML = mg.getMsg("E0008");
    //showErrorIcon(txtID);
    return false;
  } else if (domainName.match(startHyphenUnderscore)) {
    document.getElementById(schemaSpan).innerHTML = mg.getMsg("E0009");
    //showErrorIcon(txtID);
    return false;
  } else if (!(domainName.match(letters))) {
    document.getElementById(schemaSpan).innerHTML = mg.getMsg("E0005");
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
sg.validateURL = function(domainName,errorSpan,txtID) {
	var letters = /^[0-9a-zA-Z-_.]+$/;
	var startHyphenUnderscore = /^[-_!@#$%^&*()=+]/;
	if (domainName == undefined){
		document.getElementById(errorSpan).innerHTML = mg.getMsg("E0011");
		//cellpopup.showErrorIcon(txtID);
		return false;
	}
	var lenCellName = domainName.length;
	if (domainName.match(startHyphenUnderscore)) {
		document.getElementById(errorSpan).innerHTML = mg.getMsg("E0009");
		//cellpopup.showErrorIcon(txtID);
		return false;
	} else if (lenCellName != 0 && !(domainName.match(letters))) {
		document.getElementById(errorSpan).innerHTML = mg.getMsg("E0005");
		//cellpopup.showErrorIcon(txtID);
		return false;
	} 
	document.getElementById(errorSpan).innerHTML = "";
	//cellpopup.showValidValueIcon(txtID);
	return true;
};
sg.validateExternalCellName = function(cellName) {
	if (cellName == undefined) {
		//cellpopup.showErrorIcon('#txtUrl');
		document.getElementById("popupAddExtCellUrlErrorMsg").innerHTML = mg.getMsg("E0017");
		return false;
	}
	var letters = /^[0-9a-zA-Z-_]+$/;
	var startHyphenUnderscore = /^[-_]/;
	var lenCellName = cellName.length;
	if (lenCellName < 1) {
		document.getElementById("popupAddExtCellUrlErrorMsg").innerHTML = mg.getMsg("E0018");
		//cellpopup.showErrorIcon('#txtUrl');
		return false;
	} else if (lenCellName > 128) {
		document.getElementById("popupAddExtCellUrlErrorMsg").innerHTML = mg.getMsg("E0019");
		//cellpopup.showErrorIcon('#txtUrl');
		return false;
	} else if (cellName.match(startHyphenUnderscore)) {
          document.getElementById("popupAddExtCellUrlErrorMsg").innerHTML = mg.getMsg("E0020");
          //cellpopup.showErrorIcon('#txtUrl');
          return false;
	} else if (lenCellName != 0 && !(cellName.match(letters))) {
		document.getElementById("popupAddExtCellUrlErrorMsg").innerHTML = mg.getMsg("E0005");
		//cellpopup.showErrorIcon('#txtUrl');
		return false;
	}
	document.getElementById("popupAddExtCellUrlErrorMsg").innerHTML = "";
	//cellpopup.showValidValueIcon('#txtUrl');
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

$(document).ready(function() {
    cm.createProfileHeaderMenu();
    cm.createSideMenu();
    cm.createTitleHeader();
    cm.createBackMenu("main.html");
    cm.setTitleMenu(mg.getMsg("00009"));
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
});

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