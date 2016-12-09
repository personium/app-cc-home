ha.updUser = null;

$(document).ready(function() {
    createProfileHeaderMenu();
    createSideMenu();
    createTitleHeader();
    createBackMenu("main.html");
    setTitleMenu(getMsg("00009"));
    $("#dashboard").append('<div class="panel list-group toggle-panel" id="toggle-panel1"></div>');

    // Initialization
    ha.getRelationList();
    ha.populateProfile();
    //ha.getRoleList();

    // click event
    $('#b-add-extcell-ok').on('click', function () { ha.addExtCell(); });
    $('#b-del-extcell-ok').on('click', function () { ha.restDeleteExtCellAPI(); });
    $('#b-add-extcelllinkrole-ok').on('click', function () { ha.restAddExtCellLinkRole(); });
    $('#b-del-extcelllinkrole-ok').on('click', function () { ha.restDeleteExtCellLinkRole(); });
    $('#b-add-extcelllinkrelation-ok').on('click', function () { 
        ha.restAddExtCellLinkRelation();
        ha.getExtCellList();
    });
    $('#b-del-extcelllinkrelation-ok').on('click', function () { ha.restDeleteExtCellLinkRelation(); });

    // change event
    $('#ddlExtCellLinkRoleList').on('change', function () {
        var value = $("#ddlExtCellLinkRoleList option:selected").val();
        if (value === "") {
            $("#b-add-extcelllinkrole-ok").prop('disabled', true);
        } else {
            ha.setLinkParam(value);
            $("#b-add-extcelllinkrole-ok").prop('disabled', false);
        }
    });
    $('#ddlExtCellLinkRelationList').on('change', function () {
        var value = $("#ddlExtCellLinkRelationList option:selected").val();
        if (value === "") {
            $("#b-add-extcelllinkrelation-ok").prop('disabled', true);
        } else {
            ha.linkExtCellUrl = value;
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
    $('#ddlAddExtCellLinkRoleList').blur(function() { ha.checkExtCellLinkRole(); });
    $('#ddlAddExtCellLinkRelationList').blur(function() { ha.checkExtCellLinkRelation(); });

    // modal show event
    $("#modal-add-extcell").on("show.bs.modal", function () {
        $("#addExtCellUrl").val("");
        $("#popupAddExtCellUrlErrorMsg").html("");
        $("#addCheckExtCellLinkRoleAndRelation").prop('checked', false);
        ha.resetExtCellLink();
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
        ha.updUser = null;
        ha.updBox = null;
        
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

// Common
ha.resetExtCellLink = function() {
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
ha.setLinkParam = function(value) {
    var match = value.match(/(.+)\(/);
    ha.linkName = match[1];
    var boxMatch = value.match(/\((.+)\)/);
    var boxName = boxMatch[1];
    if (boxName === "[main]") {
        boxName = null;
    }
    ha.linkBoxName = boxName;
};
ha.setLinkParamName = function(relName, relBoxName) {
    ha.linkName = relName;
    if (relBoxName === "[main]") {
        ha.linkBoxName = null;
    } else {
        ha.linkBoxName = relBoxName;
    }
};
ha.populateProfile = function() {
  $("#tProfileDisplayName").html(ha.user.profile.DisplayName);
  $("#imProfilePicture").attr('src', ha.user.profile.Image);
};
ha.setLinkUrl = function(url, no) {
  ha.linkExtCellUrl = url;
  ha.linkExtCellNo = no;
};

// ExternalCell
ha.getExternalCellInfo = function(uri) {
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
ha.checkExtCellLinkRole = function() {
    var value = $("#ddlAddExtCellLinkRoleList option:selected").val();
    if (value === undefined) {
        $("#popupAddExtCellLinkErrorMsg").html(getMsg("E0014"));
        return false;
    } else {
        $("#popupAddExtCellLinkErrorMsg").html("");
        return true;
    }
};
ha.checkExtCellLinkRelation = function() {
    var value = $("#ddlAddExtCellLinkRelationList option:selected").val();
    if (value === undefined) {
        $("#popupAddExtCellLinkErrorMsg").html(getMsg("E0015"));
        return false;
    } else {
        $("#popupAddExtCellLinkErrorMsg").html("");
        return true;
    }
};
ha.getExtCellList = function() {
  $.ajax({
          type: "GET",
          url:ha.user.cellUrl + '__ctl/ExtCell',
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
            ha.dispExtCellList(data);
  }).fail(function(data) {
  });
}
ha.dispExtCellList = function(json) {
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

    $("#ddlExtCellLinkRelationList").append('<option value="' + extCell.Url + '">' + ha.getName(extCell.Url) + '</option>');

    ha.getExtCellRelationList(extCell.Url);
  }
}
ha.addExtCell = function() {
  var url = $("#addExtCellUrl").val();
  ha.checkUrlCell(url);
};
ha.checkUrlCell = function(url) {
  $.ajax({
          type: "GET",
          url: url
  }).done(function(data) {
    var jsonData = {
                    "Url" : url
    };

    // Assinginig Roles Or Relations
    ha.setLinkUrl(url, null);
    var chkObj = document.getElementById("addCheckExtCellLinkRoleAndRelation");
    if (chkObj.checked) {
      if ($('input[name="addRadioExtCellLink"]:checked').val() === "role") {
        if (ha.checkExtCellLinkRole()) {
          ha.restCreateExtCellAPI(jsonData);
        }
      } else {
        if (ha.checkExtCellLinkRelation()) {
          ha.restCreateExtCellAPI(jsonData);
        }
      }
    } else {
      ha.restCreateExtCellAPI(jsonData);
    }
  }).fail(function(data) {
    alert("The specified cell does not exist.");
  });
}
ha.dispDelExtCellModal = function() {
    $("#dvTextConfirmation").html(getMsg("I0010", ha.linkExtCellUrl));
    $("#modal-confirmation-title").html(getMsg("00018"));
    $('#b-del-extcell-ok').css("display","");
    $('#b-cancel').css("display","");
    $('#modal-confirmation').modal('show');
}
ha.urlBlurEvent = function() {
        var schemaURL = $("#addExtCellUrl").val();
        var extCellInfo = ha.getExternalCellInfo(schemaURL);
        if (extCellInfo == false) {
            $("#popupAddExtCellUrlErrorMsg").html(getMsg("E0011"));
            return false;
        }
        var extCellName = extCellInfo[1];
        var extCellURL = extCellInfo[0];
        if (ha.validateSchemaURL(schemaURL, "popupAddExtCellUrlErrorMsg", "#addExtCellUrl")
          && ha.validateURL(extCellURL, "popupAddExtCellUrlErrorMsg", "#addExtCellUrl")
          && ha.validateExternalCellName(extCellName)
          && ha.doesUrlContainSlash(schemaURL, "popupAddExtCellUrlErrorMsg", "#addExtCellUrl", getMsg("I0011"))) {

          return true;
        }
        
        return false;
};
ha.dispDelExtCellRoleModal = function(url, roleName, boxName, no) {
    ha.linkExtCellUrl = url;
    ha.linkName = roleName;
    if (boxName === "[main]") {
      ha.linkBoxName = null;
    } else {
      ha.linkBoxName = boxName
    }
    ha.linkExtCellNo = no;
    $("#dvTextConfirmation").html(getMsg("I0007", roleName, boxName));
    $("#modal-confirmation-title").html(getMsg("00006"));
    $('#b-cancel').css("display","");
    $('#b-del-extcelllinkrole-ok').css("display","");
    $('#modal-confirmation').modal('show');
};
ha.dispExtCellLinkRelation = function(json, extUrl) {
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.url < val2.url ? 1 : -1);
  })

  if (results.length === 0) {
      var dispName = ha.getName(extUrl);
      var description = "";
      var imageSrc = notImage;
      var extRelID = "dvExtCellRelList";
      ha.getProfile(extUrl).done(function(profData) {
          if (profData !== null) {
              dispName = profData.DisplayName;
              description = profData.Description;
              if (profData.Image) {
                  imageSrc = profData.Image;
              }
          }
          ha.appendRelationLinkExtCell(extUrl, dispName, description, imageSrc, extRelID, false);
      }).fail(function() {
          ha.appendRelationLinkExtCell(extUrl, dispName, description, imageSrc, extRelID, false);
      });
  }
};
ha.dispRelationLinkExtCell = function(json, relName, relBoxName) {
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

      ha.appendRelationLinkExtCellAfter(extUrl, extRelID);
    }
};
ha.appendRelationLinkExtCellAfter = function(extUrl, extRelID) {
    ha.getProfile(extUrl).done(function(profData) {
          var dispName = ha.getName(extUrl);
          var description = "";
          var imageSrc = notImage;
          if (profData !== null) {
              dispName = profData.DisplayName;
              description = profData.Description;
              if (profData.Image) {
                  imageSrc = profData.Image;
              }
          }
          ha.appendRelationLinkExtCell(extUrl, dispName, description, imageSrc, extRelID, true);
      }).fail(function() {
          var dispName = ha.getName(extUrl);
          var description = "";
          var imageSrc = notImage;
          ha.appendRelationLinkExtCell(extUrl, dispName, description, imageSrc, extRelID, true);
      });
};
ha.appendRelationLinkExtCell = function(url, dispName, description, imageSrc, extRelID, delFlag) {
    var html = '<div class="list-group-item">';
    html += '<table style="width: 100%;"><tr>';
    //html += '<td style="width: 90%;"><a class="accountToggle" onClick="ha.showRoleList(\'' + url + '\')"">';
    html += '<td style="width: 90%;"><a class="allToggle" onClick="ha.createExtCellProfile(\'' + url + '\',\'' + dispName + '\',\'' + description + '\',\'' + imageSrc + '\')"">';
    html += '<table><tr><td rowspan="2"><img class="image-circle" src="' + imageSrc + '" alt="user"></td>';
    html += '<td>' + dispName + '</td></tr>';
    html += '<tr><td><font color="LightGray">' + description + '</font></td>';
    html += '</a></td></tr></table>';
    if (delFlag) {
        var splitID = extRelID.split("-");
        var relName = splitID[1];
        var boxName = "[main]";
        if (splitID.length > 2) {
            boxName = splitID[2];
        }
        html += '<td style="width: 10%;"><a class="del-button list-group-item" style="top:25%" href="#" onClick="ha.dispDelExtCellRelationModal(\'' + url + '\',\'' + relName + '\',\'' + boxName + '\');return(false)">' + getMsg("00004") + '</a></td>';
    }
    html += '</tr></table></div>';
    $("#" + extRelID).append(html);
};
ha.showExtCellProfile = function(url, dispName, description, imagesrc) {
    ha.linkExtCellUrl = url;
    $("#imgExtProfileImage").attr("src", imagesrc);
    $("#txtExtName").html(dispName);
    $("#txtDescription").html(description);
    $('#modal-profile-extcell').modal('show');
};
ha.createExtCellProfile = function(url, dispName, description, imagesrc) {
    ha.linkExtCellUrl = url;
    $("#toggle-panel1").empty();
    setBackahead();
    var html = '<div class="panel-body">';
    html += '<div class="extcell-profile" id="dvExtProfileImage"><img class="image-circle-large" style="margin: auto;" id="imgExtProfileImage" src="' + imagesrc + '" alt="image" /><span id="txtExtUrl">' + url + '</span><h5><span id="txtDescription">' + description + '</span></h5></div>';
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="ha.showExtPublicBoxList();return(false);">' + getMsg("00037") + '</a></div>';
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="ha.createRoleList(\'' + url + '\');return(false);">' + getMsg("00038") + '</a></div>';
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="ha.dispDelExtCellModal();return(false);">' + getMsg("00018") + '</a></div>';
    html += '</div>';
    $("#toggle-panel1").append(html);
    $("#toggle-panel1,.panel-default").toggleClass('slide-on');
    setTitleMenu(dispName);
};
ha.showRoleList = function(url) {
    ha.linkExtCellUrl = url;
    ha.getExtCellRoleList(ha.linkExtCellUrl);
    $('#modal-show-extcelllinkrole').modal('show');
};
ha.createRoleList = function(url) {
    ha.linkExtCellUrl = url;
    $("#toggle-panel2").remove();
    setBackahead();
    ha.getExtCellRoleList(ha.linkExtCellUrl).done(function(data) {
        ha.dispExtCellRoleList(data, ha.linkExtCellUrl);
        $("#toggle-panel2").toggleClass('slide-on');
        $("#toggle-panel1").toggleClass('slide-on-holder');
        setTitleMenu(getMsg("00038"));
    });
};
ha.getExtCellRoleList = function(url) {
  var urlArray = url.split("/");
  var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
  var fqdn = urlArray[2];
  var cellName = urlArray[3];
  return $.ajax({
          type: "GET",
          url:ha.user.cellUrl + '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')/$links/_Role',
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  })
};
ha.dispExtCellRoleList = function(json, exturl) {
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
    html += '<table style="width: 100%;"><tr>';
    html += '<td style="width: 90%;">' + name + '(' + boxName + ')</td>';
    html += '<td colspan="2" style="width: 10%;"><a class="del-button list-group-item" href="#" onClick="ha.dispDelExtCellRoleModal(\'' + exturl + '\',\'' + name + '\',\'' + boxName + '\');return(false)">' + getMsg("00004") + '</a></td>';
    //html += '</tr><tr>';
    //html += '<td>' + boxName + '</td>';
    html += '</tr></table></div>';
    //$("#dvExtCellLinkRole").append(html);
  }
  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="dispAssignRole(\'ext\')">＋ ' + getMsg("00025") + '</a></div>';
  //html = '<a class="list-group-item" href="#" data-toggle="modal" data-target="#modal-add-extcelllinkrole">＋ ' + getMsg("00025") + '</a>';
  html += '</div>';
  $("#toggle-panel2").append(html);
};
ha.showExtPublicBoxList = function() {
    getTargetToken(ha.linkExtCellUrl).done(function(data) {
        var urlArray = ha.linkExtCellUrl.split("/");
        var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
        var fqdn = urlArray[2];
        var cellName = urlArray[3];
        $.ajax({
                type: "GET",
                url: ha.linkExtCellUrl + "__ctl/Box" ,
                headers: {
                  'Authorization':'Bearer ' + data.access_token,
                  'Accept':'application/json'
                }
        }).done(function(data) {
                  ha.checkBoxPublic(data);
        }).fail(function(data) {
                  $('#dvTextConfirmation').html(getMsg("I0019"));
                  $('#modal-confirmation-title').html(getMsg("00037"));
                  $('#b-cancel').css("display","");
                  $('#modal-confirmation').modal('show');
        });
    }).fail(function(data) {
        alert(data);
    });
};
ha.checkBoxPublic = function(json) {
    $("#toggle-panel2").empty();
    setBackahead();
    var results = json.d.results;
    results.sort(function(val1, val2) {
      return (val1.Name < val2.Name ? 1 : -1);
    })
    var html = '<div class="panel-body">';
    html += '<p>' + getMsg("00027") + '</p><HR>';
    for (var i in results) {
        var boxName = json.d.results[i].Name;
        html += '<p style="margin-top: 10px;">' + boxName + '</p>';
    }
    html += '</div>';
    $("#toggle-panel2").append(html);
    $("#toggle-panel2").toggleClass('slide-on');
    $("#toggle-panel1").toggleClass('slide-on-holder');
    setTitleMenu(getMsg("00037"));
    //$('#modal-public-extbox').modal('show');
};
ha.dispPublicBoxList = function(json) {
    
};
ha.dispDelExtCellRelationModal = function(url, relationName, boxName, no) {
    ha.linkExtCellUrl = url;
    ha.linkRelationName = relationName;
    if (boxName === "[main]") {
      ha.linkBoxName = null;
    } else {
      ha.linkBoxName = boxName
    }
    ha.linkExtCellNo = no;
    $("#dvTextConfirmation").html(getMsg("I0012", relationName, boxName));
    $("#modal-confirmation-title").html(getMsg("00019"));
    $('#b-cancel').css("display","");
    $('#b-del-extcelllinkrelation-ok').css("display","");
    $('#modal-confirmation').modal('show');
};

// Role
ha.getRoleList = function() {
  $.ajax({
          type: "GET",
          url:ha.user.cellUrl + '__ctl/Role',
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
            ha.dispRoleList(data);
  }).fail(function(data) {
  });
};
ha.dispRoleList = function(json) {
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })
  var objSel = document.getElementById("ddlExtCellLinkRoleList");
  if (objSel.hasChildNodes()) {
    while (objSel.childNodes.length > 0) {
      objSel.removeChild(objSel.firstChild);
    }
  }
  objSel = document.getElementById("ddlAddExtCellLinkRoleList");
  if (objSel.hasChildNodes()) {
    while (objSel.childNodes.length > 0) {
      objSel.removeChild(objSel.firstChild);
    }
  }
  $("#ddlExtCellLinkRoleList").append('<option value="">Please select a Role</option>');
  for (var i in results) {
    var objRole = json.d.results[i];
    var boxName = objRole["_Box.Name"];
    if (boxName === null) {
      boxName = "[main]";
    }

    // role list(selectBox)
    $("#ddlExtCellLinkRoleList").append('<option value="' + objRole.Name + '(' + boxName + ')">' + objRole.Name + '(' + boxName + ')</option>');
    $("#ddlAddExtCellLinkRoleList").append('<option value="' + objRole.Name + '(' + boxName + ')">' + objRole.Name + '(' + boxName + ')</option>');
  }
};

// Relation
ha.getRelationList = function() {
  $("#dvExtCellList").empty();
  $.ajax({
          type: "GET",
          url:ha.user.cellUrl + '__ctl/Relation',
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
            ha.dispRelationList(data);
  }).fail(function(data) {
  });
};
ha.dispRelationList = function(json) {
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
    html += '<td><a class="accountToggle" id="relationLinkToRoleToggle' + i + '" onClick="ha.slideToggle(\'extCellRelMenu' + i + '\')">';
    html += '<table><tr><td>' + objRelation.Name + '(' + boxName + ')</td></tr></table>';
    //html += '<table><tr><td>' + boxName + '</td></tr></table>';
    html += '</a></td>';
    html += '</tr></table></div>';
    html += '<nav id="extCellRelMenu' + i + '"><ul class="extCellRelMenu"><div name="dvExtCellRelList" id="' + extRelID + '"></div><div>';
    html += '<a class="list-group-item" href="#" onClick="ha.setLinkParamName(\'' + objRelation.Name + '\',\'' + boxName + '\')" data-toggle="modal" data-target="#modal-add-extcelllinkrelation">＋ ' + getMsg("00022") + '</a></div></nav>';
    $("#dvExtCellList").append(html);
    ha.getRelLinkExtCell(objRelation.Name, relBoxName);
  }

  // Independent
  html = '<div class="list-group-item relation-menu">';
  html += '<a class="accountToggle" id="relationLinkToRoleToggle" onClick="ha.slideToggle(\'extCellRelMenu\')">' + getMsg("00023") + '</a>';
  html += '</div>';
  html += '<nav id="extCellRelMenu"><ul class="extCellRelMenu"><div name="dvExtCellRelList" id="dvExtCellRelList"></div>';
  //html += '<div><a class="list-group-item" href="#" data-toggle="modal" data-target="#modal-add-extcell">＋ ' + getMsg("00024") + '</a></div>';
  html += '<div class="list-group-item"><a class="allToggle" href="#" onClick="ha.createAddExtCell()">＋ ' + getMsg("00024") + '</a></div>';
  html += '</nav>';
  $("#dvExtCellList").append(html);
  ha.getExtCellList();

  $(".relationRoleMenu").css("display", "none");
};
ha.createAddExtCell = function() {
    $("#toggle-panel1").empty();
    setBackahead();
    getRoleList().done(function(data) {
        var html = '<div class="panel-body">';
        html += '<div id="dvSelectedCell">URL</div>';
        html += '<div id="dvTextSelectedCell" style="margin-bottom: 10px;"><input type="text" id="addExtCellUrl" onblur="ha.blurAddExtCellUrl();"><span class="popupAlertArea" style="color:red"><aside id="popupAddExtCellUrlErrorMsg"> </aside></span></div>';
        html += '<div id="dvCheckAddExtCellLinkRoleAndRelation" style="margin-bottom: 10px;"><label><input type="checkbox" id="addCheckExtCellLinkRoleAndRelation" onChange="ha.changeCheckExtCellLinkRoleAndRelation(this);">' + getMsg("I0018") + '</label></div>';
        html += '<div id="dvSelectAddExtCellLink" style="margin-bottom: 10px;"><table>';
        html += '<tr><td><label><input type="radio" name="addRadioExtCellLink" id="addRadioExtCellLinkRole" onChange="ha.changeRadioExtCellLink();" value="role" disabled>' + getMsg("00032") + '</label></td><td><label><input type="radio" name="addRadioExtCellLink" id="addRadioExtCellLinkRelation" onChange="ha.changeRadioExtCellLink();" value="relation" disabled>' + getMsg("00033") + '</label></td></tr>';
        html += '<tr><td colspan="2"><select name="" id="ddlAddExtCellLinkRoleList" multiple disabled><option>Select a role</option></select><select name="" id="ddlAddExtCellLinkRelationList" multiple disabled style="display:none;"><option>Select a relation</option></select></td></tr>';
        html += '<tr><td colspan="2"><span class="popupAlertArea" style="color:red"><aside id="popupAddExtCellLinkErrorMsg"> </aside></span></td></tr>';
        html += '</table></div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" onClick="moveBackahead();">Cancel</button>';
        html += '<button type="button" class="btn btn-primary" id="b-add-extcell-ok" onClick="ha.addExtCell();">Add</button>';
        html += '</div></div>';
        $("#toggle-panel1").append(html);
        dispRoleList(data, "ddlAddExtCellLinkRoleList", true);
        getRelationList().done(function(data) {
            dispRelationList(data, "ddlAddExtCellLinkRelationList", true);
            $("#toggle-panel1,.panel-default").toggleClass('slide-on');
            setTitleMenu(getMsg("00024"));
        });
    });
};
ha.blurAddExtCellUrl = function() {
    var bool = ha.urlBlurEvent();
    $('#b-add-extcell-ok').prop('disabled', !bool);
};
ha.changeCheckExtCellLinkRoleAndRelation = function(obj) {
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
        ha.resetExtCellLink();
    }
};
ha.changeRadioExtCellLink = function() {
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
ha.validateExternalCellName = function(cellName) {
	if (cellName == undefined) {
		//cellpopup.showErrorIcon('#txtUrl');
		document.getElementById("popupAddExtCellUrlErrorMsg").innerHTML = getMsg("E0017");
		return false;
	}
	var letters = /^[0-9a-zA-Z-_]+$/;
	var startHyphenUnderscore = /^[-_]/;
	var lenCellName = cellName.length;
	if (lenCellName < 1) {
		document.getElementById("popupAddExtCellUrlErrorMsg").innerHTML = getMsg("E0018");
		//cellpopup.showErrorIcon('#txtUrl');
		return false;
	} else if (lenCellName > 128) {
		document.getElementById("popupAddExtCellUrlErrorMsg").innerHTML = getMsg("E0019");
		//cellpopup.showErrorIcon('#txtUrl');
		return false;
	} else if (cellName.match(startHyphenUnderscore)) {
          document.getElementById("popupAddExtCellUrlErrorMsg").innerHTML = getMsg("E0020");
          //cellpopup.showErrorIcon('#txtUrl');
          return false;
	} else if (lenCellName != 0 && !(cellName.match(letters))) {
		document.getElementById("popupAddExtCellUrlErrorMsg").innerHTML = getMsg("E0005");
		//cellpopup.showErrorIcon('#txtUrl');
		return false;
	}
	document.getElementById("popupAddExtCellUrlErrorMsg").innerHTML = "";
	//cellpopup.showValidValueIcon('#txtUrl');
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
ha.getProfile = function(url) {
    return $.ajax({
	type: "GET",
	url: url + '__/profile.json',
	dataType: 'json',
        headers: {'Accept':'application/json'}
    })
};
ha.restCreateExtCellAPI = function(json) {
  $.ajax({
          type: "POST",
          url: ha.user.cellUrl + '__ctl/ExtCell',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
    if (document.getElementById("addCheckExtCellLinkRoleAndRelation").checked) {
      if ($('input[name="addRadioExtCellLink"]:checked').val() === "role") {
        $("#ddlAddExtCellLinkRoleList option:selected").each(function(index, option) {
          ha.setLinkParam($(option).text());
          ha.restAddExtCellLinkRole(false);
        });
        ha.getExtCellList();
      } else {
        $("#ddlAddExtCellLinkRelationList option:selected").each(function(index, option) {
          ha.setLinkParam($(option).text());
          ha.restAddExtCellLinkRelation(false);
        });
      }
    } else {
      ha.getExtCellList();
    }

    //$("#modal-add-extcell").modal("hide");
    moveBackahead();
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
ha.restDeleteExtCellAPI = function() {
  var urlArray = ha.linkExtCellUrl.split("/");
  var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
  var fqdn = urlArray[2];
  var cellName = urlArray[3];
  $.ajax({
          type: "DELETE",
          url: ha.user.cellUrl + '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')',
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
    ha.getExtCellList();
    $("#modal-confirmation").modal("hide");
    //$("#modal-profile-extcell").modal("hide");
    moveBackahead();
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
ha.restAddExtCellLinkRole = function(moveFlag) {
  var urlArray = ha.linkExtCellUrl.split("/");
  var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
  var fqdn = urlArray[2];
  var cellName = urlArray[3];
  var uri = ha.user.cellUrl + '__ctl/Role';
  if (ha.linkBoxName === null) {
    uri += '(\'' + ha.linkName + '\')';
  } else {
    uri += '(Name=\'' + ha.linkName + '\',_Box\.Name=\'' + ha.linkBoxName + '\')';
  }
  var json = {"uri":uri};

  $.ajax({
          type: "POST",
          url: ha.user.cellUrl + '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')/$links/_Role',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
    ha.getExtCellRoleList(ha.linkExtCellUrl).done(function(data) {
        ha.dispExtCellRoleList(data, ha.linkExtCellUrl);
    });
    //$("#modal-add-extcelllinkrole").modal("hide");
    if (moveFlag) {
        moveBackahead();
    }
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
}
ha.restDeleteExtCellLinkRole = function() {
    var urlArray = ha.linkExtCellUrl.split("/");
    var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
    var fqdn = urlArray[2];
    var cellName = urlArray[3];
    var api = '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')/$links/_Role';
    if (ha.linkBoxName === null) {
      api += '(\'' + ha.linkName + '\')';
    } else {
      api += '(Name=\'' + ha.linkName + '\',_Box.Name=\'' + ha.linkBoxName + '\')';
    }

    $.ajax({
            type: "DELETE",
            url: ha.user.cellUrl + api,
            headers: {
              'Authorization':'Bearer ' + ha.user.access_token
            }
    }).done(function(data) {
      ha.getExtCellRoleList(ha.linkExtCellUrl).done(function(data) {
        ha.dispExtCellRoleList(data, ha.linkExtCellUrl);
      });
      $("#modal-confirmation").modal("hide");
    }).fail(function(data) {
      var res = JSON.parse(data.responseText);
      alert("An error has occurred.\n" + res.message.value);
    });
};
ha.getExtCellRelationList = function(url) {
  var urlArray = url.split("/");
  var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
  var fqdn = urlArray[2];
  var cellName = urlArray[3];
  $.ajax({
          type: "GET",
          url:ha.user.cellUrl + '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')/$links/_Relation',
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
            ha.dispExtCellLinkRelation(data, url);
  });
};
ha.getRelLinkExtCell = function(relName, relBoxName) {
  var uri = ha.user.cellUrl + '__ctl/Relation';
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
            'Authorization':'Bearer ' + ha.user.access_token
          }
  }).done(function(data) {
            ha.dispRelationLinkExtCell(data, relName, relBoxName);
  }).fail(function(data) {
  });
};
ha.restAddExtCellLinkRelation = function(moveFlag) {
  var urlArray = ha.linkExtCellUrl.split("/");
  var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
  var fqdn = urlArray[2];
  var cellName = urlArray[3];
  var uri = ha.user.cellUrl + '__ctl/Relation';
  var linkName = ha.linkName;
  var linkBoxName = ha.linkBoxName;
  if (ha.linkBoxName === null) {
    uri += '(\'' + ha.linkName + '\')';
  } else {
    uri += '(Name=\'' + linkName + '\',_Box\.Name=\'' + linkBoxName + '\')';
  }
  var json = {"uri":uri};

  $.ajax({
          type: "POST",
          url: ha.user.cellUrl + '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')/$links/_Relation',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
    ha.getRelLinkExtCell(linkName, linkBoxName);
    //ha.getProfile(ha.linkExtCellUrl)
    //ha.getExtCellRelationList(ha.linkExtCellUrl, ha.linkExtCellNo);
    $("#modal-add-extcelllinkrelation").modal("hide");
    if (moveFlag) {
        moveBackahead();
    }
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
ha.restDeleteExtCellLinkRelation = function() {
    var urlArray = ha.linkExtCellUrl.split("/");
    var hProt = urlArray[0].substring(0, urlArray[0].length - 1);
    var fqdn = urlArray[2];
    var cellName = urlArray[3];
    var api = '__ctl/ExtCell(\'' + hProt + '%3A%2F%2F' + fqdn + '%2F' + cellName + '%2F\')/$links/_Relation';
    if (ha.linkBoxName === null) {
      api += '(\'' + ha.linkRelationName + '\')';
    } else {
      api += '(Name=\'' + ha.linkRelationName + '\',_Box.Name=\'' + ha.linkBoxName + '\')';
    }

    $.ajax({
            type: "DELETE",
            url: ha.user.cellUrl + api,
            headers: {
              'Authorization':'Bearer ' + ha.user.access_token
            }
    }).done(function(data) {
      ha.getRelLinkExtCell(ha.linkRelationName, ha.linkBoxName);
      ha.getExtCellList();
      //ha.getExtCellRelationList(ha.linkExtCellUrl, ha.linkExtCellNo);
      $("#modal-confirmation").modal("hide");
    }).fail(function(data) {
      var res = JSON.parse(data.responseText);
      alert("An error has occurred.\n" + res.message.value);
    });
};

// API DEBUG
//ha.testAPI = function() {
//    var url = ha.user.cellUrl;
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
//                'Authorization':'Bearer ' + ha.user.access_token,
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

ha.testAPI = function() {
    var url = ha.user.cellUrl;
    //var url = "https://demo.personium.io/ksakamoto/";
    var urlArray = [];
    urlArray[0] = "https";
    urlArray[1] = "demo.personium.io";
    urlArray[2] = "kyouhei-sakamoto";
    var apiUrl = "https://demo.personium.io/app-myboard/__/MyBoard.bar";
    //urlArray[2] = "ksakamoto";
    $.ajax({
            type: "MKCOL",
            //url: url + '__box?schema=' + urlArray[0] + '%3A%2F%2F' + urlArray[1] + '%2F' + urlArray[2] + '%2F',
            url: url + '/test',
            form: {
                   'file':'https://demo.personium.io/app-myboard/',
                   'type':'application/zip'
            },
            headers: {
                'Authorization':'Bearer ' + ha.user.access_token,
                'Content-type':'application / zip'
            }
    }).done(function(data) {
        alert(data);
    }).fail(function(data) {
        alert(data);
    });
};

ha.testAPI2 = function() {
    $.ajax({
            type: "GET",
            url: ha.user.cellUrl + '/MyBoardBox',
            headers: {
                'Authorization':'Bearer ' + ha.user.access_token,
                'Accept':'application/json'
            }
    }).done(function(data) {
        alert(data);
    });
};