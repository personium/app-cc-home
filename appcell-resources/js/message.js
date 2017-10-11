var ms = {};

addNamesapces = function (ns) {
    ns.push('message');
    return ns;
};

ms.init = function() {
    cm.createTitleHeader(false, true);
    cm.createSideMenu();
    cm.createBackMenu("main.html");
    ms.setTitle();
    st.initSettings();
    $("#dashboard").append('<div class="panel list-group toggle-panel" id="toggle-panel1"></div>');

    // create send and receive
    
}

ms.setTitle = function () {
    cm.setTitleMenu("Message");
}
