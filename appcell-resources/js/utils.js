var ut = {};

ut.cellUrlWithEndingSlash = function(tempUrl, raiseError=false) {
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
 * Return:
 *     debug-user1
 *     OR
 *     hello.png
 */
ut.getName = function(path) {
    if ((typeof url === "undefined") || url == null || url == "") {
        return "";
    };

    let name;
    if (_.contains(url, "\\")) {
        name = _.last(_.compact(url.split("\\")));
    }else{
        name = _.last(_.compact(url.split("/")));
    }
    return name;
};
