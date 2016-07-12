$(document).ready(function() {
  $("#tUrl").html(cm.rootUrl);
  cm.loadProfile();
  $("#bLogin").on("click", function(e){
     // send id pw to cell and get access token
     cm.sendAccountNamePw($("#iAccountName").val(), $("#iAccountPw").val());

  });
  setInterval(cm.clock, 1000);

});

var cm = {};
var cellUrl = function() {
  var u = location.href;
  if (u.indexOf("file:") == 0) {
     return "https://demo.personium.io/akio-shimono/";
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
	});};
cm.populateProfile = function(profile) {
	$("#tProfileDisplayName").html(profile.DisplayName);
	document.title = "" + profile.DisplayName;
	$("#imProfile").attr("src", profile.Image);
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
		data.profile = cm.profile;
		sessionStorage.setItem("sessionData", JSON.stringify(data));
		location.href = "main.html";
		//location.href = "main.html#" + JSON.stringify(data);
	}).fail(function(){
		alert("fail");
	});
};

cm.clock = function() {
   var now = new Date();
   var ampm = "AM";
   var h = now.getHours();
   if (h > 11) {
     ampm = "PM";
   }
   if (h > 12) {
     h = h - 12;
   }
   $('#tHour').html(h);
   $('#tMin').html(("" + (100 + now.getMinutes())).substring(1,3));
   if (now.getSeconds()%2){
     $('#tClockSep').css("visibility","visible");
   } else {
     $('#tClockSep').css("visibility","hidden");
   }
   $('#tAmpm').html(ampm);

};
