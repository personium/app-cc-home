var edit_account = {};

addLoadScript = function (scriptList) {
    return scriptList;
}
addLoadStyleSheet = function (styleList) {
    return styleList;
}

function init() {
    ut.loadStyleSheet();
    ut.loadScript(function () {
        edit_account.appendEvent();
        $("#editAccountName").val(sessionStorage.getItem("accountName"));
    });
}

edit_account.appendEvent = function () {
    $("#editAccountName").blur(function () {
        edit_account.addAccountNameBlurEvent();
    });
    $("#editNewPassword").blur(function () {
        cm.charCheck($(this), '#editChangeMessage');
    });
    $("#editConfirmPassword").blur(function () {
        cm.changePassCheck($('#editNewPassword').val(), $('#editConfirmPassword').val(), '#editConfirmMessage');
    });
}

edit_account.addAccountNameBlurEvent = function () {
    var name = $("#editAccountName").val();
    var nameSpan = "popupEditAccountNameErrorMsg";
    //if ($("input[name=accType]:checked").val() == "basic") {
        cm.validateName(name, nameSpan, "-_!\$\*=^`\{\|\}~.@", "");
    //} else {
    //    cm.validateMail(name, nameSpan);
    //}

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
    //if (authType == "basic") {
        if (!cm.validateName(name, "popupEditAccountNameErrorMsg", "-_!\$\*=^`\{\|\}~.@", "")) {
            return false;
        }
        pass = $("#editNewPassword").val();

        if (cm.passInputCheck(pass, "")) {
            if (!cm.changePassCheck(pass, $("#editConfirmPassword").val(), "#editConfirmMessage")) {
                return false;
            }
        }
        
    //} else {
    //    if (!cm.validateMail(name, "popupAddAccountNameErrorMsg")) {
    //        return false;
    //    }
    //}

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
        location.href = "account.html";
    }).fail(function (data) {
        var res = JSON.parse(data.responseText);
        alert("An error has occurred.\n" + res.message.value);
    });
};