var links = {};

links.extCellUrl = sessionStorage.getItem("extCellUrl");
if (!links.extCellUrl) {
    location.href = "./links.html";
}
links.extCellUrl = ut.changeLocalUnitToUnitUrl(links.extCellUrl);

addLoadScript = function (scriptList) {
    scriptList.push("https://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.3.1/purl.min.js");
    scriptList.push("https://cdn.jsdelivr.net/npm/jdenticon@1.8.0");
    return scriptList;
}
addLoadStyleSheet = function (styleList) {
    return styleList;
}

function init() {
    ut.loadStyleSheet();
    ut.loadScript(links.init);
}
links.Add_Btn_Event = function () {
    $('.ok-btn').click(function () {
        links.restDeleteExtCellAPI();
    });
    $('.header-btn-right').click(function () {
        links.confDelete();
    });
}

links.init = function () {
    // Initialization
    links.Add_Btn_Event();
    cm.i18nSetTargetProfile(links.extCellUrl);
    links.displayExtProfile();
}

links.displayExtProfile = function () {
    var transName = cm.getTargetProfTransName(links.extCellUrl);
    $("header span").attr("data-i18n", "profTrans:"+transName+"_DisplayName").localize();
    $(".user-cell-url").html(links.extCellUrl);
    $(".user-description").attr("data-i18n", "profTrans:" + transName +"_Description").localize();
    $(".extcell-profile .user-icon").append('<img class="user-icon-large" data-i18n="[src]profTrans:'+transName+'_Image" src="" alt="user">');
}

links.confDelete = function () {
    $("#deleteMessage").html(i18next.t("confirmDeleteExternalCell", { value: links.extCellUrl }));
    $('.double-btn-modal').modal('show');
}
links.restDeleteExtCellAPI = function () {
    personium.restDeleteExtCellAPI(cm.getMyCellUrl(), cm.getAccessToken(), sessionStorage.getItem("extCellUrl")).done(function (data) {
        location.href = "links.html";
    }).fail(function (data) {
        var res = JSON.parse(data.responseText);
        alert("An error has occurred.\n" + res.message.value);
    });
};