var cm = {};
cm.imgBinaryFile = null;
cm.user = JSON.parse(sessionStorage.getItem("sessionData"));

// Do not display the following boxes in the installed list section
cm.boxIgnoreList = ['https://demo.personium.io/app-cc-home/'];

// Logout
cm.logout = function() {
  sessionStorage.setItem("sessionData", null);
  var mode = sessionStorage.getItem("mode");
  if (mode) {
      location.href = "./login.html?mode=" + mode;
  } else {
      location.href = "./login.html";
  }
};

if (!cm.user) {
  cm.logout();
}

// Icon quality
cm.ICON_QUALITY = 0.8;
// Icon Size
cm.ICON_WIDTH = 172;
cm.ICON_HEIGHT = 172;
// Icon Size limit(KB)
cm.ICON_SIZELIMIT = 500;
// Default timeout limit - 60 minutes.
cm.IDLE_TIMEOUT = 3600000;
// cm.IDLE_TIMEOUT =  10000;
// Records last activity time.
cm.LASTACTIVITY = new Date().getTime();

/*
 * When isAdvancedMode is false, do not display the followings:
 * 1. Create External Cell Dialog - Assign checkbox
 * 2. Create External Cell Dialog - Role/Relation radio buttons
 * 3. Create External Cell Dialog - Role/Relation options
 */ 
cm.user.isAdvancedMode = false;
cm.user.nowPage = 0;
cm.user.nowTitle = {};
cm.user.settingNowPage = 0;
cm.user.settingNowTitle = {};
cm.defaultRoleIcon = "https://demo.personium.io/app-cc-home/__/src/img/role_default.png";
cm.notAppImage = "https://demo.personium.io/HomeApplication/__/icons/no_app_image.png";
cm.cellUrl = cm.user.cellUrl;
cm.userName = cm.user.userName;
cm.profDispName = cm.user.profile.DisplayName;
cm.image = cm.user.profile.Image;
cm.access_token = cm.user.access_token;
cm.refresh_token = cm.user.refresh_token;

cm.getAdvancedMode = function () {
    return cm.user.isAdvancedMode;
}

cm.setNowPage = function (value) {
    cm.user.nowPage = value;
}
cm.getNowPage = function () {
    return cm.user.nowPage;
}

cm.setNowTitle = function (i, value) {
    cm.user.nowTitle[i] = value;
}
cm.getNowTitle = function (i) {
    return cm.user.nowTitle[i];
}

cm.getMyCellUrl = function () {
    return cm.cellUrl;
}

cm.getAccessToken = function () {
    return cm.access_token;
}

cm.getRefreshToken = function () {
    return cm.refresh_token;
}

cm.getUserName = function () {
    return cm.userName;
}

/*** new ***/
$(function () {
    setIdleTime();
})
// This method checks idle time
// Check 5 minutes before session expires
setIdleTime = function () {
    cm.refreshToken();
    setInterval(cm.refreshToken, 1800000);
}
cm.refreshToken = function () {
    personium.refreshTokenAPI(cm.getMyCellUrl(), cm.getRefreshToken()).done(function (data) {
        cm.user.access_token = data.access_token;
        cm.user.refresh_token = data.refresh_token;
        cm.access_token = cm.user.access_token;
        cm.refresh_token = cm.user.refresh_token;
        sessionStorage.setItem("sessionData", JSON.stringify(cm.user));
    });
};

/**
   * Add_Check_Mark
   * param:none
   */
function Add_Check_Mark() {
    $('.pn-check-list').click(function (event) {

        //CASE: sort list
        if ($(this).parents('#sort-menu').length != 0) {
            $('#sort-menu').find('.check-mark-right').removeClass('check-mark-right');
            $(this).addClass('check-mark-right');
        }

        //CASE: icon list
        if ($(this).parents('#icon-check-list').length != 0) {
            $(this).find('.pn-icon-check').toggle();
        }

        //CASE: check list
        if ($(this).parents('#check-list').length != 0) {

            if ($(this).hasClass('check-mark-left')) {
                $(this).removeClass('check-mark-left');
            } else {
                $(this).addClass('check-mark-left');
            }

        }

    });

}
/**
   * Control_Dialog
   * param:none
   */
function Control_Dialog() {
    //clicked logout button
    $('#logout').on('click', function () {
        $('.double-btn-modal').modal('show');
    });

    //single button modal
    $('.pn-single-modal').on('click', function () {
        $('.single-btn-modal').modal('show');
    });
}
/**
   * Control_Slide_List
   * param: none
   */
cm.Control_Slide_List = function() {
    var visible_area = $('.slide-list>li');
    var wide_line = $('.slide-list-line');
    var line_contents = $('.slide-list-line-contents');
    var line_contents_p = $('.slide-list-line-contents>p');
    var a_tag = $('.slide-list-line-contents>a');
    var edit_btn = $('.slide-list-edit-btn');

    /*Edit Button Clicked(Page's Header)*/
    edit_btn.on('click', function () {
        if (!($(this).hasClass('editing'))) {
            if (($(this).hasClass('edited'))) {
                $(this).removeClass('edited');
            }
            $(this).addClass('editing');
            visible_area.filter(":last").css('display', 'none');
            line_contents.addClass('edit-ic');
            $('.login-ic').removeClass('edit-ic');
            a_tag.addClass('edit_margin');
            wide_line.animate({
                'left': '0px'
            }, 500);
        } else if (($(this).hasClass('editing')) && !($(this).hasClass('edited'))) {
            $(this).removeClass('editing');
            $(this).addClass('edited');
            wide_line.animate({
                'left': '-70px'
            }, 500);
            visible_area.filter(":last").css('display', 'block');
            line_contents.removeClass('edit-ic');
            line_contents.removeClass('clear-ic');
            a_tag.removeClass('edit_margin');
            a_tag.removeClass('account_mng_list_edit');
            a_tag.removeClass('disabled');
        }
    })

    /*Circle Delete Button Clicked(Page's List Left)*/
    $('.delete-check-btn').on('click', function () {
        $(this).next("div").children("a").addClass('disabled');
        $(this).parent().animate({
            'left': '-170px'
        }, 500);
        $(this).next().addClass('clear-ic');
    })

    /*Square Delete Button Clicked(Page's List Right)*/
    $('.line-delete-btn').on('click', function () {
        $(this).closest('li').animate({
            width: 'hide',
            height: 'hide',
            opacity: 'hide'
        }, 'slow', function () {
            $(this).remove();
        });
    });

    /*Deletion When clicking an element being checked*/
    line_contents.on("click", function () {
        if ($(this).hasClass('clear-ic')) {
            if (edit_btn.hasClass('editing')) {
                $(this).parent().animate({
                    'left': '0px'
                }, 500);
                $(this).removeClass('clear-ic');
                $(this).children("a").removeClass('disabled');
            }
        }
    });
}
cm.i18nSetProfile = function () {
    let cellUrl = cm.user.cellUrl;
    let defProf = {
        DisplayName: ut.getName(cellUrl),
        Description: "",
        Image: ut.getJdenticon(cellUrl)
    };
    personium.getProfile(cellUrl).done(function (prof) {
        defProf = {
            DisplayName: prof.DisplayName,
            Description: prof.Description,
            Image: prof.Image
        }
    }).always(function () {
        if (!defProf.Image) {
            defProf.Image = ut.getJdenticon(cellUrl);
        }
        let transName = "myProfile";
        cm.i18nAddProfile("en", "profTrans", transName, defProf, cellUrl, "profile");
        cm.i18nAddProfile("ja", "profTrans", transName, defProf, cellUrl, "profile");
    });
}
cm.i18nSetTargetProfile = function (targetUrl) {
    let cellUrl = targetUrl;
    var cellName = ut.getName(cellUrl);
    let defProf = {
        DisplayName: cellName,
        Description: "",
        Image: ut.getJdenticon(cellUrl)
    };
    personium.getProfile(cellUrl).done(function (prof) {
        defProf = {
            DisplayName: prof.DisplayName,
            Description: prof.Description,
            Image: prof.Image
        }
    }).always(function () {
        if (!defProf.Image) {
            defProf.Image = ut.getJdenticon(cellUrl);
        }
        var transName = cm.getTargetProfTransName(cellUrl);
        cm.i18nAddProfile("en", "profTrans", transName, defProf, cellUrl, "profile");
        cm.i18nAddProfile("ja", "profTrans", transName, defProf, cellUrl, "profile");
    });
}
cm.getTargetProfTransName = function(targetUrl) {
    let cellName = ut.getName(targetUrl);
    let urlParse = $.url(targetUrl);
    return urlParse.attr('host') + "_" + cellName;
}
cm.i18nSetRole = function () {
    personium.getRoleList(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
        var results = data.d.results;
        for (var i = 0; i < results.length; i++) {
            var res = results[i];
            var name = res.Name;
            var boxName = res["_Box.Name"];
            if (boxName != null) {
                cm.registerRoleRelProfI18n(name, boxName, "roles");
            }
        }
    });
}
cm.i18nSetRelation = function () {
    cm.getRelationList().done(function (data) {
        var results = data.d.results;
        for (var i = 0; i < results.length; i++) {
            var res = results[i];
            var name = res.Name;
            var boxName = res["_Box.Name"];
            if (boxName != null) {
                cm.registerRoleRelProfI18n(name, boxName, "relations");
            }
        }
    });
}
cm.i18nSetBox = function () {
    personium.getBoxList(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
        var insAppRes = data.d.results;
        for (var i in insAppRes) {
            var schema = insAppRes[i].Schema;
            var boxName = insAppRes[i].Name;
            if (schema && schema.length > 0) {
                cm.registerProfI18n(schema, boxName, "profile", "App");
            }
        }
    })
}

cm.validateDisplayName = function (displayName, displayNameSpan) {
    var MINLENGTH = 1;
    var lenDisplayName = displayName.length;
    if (lenDisplayName < MINLENGTH || displayName == undefined || displayName == null || displayName == "") {
        $("#" + displayNameSpan).html(i18next.t("pleaseEnterName"));
        return false;
    }

    var MAXLENGTH = 128;
    $("#" + displayNameSpan).html("");
    if (lenDisplayName > MAXLENGTH) {
        $("#" + displayNameSpan).html(i18next.t("errorValidateNameLength"));
        return false;
    }
    return true;
};
cm.validateFileType = function (filePath, imageSize, popupImageErrorId) {
    var fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1)
        .toLowerCase();
    if (fileExtension.toLowerCase() == "jpg"
        || fileExtension.toLowerCase() == "jpeg"
        || fileExtension.toLowerCase() == "png"
        || fileExtension.toLowerCase() == "gif"
        || fileExtension.toLowerCase() == "bmp"
    ) {
        return true;
    } else {
        return false;
    }
};

cm.i18nAddProfile = function (lng, ns, transName, defJson, schemaUrl, fileName, typeName) {
    let defImage = ut.getJdenticon(schemaUrl);
    if (defJson.Image) {
        defImage = defJson.Image;
    }

    personium.getTargetProfileLng(schemaUrl, lng, fileName).done(function (profRes) {
        var profJson = {};
        if (typeName) {
            if (profRes[typeName]) {
                profJson = {
                    DisplayName: profRes[typeName].DisplayName,
                    Description: profRes[typeName].Description,
                    Image: profRes[typeName].Image
                }
            }
        } else {
            profJson = {
                DisplayName: profRes.DisplayName,
                Description: profRes.Description,
                Image: profRes.Image
            }
        }

        if (profJson.DisplayName) {
            i18next.addResource(lng, ns, transName + "_DisplayName", profJson.DisplayName);
        } else {
            i18next.addResource(lng, ns, transName + "_DisplayName", defJson.DisplayName);
        }
        if (profJson.Description) {
            i18next.addResource(lng, ns, transName + "_Description", profJson.Description);
        } else {
            i18next.addResource(lng, ns, transName + "_Description", defJson.Description);
        }
        if (profJson.Image) {
            i18next.addResource(lng, ns, transName + "_Image", profJson.Image);
        } else {
            i18next.addResource(lng, ns, transName + "_Image", defImage);
        }
        if (profJson.ProfileImageName) {
            i18next.addResource(lng, ns, transName + "_ProfileImageName", profJson.ProfileImageName);
        } else {
            i18next.addResource(lng, ns, transName + "_ProfileImageName", "");
        }
    }).fail(function () {
        if (defJson.DisplayName[lng]) {
            i18next.addResource(lng, ns, transName + "_DisplayName", defJson.DisplayName[lng]);
        } else {
            i18next.addResource(lng, ns, transName + "_DisplayName", defJson.DisplayName);
        }

        if (defJson.Description[lng]) {
            i18next.addResource(lng, ns, transName + "_Description", defJson.Description[lng]);
        } else {
            i18next.addResource(lng, ns, transName + "_Description", defJson.Description);
        }
        i18next.addResource(lng, ns, transName + "_Image", defImage);
        i18next.addResource(lng, ns, transName + "_ProfileImageName", "");
    }).always(function () {
        updateContent();
    });
};
cm.charCheck = function (check, displayNameSpan) {
    var passLen = check.val().length;
    var msg = "";
    var bool = true;

    if (passLen !== 0) {
        if (passLen < 6 || passLen > 36) {
            msg = i18next.t("pleaseBetweenCharacter");
            bool = false;
        } else if (check.val().match(/[^0-9a-zA-Z_-]+/)) {
            msg = i18next.t("pleaseCharacterType");
            bool = false;
        }

        $(displayNameSpan).html(msg);
    }

    return bool;
};
cm.changePassCheck = function (newpass, confirm, displayNameSpan) {
    $(displayNameSpan).empty();
    if (newpass !== confirm) {
        $(displayNameSpan).html(i18next.t("passwordNotMatch"));
        return false
    }

    return true;
};
cm.passInputCheck = function (newpass, displayNameSpan) {
    $(displayNameSpan).empty();
    if (newpass.length == 0) {
        $(displayNameSpan).html(i18next.t("pleaseEnterPassword"));
        return false;
    }

    return true;
}
// Validation Check
cm.validateName = function (displayName, displayNameSpan, addSpecial, addStart) {
    var specialChar = "a-zA-Z0-9";
    var startChar = "a-zA-Z0-9";
    if (addSpecial) {
        specialChar += addSpecial;
    }
    if (addStart) {
        startChar += addStart;
    }

    var MINLENGTH = 1;
    var MAXLENGTH = 128;

    var lenDisplayName = displayName.length;
    if (lenDisplayName < MINLENGTH || displayName == undefined || displayName == null || displayName == "") {
        document.getElementById(displayNameSpan).innerHTML = i18next.t("pleaseEnterName");
        return false;
    }

    var letters = new RegExp("^([" + startChar + "]([" + specialChar + "]){0,127})?$");
    var startReg = new RegExp("^[" + startChar + "]")
    var multibyteChar = new RegExp("[^\x00-\x7F]+");
    document.getElementById(displayNameSpan).innerHTML = "";

    if (displayName.match(letters)) {
        return true;
    } else if (lenDisplayName > MAXLENGTH) {
        document.getElementById(displayNameSpan).innerHTML = i18next.t("errorValidateNameLength");
        return false;
    } else if (displayName.match(multibyteChar)) {
        document.getElementById(displayNameSpan).innerHTML = i18next.t("errorValidateMultibyte");
        return false;
    } else if (!displayName.match(startReg)) {
        if (addStart) {
            document.getElementById(displayNameSpan).innerHTML = i18next.t("errorValidateFirstPossibleSpecialCharacters", { value: addStart });
        } else {
            document.getElementById(displayNameSpan).innerHTML = i18next.t("errorValidateStartNameSpecialCharacters");
        }
        return false;
    } else {
        document.getElementById(displayNameSpan).innerHTML = i18next.t("errorValidateSpecialCharacters", { value: addSpecial });
        return false;
    }
};
cm.validateMail = function (displayMail, displayMailSpan) {
    var MINLENGTH = 1;
    var lenDisplayMail = displayMail.length;
    if (lenDisplayMail < MINLENGTH || displayMail == undefined || displayMail == null || displayMail == "") {
        document.getElementById(displayMailSpan).innerHTML = i18next.t("pleaseEnterGMail");
        return false;
    }

    document.getElementById(displayMailSpan).innerHTML = "";

    if (displayMail.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
        return true;
    } else {
        document.getElementById(displayMailSpan).innerHTML = i18next.t("errorValidateMailAddress");
        return false;
    }
}
/*** message ***/
cm.displayProfile = function (cellUrl, num) {
    personium.getCell(cellUrl).done(function () {
        var cellName = ut.getName(cellUrl);
        var urlParse = $.url(cellUrl);
        var transName = urlParse.attr('host') + "_" + cellName;
        if (!i18next.exists(transName)) {
            cm.registerProfI18n(cellUrl, transName, "profile", "Person");
        }
        $('#msgUserName' + num).attr('data-i18n', 'profTrans:' + transName + '_DisplayName').localize();
        $('#msgIcon' + num).attr('data-i18n', '[src]profTrans:' + transName + '_Image').localize();
    }).fail(function () {
        $('#msgUserName' + num).attr('data-i18n','notExistTargetCell').localize();
    })
}

cm.getAppListURL = function () {
    /*
     * For older profile.json that might not have CellType key,
     * assign default cell type (Person) to it.
     */
    let cellType = cm.getCellType();
    let filter = "?$filter=Type%20eq%20null%20or%20Type%20eq%20'Person'%20";

    if (cellType == "Organization") {
        filter = "?$filter=Type%20eq%20null%20or%20Type%20eq%20'Organization'%20";
    }

    let appListURL = ['https://demo.personium.io/market/__/applist/Apps', filter].join("");

    return appListURL;
};
cm.getCellType = function () {
    return (JSON.parse(sessionStorage.getItem("myProfile")).CellType || "Person");
};

cm.registerProfI18n = function (schema, boxName, fileName, cellType) {
    let defImage = ut.getDefaultImage(schema);
    let defProf = {
        DisplayName: ut.getName(schema),
        Description: "",
        Image: defImage
    }
    personium.getProfile(schema).done(function (defRes) {
        defProf.DisplayName = defRes.DisplayName;
        defProf.Description = defRes.Description;
        if (defRes.Image) {
            defProf.Image = defRes.Image;
        }
    }).always(function () {
        cm.i18nAddProfile("en", "profTrans", boxName, defProf, schema, fileName, null);
        cm.i18nAddProfile("ja", "profTrans", boxName, defProf, schema, fileName, null);
    });
}
cm.registerRoleRelProfI18n = function (name, boxName, fileName) {
    personium.getBoxInfo(cm.getMyCellUrl(), cm.getAccessToken(), boxName).done(function (boxRes) {
        let schemaUrl = boxRes.d.results.Schema;
        let transName = name + "_" + boxName;
        let defProf = {
            DisplayName: name,
            Description: "",
            Image: cm.defaultRoleIcon
        }
        personium.getTargetProfile(schemaUrl, fileName).done(function (defRes) {
            if (defRes[name]) {
                defProf = {
                    DisplayName: defRes[name].DisplayName,
                    Description: defRes[name].Description,
                    Image: defRes[name].Image
                }
            }
        }).always(function () {
            cm.i18nAddProfile("en", "profTrans", transName, defProf, schemaUrl, fileName, name);
            cm.i18nAddProfile("ja", "profTrans", transName, defProf, schemaUrl, fileName, name);
        });
    });
}

cm.execApp = function (aDom) {
    let launchUrl = $(aDom).data('appLaunchUrl');
    let openNewWindow = $(aDom).data('openNewWindow');
    let childWindow;
    // https://stackoverflow.com/questions/20696041/window-openurl-blank-not-working-on-imac-safari
    if (openNewWindow) {
        childWindow = window.open('about:blank');
    }

    let tempMyProfile = JSON.parse(sessionStorage.getItem("myProfile")) || {};
    let isDemo = (tempMyProfile.IsDemo || false);

    var url = launchUrl;
    url += '?lng=' + i18next.language;
    url += '#cell=' + cm.user.cellUrl;
    
    var sendRefreshToken = $(aDom).data('sendRefreshToken');
    
    if (sendRefreshToken) {
        url += '&refresh_token=' + cm.getRefreshToken();
    }

    /*
     * Launch App according to device type if supported.
     * If App is native, launch.json should specify "android" and "ios" key/value pairs.
     * If native App is not defined, launch the web App as usual.
     */
    if (openNewWindow) {
        childWindow.location.href = url;
        childWindow = null;
    } else {
        window.location.href = url; // launch native App
    }

    if (isDemo && launchUrl.startsWith('https://demo.personium.io/app-myboard/')) {
        demoSession.sideMenu = true;
        sessionStorage.setItem("demoSession", JSON.stringify(demoSession));
        demo.showModal('#modal-logout-start');
    }

    return false;
};

cm.createQRCodeImg = function (url) {
    let googleAPI = 'https://chart.googleapis.com/chart?cht=qr&chs=177x177&chl=';
    let qrURL = googleAPI + url;
    let aImg = $('<img>', {
        src: qrURL,
        alt: url,
        style: 'margin: auto; width: 180px; height: 180px; padding: 1px;'
    })

    return aImg;
};

cm.validateDescription = function(descriptionDetails, descriptionSpan) {
	var isValidDescription = true;
	var lenDescription = descriptionDetails.length;
	if (lenDescription > 51200) {
		isValidDescription = false;
		document.getElementById(descriptionSpan).innerHTML = i18next.t("errorValidateMaxLengthOver");
	}
	return isValidDescription;
};
