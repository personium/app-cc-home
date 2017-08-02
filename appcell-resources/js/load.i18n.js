i18next
    .use(i18nextXHRBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
        fallbackLng: 'en',
        debug: true,
        backend: {
            loadPath: '../appcell-resources/locales/{{lng}}/translation.json'
           ,crossDomain: true
        }
    }, function(err, t) {
        initJqueryI18next();
        initContent();
    });

function initJqueryI18next() {
    jqueryI18next.init(i18next, $);

    i18next.on('languageChanged', function(lng) {
        updateContent();
    });
}

function initContent() {
    updateContent();
    if (typeof init == "function") {
        init();
    }
}

function updateContent() {
    $('[data-i18n]').localize();
}