var extcell_link_role_list = {};
extcell_link_role_list.roleList = {};
extcell_link_role_list.linksRoleList = {};
extcell_link_role_list.roleCustom = [];
extcell_link_role_list.extCellUrl = sessionStorage.getItem("extCellUrl");
if (!extcell_link_role_list.extCellUrl) {
    location.href = "./links.html";
}
extcell_link_role_list.extCellUrl = ut.changeLocalUnitToUnitUrl(extcell_link_role_list.extCellUrl);

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
    ut.loadScript(extcell_link_role_list.init);
}

extcell_link_role_list.init = function () {
    // Initialization
    sessionStorage.removeItem("roleList");
    sessionStorage.removeItem("boxName");
    sessionStorage.removeItem("linksList");
    cm.i18nSetProfile();
    cm.i18nSetBox();

    extcell_link_role_list.displayBoxRoleList();
}

extcell_link_role_list.displayBoxRoleList = function () {
    $("#roles ul").empty();
    personium.getRoleList(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
        let res = data.d.results;
        res.sort(function (val1, val2) {
            return (val1["_Box.Name"] > val2["_Box.Name"] ? 1 : -1);
        });
        for (var i in res) {
            let boxName = res[i]["_Box.Name"];
            if (boxName) {
                if (!extcell_link_role_list.roleList[boxName]) {
                    extcell_link_role_list.roleList[boxName] = [];
                }
                extcell_link_role_list.roleList[boxName].push(res[i].Name);
            } else {
                extcell_link_role_list.roleCustom.push(res[i].Name);
            }
        }
        let no = 0;
        for (var boxName in extcell_link_role_list.roleList) {
            extcell_link_role_list.displayBoxRole(boxName, no);
            no++;
        }
        extcell_link_role_list.displayBoxRole(null, no);
    })
}
extcell_link_role_list.displayBoxRole = function (boxName, no) {
    let transDispName = "profTrans:" + boxName + "_DisplayName";
    let transImage = "[src]profTrans:" + boxName + "_Image";
    if (!boxName) {
        transDispName = "UserCustomRole";
        transImage = "[src]profTrans:myProfile_Image";
    }
    let html = [
        '<li>',
            '<a href="#" onclick="extcell_link_role_list.transitionAccountLinks(\''+boxName+'\')">',
                '<div class="pn-list">',
                    '<div class="pn-list-icon app-icon">',
                        '<img class="img-fluid" data-i18n="' + transImage + '">',
                    '</div>',
                    '<div class="account-info text-hidden">',
                        '<span class="user-name" data-i18n="' + transDispName + '"></span>',
                    '</div>',
                    '<span class="pn-list-batch role-list-batch">',
                        '<span id="roleLinksCnt' + no + '"></span>',
                    '</span>',
                '</div>',
            '</a>',
        '</li>'
    ].join("");
    $("#roles ul").append(html).localize();
    extcell_link_role_list.displayLinksCount(boxName, no);
}
extcell_link_role_list.displayLinksCount = function (boxName, no) {
    personium.getExtCellRoleList(cm.getMyCellUrl(), cm.getAccessToken(), sessionStorage.getItem("extCellUrl")).done(function (data) {
        var results = data.d.results;
        let count = 0;
        for (var i = 0; i < results.length; i++) {
            var roleInfo = results[i];
            var uri = roleInfo.uri;
            var matchName = uri.match(/\(Name='(.+)',/);
            var roleName = matchName[1];
            var matchBox = uri.match(/_Box\.Name='(.+)'/);
            var roleBox = "";
            if (matchBox != null) {
                roleBox = matchBox[1];
            } else {
                roleBox = null;
            }

            if (boxName == roleBox) {
                if (!extcell_link_role_list.linksRoleList[boxName]) {
                    extcell_link_role_list.linksRoleList[boxName] = [];
                }
                extcell_link_role_list.linksRoleList[boxName].push(roleName);
                count++;
            }
        }
        if (count > 0) $("#roleLinksCnt" + no).html(count);
    })
}
extcell_link_role_list.transitionAccountLinks = function (boxName) {
    if (boxName !== "null") {
        sessionStorage.setItem("roleList", JSON.stringify(extcell_link_role_list.roleList[boxName]));
        sessionStorage.setItem("boxName", boxName);
    } else {
        sessionStorage.setItem("roleList", JSON.stringify(extcell_link_role_list.roleCustom));
        sessionStorage.removeItem("boxName");
    }

    if (extcell_link_role_list.linksRoleList[boxName]) {
        sessionStorage.setItem("linksList", JSON.stringify(extcell_link_role_list.linksRoleList[boxName]));
    } else {
        sessionStorage.removeItem("linksList");
    }
    
    location.href = "extcell_link_role.html";
}