var notImage = "https://demo.personium.io/HomeApplication/__/icons/profile_image.png";

$(document).ready(function() {
  cm.loadProfile();
  $("#bLogin").on("click", function(e){
     // send id pw to cell and get access token
     cm.sendAccountNamePw($("#iAccountName").val(), $("#iAccountPw").val());

  });

});

var cm = {};

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

cm.rootUrl = cellUrl();
cm.loadProfile = function() {
	$.ajax({
		type: "GET",
		url: cm.rootUrl + '__/profile.json',
		dataType: 'json',
		headers: {'Accept':'application/json'}
	}).done(function(data) {
	        cm.profile = data;
		cm.populateProfile(data);
	}).fail(function(){
		alert("fail");
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
                data.pass = pw;
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