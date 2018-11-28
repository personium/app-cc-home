var app_manage = {};

// Load app_manage screen
chg_lang.loadAppManage = function () {
    personium.loadContent(homeAppUrl + "__/html/application_management.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

app_manage.openBoxInstall = function () {
    html = [
        '<header>',
            '<a class="header-btn pn-back-btn pn-btn" href="javascript:void(0)" onclick="personium.backSubContent();">',
                '<i id="back_btn" class="fas fa-angle-left fa-2x header-ic-01"></i>',
            '</a>',
            '<span data-i18n="BoxInstall"></span>',
        '</header>',
        '<main>',
        '<div class="modal-body">',
        '<div>',
        '<span data-i18n="BoxInstall" style="margin-right:10px;"></span>',
        '<input id="boxInstallSwitch" style="margin-left: auto;" type="checkbox">',
        '</div>',
        '<div>',
        '<p class="text-danger" id="boxInsWarningMsg" data-i18n="warningBoxInstallNotAllowed"></p>',
        '</div>',
        '<div class="container" id="dvBoxInstall" style="display:none;">',
        '<div class="row">',
        '<div class="col-3 col-sm-1">',
        '<div style="margin-top:10px;">',
        '<input type="radio" value="typeSelect" name="boxInsType" id="boxInsType_select" checked>',
        '</div>',
        '</div>',
        '<div class="col-9 col-sm-11">',
        '<fieldset id="boxInsSelect">',
        '<input class="resetField" type="file" class="fileUpload" onchange="app_manage.attachBarFile();" id="selectBarFile" accept="bar/*" style="display: none">',
        '<button class="btn btn-primary" id="selectBarButton" type="button" data-i18n="SelectBar"></button>',
        '<label id="selectBarFileLbl" style="margin-left:10px;"></label>',
        '</fieldset>',
        '<span id="selectBarErrorMsg" style="color:red"></span>',
        '</div>',
        '</div>',
        '<div class="row">',
        '<div class="col-3 col-sm-1">',
        '<div style="margin-top:15px;">',
        '<input type="radio" value="typeInput" name="boxInsType" id="boxInsType_input">',
        '</div>',
        '</div>',
        '<div class="col-9 col-sm-11">',
        '<fieldset id="boxInsInput" disabled>',
        '<input class="resetField" type="text" value="" id="input_barUrl" onblur="app_manage.inputBarUrlBlurEvent();" data-i18n="[placeholder]barfileUrlInput">',
        '</fieldset>',
        '<span id="inputBarErrorMsg" style="color:red"></span>',
        '</div>',
        '</div>',
        '<div class="row">',
        '<div class="col-3 col-sm-1">',
        '<div style="margin-top:15px;" data-i18n="BoxName">',
        '</div>',
        '</div>',
        '<div class="col-9 col-sm-11">',
        '<input class="resetField" type="text" value="" id="inputBoxName" onblur="app_manage.inputBoxNameBlurEvent();">',
        '<span id="inputBoxErrorMsg" style="color:red"></span>',
        '</div>',
        '</div>',
        '<div class="row">',
        '<button type="button" id="unofficialBoxInsBtn" class="btn btn-primary text-capitalize" data-i18n="Install" onClick="app_manage.unofficialBoxInstall();" disabled>',
        '</div>',
        '<div>',
        '<hr />',
        '<span data-i18n="Status"></span>',
        '</div>',
        '<div class="container" id="installStatus">',
        '</div>',
        '</div>',
        '</div>',
        '</main>'
    ].join("");

    let id = personium.createSubContent(html);
    $("#boxInstallSwitch").bootstrapSwitch();
    if (cm.user.boxInstallAuth) {
        $("#boxInstallSwitch").bootstrapSwitch("state", cm.user.boxInstallAuth);
        $("#boxInsWarningMsg").attr("data-i18n", "warningBoxInstallAllow").localize();
        $("#dvBoxInstall").css("display", "block");
    }

    // set events
    $("#boxInstallSwitch").on('switchChange.bootstrapSwitch', function (event, state) {
        $("#dvBoxInstall").toggle(state);
        cm.user.boxInstallAuth = state;
        sessionStorage.setItem("sessionData", JSON.stringify(cm.user));
        if (state) {
            $("#boxInsWarningMsg").attr("data-i18n", "warningBoxInstallAllow").localize();
        } else {
            $("#boxInsWarningMsg").attr("data-i18n", "warningBoxInstallNotAllowed").localize();
        }

    });
    $("input[name=boxInsType]").change(function () {
        if ($("input[name=boxInsType]:checked").val() == "typeSelect") {
            // select bar file
            $("#boxInsSelect").attr("disabled", false);
            $("#boxInsInput").attr("disabled", true);
            $("#selectBarErrorMsg").css("display", "block");
            $("#inputBarErrorMsg").css("display", "none");
        } else {
            // input bar file
            $("#boxInsSelect").attr("disabled", true);
            $("#boxInsInput").attr("disabled", false);
            $("#selectBarErrorMsg").css("display", "none");
            $("#inputBarErrorMsg").css("display", "block");
        }
        app_manage.checkUnofficialBoxInsConditions();
    });
    $("#selectBarButton,#selectBarFileLbl").on('click', function () {
        $("#selectBarFile").click();
    });

    // box Installation status display
    var insArray = sessionStorage.getItem("insBarList");
    if (insArray) {
        insArray = JSON.parse(insArray);
        for (var no in insArray) {
            var boxname = insArray[no];
            var html = [
                '<div class="row">',
                '<div class="col-6 barEllipsis" title="' + boxname + '">',
                no + '. ' + boxname,
                '</div>',
                '<div class="col-6 barEllipsis" id="boxIns_' + boxname + '" data-no="' + no + '">',
                '</div>',
                '</div>'
            ].join("");
            $("#installStatus").append(html);
            app_manage.dispUnofficialBoxInsProgress(boxname);
        }
    }

    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
}

app_manage.unofficialBoxInstall = function () {
    var boxName = $("#inputBoxName").val();
    if (!$("#inputBoxName").val()) {
        // Box name not entered
        app_manage.displayUnofficialBoxInsMsg("inputBoxErrorMsg", "pleaseEnterName");
        return;
    }

    if ($("input[name=boxInsType]:checked").val() == "typeSelect") {
        // select
        if (app_manage.barFileArrayBuffer) {
            app_manage.execUnofficialBoxInstall();
        } else {
            // File not selected
            app_manage.displayUnofficialBoxInsMsg("selectBarErrorMsg", "errorBarFileNotSelected");
        }
    } else {
        // input
        var url = $("#input_barUrl").val();
        if (url && boxName) {
            var barFilePath = url;
            var oReq = new XMLHttpRequest();
            oReq.open("GET", barFilePath);
            oReq.responseType = "arraybuffer";
            oReq.setRequestHeader("Content-Type", "application/zip");
            oReq.onload = function (e) {
                app_manage.barFileArrayBuffer = oReq.response;
                app_manage.execUnofficialBoxInstall();
            }
            oReq.send();
        } else {
            // bar File URL is not entered
            app_manage.displayUnofficialBoxInsMsg("inputBarErrorMsg", "errorBarFileUrlNotEntered");
        }
    }
}

app_manage.checkUnofficialBoxInsConditions = function () {
    var insFlg = true;
    if ($("input[name=boxInsType]:checked").val() == "typeSelect") {
        // select bar file
        if ($("#selectBarErrorMsg").html()) {
            insFlg = false;
        }
        if (!app_manage.barFileArrayBuffer) {
            insFlg = false;
        }
    } else {
        // input bar file
        if ($("#inputBarErrorMsg").html()) {
            insFlg = false;
        }
        if (!$("#input_barUrl").val()) {
            insFlg = false;
        }
    }
    if ($("#inputBoxErrorMsg").html()) {
        insFlg = false;
    }

    if (insFlg) {
        $("#unofficialBoxInsBtn").prop("disabled", false);
    } else {
        $("#unofficialBoxInsBtn").prop("disabled", true);
    }
}

app_manage.attachBarFile = function () {
    $("#selectBarErrorMsg").empty();
    app_manage.barFileArrayBuffer = null;
    var file = document.getElementById("selectBarFile").files[0];
    var fileUrl = document.getElementById("selectBarFile").value;
    if (app_manage.checkBarUrl(fileUrl)) {
        try {
            var reader = new FileReader();
        } catch (e) {
            // reading error
            app_manage.displayUnofficialBoxInsMsg("selectBarErrorMsg", "errorReadingFile");
            return;
        }
        reader.readAsArrayBuffer(file);
        reader.onload = function (evt) {
            app_manage.barFileArrayBuffer = evt.target.result;
            $("#selectBarFileLbl").html(fileUrl);
            $("#inputBoxName").val(ut.getName(fileUrl, true));
            app_manage.checkUnofficialBoxInsConditions();
        }
        reader.onerror = function (evt) {
            // reading error
            app_manage.displayUnofficialBoxInsMsg("selectBarErrorMsg", "errorReadingFile");
        }
    } else {
        // FileFormat error
        app_manage.displayUnofficialBoxInsMsg("selectBarErrorMsg", "errorFileFormat");
    }
}

app_manage.checkBarUrl = function (fileUrl) {
    var fileName = ut.getName(fileUrl);
    var ext = _.last(_.compact(fileName.split("\.")));
    if ("bar" == ext) {
        return true;
    } else {
        return false;
    }
}

app_manage.displayUnofficialBoxInsMsg = function (id, msgId) {
    $("#" + id).attr("data-i18n", msgId).localize();
    $("#unofficialBoxInsBtn").prop("disabled", true);
}

app_manage.execUnofficialBoxInstall = function () {
    var view = new Uint8Array(app_manage.barFileArrayBuffer);
    var blob = new Blob([view], { "type": "application/zip" });
    var boxName = $("#inputBoxName").val();
    $.ajax({
        type: "MKCOL",
        url: cm.user.cellUrl + boxName + '/',
        data: blob,
        processData: false,
        headers: {
            'Authorization': 'Bearer ' + cm.user.access_token,
            'Content-type': 'application/zip'
        }
    }).done(function (data) {
        var insArray = sessionStorage.getItem("insBarList");
        if (!insArray) {
            insArray = [];
        } else {
            try {
                insArray = JSON.parse(insArray);
            } catch (e) {
                console.log(e);
            }
        }
        var no = insArray.length;

        // Add installation list
        var html = [
            '<div class="row">',
            '<div class="col-6 barEllipsis" title="' + boxName + '">',
            no + '. ' + boxName,
            '</div>',
            '<div class="col-6 barEllipsis" id="boxIns_' + boxName + '" data-no="' + no + '">',
            '</div>',
            '</div>'
        ].join("");
        $("#installStatus").append(html);
        app_manage.dispUnofficialBoxInsProgress(boxName);
        insArray.push(boxName);
        sessionStorage.setItem("insBarList", JSON.stringify(insArray));

    }).fail(function (data) {
        // box installation failure
        var res = JSON.parse(data.responseText);
        alert("An error has occurred.\n" + res.message.value);
    }).always(function (data) {
        app_manage.resetInputFields();
    });
}

app_manage.resetInputFields = function () {
    $("#dvBoxInstall .resetField").val("");
    $("#selectBarFileLbl").empty();
    app_manage.barFileArrayBuffer = null;
    $("#boxInsType_select").click();
}

app_manage.dispUnofficialBoxInsProgress = function (boxname) {
    var no = $("#boxIns_" + boxname).data("no");
    personium.getBoxStatus(cm.getMyCellUrl(), cm.getAccessToken(), boxname).done(function (boxObj) {
        var data = boxObj.box;
        if (!data) {
            data = boxObj;
        }
        var status = data.status;
        var resHtml = "";
        if (status.indexOf('ready') >= 0) {
            // ready
            resHtml = "<span data-i18n='Success'></span>";
            if (typeof (ha) != "undefined") {
                // Redraw the application list if it is the main screen
                // Register Schema Profile in data-i18n
                cm.i18nSetBox();
                cm.i18nSetRole();
                ha.dispInsAppList();
            }
        } else if (status.indexOf('progress') >= 0) {
            // progress
            resHtml = [
                '<div id="boxInsParent_' + no + '" class="progress progress-striped active">',
                '<div id="nowInstall_' + no + '" class="progress-bar progress-bar-success" style="width: ' + data.progress + ';">',
                '</div>',
                '</div>',
            ].join("");
        } else {
            // failed
            resHtml = "<span data-i18n='Failed' title='" + boxObj.box.message.message.value + "'></span>";
        }

        $("#boxIns_" + boxname).html(resHtml).localize();
        if (status.indexOf('progress') >= 0) {
            setTimeout(function () { app_manage.updateUnofficialBoxInsProgress(no) }, 1000);
        }
    }).fail(function (data) {
        if (data.status == "404") {
            // Box Not Found
            resHtml = "<span data-i18n='[title]errorBoxStatusNotFound'><span data-i18n='errorBoxStatusNotFound'></span></span>";
            $("#boxIns_" + boxname).html(resHtml).localize();
        } else {
            // Communication error
            resHtml = "<span data-i18n='[title]errorBoxStatusCommunication'><span data-i18n='errorBoxStatusCommunication'></span></span>";
            $("#boxIns_" + boxname).html(resHtml).localize();
        }
    })
}

app_manage.updateUnofficialBoxInsProgress = function (no) {
    var insArray = JSON.parse(sessionStorage.getItem("insBarList"));
    personium.getBoxStatus(cm.getMyCellUrl(), cm.getAccessToken(), insArray[no]).done(function (boxObj) {
        var data = boxObj.box;
        if (!data) {
            data = boxObj;
        }
        var status = data.status;
        if (status.indexOf('ready') >= 0) {
            $("#boxInsParent_" + no).remove();
            var html = "<span data-i18n='Success'></span>";
            $("#boxIns_" + insArray[no]).html(html).localize();
            if (typeof (ha) != "undefined") {
                // Redraw the application list if it is the main screen
                // Register Schema Profile in data-i18n
                cm.i18nSetBox();
                cm.i18nSetRole();
                ha.dispInsAppList();
            }
        } else if (status.indexOf('progress') >= 0) {
            $('#nowInstall_' + no).css("width", data.progress);
            setTimeout(function () { app_manage.updateUnofficialBoxInsProgress(no) }, 1000);
        } else {
            $('#boxInsParent_' + no).remove();
            var html = "<span data-i18n='Failed' title='" + data.message.message.value + "'></span>";
            $("#boxIns_" + insArray[no]).html(html).localize();
        }
    });
};

app_manage.inputBarUrlBlurEvent = function () {
    $("#inputBarErrorMsg").empty();
    var fileUrl = $("#input_barUrl").val();
    if (!fileUrl) {
        app_manage.displayUnofficialBoxInsMsg("inputBarErrorMsg", "barfileUrlInput");
        return;
    }

    if (app_manage.checkBarUrl(fileUrl)) {
        $("#inputBoxName").val(ut.getName(fileUrl, true));
        app_manage.checkUnofficialBoxInsConditions();
    } else {
        // FileFormat error
        app_manage.displayUnofficialBoxInsMsg("inputBarErrorMsg", "errorFileFormat");
    }
}

app_manage.inputBoxNameBlurEvent = function () {
    var name = $("#inputBoxName").val();
    var nameSpan = "inputBoxErrorMsg";
    if (cm.validateName(name, nameSpan, "-_", "")) {
        $("#nameSpan").empty();
        app_manage.checkUnofficialBoxInsConditions();
    } else {
        $("#unofficialBoxInsBtn").prop("disabled", true);
    }
}