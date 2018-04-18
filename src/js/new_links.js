var new_links = {};
new_links.links_list = [];

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
    ut.loadScript(new_links.init);
}

new_links.init = function () {
    // Initialization
    new_links.Add_Search_Event();
}
/**
   * Add_Check_Mark
   * param:none
   */
new_links.Add_Check_Mark = function () {
    $('.pn-check-list').click(function (event) {
        //CASE: icon list
        if ($(this).parents('#icon-check-list').length != 0) {
            $(this).find('.pn-icon-check').toggle();
            if ($(this).find('.pn-icon-check').is(":visible")) {
                new_links.links_list.push($(this).find(".external-url").html());
            } else {
                let listNo = $.inArray($(this).find(".external-url").html(), new_links.links_list);
                if (listNo >= 0) {
                    new_links.links_list.splice(listNo, 1);
                }
            }
        }
    });
}
new_links.Add_Search_Event = function () {
    $('.pn-search-btn').click(function () {
        $("#icon-check-list ul").empty();
        // select reset
        new_links.links_list = [];
        new_links.searchCells($("#inputSearch").val());
        //new_links.displayNotExtCellList();
    });
}
new_links.searchCells = function (searchVal) {
    let urlCnv = ut.changeLocalUnitToUnitUrl(searchVal);
    personium.getCell(urlCnv).done(function () {
        // Profile Modal Disp
        var profObj = {
            DisplayName: ut.getName(urlCnv),
            Description: "",
            Image: ut.getJdenticon(urlCnv)
        }
        personium.getProfile(urlCnv).done(function (prof) {
            // Profile Modal Settings
            if (prof) {
                profObj.DisplayName = _.escape(prof.DisplayName);
                profObj.Description = _.escape(prof.Description);
                if (prof.Image) {
                    profObj.Image = prof.Image;
                }
            }
        }).always(function () {
            var profTrans = "profTrans";
            var urlParse = $.url(urlCnv);
            var cellName = ut.getName(urlCnv);
            var transName = urlParse.attr('host').replace(/\./g, "") + "_" + cellName;
            cm.i18nAddProfile("en", "profTrans", transName, profObj, urlCnv, "profile");
            cm.i18nAddProfile("ja", "profTrans", transName, profObj, urlCnv, "profile");

            new_links.displayExtCellInfo(profTrans + ":" + transName, urlCnv);
            $("#cellList_" + profTrans + transName).css("display", "block");
            new_links.Add_Check_Mark();
        });
    }).fail(function () {
        // ライブラリから検索
        new_links.searchDirectoryAPI(searchVal).done(function (data) {
            let res = data.d.results;
            res.sort(function (val1, val2) {
                return (val1.url > val2.url ? 1 : -1);
            });
            for (var i in res) {
                new_links.displayDirectoryCellList(res[i].url);
            }
            new_links.Add_Check_Mark();
        }).fail(function (data) {
            // 無ければ見つからないメッセージ
            new_links.displayNotExtCellList();
        })
    });
}
new_links.displayDirectoryCellList = function (url) {
    let urlCnv = ut.changeLocalUnitToUnitUrl(url);

    var profTrans = "profTrans";
    var urlParse = $.url(urlCnv);
    var cellName = ut.getName(urlCnv);
    var transName = urlParse.attr('host').replace(/\./g, "") + "_" + cellName;
    if ($("#cellList_" + profTrans + transName).length) return;

    new_links.displayExtCellInfo(profTrans + ":" + transName, urlCnv);
    personium.getCell(urlCnv).done(function () {
        // Profile Modal Disp
        var profObj = {
            DisplayName: ut.getName(urlCnv),
            Description: "",
            Image: ut.getJdenticon(urlCnv)
        }
        personium.getProfile(urlCnv).done(function (prof) {
            // Profile Modal Settings
            if (prof) {
                profObj.DisplayName = _.escape(prof.DisplayName);
                profObj.Description = _.escape(prof.Description);
                if (prof.Image) {
                    profObj.Image = prof.Image;
                }
            }
        }).always(function () {
            cm.i18nAddProfile("en", "profTrans", transName, profObj, urlCnv, "profile");
            cm.i18nAddProfile("ja", "profTrans", transName, profObj, urlCnv, "profile");

            $("#cellList_" + profTrans + transName).css("display", "block");
        });
    }).fail(function (data) {
        $("#cellList_" + profTrans + transName).remove();
    });
}
new_links.displayExtCellInfo = function (transName, url) {
    let html = [
        '<li class="pn-check-list" id="cellList_' + transName.replace(":", "") + '" style="display:none;">',
            '<div class="pn-list pn-list-no-arrow">',
                '<div class="pn-list-icon">',
                    '<div class="pn-icon-check">',
                        '<i class="fas fa-check"></i>',
                    '</div>',
                    '<img data-i18n="[src]' + transName + '_Image" alt="">',
                '</div>',
                '<div class="account-info">',
                    '<div class="user-name" data-i18n="' + transName + '_DisplayName"></div>',
                    '<div>',
                        '<span class="external-url">' + url + '</span>',
                    '</div>',
                '</div>',
            '</div>',
        '</li>'
    ].join("");
    $("#icon-check-list ul").append(html).localize();
}
new_links.displayNotExtCellList = function () {
    let html = [
        '<li>',
            '<div class="pn-list pn-list-no-arrow">',
                '<div class="pn-list-icon">',
                    '<div class="pn-icon-check">',
                        '<i class="fas fa-check"></i>',
                    '</div>',
                '</div>',
                '<div class="account-info">',
                    '<div class="user-name" data-i18n="notExistTargetCell"></div>',
                '</div >',
            '</div > ',
        '</li > '
    ].join("");
    $("#icon-check-list ul").append(html).localize();
}
new_links.addExternalCell = function () {
    let listLen = new_links.links_list.length;
    if (listLen == 0) {
        $('.single-btn-modal').modal('show');
        return;
    }

    let addCnt = 0;
    for (var i in new_links.links_list) {
        let url = new_links.links_list[i];
        var linksUrl = ut.changeUnitUrlToLocalUnit(url);
        var jsonData = {
            "Url": linksUrl
        };
        personium.restCreateExtCellAPI(cm.getMyCellUrl(), cm.getAccessToken(), jsonData).done(function (data) {
            addCnt++;
        }).fail(function (data) {
            var res = JSON.parse(data.responseText);
            if (res.code.indexOf("PR409") >= 0) {
                // 衝突エラーは無視
                addCnt++;
            } else {
                alert("An error has occurred.\n" + res.message.value);
            }
        }).always(function () {
            if (addCnt >= listLen) {
                location.href = "links.html";
            }
        });
    }
}
new_links.searchDirectoryAPI = function (searchVal) {
    return $.ajax({
        type: "GET",
        url: "https://demo.personium.io/directory/app-uc-directory/OData/directory?$filter=substringof%28%27" + searchVal + "%27%2CalternateName%29+or+substringof%28%27" + searchVal + "%27%2Curl%29",
        datatype: "json",
        headers: {
            "Accept": "application/json"
        }
    });
}