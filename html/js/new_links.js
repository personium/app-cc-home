var new_links = {};

// Load new_links screen
new_links.loadNewLinks = function () {
    personium.loadContent(homeAppUrl + appUseBox + "/html/new_links.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        new_links.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

new_links.init = function () {
    // Initialization
    new_links.links_list = [];
    new_links.Add_Search_Event();
}
/**
   * Add_Check_Mark
   * param:none
   */
new_links.Add_Check_Mark = function () {
    $('.pn-check-list').off().click(function (event) {
        //CASE: icon list
        if ($(this).parents('#icon-check-list').length != 0) {
            $(this).find('.pn-icon-check').toggle();
            if ($(this).find('.pn-icon-check').is(":visible")) {
                new_links.links_list.push($(this).find(".external-url").text());
            } else {
                let listNo = $.inArray($(this).find(".external-url").text(), new_links.links_list);
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
    $("#inputSearch").keypress(function (e) {
        e = e ? e : event;
        var keyCode = e.charCode ? e.charCode : ((e.which) ? e.which : e.keyCode);
        var elem = e.target ? e.target : e.srcElement;
        // KeyCode:13 = Enter
        if (Number(keyCode) == 13) {
            $('.pn-search-btn').click();
            return false;
        }
    });
}
new_links.searchCells = function (searchVal) {
    let urlCnv = ut.changeLocalUnitToUnitUrl(searchVal);
    let cellName = "";
    if (urlCnv.startsWith("http://") || urlCnv.startsWith("https://")) {
        personium.getCell(urlCnv).done(function (cellObj) {
            cellName = cellObj.cell.name;
        }).fail(function (xmlObj) {
            if (xmlObj.status == "200" || xmlObj.status == "412") {
                cellName = ut.getName(urlCnv);
            }
        }).always(function () {
            if (cellName !== "") {
                // Profile Modal Disp
                var profObj = {
                    DisplayName: cellName,
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
                    var transName = urlParse.attr('host').replace(/\./g, "") + "_" + cellName;
                    cm.i18nAddProfile("en", "profTrans", transName, profObj, urlCnv, "profile");
                    cm.i18nAddProfile("ja", "profTrans", transName, profObj, urlCnv, "profile");

                    new_links.displayExtCellInfo(profTrans + ":" + transName, urlCnv);
                    $("#cellList_" + profTrans + transName).css("display", "block");
                    new_links.Add_Check_Mark();
                });
            } else {
                // Messages not found if not found
                new_links.displayNotExtCellList();
            }
        });
    } else {
        // Search from library
        let res;
        new_links.searchDirectoryAPI(searchVal).done(function (data) {
            res = data.d.results;
            res.sort(function (val1, val2) {
                return (val1.url > val2.url ? 1 : -1);
            });
        }).always(function (data) {
            if (res && res.length > 0) {
                for (var i in res) {
                    new_links.displayDirectoryCellList(res[i].url);
                }
            } else {
                // Messages not found if not found
                new_links.displayNotExtCellList();
            }
        })
    }
}
new_links.displayDirectoryCellList = function (url) {
    let urlCnv = ut.changeLocalUnitToUnitUrl(url);
    let cellName = "";
    personium.getCell(urlCnv).done(function (cellObj) {
        cellName = cellObj.cell.name;
    }).fail(function (xmlObj) {
        if (xmlObj.status == "200" || xmlObj.status == "412") {
            cellName = ut.getName(urlCnv);
        }
    }).always(function () {
        if (cellName !== "") {
            var profTrans = "profTrans";
            var urlParse = $.url(urlCnv);
            var transName = urlParse.attr('host').replace(/\./g, "") + "_" + cellName;
            if ($("#cellList_" + profTrans + transName).length) return;
            new_links.displayExtCellInfo(profTrans + ":" + transName, urlCnv);
            new_links.Add_Check_Mark();

            // Profile Modal Disp
            var profObj = {
                DisplayName: cellName,
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
        }
    })
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
        $('#notSelect_modal').modal('show');
        return;
    }

    let addCnt = 0;
    for (var i in new_links.links_list) {
        addCnt++;
        let url = new_links.links_list[i];

        new_links.createExtCell(url, addCnt);
    }
}
new_links.createExtCell = function (url, count) {
    let cellName = "";
    let unitUrl = "";
    personium.getCell(url).done(function (cellObj, status, xhr) {
        cellName = cellObj.cell.name;
        let ver = xhr.getResponseHeader("x-personium-version");
        if (ver >= "1.7.1") {
            unitUrl = cellObj.unit.url;
        } else {
            var i = url.indexOf("/"); // first slash
            i = url.indexOf("/", i + 2);  // second slash
            unitUrl = url.substring(0, i + 1);
        }
    }).fail(function (xmlObj) {
        cellName = ut.getName(url);
        var i = url.indexOf("/"); // first slash
        i = url.indexOf("/", i + 2);  // second slash
        unitUrl = url.substring(0, i + 1);
    }).always(function () {
        var linksUrl = ut.changeUnitUrlToLocalUnit(url, cellName, unitUrl);
        var jsonData = {
            "Url": linksUrl
        };
        personium.restCreateExtCellAPI(cm.getMyCellUrl(), cm.getAccessToken(), jsonData).done(function (data) {
            
        }).fail(function (data) {
            var res = JSON.parse(data.responseText);
            if (res.code.indexOf("PR409") >= 0) {
                // Ignore the collision error
            } else {
                alert("An error has occurred.\n" + res.message.value);
            }
        }).always(function () {
            let listLen = new_links.links_list.length;
            if (count >= listLen) {
                links.init();
                personium.backSubContent();
            }
        });
    })
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