var chg_pass = {};

// Load change_password screen
chg_pass.loadChangePassword = function () {
    personium.loadContent(homeAppUrl + "html/change_password.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        chg_pass.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

chg_pass.init = function() {
    chg_pass.appendEvent();
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