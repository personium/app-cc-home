var ha = {};

addLoadScript = function (scriptList) {
    scriptList.push("https://cdn.jsdelivr.net/npm/jdenticon@1.8.0");
    scriptList.push("https://cdnjs.cloudflare.com/ajax/libs/cropper/3.1.4/cropper.min.js");
    return scriptList;
}
addLoadStyleSheet = function (styleList) {
    styleList.push("https://demo.personium.io/HomeApplication/__/appcell-resources/css/cropper/cropper.min.css");
    styleList.push("https://demo.personium.io/HomeApplication/__/appcell-resources/css/cropper/cropper_circle_mask.css");
    return styleList;
}

ha.init = function () {
    ut.loadStyleSheet();
    ut.loadScript();

    let tempMyProfile = JSON.parse(sessionStorage.getItem("myProfile")) || {};
    let isDemo = (tempMyProfile.IsDemo || false);

    ha.displaySystemMenuItems();
  
    if (isDemo) {
        demo.createProfileHeaderMenu();
        demo.createSideMenu();
        demo.initSettings();
        demo.initMain();
        if (demoSession.insApp) {
            ha.dispInsAppList();
        }
        st.setBizTheme();
    } else {
        //createTitleHeader();
        cm.createProfileHeaderMenu();
        cm.createSideMenu();
        st.initSettings();
        ha.dispInsAppList();
    }
};

ha.displaySystemMenuItems = function() {
    let tempMyProfile = JSON.parse(sessionStorage.getItem("myProfile")) || {};
    let isDemo = (tempMyProfile.IsDemo || false);
    let systemMenuItems = [
      {
          "name": "Community",
          "icon": "003lighticons-03full.png",
          "url": "socialgraph.html"
      }, {
          "name": "AppMarket", // With context properly set, it can be AppMarket_biz
          "icon": "001lighticons-31full.png",
          "url": "applicationmarket.html"
      }, {
            "name": "Message",
          "icon": "001lighticons-02full.png",
          "url": "message.html"
      }
    ];

    /*
     * For older profile.json that might not have CellType key,
     * assign default cell type (Person) to it.
     */
    let cellType = cm.getCellType();

    for (var i in systemMenuItems) {
        var app = systemMenuItems[i];

        var imgTag = $('<img>', {
            src: 'https://demo.personium.io/HomeApplication/__/icons/' + app.icon,
            class: 'p-app-icon'
        });

        var divTag1 = $('<div>', {
            class: 'p-app-icon'
        });
        divTag1.append($(imgTag));

        if (app.name == "Message") {
            var spanTag = $('<span>', {
                class: 'badge',
                id: 'messageCnt'
            });
            divTag1.append($(spanTag));
            cm.getReceivedMessageCntAPI().done(function (res) {
                var results = res.d.results;
                var cnt = 0;
                for (var i in results) {
                    if (!results[i]["_Box.Name"]) {
                        cnt++;
                    }
                }
                
                if (cnt > 0) $("#messageCnt").html(cnt);
            })
        }

        var divTag2 = $('<div>', {
            class: 'p-app-name',
            'data-i18n': app.name,
            'data-i18n-options': JSON.stringify({ context: cellType })
        });

        var aTag = $('<a>', {
            class: 'p-app'
        });
        if (isDemo && _.contains(["Community", "Message"], app.name)) {
            aTag.attr('href', "javascript:void(0)");
        } else {
            aTag.attr('href', app.url);
        }
        aTag.append($(divTag1), $(divTag2));

        $("#dashboard").append($(aTag));
    }
};

ha.dispInsAppList = function() {
    $("#dashboard_ins").empty();
    cm.getBoxList().done(function(data) {
        var insAppRes = data.d.results;
        insAppRes.sort(function(val1, val2) {
            return (val1.Name < val2.Name ? 1 : -1);
        })
        for (var i in insAppRes) {
            // hotfix for not showing HomeApplication/Cell Manager's box inside a data subject's cell
            if (_.contains(cm.boxIgnoreList, insAppRes[i].Name)) {
                continue;
            };

            var schema = insAppRes[i].Schema;
            if (schema && schema.length > 0) {
                ha.dispInsAppListSchema(schema, insAppRes[i].Name);
            }
        }
    });
};

ha.dispInsAppListSchema = function(schema, boxName) {
    cm.getBoxStatus(boxName).done(function (data) {
        var status = data.status;
        var html = '';
        if (status.indexOf('ready') >= 0) {
            var msgCnt = '';
            cm.getNotCompMessageCnt().done(function (data) {
                if (data.d.__count > 0) {
                    var count = 0;
                    for (i in data.d.results) {
                        var res = data.d.results[i];
                        if (boxName == res["_Box.Name"]) {
                            count++;
                        }
                    }
                    if (count > 0) {
                        msgCnt = count;
                    }
                }
            }).fail(function (data) {
                console.log("fail");
            }).always(function (data) {
                ha.createLaunchLink(schema, boxName, msgCnt);
            });
        }
    });
};

ha.createLaunchLink = function(schema, boxName, msgCnt) {
    let profTrans = "profTrans";
    let dispName = profTrans + ":" + boxName + "_DisplayName";
    let imgName = profTrans + ":" + boxName + "_Image";

    $.ajax({
        type: "GET",
        url: schema + "__/launch.json",
        headers: {
            'Authorization':'Bearer ' + cm.user.access_token,
            'Accept':'application/json'
        }
    }).done(function(data) {
        let appLaunchInfo = ut.getAppLaunchUrl(data.personal, boxName);

        let imgTag = $('<img>', {
            class: 'ins-app-icon',
            'data-i18n': '[src]' + imgName
        });

        let counter = $('<span>', {
            class: 'badge',
            text: msgCnt
        });

        let iconDiv = $('<div>', {
            class: 'ins-app-icon'
        });
        iconDiv.append($(imgTag), $(counter));

        let nameDiv = $('<div>', {
            class: 'ins-app-name',
            'data-i18n': dispName
        });

        let aTag = $('<a>', {
            href: '#',
            class: 'ins-app',
            onClick: 'return cm.execApp(this)',
            'data-open-new-window': appLaunchInfo.openNewWindow, // $(this).data('openNewWindow')
            'data-app-launch-url': appLaunchInfo.appLaunchUrl // $(this).data('appLaunchUrl')
        });
        aTag.append($(iconDiv), $(nameDiv));

        $("#dashboard_ins").append($(aTag)).localize();
    });
};
