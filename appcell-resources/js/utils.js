var ut = {};

// LocalUnit Schema
ut.PERSONIUM_LOCALUNIT = "personium-localunit:";

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
}

/*
 * Replace personium-localunit with your unit URL
 */
ut.changeLocalUnitToUnitUrl = function (cellUrl) {
    var result = cellUrl;
    if (cellUrl.startsWith(ut.PERSONIUM_LOCALUNIT)) {
        result = cellUrl.replace(ut.PERSONIUM_LOCALUNIT + "/", cm.user.baseUrl);
    }

    return result;
}