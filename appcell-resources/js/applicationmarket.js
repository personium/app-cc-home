var am = {};

$(document).ready(function() {
    cm.createProfileHeaderMenu();
    cm.createSideMenu();
    cm.createTitleHeader();
    cm.createBackMenu("main.html");
    cm.setTitleMenu(mg.getMsg("00050"));
    st.initSettings();
    $("#dashboard").append('<div class="panel list-group toggle-panel" id="toggle-panel1"></div>');

    am.createApplicationList();
    // menu-toggle
    $(".appInsMenu").css("display", "none");
    $("#appInsToggle.toggle").on("click", function() {
      $(this).toggleClass("active");
      $(".appInsMenu").slideToggle();
    });
});

am.createApplicationList = function() {
    var html = '<div class="panel-body"><table class="table table-striped"><tr><td>' + mg.getMsg("00047") + '</td></tr><tr><td><div id="insAppList1"></div></td></tr><tr><td>' + mg.getMsg("00048") + '</td></tr><tr><td><div id="appList1"></div></td></tr></div>';
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
        var dispName = profData.DisplayName;
        var imageSrc = cm.notAppImage;
        if (profData.Image) {
            imageSrc = profData.Image;
        }
        cm.getBoxStatus(boxName).done(function(data) {
            var status = data.status;
            var html = '';
            if (status.indexOf('ready') >= 0) {
                // ready
                html = '<div class="ins-app" align="center"><a href="#" id="insAppNo_' + no + '" class="ins-app-icon" onClick="uninstallApp(\'' + schema + '\', \'' + boxName + '\')"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name">' + dispName + '</div>';

                html += '</div>';
            } else if (status.indexOf('progress') >= 0) {
                // progress
                html = '<div class="ins-app" align="center"><a href="#" id="insAppNo_' + no + '" class="ins-app-icon"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name">' + dispName + '</div><div id="nowInstallParent_' + no + '" class="progress progress-striped active"><div name="nowInstall" id="nowInstall_' + no + '" class="progress-bar progress-bar-success" style="width: ' + data.progress + ';"></div></div></div>';
                if (am.nowInstalledID === null) {
                    am.nowInstalledID = setInterval(am.checkBoxInstall, 1000);
                }
            } else {
                // failed
                html = '<div class="ins-app" align="center"><a href="#" class="ins-app-icon"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div id="appid_' + no + '" class="ins-app-name">' + dispName + '(<font color="red"> ! </font>)</div></div>';
            }

            $("#insAppList1").append(html);
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
          am.dispApplicationListSchema(results[i]);
      }
    }
};
am.dispApplicationListSchema = function(schemaJson) {
    var schema = schemaJson.SchemaUrl;
    cm.getProfile(schema).done(function(profData) {
        var dispName = profData.DisplayName;
        var description = profData.Description;
        var imageSrc = cm.notAppImage;
        if (profData.Image) {
            imageSrc = profData.Image;
        }
        var html = '<div class="ins-app" align="center"><a href="#" class="ins-app-icon" onClick="am.dispViewApp(\'' + schema + '\',\'' + dispName + '\',\'' + imageSrc + '\',\'' + description + '\',\'' + schemaJson.BarUrl + '\',\'' + schemaJson.BoxName + '\',true)"><img src = "' + imageSrc + '" class="ins-app-icon"></a><div class="ins-app-name">' + dispName + '</div></div>';
        $("#appList1").append(html);
   });
};
am.dispViewApp = function(schema, dispName, imageSrc, description, barUrl, barBoxName, insFlag) {
    $("#toggle-panel1").empty();
    cm.setBackahead();
    var html = '<div class="panel-body">';
    html += '<div class="app-profile" id="dvAppProfileImage"><img class="image-circle" style="margin: auto;" id="imgAppProfileImage" src="' + imageSrc + '" alt="image" /><span style="margin-left: 10px;" id="txtAppName">' + dispName + '</span><br><br><br><h5>概要</h5><span id="txtDescription">' + description + '</span></div>';
    if (insFlag) {
        html += '<br><br><div class="toggleButton" style="text-align:center;"><a class="appToggle list-group-item" href="#" onClick="st.confBarInstall(\'' + schema + '\',\'' + barUrl + '\',\'' + barBoxName + '\', \'' + dispName + '\');return(false);">' + mg.getMsg("00040") + '</a></div>';
    } else {
        html += '<br><br><div class="toggleButton" style="text-align:center;"><a class="appToggle list-group-item" href="#" onClick="return(false);">' + mg.getMsg("00041") + '</a></div>';
    }

    $("#toggle-panel1").append(html);
    $("#toggle-panel1").toggleClass('slide-on');
    cm.setTitleMenu(mg.getMsg("00042"));

};
