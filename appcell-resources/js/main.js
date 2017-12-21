var ha = {};

ha.init = function() {
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
    var profTrans = "profTrans";
    var dispName = profTrans + ":" + boxName + "_DisplayName";
    var imgName = profTrans + ":" + boxName + "_Image";
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
                var html = '<a class="ins-app" onClick="cm.execApp(\'' + schema + '\', \'' + boxName + '\')" target="_blank">'
                    + '<div class="ins-app-icon">'
                    + '<img data-i18n="[src]' + imgName + '" src="" class="ins-app-icon">'
                    + '<span class="badge">' + msgCnt + '</span>'
                    + '</div>'
                    + '<div class="ins-app-name" data-i18n="' + dispName + '"></div>'
                    + '</a>';
                $("#dashboard_ins").append(html).localize();
            });
        }
    });
};
