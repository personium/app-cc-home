var lg = {};

// Load login screen
lg.loadLogin = function () {
    personium.loadContent(homeAppUrl + appUseBox + "/html/login.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        lg.initTarget();
    }).fail(function (error) {
        console.log(error);
    });
}

lg.googleLogin = function (gToken) {
    var cellUrl = sessionStorage.googleLoginCell;
    $.ajax({
        type: "POST",
        url: cellUrl + "__token",
        data: {
            grant_type: 'urn:x-personium:oidc:google',
            id_token: gToken
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).done(function (data) {
        personium.getCell(cellUrl).done(function (cellObj, status, xhr) {
            let ver = xhr.getResponseHeader("x-personium-version");
            if (ver >= "1.7.1") {
                data.baseUrl = cellObj.unit.url;
            } else {
                var i = cellUrl.indexOf("/"); // first slash
                i = cellUrl.indexOf("/", i + 2);  // second slash
                data.baseUrl = cellUrl.substring(0, i + 1);
            }
        }).fail(function (xmlObj) {
            var i = cellUrl.indexOf("/"); // first slash
            i = cellUrl.indexOf("/", i + 2);  // second slash
            data.baseUrl = cellUrl.substring(0, i + 1);
        }).always(function () {
            data.cellUrl = cellUrl;
            data.profile = JSON.parse(sessionStorage.getItem("myProfile"));
            //data.userName = username;
            data.userName = "googleAccount";
            var pos = location.href.indexOf("id_token");
            if (pos >= 0) {
                // Exclude conjunctions that preceded id_token
                data.logoutUrl = location.href.substring(0, pos - 1);
            }

            sessionStorage.setItem("sessionData", JSON.stringify(data));
            location.href = data.logoutUrl;
        });
    }).fail(function (data) {
        console.log(data);
    });
}

lg.initTarget = function () {
    var mode = "local";
    var match = location.search.match(/mode=(.*?)(&|$)/);
    if (match) {
        mode = decodeURIComponent(match[1]);
    }

    if (mode === "global") {
        match = location.search.match(/target=(.*?)(&|$)/);
        var target = "";
        if (match) {
            // target
            target = decodeURIComponent(match[1]);
            $('#errorCellUrl').attr("data-i18n", "notExistTargetCell").localize().show();
        } else {
            // Cell URL is not provided in the URL's parameter, try to get the previously used cell URL from session.
            target = sessionStorage.getItem("targetCellUrl") || "";
            $('#errorCellUrl').html("");
        }

        // Call the following function explicitly in order to prompt the user to enter the cell URL.
        lg.targetCellLogin(target);
    } else {

        var u = location.href;
        if (u.indexOf("file:") == 0) {
            return homeAppUrl;
        }
        var tempUrl = ut.cellUrlWithEndingSlash(u, false, true);
        personium.getCell(tempUrl).done(function (cellObj) {
            lg.setRootUrl(tempUrl);
        }).fail(function (xmlObj) {
            if (xmlObj.status == "200" || xmlObj.status == "412") {
                lg.setRootUrl(tempUrl);
            } else {
                tempUrl = ut.cellUrlWithEndingSlash(u, true, true);
                personium.getCell(tempUrl).done(function (cellObj) {
                    lg.setRootUrl(tempUrl);
                }).fail(function () {
                    lg.setRootUrl(homeAppUrl);
                });
            }
        });
        
    }

    $('#b-input-cell-ok').on('click', function () {
        $('#modal-input-cell').modal('hide');
    });
    $('#modal-input-cell').on('hidden.bs.modal', function () {
        lg.targetCellLogin($("#pCellUrl").val());
    });
    $('#modal-input-cell').on('shown.bs.modal', function () {
        $('#pCellUrl').focus();
    });
    $("#bLogin").on("click", function (e) {
        // send id pw to cell and get access token
        lg.sendAccountNamePw($("#iAccountName").val(), $("#iAccountPw").val());
    });
    $("#gLogin").on("click", function (e) {
        var homeUrl = location.href;
        sessionStorage.googleLoginCell = lg.rootUrl;
        var url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=102363313215-408im4hc7mtsgrda4ratkro2thn58bcd.apps.googleusercontent.com&response_type=code+id_token&scope=openid%20email%20profile&redirect_uri=https%3a%2f%2fdemo%2epersonium%2eio%2fapp%2dcc%2dhome%2f__%2fhtml%2fhomeapp_google_auth%2ehtml&display=popup&nonce=personium&state=" + homeUrl;
        window.location.href = url;
    });

    $("#iAccountName, #iAccountPw").keypress(function (e) {
        e = e ? e : event;
        var keyCode = e.charCode ? e.charCode : ((e.which) ? e.which : e.keyCode);
        var elem = e.target ? e.target : e.srcElement;
        // KeyCode:13 = Enter
        if (Number(keyCode) == 13) {
            if ($('#modal-input-cell').css('display') == 'none') {
                document.getElementById('bLogin').click();
            } else {
                document.getElementById('b-input-cell-ok').click();
            }
            return false;
        }
    });


    match = location.search.match(/glogin=(.*?)(&|$)/);
    if (match) {
        let state = decodeURIComponent(match[1]);
        if (state === "err") {
            lg.dispErrorMessage(i18next.t("errorGoogleLogin"));
        }
    }
};
lg.setRootUrl = function (cellUrl) {
    lg.rootUrl = cellUrl;
    lg.loadProfile();

    sessionStorage.setItem("mode", "local");
    sessionStorage.setItem("targetCellUrl", lg.rootUrl);
}

lg.targetCellLogin = function(tempUrl) {
    // Do the best to prepare a proper cell URL
    var cellUrl = tempUrl;

    personium.getCell(cellUrl).done(function(cellObj) {
        lg.rootUrl = cellUrl;
    }).fail(function (xmlObj) {
        if (xmlObj.status == "200" || xmlObj.status == "412") {
            lg.rootUrl = cellUrl;
        } else {
            lg.rootUrl = "";
        }
    }).always(function () {
        if (lg.rootUrl !== "") {
            sessionStorage.setItem("targetCellUrl", lg.rootUrl);
            sessionStorage.setItem("mode", "global");
            $('#iAccountName').focus();
            lg.loadProfile();
        } else {
            $("#pCellUrl").val(cellUrl)
            $('#modal-input-cell').modal('show');
        }
    });
};

lg.cellUrl = function() {
    var u = location.href;
    if (u.indexOf("file:") == 0) {
        return homeAppUrl;
    }

    var tempUrl = ut.cellUrlWithEndingSlash(u, true);

    return tempUrl;
};

lg.loadProfile = function() {
    $.ajax({
        type: "GET",
        url: lg.rootUrl + '__/profile.json',
        dataType: 'json',
        headers: {'Accept':'application/json'}
    }).done(function(data) {
        lg.profile = data;
        sessionStorage.setItem("myProfile", JSON.stringify(lg.profile));
        lg.populateProfile(data);
    }).fail(function(){
        alert("Do not have a profile.");
                var noProfile = {
                    Description: "",
                    DisplayName: "Guest",
                    Image: ut.getJdenticon(lg.rootUrl),
                    ProfileImageName: "",
                    Scope: "Private"
                };
                lg.profile = noProfile;
                sessionStorage.setItem("myProfile", JSON.stringify(lg.profile));
        lg.populateProfile(noProfile);
    }).always(function(){
        lg.setBizTheme();
        lg.automaticLogin();
    });
};
lg.populateProfile = function(profile) {
    $("#tProfileDisplayName").html(profile.DisplayName);
    document.title = "" + profile.DisplayName;
        if (profile.Image) {
            $("#imProfile").attr("src", profile.Image);
        } else {
            $("#imProfile").attr("src", ut.getJdenticon(lg.rootUrl));
        }
};

lg.setBizTheme = function() {
    let cellType = (JSON.parse(sessionStorage.getItem("myProfile")).CellType || "Person");
    if (cellType == "Organization") {
        $('#loginForm').addClass('body-biz');
        $('.login_btn').addClass('login_btn-biz');
    } else {
        $('#loginForm').addClass('body');
    };
};

lg.sendAccountNamePw = function(username, pw) {
    $.ajax({
        type: "POST",
        url: lg.rootUrl + '__token',
        processData: true,
        dataType: 'json',
        data: {
            grant_type: "password",
            username: username,
            password: pw,
            p_cookie: true
        },
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
        }
    }).done(function (data) {
        personium.getCell(lg.rootUrl).done(function (cellObj, status, xhr) {
            let ver = xhr.getResponseHeader("x-personium-version");
            if (ver >= "1.7.1") {
                data.baseUrl = cellObj.unit.url;
            } else {
                var i = lg.rootUrl.indexOf("/"); // first slash
                i = lg.rootUrl.indexOf("/", i + 2);  // second slash
                data.baseUrl = lg.rootUrl.substring(0, i + 1);
            }
        }).fail(function (xmlObj) {
            var i = lg.rootUrl.indexOf("/"); // first slash
            i = lg.rootUrl.indexOf("/", i + 2);  // second slash
            data.baseUrl = lg.rootUrl.substring(0, i + 1);
        }).always(function () {
            data.username = username;
            data.cellUrl = lg.rootUrl;
            data.profile = lg.profile;
            data.userName = username;
            if (location.origin === undefined) {
                location.origin = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
            }
            data.logoutUrl = location.origin + location.pathname + location.search;
            sessionStorage.setItem("sessionData", JSON.stringify(data));
            cm.setUserDate(data);
            ha.loadMain();
        })
    }).fail(function(){
        // login failed
        lg.dispErrorMessage(i18next.t("incorrectAccountOrPass"));
    });
};
lg.dispErrorMessage = function (errMsg) {
    $("#error_area").removeClass('frames_active');
    $("#error_area").removeClass('frames_hide');
    $("#error_msg").html(errMsg);
    $("#error_area").addClass('frames_active').on('transitionend', function () {
        $(this).addClass('frames_hide');
    })
}

lg.reAnimation = function() {
    var el = $("#error_area");
    var newone = el.clone(true);

    el.before(newone);

    $("." + el.attr("class") + ":last").remove();
}

/*
 * Try automatic login using hash information
 */
lg.automaticLogin = function () {
    // If there is id,password in the parameter, log in automatically
    let hash = location.hash.substring(1);
    let params = hash.split("&");
    let arrParam = {};
    for (var i in params) {
        var param = params[i].split("=");
        arrParam[param[0]] = param[1];
    }
    if (arrParam.id && arrParam.password) {
        // Try login with id, password
        $("#iAccountName").val(arrParam.id);
        $("#iAccountPw").val(arrParam.password);
        lg.sendAccountNamePw($("#iAccountName").val(), $("#iAccountPw").val());
    } else {
        // manual login
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }
}
