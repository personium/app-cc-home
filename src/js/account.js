var account = {};

// Load account screen
account.loadAccount = function () {
    personium.loadContent(cm.homeAppUrl + "__/html/account.html").done(function (data) {
        let out_html = $($.parseHTML(data));
        let id = personium.createSubContent(out_html, true);
        account.init();
    }).fail(function (error) {
        console.log(error);
    });
}

account.init = function () {
    cm.Edit_Btn_Event();
    account.createAccountList();
}

// Create account list
account.createAccountList = function () {
    personium.getAccountList(cm.getMyCellUrl(), cm.getAccessToken()).done(function (data) {
        account.dispAccountList(data);
        cm.Delete_List_Event();
    });
};
// View account list
account.dispAccountList = function (json) {
    $(".slide-list").empty();
    var results = json.d.results;
    results.sort(function (val1, val2) {
        return (val1.Name < val2.Name ? 1 : -1);
    })
    let html = "";
    for (var i = 0; i < results.length; i++) {
        var acc = json.d.results[i];
        var type = acc.Type;
        var typeImgTag = '<img class="image-circle-small-border-less" src="https://demo.personium.io/app-cc-home/__/html/img/type_p.png">';
        if (type !== "basic") {
            typeImgTag = '<img class="image-circle-small-border-less" src="https://demo.personium.io/app-cc-home/__/html/img/type_g.png">';
        }
        html = '<li>';
        html += '<div class="slide-list-line">';
        if (acc.Name !== cm.getUserName()) {
            html += '<button class="delete-check-btn">';
            html += '<i class="fas fa-minus-circle fa-2x"></i>';
            html += '</button>';
            html += '<div class="account-name slide-list-line-contents ellipsisText"><a href="#" onclick="account.transitionAccountLinks(this, \'' + acc.Name + '\', \'' + type + '\')"><p class="ellipsisText" style="margin-right:25px;">' + typeImgTag + acc.Name + '</p></a></div>';
        } else {
            html += '<div style="padding-left: 70px;" class="account-name slide-list-line-contents ellipsisText login-ic"><a href="#" onclick="account.transitionAccountLinks(this, \'' + acc.Name + '\', \'' + type + '\')"><p class="ellipsisText" style="margin-right:25px;">' + typeImgTag + acc.Name + '</p></a></div>';
        }
        html += '<button class="line-delete-btn" data-i18n="Del" onClick="account.deleteAccount(\'' + acc.Name + '\');return(false)"></button>';
        html += '</div></li>';
        $(".slide-list").append(html).localize();
    }
    html = '<li>';
    html += '<a onclick="sel_accType.loadSelectAccountType();">';
    html += '<div class="slide-list-line">';
    html += '<div class="new-account slide-list-line-contents add-setting" data-i18n="CreateAccount">';
    html += '</div></div></a></li>';
    $(".slide-list").append(html).localize();
}
account.transitionAccountLinks = function (obj, acc, type) {
    sessionStorage.setItem("accountName", acc);
    if ($(obj).hasClass("edit_margin")) {
        if (!$(obj).parent().hasClass("login-ic")) {
            sessionStorage.setItem("accountType", type);
            edit_account.loadEditAccount();
        }
    } else {
        accinfo.loadAccountInfo();
    }
}
account.deleteAccount = function (name) {
    personium.restDeleteAccountAPI(cm.getMyCellUrl(), cm.getAccessToken(), name).fail(function (data) {
        var res = JSON.parse(data.responseText);
        alert("An error has occurred.\n" + res.message.value);
    });
};
account.createEditAccount = function (name, type) {
    st.updUser = name;
    $("#setting-panel2").empty();
    cm.setBackahead(true);
    var html = '<div class="modal-body">';
    html += '<div id="dvEditName">' + i18next.t("Name") + '</div>';
    html += '<div id="dvTextEditName" style="margin-bottom: 10px;"><input type="text" id="editAccountName" onblur="st.editAccountNameBlurEvent();" value="' + name + '" data-accType="' + type + '"><span class="popupAlertArea" style="color:red"><aside id="popupEditAccountNameErrorMsg"> </aside></span></div>';
    if (type === "basic") {
        html += '<div id="dvEditPassword">' + i18next.t("Password") + '</div>';
        html += '<div id="dvTextEditNewPassword" style="margin-bottom: 10px;"><input type="password" placeholder="' + i18next.t("newPassPlaceHolder") + '" id="pEditNewPassword" onblur="st.blurNewPassword(this, \'b-edit-account-ok\', \'editChangeMessage\');"><span class="popupAlertArea" style="color:red"><aside id="editChangeMessage"> </aside></span></div>';
        html += '<div id="dvTextEditConfirm" style="margin-bottom: 10px;"><input type="password" placeholder="' + i18next.t("confirmNewPass") + '" id="pEditConfirm" onblur="st.blurConfirm(\'pEditNewPassword\', \'pEditConfirm\', \'editConfirmMessage\');"><span class="popupAlertArea" style="color:red"><aside id="editConfirmMessage"> </aside></span></div>';
    }
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-default" onClick="cm.moveBackahead(true);">' + i18next.t("Cancel") + '</button>';
    html += '<button type="button" class="btn btn-primary text-capitalize" id="b-edit-account-ok" onClick="st.validateEditedInfo();" disabled>' + i18next.t("Edit") + '</button>';
    html += '</div></div>';
    $("#setting-panel2").append(html);
    $("#setting-panel2").toggleClass('slide-on');
    $("#setting-panel1").toggleClass('slide-on-holder');
    cm.setTitleMenu("EditAccount", true);
};

// Assigned account name setting
account.setLinkAccName = function (accName, no) {
    st.linkAccName = accName;
    st.linkAccNameNo = no;
}
// Create account assignment role list
account.createAccountRole = function (obj, accName, no) {
    // Do not process while editing
    if ($(obj).hasClass('edit-ic')) return false;

    st.setLinkAccName(accName, no);
    $("#setting-panel2").remove();
    cm.setBackahead(true);
    personium.getAccountRoleList(cm.getMyCellUrl(), cm.getAccessToken(), accName, no).done(function (data) {
        st.dispAccountRoleList(data, accName, no);
        $("#setting-panel2").toggleClass('slide-on');
        $("#setting-panel1").toggleClass('slide-on-holder');
        cm.setTitleMenu(accName, true);
    });
}