var notImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAABGCAYAAACe7Im6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUyREQ0MTQ1OTdEODExRTNBNzE3RDNCNTI0QUYxQjY4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjUyREQ0MTQ2OTdEODExRTNBNzE3RDNCNTI0QUYxQjY4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTJERDQxNDM5N0Q4MTFFM0E3MTdEM0I1MjRBRjFCNjgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTJERDQxNDQ5N0Q4MTFFM0E3MTdEM0I1MjRBRjFCNjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6o15UuAAADC0lEQVR42uyb2W7iQBBFG2P2fZMQiK+YR36fN574B0Dsm9nXmduSNZmJwwzpxW1TV7KSh8g0x7equ6qcSKfTeTDSJ0Wj0bWNX9rtNtH4oNvtxrrdLrMIxdciOASH4BAcgkNwCA7BCatsExbxeDzY+Xz+vSjbxvH9feHc73e22WzYfr9nx+Px88J+AcpkMiyXy7F4PP4+cNbrNVsulxzQV7per/zvcAFQuVzW7iZbt1smkwl3yytyHIcdDgdWr9e1usjSmVdGo9HLYD46aTgc/pGbQgNnNpt55pZXnTcej5+GY+DgAApCQ4YulwtbLBbhgSP7ywA0wizwcJAjRMPJK3/hGBB4ON9NwH7dV7tzVN0XDgo0HJW5AY3wQMNR+XQD7xzLUvcRqssJ5XBUHfcBRiV4LXCSyWSg7qsVTjqdVvKEUakHHk4kEmHFYlF6qAJ6KMqHfD7Pm1eyVK1Ww1NbIazQi4GLRIWml458o7VlgVAAIJH8AwfKDlEj4ECpVIo1Gg0Wi8Vedl6tVtMWTq6095DhoFarxavq1Wr1tLwAlGw2y0qlki/TCN+mDwgRXKfTibc08NMtBwACLsOOJCNPBQ4OWg7b7ZY3zr0KSLdf40KCg0I9fUAIIZQA5X/7wICHaz6fc1CFQkHLGUcbHIQL5lSYQYlU0i6oRCLBE7TqMY2WZle/3+eOkdViQH4aDAYcdmCdg0SLWZWKUQpAI9QQqpVKJVhwkHAxY1LdkIJ7kNARZrJ3NksVGDhGNRhXSPAYMxufczB0U7HQf2m32/GkbzQcgNE1rv1bgCNzRiYVDnYk7CR+ajqdSgtnaXCQFAHHbyGsZU1DpcHBruFXOHk5WIZ7pMBxX2EzRXCxjLc6pMDBTmGKa1wZBcc0YWMQHUULw0Fsoxg0UaJvYlgynpCuk/B3ajtf4ch+MSlUcHS8fiayaxGcJ/lQZH3CcEzbwmWuj+A8kXCzq9lsGg1HpAFm+/nhpov+GY3gEByCQ3AIDsEhOATnDcVPyL1ej0h4nf4dx/lBGDzLottPAQYAdNK3d3dhCSIAAAAASUVORK5CYII=";

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
  return "https://demo.personium.io/HomeApplication/";
  //return "https://demo.personium.io/Friend/";
  if (u.indexOf("file:") == 0) {
     //return "https://demo.personium.io/akio-shimono/";
     return "https://demo.personium.io/kyouhei-sakamoto/";
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
                $("#error_msg").html(getMsg("E0001"));
                $("#error_area").addClass('frames_active');
                cm.reAnimation();
	});
};

cm.reAnimation = function() {
    var el = $("#error_area");
    var newone = el.clone(true);

    el.before(newone);

    $("." + el.attr("class") + ":last").remove();
}