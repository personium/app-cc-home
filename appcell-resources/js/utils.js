var ut = {};

// Local Unit/Box Schema
ut.PERSONIUM_LOCALUNIT = "personium-localunit:";
ut.PERSONIUM_LOCALBOX = "personium-localbox:";

ut.loadScript = function () {
    let head = document.getElementsByTagName('head')[0];
    let scriptList = [];
    if (typeof addLoadScript == "function") {
        scriptList = addLoadScript(scriptList);
    }

    let scriptLen = scriptList.length;
    for (var i = 0; i < scriptLen; i++) {
        let script = document.createElement('script');
        script.src = scriptList[i];
        head.appendChild(script);
    }
};

ut.cellUrlWithEndingSlash = function(tempUrl, raiseError) {
    var i = tempUrl.indexOf("/", 8); // search after "http://" or "https://"

    if (raiseError && i == -1) {
        $('#errorCellUrl').html(i18next.t("pleaseValidExternalCellUrl"));
        return tempUrl;
    }

    if (tempUrl.slice(-1) != "/") {
        tempUrl += "/";
    }

    i = tempUrl.indexOf("/", i + 1);

    var cellUrl = tempUrl.substring(0, i + 1);

    return cellUrl;
};

/*
 * Retrieve cell name from cell URL
 * OR
 * file name from file path (windows, linux)
 * Parameter:
 *     1. ended with "/", "https://demo.personium.io/debug-user1/"
 *     2. ended without "/", "https://demo.personium.io/debug-user1"
 *     3. window path "c:\\home\hoge\hello.png"
 *     4. linux path "/home/hoge/hello.png"
 *     5. "https://demo.personium.io/debug-user1/HomeApplicatin.bar"
 *     withoutExtension: Exclude the extension from the acquired file name
 * Return:
 *     debug-user1
 *     OR
 *     hello.png
 */
ut.getName = function(path, withoutExtension) {
    if ((typeof path === "undefined") || path == null || path == "") {
        return "";
    };

    let name;
    if (_.contains(path, "\\")) {
        name = _.last(_.compact(path.split("\\")));
    }else{
        name = _.last(_.compact(path.split("/")));
    }

    if (withoutExtension) {
        name = _.first(_.compact(name.split("\.")));
    }
    return name;
};

/*
 * Replace the same unit URL as my unit URL with personium-localunit
 */
ut.changeUnitUrlToLocalUnit = function (cellUrl) {
    var result = cellUrl;
    if (cellUrl.startsWith(cm.user.baseUrl)) {
        result = cellUrl.replace(cm.user.baseUrl, ut.PERSONIUM_LOCALUNIT + "/");
    }

    return result;
};

/*
 * Replace personium-localunit with your unit URL
 */
ut.changeLocalUnitToUnitUrl = function (cellUrl) {
    var result = cellUrl;
    if (cellUrl.startsWith(ut.PERSONIUM_LOCALUNIT)) {
        result = cellUrl.replace(ut.PERSONIUM_LOCALUNIT + "/", cm.user.baseUrl);
    }

    return result;
};

/*
 * Replace personium-localbox with the user's Box URL
 */
ut.changeLocalBoxToBoxUrl = function (url, boxName) {
    let result = url;
    if (url.startsWith(ut.PERSONIUM_LOCALBOX)) {
        result = url.replace(ut.PERSONIUM_LOCALBOX, cm.user.cellUrl + boxName);
    }

    return result;
};

/*
 * Confirm existence of the specified URL.
 */
ut.confirmExistenceOfURL = function (url) {
    return $.ajax({
        type: "GET",
        url: url,
        headers: {
            'Authorization': 'Bearer ' + cm.user.access_token,
            'Accept': 'text/plain'
        }
    });
};

ut.putFileAPI = function (putUrl, json) {
    return $.ajax({
        type: "PUT",
        url: putUrl,
        data: JSON.stringify(json),
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + cm.user.access_token
        }
    });
};

/*
 * The following are not supported for now:
 * navigator.userAgent.match(/webOS/i)
 * navigator.userAgent.match(/iPod/i)
 * navigator.userAgent.match(/BlackBerry/i)
 * navigator.userAgent.match(/Windows Phone/i)
 */
ut.deviceType2PersoniumAppType = function() {
    if (navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)) {
        return "ios";
    }

    if (navigator.userAgent.match(/Android/i)) {
        return "android";
    }

    return "web";
};
ut.PEROSNIUM_APP_TYPE = ut.deviceType2PersoniumAppType();
console.log('Personium App Type [' + ut.PEROSNIUM_APP_TYPE + ']');

ut.getAppLaunchUrl = function(launchObj, boxName) {
    let result = {
        appLaunchUrl: ut.changeLocalBoxToBoxUrl(launchObj.web, boxName),
        openNewWindow: true
    };

    let personiumAppType = ut.PEROSNIUM_APP_TYPE;
    switch (personiumAppType) {
        case 'android':
        case 'ios':
            if (launchObj[personiumAppType] && !launchObj[personiumAppType].startsWith('***:')) {
                result.openNewWindow = false;
                result.appLaunchUrl = launchObj[personiumAppType];
                console.log('Launch native App');
            }
            break;
        case 'web':
        default:
            console.log('Launch Web App');
    }

    return result;
};
