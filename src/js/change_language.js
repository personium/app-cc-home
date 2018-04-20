var chg_lang = {};

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
        $("#selectLng").val(i18next.language);
        $("#b-setlng-ok").on('click', function () {
            $("#selectLng option:selected").each(function (index, option) {
                i18next.changeLanguage($(option).val())
                cm.moveBackahead(true);
            });
        });
    });
}