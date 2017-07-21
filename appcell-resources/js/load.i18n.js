var tran = {};
tran.lang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
tran.lang = tran.lang.split("-")[0];
i18n.init({
    lng: tran.lang
  , fallbackLng: "en"
  , resGetPath : "../appcell-resources/locales/" + tran.lang + "/translation.json"
}, function(t) {
    $("#translate").i18n();
    tran.msg = t;
});
