var ut = {};

ut.cellUrlWithEndingSlash = function(tempUrl, raiseError=false) {
    var i = tempUrl.indexOf("/", 8); // search after "http://" or "https://"

    if (raiseError && i == -1) {
        $('#errorCellUrl').html(mg.getMsg("E0018"));
        return tempUrl;
    }

    if (tempUrl.slice(-1) != "/") {
        tempUrl += "/";
    }

    i = tempUrl.indexOf("/", i + 1);

    var cellUrl = tempUrl.substring(0, i + 1);

    return cellUrl;
};
