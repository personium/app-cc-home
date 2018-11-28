var links = {};

// Load links screen
create_msg.loadLinks = function () {
    personium.loadContent(homeAppUrl + appUseBox + "/html/links.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        links.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

links.init = function () {
    // Initialization
    personium.getExtCellList(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
        links.dispExtCellList(data);
    }).fail(function (data) {
    });
}

links.dispExtCellList = function (json) {
    $('#links ul').empty();

    let results = json.d.results;
    results.sort(function (val1, val2) {
        return (val1.Url < val2.Url ? 1 : -1);
    })
    for (var i = 0; i < results.length; i++) {
        $("#links ul").append("<li id='links_" + i + "'></li>");
        let extCellUrl = results[i].Url;
        let published = moment(results[i].__published).format("YYYY/MM/DD");
        let extObj = {
            url: extCellUrl,
            date: published
        }
        links.dispExtCellListProf(extObj, i);
    }
    let addLinksTag = [
        '<li>',
            '<a href="javascript:void(0)" onclick="new_links.loadNewLinks();">',
                '<div class="edit-list">',
                    '<span class="add-member" data-i18n="AddMember"></span>',
                '</div>',
            '</a>',
        '</li>'
    ].join("");
    $("#links ul").append(addLinksTag).localize();
};
links.dispExtCellListProf = function (extObj, no) {
    let extCellUrl = extObj.url;
    // Displace the cell URL with the unit's proper URL. However, when sending to the server, we use "personium-localunit:" URL format.
    var extCellUrlCnv = ut.changeLocalUnitToUnitUrl(extCellUrl);
    let cellName = "";
    let dispCellName = "";
    personium.getCell(extCellUrlCnv).done(function (cellObj) {
        cellName = cellObj.cell.name;
    }).fail(function (xmlObj) {
        cellName = ut.getName(extCellUrlCnv);
        if (xmlObj.status == "200") {
            dispCellName = cellName;
        } else {
            dispCellName = i18next.t("NoTarget");
        }
    }).always(function () {
        var profObj = {
            DisplayName: dispCellName,
            Description: "",
            Image: ut.getJdenticon(extCellUrlCnv)
        }
        personium.getProfile(extCellUrlCnv).done(function (profData) {
            if (profData !== null) {
                profObj.DisplayName = _.escape(profData.DisplayName);
                profObj.Description = _.escape(profData.Description);
                if (profData.Image) {
                    profObj.Image = profData.Image;
                }
            }
        }).always(function () {
            var profTrans = "profTrans";
            var urlParse = $.url(extCellUrlCnv);
            var transName = urlParse.attr('host') + "_" + cellName;
            cm.i18nAddProfile("en", profTrans, transName, profObj, extCellUrlCnv, "profile", null);
            cm.i18nAddProfile("ja", profTrans, transName, profObj, extCellUrlCnv, "profile", null);
            links.appendRelationLinkExtCell(extObj, profTrans + ":" + transName, no);
        });
    })
};
links.appendRelationLinkExtCell = function (extObj, transName, no) {
    let url = ut.changeLocalUnitToUnitUrl(extObj.url);
    let published = extObj.date;

    let linksTag = [
        '<a href="javascript:void(0)" onClick="transitionTargetLinks(\'' + extObj.url + '\');">',
            '<div class="pn-list">',
                '<div class="pn-list-icon">',
                    '<img data-i18n="[src]' + transName + '_Image">',
                '</div>',
                '<div class="account-info">',
                    '<div class="user-name" data-i18n="' + transName + '_DisplayName"></div>',
                    '<div>',
                        '<span data-i18n="RegistrationDate"></span>',
                        '<span> ' + published + '</span>',
                    '</div>',
                '</div>',
            '</div>',
        '</a>',
    ].join("");
    $("#links_" + no).append(linksTag).localize();
};

function transitionTargetLinks(url) {
    sessionStorage.setItem("extCellUrl", url);
    link_info.loadLinks02();
};
