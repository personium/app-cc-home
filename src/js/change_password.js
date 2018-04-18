var chg_pass = {};

addLoadScript = function (scriptList) {
    return scriptList;
}
addLoadStyleSheet = function (styleList) {
    return styleList;
}

function init() {
    ut.loadStyleSheet();
    ut.loadScript(function () {
        chg_pass.appendEvent();
    });
}

chg_pass.appendEvent = function () {
    $("#editNewPassword").blur(function () {
        cm.charCheck($(this), '#editChangeMessage');
    });
    $("#editConfirmPassword").blur(function () {
        cm.changePassCheck($('#editNewPassword').val(), $('#editConfirmPassword').val(), '#editConfirmMessage');
    });
    $(".ok-btn").click(function () {
        cm.logout();
    });
}

chg_pass.changePassword = function () {
    let newpass = $('#editNewPassword').val();
    let confirm = $('#editConfirmPassword').val()
    if (cm.changePassCheck(newpass, confirm, '#editConfirmMessage')) {
        $('#confirmMessage').html("");
        personium.changePassAPI(cm.getMyCellUrl(), cm.getAccessToken(), newpass).done(function (data) {
            $('.single-btn-modal').modal('show');
        }).fail(function (data) {
            var res = JSON.parse(data.responseText);
            alert("An error has occurred.\n" + res.message.value);
        });
    }
};