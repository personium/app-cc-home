var am = {};

am.initAppMarket = function() {
    cm.createTitleHeader(false, true);
    cm.createSideMenu();
    cm.createBackMenu("main.html");
    cm.setTitleMenu("AppMarket");
    st.initSettings();
    $("#dashboard").append('<div class="panel list-group toggle-panel" id="toggle-panel1"></div>');

    am.createApplicationList();
    // menu-toggle
    $(".appInsMenu").css("display", "none");
    $("#appInsToggle.toggle").on("click", function() {
      $(this).toggleClass("active");
      $(".appInsMenu").slideToggle();
    });
}

am.createApplicationList = function() {
    var html = '<div class="panel-body" id="app-panel"><section class="dashboard-block" id="installed-app"><h2 data-i18n="Installed"></h2><div id="insAppList1"></div></section><section class="dashboard-block" id="all-app"><h2 data-i18n="ApplicationList"></h2><div id="appList1"></div></section></div>';
    $("#dashboard").append(html);
    // install application list
    cm.getBoxList().done(function(data) {
        var insAppRes = data.d.results;
        insAppRes.sort(function(val1, val2) {
            return (val1.Name < val2.Name ? 1 : -1);
        })
        am.insAppList = new Array();
        am.insAppBoxList = new Array();
        for (var i in insAppRes) {
            var schema = insAppRes[i].Schema;
            if (schema && schema.length > 0) {
                am.insAppList.push(schema);
                am.insAppBoxList.push(insAppRes[i].Name);
            }
        }
        am.dispInsAppListSetting();

        // application list
        st.getApplicationList().done(function(data) {
            am.dispApplicationList(data);
        }).fail(function(data) {
            alert(data);
        });
    });
};
am.dispInsAppListSetting = function() {
    $("#insAppList1").empty();
    am.nowInstalledID = null;
    for (var i in am.insAppList) {
        am.dispInsAppListSchemaSetting(am.insAppList[i], am.insAppBoxList[i], i);
    }

    if (typeof(ha) != "undefined") {
        ha.dispInsAppList();
    }
};
am.dispInsAppListSchemaSetting = function(schema, boxName, no) {
    cm.getProfile(schema).done(function(profData) {
        var dispName = boxName + "_DisplayName";
        cm.i18nAddProfile("en", "translation", boxName, profData);
        cm.i18nAddProfile("ja", "translation", boxName, profData);
        var imageSrc = cm.notAppImage;
        if (profData.Image) {
            imageSrc = profData.Image;
        }
        cm.getBoxStatus(boxName).done(function(data) {
            var status = data.status;
            var html = '';
            if (status.indexOf('ready') >= 0) {
                // ready
                html = '<a href="#" id="insAppNo_' + no + '" class="ins-app-icon" onClick="uninstallApp(\'' + schema + '\', \'' + boxName + '\')"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name" data-i18n="' + dispName + '"></div>';
            } else if (status.indexOf('progress') >= 0) {
                // progress
                html = '<a href="#" id="insAppNo_' + no + '" class="ins-app-icon"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name" data-i18n="' + dispName + '"></div><div id="nowInstallParent_' + no + '" class="progress progress-striped active"><div name="nowInstall" id="nowInstall_' + no + '" class="progress-bar progress-bar-success" style="width: ' + data.progress + ';"></div></div>';
                if (am.nowInstalledID === null) {
                    am.nowInstalledID = setInterval(am.checkBoxInstall, 1000);
                }
            } else {
                // failed
                html = '<a href="#" class="ins-app-icon"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div><span id="appid_' + no + '" class="ins-app-name" data-i18n-"' + dispName + '"></span>(<font color="red"> ! </font>)</div>';
            }

            $("#insAppList1").append('<a class="ins-app" id="ins-app_' + no + '"></a>');
            var insAppId = 'ins-app_' + no;
            $('#' + insAppId).append(html).localize();
        });
    });
};
am.dispApplicationList = function(json) {
    $("#appList1").empty();
    var results = json.Apps;
    results.sort(function(val1, val2) {
      return (val1.SchemaUrl < val2.SchemaUrl ? 1 : -1);
    })
    for (var i in results) {
      var schema = results[i].SchemaUrl;
      if (am.insAppList.indexOf(schema) < 0) {
          am.dispApplicationListSchema(results[i],i);
      }
    }
};
am.dispApplicationListSchema = function(schemaJson, no) {
    var schema = schemaJson.SchemaUrl;
    cm.getProfile(schema).done(function(profData) {
        var dispName = schemaJson.BoxName + "_DisplayName";
        cm.i18nAddProfile("en", "translation", schemaJson.BoxName, profData);
        cm.i18nAddProfile("ja", "translation", schemaJson.BoxName, profData);
        var description = schemaJson.BoxName + "_Description";
        var imageSrc = cm.notAppImage;
        if (profData.Image) {
            imageSrc = profData.Image;
        }
        $("#appList1").append('<a class="p-app" id="p-app_' + no + '"></a>');
        var pAppId = 'p-app_' + no;
        var html = '<a href="#" class="ins-app-icon" onClick="am.dispViewApp(\'' + schema + '\',\'' + dispName + '\',\'' + imageSrc + '\',\'' + description + '\',\'' + schemaJson.BarUrl + '\',\'' + schemaJson.BoxName + '\',true)"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div class="ins-app-name" data-i18n="' + dispName + '"></div>';
        $('#' + pAppId).append(html).localize();
   });
};
am.dispViewApp = function(schema, dispName, imageSrc, description, barUrl, barBoxName, insFlag) {
    $("#toggle-panel1").empty();
    cm.setBackahead();
    var html = '<div class="panel-body">';
    html += '<div class="app-info"><div class="app-icon"><img src="' + imageSrc + '"></div><div class="app-data"><div data-i18n="' + dispName + '"></div><div data-i18n="Provider"></div></div></div><section class="detail-section"><h2 data-i18n="Overview"></h2><div class="overview" data-i18n="' + description + '"></div>';
    if (insFlag) {
        html += '<div class="app-install"><button class="round-btn"href="#" onClick="st.confBarInstall(\'' + schema + '\',\'' + barUrl + '\',\'' + barBoxName + '\', \'' + dispName + '\');return(false);" data-i18n="Install"></button></div></section>';
    } else {
        html += '<div class="app-install"><button class="round-btn"href="#" onClick="return(false);" data-i18n="Uninstall"></button></div></section>';
    }

    $("#toggle-panel1").append(html).localize();
    $("#toggle-panel1").toggleClass('slide-on');
    cm.setTitleMenu("Details");
};

