var link_info = {};

// Load links_02 screen
link_info.loadLinks02 = function () {
    personium.loadContent(homeAppUrl + appUseBox + "/html/links_02.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        link_info.id = personium.createSubContent(out_html, true);
        link_info.init();
        link_info.Add_Btn_Event();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

link_info.Add_Btn_Event = function () {
    $('#confDeleteLink_modal .ok-btn').off().click(function () {
        link_info.restDeleteExtCellAPI();
    });
    $(link_info.id + ' .header-btn-right').click(function () {
        link_info.confDelete();
    });
}

link_info.init = function () {
    // Initialization
    link_info.extCellUrl = sessionStorage.getItem("extCellUrl");
    link_info.extCellUrl = ut.changeLocalUnitToUnitUrl(link_info.extCellUrl);
    cm.i18nSetTargetProfile(link_info.extCellUrl);
    link_info.displayExtProfile();
}

link_info.displayExtProfile = function () {
    let cellName = "";
    personium.getCell(link_info.extCellUrl).done(function (cellObj) {
        cellName = cellObj.cell.name;
    }).fail(function (xmlObj) {
        cellName = ut.getName(link_info.extCellUrl);
    }).always(function () {
        var transName = cm.getTargetProfTransName(link_info.extCellUrl, cellName);
        $(link_info.id + " header span").attr("data-i18n", "profTrans:" + transName + "_DisplayName").localize();
        $(".user-cell-url").html(link_info.extCellUrl);
        $(".user-description").attr("data-i18n", "profTrans:" + transName + "_Description").localize();
        $(".extcell-profile .user-icon").append('<img class="user-icon-large" data-i18n="[src]profTrans:' + transName + '_Image" src="" alt="user">').localize();
    })
}

link_info.confDelete = function () {
    $("#deleteMessage").html(i18next.t("confirmDeleteExternalCell", { value: link_info.extCellUrl }));
    $('#confDeleteLink_modal').modal('show');
}
link_info.restDeleteExtCellAPI = function () {
    personium.restDeleteExtCellAPI(cm.getMyCellUrl(), cm.getAccessToken(), sessionStorage.getItem("extCellUrl")).done(function (data) {
        links.init();
        $('#confDeleteLink_modal').modal('hide');
        personium.backSubContent();
    }).fail(function (data) {
        var res = JSON.parse(data.responseText);
        alert("An error has occurred.\n" + res.message.value);
    });
};