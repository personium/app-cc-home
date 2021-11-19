var edit_account = {};

// Load edit_account screen
edit_account.loadEditAccount = function () {
    personium.loadContent(homeAppUrl + appUseBox + "/html/edit_account.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        edit_account.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

edit_account.init = function() {
    edit_account.appendEvent();
    $("#editAccountName").val(sessionStorage.getItem("accountName"));
}

edit_account.appendEvent = function () {
    $("#editAccountName").blur(function () {
        edit_account.addAccountNameBlurEvent();
    });
    if (sessionStorage.getItem("accountType") == "basic") {
        $("#editAccountName").attr("placeholder", i18next.t("accountNamePlaceHolder"));
        $("#editNewPassword").blur(function () {
            cm.charCheck($(this), '#editChangeMessage');
        });
        $("#editConfirmPassword").blur(function () {
            cm.changePassCheck($('#editNewPassword').val(), $('#editConfirmPassword').val(), '#editConfirmMessage');
        });
    } else {
        $("#editAccountName").attr("placeholder", i18next.t("gmailPlaceHolder"));
        $("#editNewPassword").parents("li").hide();
        $("#editConfirmPassword").parents("li").hide();
    }
}

edit_account.addAccountNameBlurEvent = function () {
    var name = $("#editAccountName").val();
    var nameSpan = "popupEditAccountNameErrorMsg";
    if (sessionStorage.getItem("accountType") == "basic") {
        cm.validateName(name, nameSpan, "-_!\$\*=^`\{\|\}~.@", "");
    } else {
        cm.validateMail(name, nameSpan);
    }

};

edit_account.editAccount = function () {
    let keyName = sessionStorage.getItem("accountName");
    let authType = sessionStorage.getItem("accountType");;
    var name = $("#editAccountName").val();
    var jsonData = {
        "Name": name,
        "Type": authType
    };

    let pass = null;
    if (authType == "basic") {
        if (!cm.validateName(name, "popupEditAccountNameErrorMsg", "-_!\$\*=^`\{\|\}~.@", "")) {
            return false;
        }
        pass = $("#editNewPassword").val();

        if (cm.passInputCheck(pass, "")) {
            if (!cm.changePassCheck(pass, $("#editConfirmPassword").val(), "#editConfirmMessage")) {
                return false;
            }
        }
        
    } else {
        if (!cm.validateMail(name, "popupAddAccountNameErrorMsg")) {
            return false;
        }
    }

        edit_account.restEditAccountAPI(jsonData, $("#editNewPassword").val(), keyName);
    return false;
};

edit_account.restEditAccountAPI = function (json, pass, updUser) {
    var headers = {};
    headers["Authorization"] = 'Bearer ' + cm.getAccessToken();
    if (pass && pass.length > 0) {
        headers["X-Personium-Credential"] = pass;
    }
    $.ajax({
        type: "PUT",
        url: cm.getMyCellUrl() + '__ctl/Account(\'' + updUser + '\')',
        data: JSON.stringify(json),
        headers: headers
    }).done(function (data) {
        account.createAccountList();
        personium.backSubContent();
    }).fail(function (data) {
        var res = JSON.parse(data.responseText);
        alert("An error has occurred.\n" + res.message.value);
    });
};