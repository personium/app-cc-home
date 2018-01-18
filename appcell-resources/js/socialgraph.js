var sg = {};

loadScript = function () {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.3.1/purl.min.js";
    head.appendChild(script);
}

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
    return $.ajax({
        type: "GET",
        url: cm.user.cellUrl + '__ctl/ExtCell',
        headers: {
            'Authorization': 'Bearer ' + cm.user.access_token,
            'Accept': 'application/json'
        }
    });
}
sg.dispExtCellList = function (json) {
    $('#dvExtCellList').empty();

    var results = json.d.results;
    results.sort(function (val1, val2) {
        return (val1.Url < val2.Url ? 1 : -1);
    })
    for (var i = 0; i < results.length; i++) {
        var extCellUrl = results[i].Url;
        sg.dispExtCellListProf(extCellUrl);
    }
};
sg.dispExtCellListProf = function (extCellUrl) {
    // Displace the cell URL with the unit's proper URL. However, when sending to the server, we use "personium-localunit:" URL format.
    var extCellUrlCnv = ut.changeLocalUnitToUnitUrl(extCellUrl);
    var cellName = ut.getName(extCellUrl);
    var profObj = {
        DisplayName: cellName,
        Description: "",
        Image: cm.notImage
    }
    var extRelObj = { ID: "dvExtCellList" };
    cm.getProfile(extCellUrlCnv).done(function (profData) {
        if (profData !== null) {
            profObj.DisplayName = _.escape(profData.DisplayName);
            profObj.Description = _.escape(profData.Description);
            if (profData.Image) {
                profObj.Image = profData.Image;
            }
        }
    }).always(function () {
        var profTrans = "profTrans";
        var urlParse = $.url(extCellUrlCnv);
        var transName = urlParse.attr('host') + "_" + cellName;
        cm.i18nAddProfile("en", profTrans, transName, profObj, extCellUrlCnv, "profile", null, true);
        cm.i18nAddProfile("ja", profTrans, transName, profObj, extCellUrlCnv, "profile", null, true);
        sg.appendRelationLinkExtCell(extCellUrl, profTrans + ":" + transName, extRelObj, false);
    });
};
sg.addExtCell = function() {
  var url = $("#addExtCellUrl").val();
  sg.checkUrlCell(url);
};
sg.checkUrlCell = function(url) {
    sg.getCell().done(function (data) {
        var cellUrl = ut.changeUnitUrlToLocalUnit(url);
        var jsonData = {
                        "Url" : cellUrl
        };
        
        // Assigning Roles or Relations using the "personium-localunit:" format if possible
        sg.setLinkUrl(cellUrl, null);
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
    $("#dvTextConfirmation").html(i18next.t("confirmDeleteExternalCell", { value: ut.changeLocalUnitToUnitUrl(sg.linkExtCellUrl)}));
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
        $("#dvTextConfirmation").html(i18next.t("removeAssociationRole", { value1: roleName, value2: boxName }));
    } else {
        cm.linkBoxName = boxName;
        $("#dvTextConfirmation").html(i18next.t("removeAssociationRole", { value1: i18next.t("profTrans:" + roleName + "_" + boxName + "_DisplayName"), value2: "" }));
    }

    $("#modal-confirmation-title").html(i18next.t("DeleteAssigningRole"));
    $('#b-cancel').css("display","");
    $('#b-del-extcelllinkrole-ok').css("display","");
    $('#modal-confirmation').modal('show');
};
sg.dispExtCellLinkRelation = function (json, extUrl) {
  $("#toggle-panel2").empty();
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.url < val2.url ? 1 : -1);
  })

  var html = '<div class="panel-body" id="relList">';
  html += '</div>';
  $("#toggle-panel2").append(html);

  // add relation list
  for (var i = 0; i < results.length; i++) {
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

      var profTag = "";
      if (matchBox) {
          profTag = [
              '<tr>',
              '<td>',
              '<img class="image-circle-small" data-i18n="[src]profTrans:' + boxName + '_Image" src="' + cm.notImage + '" alt="user">',
              '<font color="LightGray" data-i18n="profTrans:' + boxName + '_DisplayName"></font>',
              '</td>',
              '</tr>'
          ].join("");
      }

      var tempHTML = [
          '<table class="table-fixed">',
          '<tr>',
          '<td rowspan="3" style="width: 25%;"><img class="image-circle" data-i18n="[src]profTrans:' + name + '_' + boxName + '_Image" src="' + cm.notImage + '" alt="user"></td>',
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
          onClick: 'sg.dispDelExtCellRelationModal(\'' + extUrl + '\',\'' + name + '\',\'' + boxName + '\')',
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
      $("#relList").append($(aDiv)).localize();

      //html += '<div class="list-group-item" id="relList' + i + '">';
      //html += '<table class="table-fixed"><tr>';
      //html += '<td style="width: 85%;"><p class="ellipsisText">' + name + '(' + boxName + ')</p></td>';
      //html += '<td colspan="2" style="width: 15%;"><a class="del-button list-group-item" href="#" onClick="sg.dispDelExtCellRelationModal(\'' + extUrl + '\',\'' + name + '\',\'' + boxName + '\');return(false)" data-i18n="Del"></a></td>';
      //html += '</tr></table></div>';
  }

  html = '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="sg.dispAssignRelation(\'ext\')" data-i18n="AddRelationPlus"></a></div>';
  $("#relList").append(html).localize();
};
sg.dispAssignRelation = function () {
    $("#toggle-panel3").empty();
    cm.setBackahead();
    var html = '<div class="panel-body">';
    html += '<div id="dvAddAccLinkRole" data-i18n="selectRoleAssign"></div>';
    html += '<div id="dvSelectAddAccLinkRole" style="margin-bottom: 10px;">';
    html += '<select class="form-control" name="" id="ddlExtCellLinkRelationList" onChange="sg.changeRelationSelect();"></select>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-primary" id="b-linkrelation-ok" onClick="sg.restAddExtCellLinkRelation(true);" data-i18n="Assign"></button>';
    html += '</div></div>';
    $("#toggle-panel3").append(html).localize();
    cm.getRelationList().done(function (data) {
        cm.dispRelationList(data, "ddlExtCellLinkRelationList", false);
    });

    $("#toggle-panel3").toggleClass('slide-on');
    $("#toggle-panel2").toggleClass('slide-on-holder');
    cm.setTitleMenu("AssigningRelation");
};
sg.changeRelationSelect = function () {
    var value = $("#ddlExtCellLinkRelationList option:selected").val();
    if (value === "") {
        $("#b-linkrelation-ok").prop('disabled', true);
    } else {
        cm.setLinkParam(value);
        $("#b-linkrelation-ok").prop('disabled', false);
    }
};
sg.appendRelationLinkExtCell = function (url, transName, extRelObj, delFlag) {
    var aTag = $('<a>', {
        class: 'allToggle',
        onClick: 'sg.createExtCellProfile(this)'
    });
    var tempHTML = [
        '<table class="table-fixed">',
            '<tr>',
                '<td rowspan="2" style="width: 25%;"><img class="image-circle" data-i18n="[src]' + transName + '_Image" src="" alt="user"></td>',
                '<td><p class="ellipsisText" data-i18n="' + transName + '_DisplayName"></p></td>',
            '</tr>',
            '<tr>',
            '<td><p class="ellipsisText"><font color="LightGray" data-i18n="' + transName + '_Description"></font></p></td>',
            '</tr>',
        '</table>'
    ].join("");
    aTag
        .data('url', url)
        .data('dispName', transName + '_DisplayName')
        .data('description', transName + '_Description')
        .data('imageSrc', transName + '_Image')
        .append(tempHTML);
    var firstCell = $('<td>', {
        style: 'width: 90%;'
    }).append($(aTag));

    var html='';
    if (delFlag) {
        var boxName = "[main]";
        if (extRelObj.BoxName) {
            boxName = extRelObj.BoxName;
        }
        var anotherTag = $('<a>', {
            class: 'del-button list-group-item', 
            style: 'top:25%;', 
            onClick: 'sg.dispDelExtCellRelationModal(this)',
            'data-i18n': 'Del'
        });
        anotherTag
                  .data('url', url)
                  .data('relName', extRelObj.Name)
                  .data('boxName', boxName);
    }
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

    $("#" + extRelObj.ID).append($(aDiv)).localize();
};
sg.createExtCellProfile = function(aDom) {
    // url, dispName, description, imagesrc
    var url = $(aDom).data('url');
    var description = $(aDom).data('description');
    var imagesrc = $(aDom).data('imageSrc');
    sg.linkExtCellUrl = url;
    $("#toggle-panel1").empty();
    cm.setBackahead();
    var html = '<div class="panel-body">';
    html += '<div class="extcell-profile" id="dvExtProfileImage"><img class="image-circle-large" style="margin: auto;" id="imgExtProfileImage" data-i18n="[src]' + imagesrc + '" src="" alt="image" /><span id="txtExtUrl">' + ut.changeLocalUnitToUnitUrl(url) + '</span><h5><span id="txtDescription" data-i18n="' + description + '"></span></h5></div>';
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="sg.showExtPublicBoxList();return(false);" data-i18n="WatchPublicBOX"></a></div>';
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="sg.createRoleList(\'' + url + '\');return(false);" data-i18n="RoleList"></a></div>';
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="sg.createRelationList(\'' + url + '\');return(false);" data-i18n="RelationList"></a></div>';
    html += '<div class="toggleButton"><a class="toggle list-group-item" href="#" onClick="sg.dispDelExtCellModal();return(false);" data-i18n="DeleteExternalCell"></a></div>';
    html += '</div>';
    $("#toggle-panel1").append(html).localize();
    $("#toggle-panel1,.panel-default").toggleClass('slide-on');
    cm.setTitleMenu($(aDom).data('dispName'));
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
  var extCellUrl = encodeURIComponent(url);
  return $.ajax({
          type: "GET",
          url: cm.user.cellUrl + '__ctl/ExtCell(\'' + extCellUrl + '\')/$links/_Role',
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

  var html = '<div class="panel-body" id="roleList">';
  html += '</div>';
  $("#toggle-panel2").append(html);

  // add role list
  for (var i = 0; i < results.length; i++) {
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

    var profTag = "";
    if (matchBox) {
        profTag = [
            '<tr>',
            '<td>',
            '<img class="image-circle-small" data-i18n="[src]profTrans:' + boxName + '_Image" src="' + cm.notImage + '" alt="user">',
            '<font color="LightGray" data-i18n="profTrans:' + boxName + '_DisplayName"></font>',
            '</td>',
            '</tr>'
        ].join("");
    }

    var tempHTML = [
        '<table class="table-fixed">',
        '<tr>',
        '<td rowspan="3" style="width: 25%;"><img class="image-circle" data-i18n="[src]profTrans:' + name + '_' + boxName + '_Image" src="' + cm.notImage + '" alt="user"></td>',
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
        onClick: 'sg.dispDelExtCellRoleModal(\'' + exturl + '\',\'' + name + '\',\'' + boxName + '\')',
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
    $("#roleList").append($(aDiv)).localize();

    //html += '<div class="list-group-item">';
    //html += '<table class="table-fixed"><tr>';
    //html += '<td style="width: 85%;"><p class="ellipsisText">' + name + '(' + boxName + ')</p></td>';
    //html += '<td colspan="2" style="width: 15%;"><a class="del-button list-group-item" href="#" onClick="sg.dispDelExtCellRoleModal(\'' + exturl + '\',\'' + name + '\',\'' + boxName + '\');return(false)" data-i18n="Del"></a></td>';
    //html += '</tr></table></div>';
  }
  html += '<div class="list-group-item">';
  html += '<a class="allToggle" href="#" onClick="cm.dispAssignRole(\'ext\')" data-i18n="AddRolePlus"></a></div>';
  html += '</div>';
  $("#toggle-panel2").append(html).localize();
};
sg.showExtPublicBoxList = function () {
    var cellUrl = ut.changeLocalUnitToUnitUrl(sg.linkExtCellUrl);
    cm.getTargetToken(cellUrl).done(function(data) {
        $.ajax({
                type: "GET",
                url: cellUrl + "__ctl/Box" ,
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
    for (var i = 0; i < results.length; i++) {
        var boxName = results[i].Name;
        html += '<p style="margin-top: 10px;">' + boxName + '</p>';
    }
    html += '</div>';
    $("#toggle-panel2").append(html);
    $("#toggle-panel2").toggleClass('slide-on');
    $("#toggle-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu("WatchPublicBOX");
    //$('#modal-public-extbox').modal('show');
};
sg.dispDelExtCellRelationModal = function (url, relName, boxName) {
    sg.linkExtCellUrl = url;
    sg.linkRelationName = relName;
    if (boxName === "[main]") {
        cm.linkBoxName = null;
        $("#dvTextConfirmation").html(i18next.t("confirmDeleteRelationAssign", { value1: relName, value2: boxName }));
    } else {
        cm.linkBoxName = boxName;
        $("#dvTextConfirmation").html(i18next.t("confirmDeleteRelationAssign", { value1: i18next.t("profTrans:" + relName + "_" + boxName + "_DisplayName"), value2: "" }));
    }
    
    $("#modal-confirmation-title").html(i18next.t("DeleteAssigningRelation"));
    $('#b-cancel').css("display","");
    $('#b-del-extcelllinkrelation-ok').css("display","");
    $('#modal-confirmation').modal('show');
};

// Relation
sg.createAddExtCell = function() {
    $("#toggle-panel1").empty();
    cm.setBackahead();
    cm.getRoleList().done(function(data) {
        var html = '<div class="modal-body">';
        html += '<div id="dvSelectedCell">URL <button type="button" class="btn-xs btn-info" id="dispExtProfileBtn" data-toggle="modal" data-target="#modal-dispExtProfile" data-i18n="Details" style="display:none;"></button></div>';
        html += '<div id="dvTextSelectedCell" style="margin-bottom: 10px;"><input type="text" id="addExtCellUrl" onblur="sg.blurAddExtCellUrl();"><span class="popupAlertArea" style="color:red"><aside id="popupAddExtCellUrlErrorMsg"> </aside></span>';

        // Read QR Image
        html += '<input type="file" class="fileUpload" onchange="sg.readQRImage(this);" id="readQRImage" accept="image/*" style="display: none">';
        html += '<button class="btn btn-primary" id="readQRImgButton" type="button" data-i18n="SelectFile"></button>';

        // Start QR Scanner
        html += '<button type="button" class="btn btn-primary" id="qrscannerBtn" data-toggle="modal" data-target="#modal-qrscanner" data-i18n="QRScanner" style="margin-left:10px;"></button>';
        html += '</div>';

        html += '<div id="dvCheckAddExtCellLinkRoleAndRelation" style="margin-bottom: 10px;"><label><input type="checkbox" id="addCheckExtCellLinkRoleAndRelation" onChange="sg.changeCheckExtCellLinkRoleAndRelation(this);"><span data-i18n="AssignMulti"></span></label></div>';
        html += '<div id="dvSelectAddExtCellLink" style="margin-bottom: 10px;"><table>';
        html += '<tr><td><label><input type="radio" name="addRadioExtCellLink" id="addRadioExtCellLinkRole" onChange="sg.changeRadioExtCellLink();" value="role" disabled><span data-i18n="Role"></span></label></td><td><label><input type="radio" name="addRadioExtCellLink" id="addRadioExtCellLinkRelation" onChange="sg.changeRadioExtCellLink();" value="relation" disabled><span data-i18n="Relation"></span></label></td></tr>';
        html += '<tr><td colspan="2"><select class="form-control" name="" id="ddlAddExtCellLinkRoleList" multiple disabled><option>Select a role</option></select><select class="form-control" name="" id="ddlAddExtCellLinkRelationList" multiple disabled style="display:none;"><option>Select a relation</option></select></td></tr>';
        html += '<tr><td colspan="2"><span class="popupAlertArea" style="color:red"><aside id="popupAddExtCellLinkErrorMsg"> </aside></span></td></tr>';
        html += '</table></div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead();" data-i18n="Cancel"></button>';
        html += '<button type="button" class="btn btn-primary" id="b-add-extcell-ok" onClick="sg.addExtCell();" data-i18n="Add" disabled></button>';
        html += '</div></div>';
        $("#toggle-panel1").append(html).localize();

        /*
         * Only show Role and Relation Assignment input items for Advanced Mode.
         * Currently mode switching is not implemented.
         * Default is to hide the items.
         */
        $("#dvCheckAddExtCellLinkRoleAndRelation, #dvSelectAddExtCellLink").toggle(cm.user.isAdvancedMode);

        cm.dispRoleList(data, "ddlAddExtCellLinkRoleList", true);
        cm.getRelationList().done(function(data) {
            cm.dispRelationList(data, "ddlAddExtCellLinkRelationList", true);
            $("#toggle-panel1,.panel-default").toggleClass('slide-on');
            cm.setTitleMenu("CreateExternalCell");
        });

        $("#readQRImgButton").on('click', function () {
            $("#readQRImage").click();
        });
    });
};
sg.blurAddExtCellUrl = function() {
    if (sg.urlBlurEvent()) {
        // Cell existence check
        var schemaURL = $("#addExtCellUrl").val();
        sg.getCell(schemaURL).done(function () {
            // Profile Modal Disp
            var profObj = {
                DisplayName: ut.getName(schemaURL),
                Description: "",
                Image: cm.notImage
            }
            cm.getProfile(schemaURL).done(function (prof) {
                // Profile Modal Settings
                if (prof) {
                    profObj.DisplayName = _.escape(prof.DisplayName);
                    profObj.Description = _.escape(prof.Description);
                    if (prof.Image) {
                        profObj.Image = prof.Image;
                    }
                }
            }).always(function () {
                let transName = "inputExtCell";
                cm.i18nAddProfile("en", "profTrans", transName, profObj, schemaURL, "profile");
                cm.i18nAddProfile("ja", "profTrans", transName, profObj, schemaURL, "profile");

                //$("#modalProfileName").html(profObj.DisplayName);
                //$("#txtModalDescription").html(profObj.Description);
                //$("#imgModalExtProfileImage").attr("src", profObj.Image);
                $("#dispExtProfileBtn").css("display", "");
            });
            $('#b-add-extcell-ok').prop('disabled', false);
        }).fail(function () { 
            $("#popupAddExtCellUrlErrorMsg").attr("data-i18n", "notExistTargetCell").localize();
            $('#b-add-extcell-ok').prop('disabled', true);
            $("#dispExtProfileBtn").css("display", "none");
        });
    } else {
        $('#b-add-extcell-ok').prop('disabled', true);
        $("#dispExtProfileBtn").css("display", "none");
    }
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
sg.getCell = function (cellUrl) {
    return $.ajax({
        type: "GET",
        url: cellUrl,
        headers: {
            'Accept': 'application/xml'
        }
    });
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
      } else {
        $("#ddlAddExtCellLinkRelationList option:selected").each(function(index, option) {
          cm.setLinkParam($(option).text());
          sg.restAddExtCellLinkRelation(false);
        });
      }
    }

    sg.getExtCellList().done(function (data) {
        sg.dispExtCellList(data);
    });

    //$("#modal-add-extcell").modal("hide");
    cm.moveBackahead();
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
sg.restDeleteExtCellAPI = function () {
  var extCellUrl = encodeURIComponent(sg.linkExtCellUrl);
  $.ajax({
          type: "DELETE",
          url: cm.user.cellUrl + '__ctl/ExtCell(\'' + extCellUrl + '\')',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  }).done(function(data) {
    sg.getExtCellList().done(function (data) {
          sg.dispExtCellList(data);
    }).fail(function (data) {
    });
    $("#modal-confirmation").modal("hide");
    //$("#modal-profile-extcell").modal("hide");
    cm.moveBackahead();
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
sg.restAddExtCellLinkRole = function (moveFlag) {
  var extCellUrl = encodeURIComponent(sg.linkExtCellUrl);
  var uri = cm.user.cellUrl + '__ctl/Role';
  if (cm.linkBoxName === null) {
    uri += '(\'' + cm.linkName + '\')';
  } else {
    uri += '(Name=\'' + cm.linkName + '\',_Box\.Name=\'' + cm.linkBoxName + '\')';
  }
  var json = {"uri":uri};

  $.ajax({
          type: "POST",
          url: cm.user.cellUrl + '__ctl/ExtCell(\'' + extCellUrl + '\')/$links/_Role',
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
sg.restDeleteExtCellLinkRole = function () {
    var extCellUrl = encodeURIComponent(sg.linkExtCellUrl);
    var api = '__ctl/ExtCell(\'' + extCellUrl + '\')/$links/_Role';
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
sg.createRelationList = function (url) {
    sg.linkExtCellUrl = url;
    $("#toggle-panel2").remove();
    cm.setBackahead();
    sg.getExtCellRelationList(sg.linkExtCellUrl).done(function (data) {
        sg.dispExtCellLinkRelation(data, sg.linkExtCellUrl);
        $("#toggle-panel2").toggleClass('slide-on');
        $("#toggle-panel1").toggleClass('slide-on-holder');
        cm.setTitleMenu("RelationList");
    });
};
sg.getExtCellRelationList = function (url) {
  var extCellUrl = encodeURIComponent(url);
  return $.ajax({
          type: "GET",
          url: cm.user.cellUrl + '__ctl/ExtCell(\'' + extCellUrl + '\')/$links/_Relation',
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token
          }
  });
};
sg.restAddExtCellLinkRelation = function (refreshListFlag) {
  var extCellUrl = encodeURIComponent(sg.linkExtCellUrl);
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
          url: cm.user.cellUrl + '__ctl/ExtCell(\'' + extCellUrl + '\')/$links/_Relation',
          data: JSON.stringify(json),
          headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
          }
  }).done(function(data) {
    //cm.getProfile(sg.linkExtCellUrl)
    $("#modal-add-extcelllinkrelation").modal("hide");
    if (refreshListFlag) {
        sg.getExtCellRelationList(sg.linkExtCellUrl).done(function (data) {
            sg.dispExtCellLinkRelation(data, sg.linkExtCellUrl);
        });
    }
    cm.moveBackahead();
  }).fail(function(data) {
    var res = JSON.parse(data.responseText);
    alert("An error has occurred.\n" + res.message.value);
  });
};
sg.restDeleteExtCellLinkRelation = function () {
    var extCellUrl = encodeURIComponent(sg.linkExtCellUrl);
    var api = '__ctl/ExtCell(\'' + extCellUrl + '\')/$links/_Relation';
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
      sg.getExtCellRelationList(sg.linkExtCellUrl).done(function (data) {
          sg.dispExtCellLinkRelation(data, sg.linkExtCellUrl);
      });
      $("#modal-confirmation").modal("hide");
    }).fail(function(data) {
      var res = JSON.parse(data.responseText);
      alert("An error has occurred.\n" + res.message.value);
    });
};

sg.initSocialGraph = function () {
    loadScript();
    cm.createSideMenu();
    cm.createTitleHeader(false, true);
    cm.createBackMenu("main.html");
    cm.setTitleMenu("Community");
    st.initSettings();
    $("#dashboard").append('<div class="panel list-group toggle-panel" id="toggle-panel1"></div>');

    // Initialization
    sg.getExtCellList().done(function (data) {
        sg.dispExtCellList(data);
    }).fail(function (data) {
    });
    sg.createProfileModal();
    sg.createQRScannerModal();

    // click event
    $('#b-add-extcell-ok').on('click', function () { sg.addExtCell(); });
    $('#b-del-extcell-ok').on('click', function () { sg.restDeleteExtCellAPI(); });
    $('#b-add-extcelllinkrole-ok').on('click', function () { sg.restAddExtCellLinkRole(); });
    $('#b-del-extcelllinkrole-ok').on('click', function () { sg.restDeleteExtCellLinkRole(); });
    $('#b-add-extcelllinkrelation-ok').on('click', function () { 
        sg.restAddExtCellLinkRelation();
        sg.getExtCellList().done(function (data) {
            sg.dispExtCellList(data);
        }).fail(function (data) {
        });
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

sg.createProfileModal = function () {
    // Profile Modal
    var html = '<div id="modal-dispExtProfile" class="modal fade" role="dialog">' +
        '<div class="modal-dialog">' +
        // Modal content
        '<div class="modal-content">' +
        '<div class="modal-header login-header">' +
        '<button type="button" class="close" data-dismiss="modal">x</button>' +
        '<h4 class="modal-title" id="modalProfileName" data-i18n="profTrans:inputExtCell_DisplayName"></h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<div><img class="image-circle-large center-block" style="margin: auto;" id="imgModalExtProfileImage" alt="image"  data-i18n="[src]profTrans:inputExtCell_Image"/></div><div><p align="center" id="txtModalDescription" data-i18n="profTrans:inputExtCell_Description"></p></div>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal" data-i18n="Close"></button>' +
        '</div></div></div></div>';
    var modal = $(html);
    $(document.body).append(modal);
}

sg.createQRScannerModal = function () {
    // QRScanner Modal
    var html = '<div id="modal-qrscanner" class="modal fade" role="dialog">' +
        '<div class="modal-dialog">' +
        // Modal content
        '<div class="modal-content">' +
        '<div class="modal-header login-header">' +
        '<button type="button" class="close" data-dismiss="modal">x</button>' +
        '<h4 class="modal-title" data-i18n="QRScanner"></h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<div><p align="center" data-i18n="qrscannerDescription"></p></div>' +
        '<div id="pqrdiv"></div>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal" data-i18n="Close"></button>' +
        '</div></div></div></div>';
    var modal = $(html);
    $(document.body).append(modal);

    $("#modal-qrscanner").on("show.bs.modal", function () {
        start_pQR(sg.qrReturn);
    });
    $("#modal-qrscanner").on("hidden.bs.modal", function () {
        quit_pQR();
    });
}

sg.qrReturn = function (res) {
    $("#addExtCellUrl").val(_.escape(res));
    sg.blurAddExtCellUrl();
    $('#modal-qrscanner').modal('hide');
}

sg.readQRImage = function (e) {
    var file = e.files[0];
    if (file) {
        try {
            var reader = new FileReader();
        } catch (e) {
            return;
        }
        reader.readAsDataURL(file, "UTF-8");
        reader.onload = sg.loaded;
        reader.onerror = cm.errorHandler;
    }
}

sg.loaded = function (evt) {
    sg.decodeImageFromBase64(evt.target.result, function (decodedInformation) {
        $("#addExtCellUrl").val(_.escape(decodedInformation));
        sg.blurAddExtCellUrl();

    })
}

sg.decodeImageFromBase64 = function (data, callback) {
    qrcode.callback = callback;
    qrcode.decode(data);
}

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
