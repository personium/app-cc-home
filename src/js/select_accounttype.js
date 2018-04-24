var sel_accType = {};

addLoadScript = function (scriptList) {
    scriptList.push("https://cdn.jsdelivr.net/npm/jdenticon@1.8.0");
    return scriptList;
}
addLoadStyleSheet = function (styleList) {
    return styleList;
}

function init() {
    ut.loadStyleSheet();
    ut.loadScript(function () {
    });
}

sel_accType.dispPasswordAccount = function () {
    sessionStorage.setItem("accountType", "basic");
    location.href = "new_account.html";
};

sel_accType.dispGoogleAccount = function () {
    sessionStorage.setItem("accountType", "oidc:google");
    location.href = "new_account.html";
};