if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

var ut = {};

// Local Unit/Box Schema
ut.PERSONIUM_LOCALUNIT = "personium-localunit:";
ut.PERSONIUM_LOCALBOX = "personium-localbox:";

ut.loadScript = function (callback) {
    let head = document.getElementsByTagName('head')[0];
    let scriptList = [];
    if (typeof addLoadScript == "function") {
        scriptList = addLoadScript(scriptList);
    }

    let i = 0;
    (function appendScript() {
        if (typeof scriptList[i] == "undefined") {
            if ((typeof callback !== "undefined") && $.isFunction(callback)) {
                callback();
            };
            return false;
        }
        let script = document.createElement('script');
        script.src = scriptList[i];
        
        head.appendChild(script);
        i++;
        script.onload = function (e) {
            appendScript();
        }
    })();
};
ut.loadStyleSheet = function () {
    let head = document.getElementsByTagName('head')[0];
    let styleList = [];
    if (typeof addLoadStyleSheet == "function") {
        styleList = addLoadStyleSheet(styleList);
    }

    for (var i = 0; i < styleList.length; i++){
        let link = document.createElement("link");
        link.href = styleList[i];
        link.rel = "stylesheet";
        link.type = "text/css";
        head.insertBefore(link, head.firstChild);
    }
}

ut.cellUrlWithEndingSlash = function(tempUrl, raiseError) {
    var i = tempUrl.indexOf("/", 8); // search after "http://" or "https://"

    if (raiseError && i == -1) {
        $('#errorCellUrl').html(i18next.t("pleaseValidExternalCellUrl"));
        return tempUrl;
    }

    if (tempUrl.slice(-1) != "/") {
        tempUrl += "/";
    }

    i = tempUrl.indexOf("/", i + 1);

    var cellUrl = tempUrl.substring(0, i + 1);

    return cellUrl;
};

/*
 * Retrieve cell name from cell URL
 * OR
 * file name from file path (windows, linux)
 * Parameter:
 *     1. ended with "/", "https://demo.personium.io/debug-user1/"
 *     2. ended without "/", "https://demo.personium.io/debug-user1"
 *     3. window path "c:\\home\hoge\hello.png"
 *     4. linux path "/home/hoge/hello.png"
 *     5. "https://demo.personium.io/debug-user1/HomeApplicatin.bar"
 *     withoutExtension: Exclude the extension from the acquired file name
 * Return:
 *     debug-user1
 *     OR
 *     hello.png
 */
ut.getName = function(path, withoutExtension) {
    if ((typeof path === "undefined") || path == null || path == "") {
        return "";
    };

    let name;
    if (_.contains(path, "\\")) {
        name = _.last(_.compact(path.split("\\")));
    }else{
        name = _.last(_.compact(path.split("/")));
    }

    if (withoutExtension) {
        name = _.first(_.compact(name.split("\.")));
    }
    return name;
};

/*
 * Replace the same unit URL as my unit URL with personium-localunit
 */
ut.changeUnitUrlToLocalUnit = function (cellUrl) {
    var result = cellUrl;
    if (cellUrl.startsWith(cm.user.baseUrl)) {
        result = cellUrl.replace(cm.user.baseUrl, ut.PERSONIUM_LOCALUNIT + "/");
    }

    return result;
};

/*
 * Replace personium-localunit with your unit URL
 */
ut.changeLocalUnitToUnitUrl = function (cellUrl) {
    var result = cellUrl;
    if (cellUrl.startsWith(ut.PERSONIUM_LOCALUNIT)) {
        result = cellUrl.replace(ut.PERSONIUM_LOCALUNIT + "/", cm.user.baseUrl);
    }

    return result;
};

/*
 * Replace personium-localbox with the user's Box URL
 */
ut.changeLocalBoxToBoxUrl = function (url, boxName) {
    let result = url;
    if (url.startsWith(ut.PERSONIUM_LOCALBOX)) {
        result = url.replace(ut.PERSONIUM_LOCALBOX, cm.user.cellUrl + boxName);
    }

    return result;
};

/*
 * Confirm existence of the specified URL.
 */
ut.confirmExistenceOfURL = function (url) {
    return $.ajax({
        type: "GET",
        url: url,
        headers: {
            'Authorization': 'Bearer ' + cm.user.access_token,
            'Accept': 'text/plain'
        }
    });
};

ut.putFileAPI = function (putUrl, json) {
    return $.ajax({
        type: "PUT",
        url: putUrl,
        data: JSON.stringify(json),
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + cm.user.access_token
        }
    });
};

/*
 * The following are not supported for now:
 * navigator.userAgent.match(/webOS/i)
 * navigator.userAgent.match(/iPod/i)
 * navigator.userAgent.match(/BlackBerry/i)
 * navigator.userAgent.match(/Windows Phone/i)
 */
ut.deviceType2PersoniumAppType = function() {
    if (navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)) {
        return "ios";
    }

    if (navigator.userAgent.match(/Android/i)) {
        return "android";
    }

    return "web";
};
ut.PEROSNIUM_APP_TYPE = ut.deviceType2PersoniumAppType();
console.log('Personium App Type [' + ut.PEROSNIUM_APP_TYPE + ']');

ut.getAppLaunchUrl = function(launchObj, boxName) {
    let appTypeFinal = 'Web App';
    let result = {
        appLaunchUrl: ut.changeLocalBoxToBoxUrl(launchObj.web, boxName),
        openNewWindow: true
    };

    let personiumAppType = ut.PEROSNIUM_APP_TYPE;
    switch (personiumAppType) {
        case 'android':
        case 'ios':
            if (launchObj[personiumAppType] && !launchObj[personiumAppType].startsWith('***:')) {
                result.openNewWindow = false;
                result.appLaunchUrl = launchObj[personiumAppType];
                appTypeFinal = 'native App';
            }
            break;
        case 'web':
        default:
            appTypeFinal = 'Web App';
    }
    console.log('[%s] will be launched as %s', boxName, appTypeFinal);

    return result;
};
ut.getDefaultImage = function (cellUrl, cellType) {
    if (cellType === "App") {
        return cm.notAppImage;
    }

    return ut.getJdenticon(cellUrl);
}

/*
 * A function that creates a button for a modal footer part
 * @param id OK button id
 * @param callback Processing when the OK button is pressed
 */
ut.createModalFooterTag = function (id, callback) {
    let footerTag = $("<div>", {
        class: "modal-footer"
    });
    let cancelBtnTag = $("<button>", {
        type: "button",
        class: "btn btn-default",
        "data-dismiss": "modal",
        "data-i18n": "Cancel"
    });
    footerTag.append(cancelBtnTag);

    let okBtnTag = $("<button>", {
        type: "button",
        class: "btn btn-primary",
        id: id
    }).html("OK");
    okBtnTag.click(function () {
        if ((typeof callback !== "undefined") && $.isFunction(callback)) {
            callback();
        }
    });
    footerTag.append(okBtnTag);

    return footerTag;
}

/*
 * Based on the passed value, we generate an image using jdenticon and return it in base64 format.
 * This function can not be used unless you load jdenticon.
 */
ut.getJdenticon = function (value) {
    var canvas = document.createElement("canvas");
    canvas.height = 172;
    canvas.width = 172;
    jdenticon.update(canvas, value);
    var icon_quality = 0.8;
    return canvas.toDataURL("image/jpeg", icon_quality);
}
/*
 * Create cropper modal.
 * If it has already been created, delete it and recreate it.
 * @param imgSrc Image source to crop
 * @param callbackOkBtn Processing when pressing the modal OK button
 * @param dispCircleMaskBool Whether to display a circular mask
 */
ut.createCropperModal = function (paramObj) {
    let imgSrc = null;
    if (paramObj.imgSrc) imgSrc = paramObj.imgSrc;
    let callbackOkBtn = null;
    if (paramObj.callbackOkBtn) callbackOkBtn = paramObj.callbackOkBtn;
    let dispCircleMaskBool = false;
    if (paramObj.dispCircleMaskBool) dispCircleMaskBool = paramObj.dispCircleMaskBool;

    ut.deleteCropperModal();

    let modalTag = $("<div>", {
        id: "modal-cropper-image",
        class: "modal fade",
        role: "dialog",
        "data-backdrop": "static"
    });

    let modalDiaTag = $("<div>", {
        class: "modal-dialog"
    });

    let modalContTag = $("<div>", {
        class: "modal-content"
    });

    let modalHerderTag = $("<div>", {
        class: "modal-header",
        style: "text-align:center;"
    });
    let dispImgTag = $("<img>", {
        id: "cropped_img",
        class: "image-circle-large"
    });
    if (dispCircleMaskBool) {
        dispImgTag.css("display", "none");
    }
    modalHerderTag.append(dispImgTag);

    modalContTag.append(modalHerderTag);

    let modalBodyTag = $("<div>", {
        class: "modal-body"
    });

    let bootContTag = $("<div>", {
        class: "container",
        style: "width:100%;"
    });
    let bootRowTag = $("<div>", {
        class: "row"
    });
    let bootColTag = $("<div>", {
        class: "col-md-12"
    });

    let imgContTag = $("<div>", {
        style: "text-align:center;"
    });
    if (dispCircleMaskBool) {
        imgContTag.addClass("circle-mask");
    }

    let cropImgTag = $("<img>", {
        id: "cropping_img",
        style: "max-width:100%;max-height: 600px;",
        src: imgSrc
    });
    imgContTag.append(cropImgTag);
    bootColTag.append(imgContTag);
    bootRowTag.append(bootColTag);
    bootContTag.append(bootRowTag);
    modalBodyTag.append(bootContTag);
    modalContTag.append(modalBodyTag);

    modalContTag.append(ut.createModalFooterTag("b-cropper-ok"));
    modalDiaTag.append(modalContTag);
    modalTag.append(modalDiaTag);
    $(document.body).append(modalTag);

    // Set processing when pressing OK button.
    ut.setCropperModalOkBtnFunc(callbackOkBtn);

    // After displaying the modal, set the cropper
    $("#modal-cropper-image").on("shown.bs.modal", function () {
        // Destroy cropper once
        $("#cropping_img").cropper("destroy");

        // Calculate ratio from width / height of original image
        let width_ratio = 1;
        if ($("#cropping_img")[0] && $("#cropping_img")[0].naturalWidth > 0) {
            width_ratio = $("#cropping_img").width() / $("#cropping_img")[0].naturalWidth;
        }

        let height_ratio = 1;
        if ($("#cropping_img")[0] && $("#cropping_img")[0].naturalHeight > 0) {
            height_ratio = $("#cropping_img").height() / $("#cropping_img")[0].naturalHeight;
        }

        let option = {};
        if (dispCircleMaskBool) {
            option = {
                cropBoxResizable: false, // Prohibition of crop box resizing
                toggleDragModeOnDblclick: false, // Prohibit change of drag mode by double click
                // Specify the size of the crop box
                // ("cropper" calculates the actual size from the ratio between the specified size and the size of the original image, 
                // so if you specify the result calculated in advance, you can make it look like specified size)
                data: {
                    width: $("#cropped_img").width() / width_ratio,
                    height: $("#cropped_img").height() / height_ratio
                }
            }
        }
        ut.appendCropper('#cropping_img', '#cropped_img', option);

        console.log($("#cropping_img").cropper("getImageData"));
    });
}
/*
 * Delete cropper modal.
 */
ut.deleteCropperModal = function () {
    $("#modal-cropper-image").remove();
}
/*
 * Call cropper modal.
 */
ut.showCropperModal = function () {
    $('#modal-cropper-image').modal('show');
}
/*
 * Set processing when pressing OK button.
 * If it is already set, overwrite it.
 * @param func Processing when the OK button is pressed
 */
ut.setCropperModalOkBtnFunc = function (func) {
    if (!$("#b-cropper-ok").length) return;

    $("#b-cropper-ok").off("click");
    let okFunc = function () {
        $('#modal-cropper-image').modal('hide');
    };
    if ((typeof func !== "undefined") && $.isFunction(func)) {
        let oldFunc = okFunc;
        okFunc = function () {
            func();
            oldFunc();
        }
    }
    $("#b-cropper-ok").click(function () {
        okFunc();
    });
}
/*
 * crop Sets the target image.
 */
ut.setCropperModalImage = function (imgSrc) {
    if (!$("#cropping_img").length) return;

    $("#cropping_img").attr("src", imgSrc);
    $("#cropping_img").cropper('destroy');
}
/*
 * Retrieve the croped image.
 */
ut.getCroppedModalImage = function () {
    return $("#cropped_img").attr("src");
}

/*
 * Add the cropping function to the specified Image selector.
 * @param appendSelector Jquery selector to create cropper
 * @param dispImageSelector Jquery selector to display cropped image
 * @param options cropper options
 */
ut.appendCropper = function (croppingImageSelector, dispImageSelector, cropperOptions) {
    const VECTOR_X = 1;
    const VECTOR_Y = 1;
    let canvas_w = 200;
    let canvas_h = 200;
    if ($(dispImageSelector).width()) {
        canvas_w = $(dispImageSelector).width();
    }
    if ($(dispImageSelector).height()) {
        canvas_h = $(dispImageSelector).height();
    }

    // Define cropper options
    let options = {
        dragMode: "move",
        aspectRatio: VECTOR_X/VECTOR_Y
    };
    if (cropperOptions) {
        $.extend(options, cropperOptions);
    }

    // Add "cropper" to image
    let imgDef = $(croppingImageSelector);
    imgDef.on({
        ready: function (e) {
            setImgParams();
        },
        cropstart: function (e) {
            setImgParams();
        },
        cropmove: function (e) {
            setImgParams();
        },
        cropend: function (e) {
            setImgParams();
        },
        crop: function (e) {
            setImgParams();
        },
        zoom: function (e) {
            setImgParams();
        }
    }).cropper(options);

    let canvas = document.createElement("canvas");
    canvas.width = canvas_w;
    canvas.height = canvas_h;
    let ctx = canvas.getContext('2d');

    let img = new Image();
    if ($(croppingImageSelector).attr("src")) {
        img.src = $(croppingImageSelector).attr("src");
        img.onload = function () {
            setImgParams();
        }
    }
    // Make drawing settings
    function setImgParams() {
        let data = imgDef.cropper('getData');
        let imageData = {
            x: Math.round(data.x),
            y: Math.round(data.y),
            width: Math.round(data.width),
            height: Math.round(data.height),
            vectorX: VECTOR_X,
            vectorY: VECTOR_Y
        };
        drawImg(imageData);
    }
    // Drawing process
    function drawImg(data) {
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas_w, canvas_h);
        ctx.save();

        ctx.beginPath();
        ctx.drawImage(
            img,
            data['x'],
            data['y'],
            data['width'],
            data['height'],
            0, 0,
            data['vectorX'] * canvas_w,
            data['vectorY'] * canvas_h
        );

        // Display of cut image
        $(dispImageSelector).attr("src", canvas.toDataURL());

        ctx.restore();
    }
}