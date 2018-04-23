var app_manage = {};

addLoadScript = function (scriptList) {
    return scriptList;
}
addLoadStyleSheet = function (styleList) {
    return styleList;
}

function init() {
    ut.loadStyleSheet();
    ut.loadScript(function () {
        cm.createBackMenu("main.html", true);
    });
}