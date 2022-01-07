var privacy_policy = {};
var renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
    var link = marked.Renderer.prototype.link.call(this, href, title, text);
    return link.replace("<a","<a target='_blank' ");
};

marked.setOptions({
    renderer: renderer
});

// Load contents
privacy_policy.loadContent = function () {
    personium.loadContent(homeAppUrl + appUseBox + "/html/privacy_policy.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        privacy_policy.init();
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }).fail(function (error) {
        console.log(error);
    });
}

privacy_policy.init = function() {
    $.get(homeAppUrl + i18next.t('PrivacyPolicyURL'), function(data) {
        $('#content').html(marked(data));
    });
}