var afr = {};

// Load arrow_from_role screen
afr.loadArrowFromRole = function () {
    personium.loadContent(homeAppUrl + appUseBox + "/html/arrow_from_role.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        afr.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

afr.init = function () {
    // Initialization
    afr.linksRoleList = {};
    afr.roleCustom = [];
    afr.extCellUrl = sessionStorage.getItem("extCellUrl");
    afr.extCellUrl = ut.changeLocalUnitToUnitUrl(afr.extCellUrl);

    cm.i18nSetTargetProfile(afr.extCellUrl);

    afr.displayMyImage();
    afr.displayTargetImage();
    afr.displayArrowFromRole();
}

afr.displayMyImage = function () {
    $(".arrow-to-img .font-weight-bold").eq(1).attr("data-i18n", "profTrans:myProfile_DisplayName").localize();
    $(".arrow-to-img .user-icon").eq(1).append('<img class="user-icon-large" data-i18n="[src]profTrans:myProfile_Image" src="" alt="user">');
}
afr.displayTargetImage = function () {
    let cellName = "";
    personium.getCell(afr.extCellUrl).done(function (cellObj) {
        cellName = cellObj.cell.name;
    }).fail(function (xmlObj) {
        cellName = ut.getName(afr.extCellUrl);
    }).always(function () {
        var transName = cm.getTargetProfTransName(afr.extCellUrl, cellName);
        $(".arrow-to-img .font-weight-bold").eq(0).attr("data-i18n", "profTrans:" + transName + "_DisplayName").localize();
        $(".arrow-to-img .user-icon").eq(0).append('<img class="user-icon-large" data-i18n="[src]profTrans:' + transName + '_Image" src="" alt="user">');
    })
}
afr.displayArrowFromRole = function () {
    $("#fromAppendRoleList").empty();
    personium.getTargetToken(cm.getMyCellUrl(), cm.getRefreshToken(), afr.extCellUrl).done(function (extToken) {
        afr.targetAccessToken = extToken.access_token;
        personium.getExtCellLinksRole(afr.extCellUrl, afr.targetAccessToken, cm.getMyCellUrl()).done(function (data) {
            afr.displayLinksRoleList(data);
        }).fail(function () {
            let cellName = "";
            let unitUrl = "";
            personium.getCell(cm.getMyCellUrl()).done(function (cellObj, status, xhr) {
                cellName = cellObj.cell.name;
                let ver = xhr.getResponseHeader("x-personium-version");
                if (ver >= "1.7.1") {
                    unitUrl = cellObj.unit.url;
                } else {
                    var i = cm.getMyCellUrl().indexOf("/"); // first slash
                    i = cm.getMyCellUrl().indexOf("/", i + 2);  // second slash
                    unitUrl = cm.getMyCellUrl().substring(0, i + 1);
                }
            }).fail(function (xmlObj) {
                cellName = ut.getName(cm.getMyCellUrl());
                var i = cm.getMyCellUrl().indexOf("/"); // first slash
                i = cm.getMyCellUrl().indexOf("/", i + 2);  // second slash
                unitUrl = cm.getMyCellUrl().substring(0, i + 1);
            }).always(function () {
                let localUnitCell = ut.changeUnitUrlToLocalUnit(cm.getMyCellUrl(), cellName, unitUrl);
                personium.getExtCellLinksRole(afr.extCellUrl, afr.targetAccessToken, localUnitCell).done(function (data) {
                    afr.displayLinksRoleList(data);
                }).fail(function (data) {
                    console.log(data);
                });
            })
        })
    })
}
afr.displayLinksRoleList = function (data) {
    let res = data.d.results;
    res.sort(function (val1, val2) {
        return (val1["_Box.Name"] > val2["_Box.Name"] ? 1 : -1);
    });
    for (var i in res) {
        let boxName = res[i]["_Box.Name"];
        if (boxName) {
            if (!afr.linksRoleList[boxName]) {
                afr.linksRoleList[boxName] = [];
            }
            afr.linksRoleList[boxName].push(res[i].Name);
        } else {
            afr.roleCustom.push(res[i].Name);
        }
    }
    let no = 0;
    for (var boxName in afr.linksRoleList) {
        afr.displayLinksRole(boxName, afr.linksRoleList[boxName]);
        no++;
    }
    afr.displayLinksRole("", afr.roleCustom);
}
afr.displayLinksRole = function (boxName, roleList) {
    let transDispName = "profTrans:" + boxName + "_DisplayName";
    let transImage = "profTrans:" + boxName + "_Image";
    let roleId = boxName;
    if (!boxName) {
        transDispName = "UserCustomRole";
        transImage = "[src]profTrans:myProfile_Image";
        roleId = "[main]";
    } else {
        // Box Profile
        personium.getBoxInfo(afr.extCellUrl, afr.targetAccessToken, boxName).done(function (data) {
            var BoxInfo = data.d.results;
            var schema = BoxInfo.Schema;
            var boxName = BoxInfo.Name;
            if (schema && schema.length > 0) {
                cm.registerProfI18n(schema, boxName, "profile", "App");
            }
        });
    }

    $("#fromAppendRoleList").append([
        '<div class="title">',
        '<img class="title-icon" data-i18n="[src]' + transImage + '" alt="">',
        '<span style="margin-left:0.43rem;" data-i18n="' + transDispName + '">' + boxName + '</span>',
        '</div>',
        '<div class="role-list thin-border">',
        '<ul id="role_list_' + boxName + '">',
        '</ul>',
        '</div>'
    ].join("")).localize();

    for (var i in roleList) {
        let name = roleList[i];
        let transName = "profTrans:" + name + "_" + roleId + "_DisplayName";
        let transImage = "profTrans:" + name + "_" + roleId + "_Image";
        let transImgTag = '<img class="image-circle-small" data-i18n="[src]' + transImage + '" src="' + cm.defaultRoleIcon +' ">';
        if (!boxName) {
            transImgTag = '<img class="image-circle-small" src="' + cm.defaultRoleIcon + '">';
        }
        $("#role_list_" + boxName).append([
            '<li class="ellipsisText">',
            transImgTag,
            '<span  data-i18n="' + transName + '">',
            name,
            '</span>',
            '</li>'
        ].join("")).localize();

        // Role Profile
        afr.dispTargetRoleProf(name, boxName);
    }
}
afr.dispTargetRoleProf = function (name, boxName) {
    let fileName = "roles";
    personium.getBoxInfo(afr.extCellUrl, afr.targetAccessToken, boxName).done(function (boxRes) {
        let schemaUrl = boxRes.d.results.Schema;
        let transName = name + "_" + boxName;
        let defProf = {
            DisplayName: name,
            Description: "",
            Image: cm.defaultRoleIcon
        }
        personium.getTargetProfile(schemaUrl, fileName).done(function (defRes) {
            if (defRes[name]) {
                defProf = {
                    DisplayName: defRes[name].DisplayName,
                    Description: defRes[name].Description,
                    Image: defRes[name].Image
                }
            }
        }).always(function () {
            cm.i18nAddProfile("en", "profTrans", transName, defProf, schemaUrl, fileName, name);
            cm.i18nAddProfile("ja", "profTrans", transName, defProf, schemaUrl, fileName, name);
        });
    });
}


afr.appendBoxRole = function (boxName) {
    // �A�v���w�b�_�[�쐬
    let profTrans = "profTrans";
    let dispName = profTrans + ":" + boxName + "_DisplayName";
    let imgName = profTrans + ":" + boxName + "_Image";
    let id = boxName;
    let transId = boxName;
    if (!boxName) {
        dispName = "UserCustomRole";
        imgName = "profTrans:myProfile_Image";
        id = "";
        transId = "[main]";
        transImgTag = '';
    }
    
    

    // ���蓖��Role���擾
    personium.getExtCellRoleList(cm.getMyCellUrl(), cm.getAccessToken(), sessionStorage.getItem("extCellUrl")).done(function (data) {
        var results = data.d.results;
        results.sort(function (val1, val2) {
            return (val1.uri < val2.uri ? 1 : -1);
        });
        let createFlg = false;
        for (var i = 0; i < results.length; i++) {
            var uri = results[i].uri;
            var matchBox = uri.match(/_Box\.Name='(.+)'/);
            var roleBox = "";
            if (matchBox != null) {
                roleBox = matchBox[1];
            } else {
                roleBox = null;
            }
            if (boxName == roleBox) {
                if (!createFlg) {
                    // Role���A���΁A�A�v���w�b�_�[�\��
                    $("#role_" + id).show();
                    createFlg = true;
                }
                
                // ���蓖��Role��\��
                var matchName = uri.match(/\(Name='(.+)',/);
                var name = matchName[1];
                let transName = profTrans + ":" + name + "_" + transId + "_DisplayName";
                let transImage = profTrans + ":" + name + "_" + boxName + "_Image";
                let transImgTag = '<img class="image-circle-small" data-i18n="[src]' + transImage + '">';
                if (!boxName) {
                    transImgTag = '';
                }
                $("#role_list_" + id).append([
                    '<li class="ellipsisText">',
                        transImgTag,
                        '<span  data-i18n="' + transName + '">',
                            name,
                        '</span>',
                    '</li>'
                ].join("")).localize();
            }
        }
        if (!createFlg) {
            // Role��������΁A�A�v���w�b�_�[�폜
            $("#role_" + id).remove();
            $("#role_list_" + id).parent().remove();
        }
    })
        
}