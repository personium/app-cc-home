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

// Get file name from file path
ut.getName = function(path) {
  var collectionName = path;
  var recordsCount = 0;
  if (collectionName != undefined) {
          recordsCount = collectionName.length;
          var lastIndex = collectionName.lastIndexOf("/");
          if (lastIndex < 0) {
              lastIndex = collectionName.lastIndexOf("\\");
          }
          if (recordsCount - lastIndex === 1) {
                  collectionName = path.substring(0, recordsCount - 1);
                  recordsCount = collectionName.length;
                  lastIndex = collectionName.lastIndexOf("/");
          }
          
          collectionName = path.substring(lastIndex + 1, recordsCount);
  }
  return collectionName;
};