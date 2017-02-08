var notImage = "https://demo.personium.io/HomeApplication/__/icons/profile_image.png";
var cm = {};

$(document).ready(function() {
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
          if (target.slice(-1) != "/") {
              target += "/";
          }
          $('#errorCellUrl').html(getMsg("E0022"));
      } else {
          // no target
          target = sessionStorage.getItem("targetCellUrl");
          $('#errorCellUrl').html("");
      }

      targetCellLogin(target);
  } else {
      cm.rootUrl = cellUrl();
      cm.loadProfile();

      sessionStorage.setItem("mode", "local");
      sessionStorage.setItem("targetCellUrl", cm.rootUrl);
  }

  $('#b-input-cell-ok').on('click', function () {
     $('#modal-input-cell').modal('hide');
     targetCellLogin($("#pCellUrl").val());
  });
  $("#bLogin").on("click", function(e){
     // send id pw to cell and get access token
     cm.sendAccountNamePw($("#iAccountName").val(), $("#iAccountPw").val());
  });
  $("#gLogin").on("click", function(e) {
     //var url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=102363313215-408im4hc7mtsgrda4ratkro2thn58bcd.apps.googleusercontent.com&response_type=code+id_token&scope=openid%20email%20profile&redirect_uri=https%3A%2F%2Fdemo.personium.io%2FoidcTest%2Foidc%2Fdav%2Findex2.html&state=abc&display=popup&nonce=personium";
     var url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=102363313215-408im4hc7mtsgrda4ratkro2thn58bcd.apps.googleusercontent.com&response_type=code+id_token&scope=openid%20email%20profile&redirect_uri=https%3A%2F%2Fdemo.personium.io%2FHomeApplication%2F__%2Fja%2Fhomeapp_google_auth.html&state=abc&display=popup&nonce=personium";

     window.location.href = url;
  });

});

var targetCellLogin = function(cellUrl) {
    getCell(cellUrl).done(function(data, status, xhr) {
        if (xhr.responseText.match(/urn:x-personium:xmlns/)) {
            var i = cellUrl.indexOf("/", 8); // first slash
            i = cellUrl.indexOf("/", i + 1);  // second slash
            cm.rootUrl = cellUrl.substring(0, i + 1);

            sessionStorage.setItem("targetCellUrl", cm.rootUrl);
            sessionStorage.setItem("mode", "global");

            cm.loadProfile();
        } else {
            $("#pCellUrl").val(cellUrl)
            $('#modal-input-cell').modal('show');
        }
    }).fail(function(data) {
        $("#pCellUrl").val(cellUrl)
        $('#modal-input-cell').modal('show');
    });
};

var cellUrl = function() {
  var u = location.href;
  //return "https://demo.personium.io/HomeApplication/";
  //return "https://demo.personium.io/Friend/";
  if (u.indexOf("file:") == 0) {
     //return "https://demo.personium.io/akio-shimono/";
     //return "https://demo.personium.io/kyouhei-sakamoto/";
     return "https://demo.personium.io/HomeApplication/";
  }
  var i = u.indexOf("/", 8); // first slash
  i = u.indexOf("/", i + 1);  // second slash
  return u.substring(0, i + 1);
};

cm.loadProfile = function() {
	$.ajax({
		type: "GET",
		url: cm.rootUrl + '__/profile.json',
		dataType: 'json',
		headers: {'Accept':'application/json'}
	}).done(function(data) {
	        cm.profile = data;
                sessionStorage.setItem("myProfile", cm.profile);
		cm.populateProfile(data);
	}).fail(function(){
		alert("I do not have a profile.");
	});
};
cm.populateProfile = function(profile) {
	$("#tProfileDisplayName").html(profile.DisplayName);
	document.title = "" + profile.DisplayName;
        if (profile.Image) {
	    $("#imProfile").attr("src", profile.Image);
        } else {
            $("#imProfile").attr("src", notImage);
        }
};

cm.sendAccountNamePw = function(username, pw) {
	$.ajax({
		type: "POST",
		url: cm.rootUrl + '__auth',
		processData: true,
		dataType: 'json',
		data: {
			grant_type: "password",
			username: username,
			password: pw
		},
		headers: {'Accept':'application/json'}
	}).done(function(data) {
                data.username=username;
                data.cellUrl = cm.rootUrl;
                var i = cm.rootUrl.indexOf("/"); // first slash
                i = cm.rootUrl.indexOf("/", i + 2);  // second slash
                data.baseUrl = cm.rootUrl.substring(0, i + 1);
                data.profile = cm.profile;
                data.userName = username;
                sessionStorage.setItem("sessionData", JSON.stringify(data));
                location.href = "main.html";
                //location.href = "main.html#" + JSON.stringify(data);
	}).fail(function(){
		//alert("fail");
                $("#error_area").removeClass('frames_active');
                $("#error_area").removeClass('frames_hide');
                $("#error_msg").html(getMsg("E0001"));
                $("#error_area").addClass('frames_active').on('transitionend', function() {
                    $(this).addClass('frames_hide');
                })
                //$("#error_area").addClass('frames_active');
                //cm.reAnimation();
	});
};

cm.reAnimation = function() {
    var el = $("#error_area");
    var newone = el.clone(true);

    el.before(newone);

    $("." + el.attr("class") + ":last").remove();
}

function getCell(cellUrl) {
    //return $.ajax({
    //            type: "GET",
    //            url: "https://demo.personium.io/HomeApplication/__/service/getCell",
    //            data: {
    //                'target': cellUrl
    //            },
    //            headers:{
    //                'Accept':'application/json'
    //            }
    //});

    return $.ajax({
                type: "GET",
                url: cellUrl,
                headers:{
                    'Accept':'application/xml'
                }
    });
};