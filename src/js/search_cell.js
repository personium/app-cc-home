var search_cell = {};
search_cell.links_list = [];

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
    ut.loadScript(search_cell.init);
}

search_cell.init = function () {
    // Initialization
    search_cell.Add_Search_Event();
    // External Cell List
    search_cell.dispExtCellList();
}
/**
   * Add_Check_Mark
   * param:none
   */
search_cell.Add_Check_Mark = function () {
    $('.pn-check-list').click(function (event) {
        //CASE: icon list
        if ($(this).parents('#icon-check-list').length != 0) {
            $(this).find('.pn-icon-check').toggle();
            if ($(this).find('.pn-icon-check').is(":visible")) {
                search_cell.links_list.push($(this).find(".external-url").html());
            } else {
                let listNo = $.inArray($(this).find(".external-url").html(), search_cell.links_list);
                if (listNo >= 0) {
                    search_cell.links_list.splice(listNo, 1);
                }
            }
        }
    });
}
search_cell.Add_Search_Event = function () {
    $('.pn-search-btn').click(function () {
        $("#icon-check-list ul").empty();
        // select reset
        search_cell.links_list = [];
        search_cell.searchCells($("#inputSearch").val());
        //search_cell.displayNotExtCellList();
    });
}
search_cell.dispExtCellList = function (searchVal) {
    $("#icon-check-list ul").empty();
    personium.getExtCellList(cm.getMyCellUrl(), cm.getAccessToken(), searchVal).done(function (data) {
        let results = data.d.results;
        if (results.length == 0) {
            // 無ければ見つからないメッセージ
            search_cell.displayNotExtCellList();
        }

        results.sort(function (val1, val2) {
            return (val1.Url < val2.Url ? 1 : -1);
        })
        for (var i = 0; i < results.length; i++) {
            let extCellUrl = results[i].Url;
            search_cell.displayCell(extCellUrl);
        }
        search_cell.Add_Check_Mark();
    });
}
search_cell.displayCell = function (url) {
    let urlCnv = ut.changeLocalUnitToUnitUrl(url);

    var profTrans = "profTrans";
    var urlParse = $.url(urlCnv);
    var cellName = ut.getName(urlCnv);
    var transName = urlParse.attr('host').replace(/\./g, "") + "_" + cellName;
    if ($("#cellList_" + profTrans + transName).length) return;

    search_cell.displayExtCellInfo(profTrans + ":" + transName, urlCnv);
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
search_cell.searchCells = function (searchVal) {
    if (searchVal) {
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

                search_cell.displayExtCellInfo(profTrans + ":" + transName, urlCnv);
                $("#cellList_" + profTrans + transName).css("display", "block");
                search_cell.Add_Check_Mark();
            });
        }).fail(function () {
            // 外部セルから検索
            search_cell.dispExtCellList(searchVal);
        });
    } else {
        search_cell.dispExtCellList();
    }
}
search_cell.displayExtCellInfo = function (transName, url) {
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
search_cell.displayNotExtCellList = function () {
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
search_cell.addExternalCell = function () {
    let cellList = [];
    let addList = search_cell.links_list;
    if (addList.length == 0) {
        $(".single-btn-modal").modal("show");
        return;
    }

    if (sessionStorage.getItem("sendMsgList")) {
        cellList = JSON.parse(sessionStorage.getItem("sendMsgList"));
    }
    for (var i in addList) {
        cellList.push(addList[i]);
    }
    $.uniqueSort(cellList);
    cellList.sort(function (val1, val2) {
        return (val1 < val2 ? 1 : -1);
    });
    sessionStorage.setItem("sendMsgList", JSON.stringify(cellList));
    location.href = "create_message.html";
}