var sel_accType = {};

// Load select_accounttype screen
sel_accType.loadSelectAccountType = function () {
    personium.loadContent(homeAppUrl + appUseBox + "/html/select_accounttype.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

sel_accType.dispPasswordAccount = function () {
    sessionStorage.setItem("accountType", "basic");
    new_account.loadNewAccount();
};

sel_accType.dispGoogleAccount = function () {
    sessionStorage.setItem("accountType", "oidc:google");
    new_account.loadNewAccount();
};