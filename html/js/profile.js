var profile = {};

// Load profile screen
profile.loadProfile = function () {
    personium.loadContent(homeAppUrl + appUseBox + "/html/profile.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        profile.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

/**
 * Control_Input_Editer
 * param:
 * pushed_btn -> Pushed Edit Button
 * target_input -> Want To Edit Input Box
 */
profile.Control_Input_Editer = function(pushed_btn, target_input) {
    var edit_ic = pushed_btn.find('.fa-edit');
    var check_ic = pushed_btn.find('.fa-check');

    if (!(pushed_btn.hasClass('editing'))) {
        pushed_btn.addClass('editing');
        edit_ic.removeClass('fa-edit');
        edit_ic.addClass('fa-check');
        $('#user-name-form').attr('disabled', false);
        $('#description-form-area').attr('disabled', false);
        $("div.my_icon>span").css("display", "block");
    } else {
        pushed_btn.removeClass('editing');

        check_ic.removeClass('fa-check');
        check_ic.addClass('fa-edit');

        $('#user-name-form').blur();
        $('#user-name-form').attr('disabled', true);
        $('#description-form-area').blur();
        $('#description-form-area').attr('disabled', true);
        $("div.my_icon>span").css("display", "none");
        profile.updateCellProfile();
    }
}

profile.init = function() {
    /*Edit button clicked action*/
    $('#edit-btn').on('click', function () {
        profile.Control_Input_Editer($(this));
    })

    // Create Cropper Modal
    ut.createCropperModal({ dispCircleMaskBool: true });
    profile.setProfileValue();
}

profile.setProfileValue = function () {
    let cellUrl = JSON.parse(sessionStorage.getItem("sessionData")).cellUrl;
    $("#user-name-form").attr("data-i18n", "[placeholder]profTrans:myProfile_DisplayName").localize();
    $("#description-form-area").attr("data-i18n", "profTrans:myProfile_Description").localize();
    $("div.my_icon").prepend('<img class="user-icon" style="margin: auto;" id="idImgFile" data-i18n="[src]profTrans:myProfile_Image" src="#" alt="image" />').localize();
    $("div.my_icon").prepend('<input type="file" class="fileUpload" onclick="profile.clearInput(this);" onchange="profile.attachFile(\'popupEditUserPhotoErrorMsg\', \'editImgFile\');" id="editImgFile" accept="image/*" style="display: none">');
    $("div.my_icon>span").click(function () {
        profile.editProfileImage();
    });
    let aImg = cm.createQRCodeImg('https://chart.googleapis.com/chart?cht=qr&chs=177x177&chl=' + cellUrl);
    $(".user-qr-code").html($(aImg));
    $(".user-cell-url").html(cm.getMyCellUrl());
};

profile.editProfileImage = function () {
    $("#editImgFile").click();
};

// File Read
profile.attachFile = function (popupImageErrorId, fileDialogId) {
    var file = document.getElementById(fileDialogId).files[0];
    profile.fileName = document.getElementById(fileDialogId).value;
    if (file) {
        var imageFileSize = file.size / 1024;
        if (cm.validateFileType(profile.fileName, imageFileSize, popupImageErrorId)) {
            profile.getAsBinaryString(file);
        } else {
            console.log("Failed to upload image; format not supported");
        }
    }
};
profile.getAsBinaryString = function (readFile) {
    try {
        var reader = new FileReader();
    } catch (e) {
        //uCellProfile.spinner.stop();
        //document.getElementById('successmsg').innerHTML = "Error: seems File API is not supported on your browser";
        return;
    }
    reader.readAsDataURL(readFile, "UTF-8");
    reader.onload = profile.loaded;
    reader.onerror = profile.errorHandler;
};
profile.loaded = function (evt) {
    // Set images in cropper modal
    ut.setCropperModalImage(evt.target.result);
    // Set functions in cropper modal ok button
    let okFunc = function () {
        let cropImg = ut.getCroppedModalImage();
        $("#idImgFile").attr('src', cropImg);
    }
    ut.setCropperModalOkBtnFunc(okFunc);

    // Start cropper modal
    ut.showCropperModal();
};
profile.errorHandler = function (evt) {
    if (evt.target.error.code == evt.target.error.NOT_READABLE_ERR) {
        cm.spinner.stop();
        alert("Error reading file...");
        //document.getElementById('successmsg').innerHTML = "Error reading file...";
    }
};
profile.clearInput = function (e) {
    e.value = null;
}

// File Save
profile.updateCellProfile = function () {
    var displayName = $("#user-name-form").val();
    if (!displayName) {
        displayName = $("#user-name-form").attr("placeholder");
    }
    var description = $("#description-form-area").val();
    var fileData = null;
    var profileBoxImageName = profile.fileName;
    if (!profileBoxImageName) {
        profileBoxImageName = i18next.t("profTrans:myProfile_ProfileImageName");
    }
    var validDisplayName = cm.validateDisplayName(displayName, "popupEditDisplayNameErrorMsg", '#user-name-form');
    if (validDisplayName) {
        $('#popupEditDisplayNameErrorMsg').html('');
        var validDesciption = cm.validateDescription(description, "popupEditDescriptionErrorMsg");
        if (validDesciption) {
            fileData = {
                "CellType": cm.getCellType(),
                "DisplayName": displayName,
                "Description": description,
                "Image": $("#idImgFile").attr('src'),
                "ProfileImageName": profileBoxImageName
            };
            profile.retrieveCollectionAPIResponse(fileData);
        }
    } else {
        console.log("NG");
    }
};
profile.retrieveCollectionAPIResponse = function (json) {
    let profileUrl = cm.getMyCellUrl() + '__/profile.json';
    // Check if there is locales folder
    ut.confirmExistenceOfURL(cm.getMyCellUrl() + '__/locales').done(function (res) {
        // Update default profile
        ut.putFileAPI(profileUrl, json).fail(function (res) {
            console.log(res);
        });

        profileUrl = cm.getMyCellUrl() + '__/locales/' + i18next.language + '/profile.json';

        // Check if there is a target language folder
        ut.confirmExistenceOfURL(cm.getMyCellUrl() + '__/locales/' + i18next.language).fail(function (res) {
            $.ajax({
                type: "MKCOL",
                url: cm.getMyCellUrl() + '__/locales/' + i18next.language,
                data: '<?xml version="1.0" encoding="utf-8"?><D:mkcol xmlns:D="DAV:" xmlns:p="urn:x-personium:xmlns"><D:set><D:prop><D:resourcetype><D:collection/></D:resourcetype></D:prop></D:set></D:mkcol>',
                processData: false,
                headers: {
                    'Authorization': 'Bearer ' + cm.user.access_token,
                    'Accept': 'application/json'
                }
            }).done(function (res) {
                profile.putFileProcess(profileUrl, json);
            }).fail(function (res) {
                console.log(res);
            })
        }).done(function (res) {
            profile.putFileProcess(profileUrl, json);
        });
    }).fail(function (res) {
        profile.putFileProcess(profileUrl, json);
    });
};
profile.putFileProcess = function (profileUrl, json) {
    ut.putFileAPI(profileUrl, json).done(function (data) {
        cm.i18nAddProfile(i18next.language, "profTrans", "myProfile", json, cm.getMyCellUrl(), "profile");
        $("#user-name-form").attr("placeholder", json.DisplayName);
    }).fail(function () {
        alert("fail");
    });
}