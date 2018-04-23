var links = {};

addLoadScript = function (scriptList) {
    scriptList.push("https://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.3.1/purl.min.js");
    scriptList.push("https://cdn.jsdelivr.net/npm/jdenticon@1.8.0");
    return scriptList;
}
addLoadStyleSheet = function (styleList) {
    return styleList;
}

/*** new ***/
function init() {
    ut.loadStyleSheet();
    ut.loadScript(links.init);
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
            '<a href="new_links.html">',
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
    var cellName = ut.getName(extCellUrl);
    var profObj = {
        DisplayName: cellName,
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
};
links.appendRelationLinkExtCell = function (extObj, transName, no) {
    let url = ut.changeLocalUnitToUnitUrl(extObj.url);
    let published = extObj.date;

    let linksTag = [
        '<a href="#" onClick="transitionTargetLinks(\'' + extObj.url + '\');">',
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
    location.href = "links_02.html";
};


/*** old ***/