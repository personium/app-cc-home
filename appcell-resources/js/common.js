var ha = {};
var imgBinaryFile = null;
ha.user = JSON.parse(sessionStorage.getItem("sessionData"));
if (!ha.user) {
  location.href = "./login.html";
}
ha.user.nowPage = 0;
ha.user.nowTitle = {};
var notImage = "https://demo.personium.io/HomeApplication/__/icons/profile_image.png";

//Default timeout limit - 60 minutes.
var IDLE_TIMEOUT =  3600000;
//var IDLE_TIMEOUT =  10000;
// Records last activity time.
var LASTACTIVITY = new Date().getTime();

// Class "profile-menu" in create
// and Modal create
function createProfileHeaderMenu() {
    // get profile image
    if (ha.user.profile.Image) {
        imgBinaryFile = ha.user.profile.Image;
    } else {
        // if there is no image, set default image
        imgBinaryFile = notImage;
    }

    // create a profile menu in to "profile-menu" class
    var html = '<div class="header-rightside">';
    html += '<table class="list-inline table-fixed">';
    html += '<tr><td rowspan="2" class="profile-header">';
    html += '<img class="icon-profile" id="imProfilePicture" src="' + imgBinaryFile + '" alt="user">';
    html += '</td><td width="70%" class="sizeBody1">';
    html += '<span id="tProfileDisplayName">' + ha.user.profile.DisplayName + '</span>';
    html += '</td><td width="30%">&nbsp;</td></tr>';
    html += '<tr><td class="sizeCaption2">';
    html += '<p class="ellipsisText">' + ha.user.cellUrl + '</p>';
    html += '</td><td class="sizeCaption" style="text-align:right;"><a onClick="openSlide();">';
    html += '<p class="headerAccountNameText">' + ha.user.userName + '</p>';
    //html += '<p class="headerAccountNameText">aiueokakikukekosasisuseso</p>▼';
    html += '</a></td></tr>';
    $(".profile-menu").html(html);

    // Processing when resized
    $(window).on('load resize', function(){
        $('.headerAccountNameText').each(function() {
            var $target = $(this);

            // get a account name
            var html = ha.user.userName + '▼';

            // Duplicate the current state
            var $clone = $target.clone();

            // Set an account name on the duplicated element and hide it
            $clone
              .css({
                display: 'none',
                position: 'absolute',
                overflow: 'visible'
              })
              .width('auto')
              .html(html);
            $target.after($clone);

            // Replace sentences that exceed the display area
            while((html.length > 0) && ($clone.width() > $target.width())) {
                html = html.substr(0, html.length - 1);
                $clone.html(html + '...▼');
            }

            $target.html($clone.html());
            $clone.remove();
        });
    });
}

// Create title header in "header-menu" class
function createTitleHeader() {
    var html = '<table class="table-fixed">';
    html += '<tr style="vertical-align: middle;">';
    html += '<td id="backMenu" class="prev-icon" style="width: 10%;"></td>';
    html += '<td id="backTitle" align="left" style="width: 30%;white-space: nowrap;"></td>';
    html += '<td id="titleMenu" align="left" class="title"></td>';
    html += '<td class="menu-icon header-top pull-right">';
    html += '</td></tr></table>';
    $(".header-menu").html(html);
}

// Back ahead Setting
function setBackahead() {
    ha.user.nowPage = ha.user.nowPage + 1;
    if (document.getElementById('toggle-panel' + ha.user.nowPage) == null) {
        $("#dashboard").append('<div class="panel list-group toggle-panel" id="toggle-panel' + ha.user.nowPage + '"></div>');
    }
    if (document.getElementById('toggle-panel' + ha.user.nowPage + 1) == null) {
        $("#dashboard").append('<div class="panel list-group toggle-panel" id="toggle-panel' + (ha.user.nowPage + 1) + '"></div>');
    }
}

// Back ahead move
function moveBackahead() {
    var no = ha.user.nowPage;
    switch (no) {
        case 0:
            window.location.href = ha.user.prevUrl;
            break;
        case 1:
            $(".panel-default,#toggle-panel1").toggleClass("slide-on");
            break;
        default:
            $("#toggle-panel" + no).toggleClass("slide-on");
            $("#toggle-panel" + (no - 1)).toggleClass("slide-on-holder");
            break;
    }

    ha.user.nowPage = no - 1;
    if (ha.user.nowPage >= 0) {
        setTitleMenu(ha.user.nowTitle[ha.user.nowPage]);
        if (ha.user.nowPage > 0) {
            $("#backTitle").html(ha.user.nowTitle[ha.user.nowPage - 1]);
        } else {
            $("#backTitle").html("");
        }
    } else {
        $("#backTitle").html("");
    }
}

// create side menu
function createSideMenu() {
    var itemName = {};
    itemName.EditProf = getMsg("00010");
    itemName.ChgPass = getMsg("00011");
    itemName.Logout = getMsg("00012");
    itemName.DispName = getMsg("00013");
    itemName.Description = getMsg("00014");
    itemName.Photo = getMsg("00015");
    itemName.Relogin = getMsg("00016");

    var html = '<div class="slide-menu"><nav>';
    html += '<table class="menu-title"><span class="commonLabel">' + getMsg("00026") + '</span>';
    //html += '<tr class="sidemenu-list v-align-m">';
    html += '<tr>';
    html += '<td rowspan="3" class="sidemenu-itemEmpty">&nbsp;</td><td valign="middle" class="sidemenu-item sizeBody1"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-edit-profile">' + itemName.EditProf + '<img class="moveIcon" src="https://demo.personium.io/HomeApplication/__/icons/ico_back.png" alt="user"></a></td>';
    //html += '</tr><tr class="sidemenu-list v-align-m">';
    html += '</tr><tr>';
    html += '<td class="sidemenu-item sizeBody1"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-change-password">' + itemName.ChgPass + '<img class="moveIcon" src="https://demo.personium.io/HomeApplication/__/icons/ico_back.png" alt="user"></a></td>';
    //html += '</tr><tr class="sidemenu-list v-align-m">';
    html += '</tr><tr>';
    html += '<td class="sidemenu-lastitem sizeBody1"><a class="allToggle" href="#" data-toggle="modal" data-target="#modal-logout">' + itemName.Logout + '<img class="moveIcon" src="https://demo.personium.io/HomeApplication/__/icons/ico_back.png" alt="user"></a></td>';
    html += '</tr>';
    html += '</table></div>';
    html += '<div class="overlay" id="dvOverlay"></div>';

    $(".display-parent-div").append(html);

    // Modal
    // Edit Profile
    html = '<div id="modal-edit-profile" class="modal fade" role="dialog">';
    html += '<div class="modal-dialog">';
    // Modal content
    html += '<div class="modal-content">';
    html += '<div class="modal-header login-header">';
    html += '<button type="button" class="close" data-dismiss="modal">×</button>';
    html += '<h4 class="modal-title">' + itemName.EditProf + '</h4>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += '<div id="dvDisplayName">' + itemName.DispName + '</div>';
    html += '<div id="dvTextDisplayName">';
    html += '<input type="text" id="editDisplayName" onblur="editDisplayNameBlurEvent();">';
    html += '</div>';
    html += '<span class="popupAlertArea" style="color:red">';
    html += '<aside id="popupEditDisplayNameErrorMsg"></aside>';
    html += '</span>';
    html += '<div id="dvDescription">' + itemName.Description + '</div>';
    html += '<div id="dvTextDescription">';
    html += '<textarea onblur="editDescriptionBlurEvent();" name="" cols="" rows=""  id="editDescription"></textarea>';
    html += '</div>';
    html += '<span style="padding-top: 3px;height:11px;color:red;">';
    html += '<aside id="popupEditDescriptionErrorMsg"></aside>';
    html += '</span>';
    html += '<div id="dvPhoto">' + itemName.Photo + '</div>';
    html += '<div id="dvBrowseButtonSection">';
    html += '<input type="file" class="fileUpload" onchange="attachFile(\'popupEditUserPhotoErrorMsg\', \'editImgFile\');" id="editImgFile">';
    html += '</div>';
    html += '<div id="dvBoxProfileImage">';
    html += '<figure id="figEditCellProfile" class="boxProfileImage">';
    html += '<img class="image-circle-large" style="margin: auto;" id="idImgFile" src="#" alt="image" />';
    html += '</figure>';
    html += '</div>';
    html += '<span style="padding-top: 3px;height:11px;color:red;">';
    html += '<aside id="popupEditUserPhotoErrorMsg"></aside>';
    html += '</span>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
    html += '<button type="button" class="btn btn-primary" id="b-edit-profile-ok">Register</button>';
    html += '</div></div></div></div>';
    var modal = $(html);
    $(document.body).append(modal);

    // Change Password
    html = '<div id="modal-change-password" class="modal fade" role="dialog">' +
           '<div class="modal-dialog">' +
           // Modal content
           '<div class="modal-content">' +
           '<div class="modal-header login-header">' +
           '<button type="button" class="close" data-dismiss="modal">×</button>' +
           '<h4 class="modal-title">' + itemName.ChgPass + '</h4>' +
           '</div>' +
           '<div class="modal-body">' +
           '<input type="password" placeholder="' + getMsg("I0005") + '" id="pNewPassword">' +
           '<span id="changeMessage" style="color:red"></span>' +
           '<input type="password" placeholder="' + getMsg("I0003") + '" id="pConfirm">' +
           '<span id="confirmMessage" style="color:red"></span>' +
           '</div>' +
           '<div class="modal-footer">' +
           '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
           '<button type="button" class="btn btn-primary" id="b-change-password-ok" disabled>OK</button>' +
           '</div></div></div></div>';

    modal = $(html);
    $(document.body).append(modal);

    // ReLogin
    html = '<div id="modal-relogin" class="modal fade" role="dialog" data-backdrop="static">' +
           '<div class="modal-dialog">' +
           '<div class="modal-content">' +
           '<div class="modal-header login-header">' +
           '<h4 class="modal-title">' + itemName.Relogin + '</h4>' +
           '</div>' +
           '<div class="modal-body">' +
           getMsg("I0001") +
           '</div>' +
           '<div class="modal-footer">' +
           '<button type="button" class="btn btn-primary" id="b-relogin-ok" >OK</button>' +
           '</div></div></div></div>';
    modal = $(html);
    $(document.body).append(modal);

    // Log Out
    html = '<div id="modal-logout" class="modal fade" role="dialog">' +
           '<div class="modal-dialog">' +
           '<div class="modal-content">' +
           '<div class="modal-header login-header">' +
           '<button type="button" class="close" data-dismiss="modal">×</button>' +
           '<h4 class="modal-title">' + itemName.Logout + '</h4>' +
           '</div>' +
           '<div class="modal-body">' +
           getMsg("I0002") +
           '</div>' +
           '<div class="modal-footer">' +
           '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
           '<button type="button" class="btn btn-primary" id="b-logout-ok" >OK</button>' +
           '</div></div></div></div>';
    modal = $(html);
    $(document.body).append(modal);

    // Session Expiration
    html = '<div id="modal-session-expired" class="modal fade" role="dialog" data-backdrop="static">' +
           '<div class="modal-dialog">' +
           '<div class="modal-content">' +
           '<div class="modal-header login-header">' +
           '<h4 class="modal-title">' + itemName.Relogin + '</h4>' +
           '</div>' +
           '<div class="modal-body">' +
           getMsg("W0001") +
           '</div>' +
           '<div class="modal-footer">' +
           '<button type="button" class="btn btn-primary" id="b-session-relogin-ok" >OK</button>' +
           '</div></div></div></div>';
    modal = $(html);
    $(document.body).append(modal);

    // Set Event
    $('#b-logout-ok,#b-relogin-ok,#b-session-relogin-ok').on('click', function() { logout(); });
    $('#b-change-password-ok').on('click', function() { changePassCheck($("#pNewPassword").val(), $("#pConfirm").val());});
    $('#modal-change-password').on('hidden.bs.modal', function () {
      $("#pNewPassword").val("");
      $("#pConfirm").val("");
      $("#changeMessage").html("");
      $("#confirmMessage").html("");
      $('#b-change-password-ok').prop('disabled', true);
    });
    $('#modal-edit-profile').on('show.bs.modal', function () {
      populateProfileEditData();
    });
    $('#pNewPassword').blur(function() {
       charCheck($(this));
    });
    $('#b-edit-profile-ok').on('click', function () { updateCellProfile(); });
    $('#dvOverlay').on('click', function() {
        $(".overlay").removeClass('overlay-on');
        $(".slide-menu").removeClass('slide-on');
    });

    // Time Out Set
    setIdleTime();
}

function openSlide() {
    $(".overlay").toggleClass('overlay-on');
    $(".slide-menu").toggleClass('slide-on');
}

function createBackMenu(moveUrl) {
    var html = '<a class="allToggle" style="float:left;" onClick="moveBackahead();return false;"><img id="imBack" src="https://demo.personium.io/HomeApplication/__/icons/ico_back.png" alt="user"></a>';
    $("#backMenu").html(html);
    ha.user.prevUrl = moveUrl;
}

function setTitleMenu(title) {
    $("#titleMenu").html('<p  class="ellipsisText">' + title + '</p>');
    var titles = ha.user.nowTitle;
    titles[ha.user.nowPage] = title;
    ha.user.nowTitle = titles;
    if (ha.user.nowPage > 0) {
        var html = '<p class="ellipsisText">' + ha.user.nowTitle[ha.user.nowPage - 1] + '</p>'
        $("#backTitle").html(html);
    }
}

// Role
function getRoleList() {
  return $.ajax({
          type: "GET",
          url:ha.user.cellUrl + '__ctl/Role',
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  })
}
function dispRoleList(json, id, multiFlag) {
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })

  var objSel = document.getElementById(id);
  if (objSel.hasChildNodes()) {
    while (objSel.childNodes.length > 0) {
      objSel.removeChild(objSel.firstChild);
    }
  }

  if (!multiFlag) {
      $("#" + id).append('<option value="">Please select a Role</option>');
  }
  for (var i in results) {
    var objRole = json.d.results[i];
    var boxName = objRole["_Box.Name"];
    if (boxName === null) {
      boxName = "[main]";
    }

    // role list(selectBox)
    $("#" + id).append('<option value="' + objRole.Name + '(' + boxName + ')">' + objRole.Name + '(' + boxName + ')</option>');
  }
}
function dispAssignRole(type) {
    $("#toggle-panel3").empty();
    setBackahead();
    var html = '<div class="panel-body">';
    html += '<div id="dvAddAccLinkRole">' + getMsg("I0014") + '</div>';
    html += '<div id="dvSelectAddAccLinkRole" style="margin-bottom: 10px;">';
    html += '<select name="" id="ddlLinkRoleList" onChange="changeRoleSelect();"></select>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-primary" id="b-linkrole-ok" onClick="';
    switch (type) {
        case "acc":
            html += 'ha.restAddAccountLinkRole(true);';
            break;
        case "rel":
            html += 'ha.restAddRelationLinkRole(true);';
            break;
        case "ext":
            html += 'ha.restAddExtCellLinkRole(true);';
            break;
    }
    html += '">Assign</button>';
    html += '</div></div>';
    $("#toggle-panel3").append(html);
    getRoleList().done(function(data) {
        dispRoleList(data, "ddlLinkRoleList", false);
    });
    
    $("#toggle-panel3").toggleClass('slide-on');
    $("#toggle-panel2").toggleClass('slide-on-holder');
    setTitleMenu(getMsg("00005"));
};
function changeRoleSelect() {
    var value = $("#ddlLinkRoleList option:selected").val();
    if (value === "") {
        $("#b-linkrole-ok").prop('disabled', true);
    } else {
        ha.setLinkParam(value);
        $("#b-linkrole-ok").prop('disabled', false);
    }
};

// Relation
function getRelationList() {
  return $.ajax({
          type: "GET",
          url:ha.user.cellUrl + '__ctl/Relation',
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  })
};
function dispRelationList(json, id, multiFlag) {
  var results = json.d.results;
  results.sort(function(val1, val2) {
    return (val1.Name < val2.Name ? 1 : -1);
  })
  
  var objSel = document.getElementById(id);
  if (objSel.hasChildNodes()) {
    while (objSel.childNodes.length > 0) {
      objSel.removeChild(objSel.firstChild);
    }
  }

  if (!multiFlag) {
      $("#" + id).append('<option value="">Please select a Relation</option>');
  }

  for (var i in results) {
    var objRelation = json.d.results[i];
    var boxName = objRelation["_Box.Name"];
    if (boxName === null) {
      boxName = "[main]";
    }

    // relation list(selectBox)
    $("#" + id).append('<option value="' + objRelation.Name + '(' + boxName + ')">' + objRelation.Name + '(' + boxName + ')</option>');
  }
};

// Initialization
function populateProfileEditData() {
  $("#editDisplayName").val(ha.user.profile.DisplayName);
  document.getElementById("popupEditDisplayNameErrorMsg").innerHTML = "";
  $("#editDescription").val(ha.user.profile.Description);
  document.getElementById("popupEditDescriptionErrorMsg").innerHTML = "";
  document.getElementById("popupEditUserPhotoErrorMsg").innerHTML = "";
  
  $('#editImgFile').replaceWith($('#editImgFile').clone());
  if (ha.user.profile.Image) {
    $("#idImgFile").attr('src', ha.user.profile.Image);
  } else {
    $("#idImgFile").attr('src', "../../appcell-resources/icons/profile_image.png");
  }

};

// File Save
function updateCellProfile() {
  var displayName = $("#editDisplayName").val();
  var description = $("#editDescription").val();
  var fileData = null;
  var profileBoxImageName = $('#lblEditFileName').text();
  var validDisplayName = validateDisplayName(displayName, "popupEditDisplayNameErrorMsg",'#editDisplayName');
  if(validDisplayName){
    $('#popupEditDisplayNameErrorMsg').html('');
    var validDesciption = validateDescription(description,"popupEditDescriptionErrorMsg");
    if (validDesciption){
      fileData = {
                   "DisplayName" : displayName,
                   "Description" : description,
                   "Image" : imgBinaryFile,
                   "ProfileImageName" : profileBoxImageName
      };
      retrieveCollectionAPIResponse(fileData);
    }
  }
};

// File Read
function attachFile(popupImageErrorId, fileDialogId) {
  var file = document.getElementById(fileDialogId).files[0];
  ha.fileName = document.getElementById(fileDialogId).value;
  if (file) {
    var imageFileSize = file.size / 1024;
    if (validateFileType(ha.fileName, imageFileSize, popupImageErrorId)) {
      getAsBinaryString(file);
    }
  }
};
function getAsBinaryString(readFile) {
	try {
		var reader = new FileReader();
	} catch (e) {
		//uCellProfile.spinner.stop();
		//document.getElementById('successmsg').innerHTML = "Error: seems File API is not supported on your browser";
		return;
	}
	reader.readAsDataURL(readFile, "UTF-8");
	reader.onload = loaded;
	reader.onerror = errorHandler;
};
function loaded(evt) {
	imgBinaryFile = null;
	imgBinaryFile = evt.target.result;
        $("#idImgFile").attr('src', imgBinaryFile);
	//document.getElementById("fileID").value = '';
};
function errorHandler(evt) {
	if (evt.target.error.code == evt.target.error.NOT_READABLE_ERR) {
		ha.spinner.stop();
		alert("Error reading file...");
		//document.getElementById('successmsg').innerHTML = "Error reading file...";
	}
};
function editDisplayNameBlurEvent() {
	var displayName = $("#editDisplayName").val();
	var displayNameSpan = "popupEditDisplayNameErrorMsg";
	var txtDisplayName = "#editDisplayName";
	validateDisplayName(displayName, displayNameSpan, txtDisplayName);
};
function editDescriptionBlurEvent() {
	document.getElementById("popupEditDescriptionErrorMsg").innerHTML = "";
	var descriptionDetails = document.getElementById("editDescription").value;
	var descriptionSpan = "popupEditDescriptionErrorMsg";
	validateDescription(descriptionDetails, descriptionSpan);
};

// Validation Check
function charCheck(check) {
  var passLen = check.val().length;
  var msg = "";
  var bool = false;

  if (passLen !== 0) {
    bool = true;
    if (passLen < 6 || passLen > 36) {
      msg = "Please enter between 6 to 32 characters.";
      bool = false;
    } else if (check.val().match(/[^0-9a-zA-Z_-]+/)) {
      msg = "Please enter Character Type(Half Size Alphanumeric, '-', '_')";
      bool = false;
    }

    $('#changeMessage').html(msg);
  }

  $('#b-change-password-ok').prop('disabled', !bool);
};
function validateFileType(filePath, imageSize, popupImageErrorId) {
	var fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1)
			.toLowerCase();
	if (fileExtension.toLowerCase() == "jpg"
			|| fileExtension.toLowerCase() == "jpeg"
                        || fileExtension.toLowerCase() == "png"
                        || fileExtension.toLowerCase() == "gif"
                        || fileExtension.toLowerCase() == "bmp"
	) {
		document.getElementById(popupImageErrorId).innerHTML = "";
		return true;
	} else {
		imgBinaryFile = null;
		document.getElementById(popupImageErrorId).innerHTML = "";
		document.getElementById(popupImageErrorId).innerHTML = "Failed to upload image; format not supported";
		return false;
	}
};
function validateDisplayName(displayName, displayNameSpan,txtID) {
	var MINLENGTH = 1;
	var MAXLENGTH = 128;
	var letters = /^[一-龠ぁ-ゔ[ァ-ヴー々〆〤0-9a-zA-Z-_\s]+$/;
	var specialchar = /^[-_\s]*$/;
	var allowedLetters = /^[0-9a-zA-Z-_\s]+$/;
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
function validateDescription(descriptionDetails, descriptionSpan) {
	var isValidDescription = true;
	var lenDescription = descriptionDetails.length;
	if (lenDescription > 51200) {
		isValidDescription = false;
		document.getElementById(descriptionSpan).innerHTML = getMsg("E0021");
	}
	return isValidDescription;
};

// Logout
function logout() {
  sessionStorage.setItem("sessionData", null);
  location.href = "./login.html";
};

// This method checks idle time
function setIdleTime() {
    setInterval(checkIdleTime, 1000);
    document.onclick = function() {
      LASTACTIVITY = new Date().getTime();
      refreshToken().done(function(data) {
              ha.user.access_token = data.access_token;
              ha.user.refresh_token = data.refresh_token;
              sessionStorage.setItem("sessionData", JSON.stringify(ha.user));
      });
    };
    document.onmousemove = function() {
      LASTACTIVITY = new Date().getTime();
      refreshToken().done(function(data) {
              ha.user.access_token = data.access_token;
              ha.user.refresh_token = data.refresh_token;
              sessionStorage.setItem("sessionData", JSON.stringify(ha.user));
      });
    };
    document.onkeypress = function() {
      LASTACTIVITY = new Date().getTime();
      refreshToken().done(function(data) {
              ha.user.access_token = data.access_token;
              ha.user.refresh_token = data.refresh_token;
              sessionStorage.setItem("sessionData", JSON.stringify(ha.user));
      });
    };
}
function checkIdleTime() {
  if (new Date().getTime() > LASTACTIVITY + IDLE_TIMEOUT) {
    if (sessionStorage.isResourceMgmt = "true") {
      $('#modal-session-expired').modal('show');
    }
  }
};
function changePassCheck(newpass, confirm) {
  if (newpass === confirm) {
    $('#confirmMessage').html("");
    changePass(newpass);
  } else {
    $('#confirmMessage').html(getMsg("E0002"));
  }
};

// API
function refreshToken() {
    return $.ajax({
        type: "POST",
        url: ha.user.cellUrl + '__auth',
        processData: true,
        dataType: 'json',
        data: {
               grant_type: "refresh_token",
               refresh_token: ha.user.refresh_token
        },
        headers: {'Accept':'application/json'}
    })
}
//function getTargetToken(extCellUrl) {
//  return $.ajax({
//                type: "POST",
//                url: ha.user.cellUrl + '__auth',
//                processData: true,
//		dataType: 'json',
//                data: {
//                        grant_type: "password",
//                        username: ha.user.userName,
//			password: ha.user.pass,
//                        dc_target: extCellUrl
//                },
//		headers: {'Accept':'application/json'}
//         });
//};
function getTargetToken(extCellUrl) {
  return $.ajax({
                type: "POST",
                url: ha.user.cellUrl + '__auth',
                processData: true,
		dataType: 'json',
                data: {
                        grant_type: "refresh_token",
                        refresh_token: ha.user.refresh_token,
                        dc_target: extCellUrl
                },
		headers: {'Accept':'application/json'}
         });
};
function getProfile(url) {
    return $.ajax({
	type: "GET",
	url: url + '__/profile.json',
	dataType: 'json',
        headers: {'Accept':'application/json'}
    })
};
function getBoxList() {
  return $.ajax({
          type: "GET",
          url: ha.user.cellUrl + '__ctl/Box',
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  })
}
function getBoxStatus(boxName) {
  return $.ajax({
          type: "GET",
          url: ha.user.cellUrl + boxName,
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
          }
  })
}
function changePass(newpass) {
  $.ajax({
          type: "PUT",
          url: ha.user.cellUrl + '__mypassword',
          headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'X-Dc-Credential': newpass
          }
  }).done(function(data) {
          $('#modal-relogin').modal('show');
  }).fail(function(data) {
          var res = JSON.parse(data.responseText);
          alert("An error has occurred.\n" + res.message.value);
  });
};
function retrieveCollectionAPIResponse(json) {
  $.ajax({
    type: "PUT",
    url: ha.user.cellUrl + '__/profile.json',
    data: JSON.stringify(json),
    dataType: 'json',
    headers: {'Accept':'application/json',
              'Authorization':'Bearer ' + ha.user.access_token}
  }).done(function(data) {
    $('#modal-edit-profile').modal('hide');
    ha.user.profile.Image = imgBinaryFile;
    ha.user.profile.DisplayName = json.DisplayName;
    ha.user.profile.Description = json.Description;
    editProfileHeaderMenu();
    sessionStorage.setItem("sessionData", JSON.stringify(ha.user));
  }).fail(function(){
    alert("fail");
  });
};
function editProfileHeaderMenu() {
    $("#imProfilePicture").attr('src', imgBinaryFile);
    $("#tProfileDisplayName").html(ha.user.profile.DisplayName);
}

// APP
//function execApp(schema,boxName) {
//    $.ajax({
//        type: "GET",
//        url: schema + "__/launch.json",
//        headers: {
//            'Authorization':'Bearer ' + ha.user.access_token,
//            'Accept':'application/json'
//        }
//    }).done(function(data) {
//        var type = data.type;
//        var launch = data[type];
//        var target = ha.user.cellUrl + boxName;
//        refreshToken().done(function(data) {
//            switch (type) {
//                case "web":
//                    var url = launch;
//                    url += '#target=' + target;
//                    url += '&token=' + data.access_token;
//                    url += '&ref=' + data.refresh_token;
//                    url += '&expires=' + data.expires_in;
//                    url += '&refexpires=' + data.refresh_token_expires_in;
//                    window.open(url);
//                    break;
//            }
//        });
//    });
//};
function execApp(schema,boxName) {
    var childWindow = window.open('about:blank');
    $.ajax({
        type: "GET",
        url: schema + "__/launch.json",
        headers: {
            'Authorization':'Bearer ' + ha.user.access_token,
            'Accept':'application/json'
        }
    }).done(function(data) {
        var type = data.type;
        var launch = data[type];
        var target = ha.user.cellUrl + boxName;
        refreshToken().done(function(data) {
            switch (type) {
                case "web":
                    var url = launch;
                    url += '#target=' + target;
                    url += '&token=' + data.access_token;
                    url += '&ref=' + data.refresh_token;
                    url += '&expires=' + data.expires_in;
                    url += '&refexpires=' + data.refresh_token_expires_in;
                    childWindow.location.href = url;
                    childWindow = null;
                    break;
            }
        });
    }).fail(function(data) {
        childWindow.close();
        childWindow = null;
    });
};

// TEST
function testBinary() {
    var file = document.getElementById("testFile").files[0];
    if (file) {
        try {
             var reader = new FileReader();
        } catch (e) {
             return;
        }

        reader.readAsDataURL(file, "UTF-8");
        reader.onload = testAPI;
    }
}
function testAPI(evt) {
    var file = document.getElementById("testFile");
    var form_data = new FormData(file);

    var url = ha.user.cellUrl;
    //var url = "https://demo.personium.io/ksakamoto/";
    var urlArray = [];
    urlArray[0] = "https";
    urlArray[1] = "demo.personium.io";
    urlArray[2] = "kyouhei-sakamoto";
    var apiUrl = "https://demo.personium.io/app-myboard/__/MyBoard.bar";
    //urlArray[2] = "ksakamoto";
    var oReq = new XMLHttpRequest();
    oReq.open("GET", "https://demo.personium.io/app-myboard/__/MyBoard.bar", true);
    //oReq.open("GET", "https://demo.personium.io/app-myboard/__/V1_1_2_bar_webdav_odata.bar", true);
    oReq.responseType = "arraybuffer";
    oReq.setRequestHeader("Content-Type", "application/zip");
    //oReq.responseType = "blob";
    oReq.onload = function(e) {
        //var blob = new Blob([oReq.response], {type: "application/octet-stream"});
        //var formData = new FormData(); 
        //formData.append('zip', blob);
        //console.log(blob);
        //var r = new FileReader();
        //r.onload = function() {
        //    console.log(r.result.substr(r.result.indexOf(',')+1));
        //}
        //r.readAsDataURL(blob);
        //var view = new DataView(arrayBuffer);
        var arrayBuffer = oReq.response;
        var view = new Uint8Array(arrayBuffer);
        var blob = new Blob([view], {"type" : "application/zip"})
        //if (arrayBuffer) {
        //    var byteArray = new Uint8Array(arrayBuffer);
        //    var binaryData = "";
        //    for (var i = 0; i < byteArray.byteLength; i++) {
        //        binaryData += String.fromCharCode(byteArray[i]);
        //    }
        //}
        //var binary = evt.target.result.substr(evt.target.result.indexOf(',')+1);
        $.ajax({
                type: "MKCOL",
                url: url + 'MyBoard/', // 作成ボックス名
                data: blob,
                //data: 'C:\Users\coe\Desktop\V1_1_2_bar_webdav_odata.bar',
                processData: false,
                headers: {
                    'Authorization':'Bearer ' + ha.user.access_token,
                    //'Content-type':'application/zip'
                    'Content-type':'application/zip'
                }
        }).done(function(data) {
            alert(data);
        }).fail(function(data) {
            alert(data);
        });
    }
    oReq.send();
};
function testAPI2() {
    $.ajax({
            //type: "GET",
            //url: 'https://demo.personium.io/HomeApplication/io_personium_demo_app-myboard',
            //headers: {
            //    'Authorization':'Bearer ' + ha.user.access_token
            //}
            type: "PROPFIND",
            url: 'https://demo.personium.io/HomeApplication/io_personium_demo_app-myboard/MyBoardBox/my-board.json',
            headers: {
                'Authorization':'Bearer ' + ha.user.access_token,
                'Depth': 1
            }
    }).done(function(data) {
        alert(data);
    }).fail(function(data) {
        alert(data);
    });
};