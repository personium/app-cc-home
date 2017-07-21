var ut = {};

ut.cellUrlWithEndingSlash = function(tempUrl, raiseError=false) {
    var i = tempUrl.indexOf("/", 8); // search after "http://" or "https://"

    if (raiseError && i == -1) {
        $('#errorCellUrl').html(tran.msg("pleaseValidExternalCellUrl"));
        return tempUrl;
    }

    if (tempUrl.slice(-1) != "/") {
        tempUrl += "/";
    }

    i = tempUrl.indexOf("/", i + 1);

    var cellUrl = tempUrl.substring(0, i + 1);

    return cellUrl;
};

ut.getMsgFormat = function(msg) {
    var str = msg;
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            str = str.replace(new RegExp("\\(" + i + "\\)"), arguments[i]);
        }
    }
    return str;
};