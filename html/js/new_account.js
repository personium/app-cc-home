var new_account = {};

// Load new_account screen
new_account.loadNewAccount = function () {
    personium.loadContent(homeAppUrl + "html/new_account.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        new_account.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

new_account.init = function() {
    new_account.appendEvent();
}

new_account.appendEvent = function () {
    $("#addAccountName").blur(function () {
        new_account.addAccountNameBlurEvent();
    });
    if (sessionStorage.getItem("accountType") == "basic") {
        $("#addAccountName").attr("placeholder", i18next.t("accountNamePlaceHolder"));
        $("#addNewPassword").blur(function () {
            cm.charCheck($(this), '#addChangeMessage');
        });
        $("#addConfirmPassword").blur(function () {
            cm.changePassCheck($('#addNewPassword').val(), $('#addConfirmPassword').val(), '#addConfirmMessage');
        });
    } else {
        $("#addAccountName").attr("placeholder", i18next.t("gmailPlaceHolder"));
        $("#addNewPassword").parents("li").hide();
        $("#addConfirmPassword").parents("li").hide();
    }
}

new_account.addAccountNameBlurEvent = function () {
    var name = $("#addAccountName").val();
    var nameSpan = "popupAddAccountNameErrorMsg";
    if (sessionStorage.getItem("accountType") == "basic") {
        cm.validateName(name, nameSpan, "-_!\$\*=^`\{\|\}~.@", "");
    } else {
        cm.validateMail(name, nameSpan);
    }

};

new_account.addAccount = function () {
    var name = $("#addAccountName").val();
    let authType = sessionStorage.getItem("accountType");
    var jsonData = {
        "Name": name,
        "Type": authType
    };

    let pass = null;
    if (authType == "basic") {
        if (!cm.validateName(name, "popupAddAccountNameErrorMsg", "-_!\$\*=^`\{\|\}~.@", "")) {
            return false;
        }
        pass = $("#addNewPassword").val();

        if (!cm.passInputCheck(pass, "#addChangeMessage")) {
            return false;
        }
        if (!cm.changePassCheck(pass, $("#addConfirmPassword").val(), "#addConfirmMessage")) {
            return false;
        }
    } else {
        if (!cm.validateMail(name, "popupAddAccountNameErrorMsg")) {
            return false;
        }
    }

    new_account.restCreateAccountAPI(jsonData, pass);
    return false;
};

new_account.restCreateAccountAPI = function (json, pass) {
    var headerObj = {};
    headerObj.Authorization = 'Bearer ' + cm.getAccessToken();
    if (pass) {
        headerObj["X-Personium-Credential"] = pass;
    }
    $.ajax({
        type: "POST",
        url: cm.getMyCellUrl() + '__ctl/Account',
        data: JSON.stringify(json),
        headers: headerObj
    }).done(function (data) {
        account.createAccountList();
        personium.backSubContent(2);
    }).fail(function (data) {
        var res = JSON.parse(data.responseText);
        alert("An error has occurred.\n" + res.message.value);
    });
};