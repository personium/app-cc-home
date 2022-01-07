$(document).ready(function () {
  i18next
    .use(i18nextXHRBackend)
    .use(i18nextBrowserLanguageDetector)
    .init(
      {
        fallbackLng: "en",
        ns: ["translation"],
        defaultNS: "translation",
        debug: true,
        backend: {
          loadPath:
            "${HOME_APP_CELL_URL}__/authform/locales/{{lng}}/{{ns}}.json",
          crossDomain: true,
        },
      },
      function (err, t) {
        initJqueryI18next();
        init();
        updateContent();
      }
    );
});

function init() {
  $('select[name="language"]').val(i18next.language);

  let pos = location.href.substring(0, 42);
  let action = location.href.substring(0, pos);
  $("#form").attr("action", action);

  let searchParams = new URLSearchParams(location.search);
  if (searchParams.get("response_type")) {
    $("#response_type").val(searchParams.get("response_type"));
  } else {
    $("#response_type").val("");
  }
  if (searchParams.get("redirect_uri")) {
    $("#redirect_uri").val(searchParams.get("redirect_uri"));
  } else {
    $("#redirect_uri").val("");
  }
  if (searchParams.get("client_id")) {
    $("#client_id").val(searchParams.get("client_id"));
  } else {
    $("#client_id").val("");
  }
  if (searchParams.get("state")) {
    $("#state").val(searchParams.get("state"));
  } else {
    $("#state").val("");
  }
  if (searchParams.get("p_target")) {
    $("#p_target").val(searchParams.get("p_target"));
  } else {
    $("#p_target").val("");
  }
  if (searchParams.get("p_owner")) {
    $("#p_owner").val(searchParams.get("p_owner"));
  } else {
    $("#p_owner").val("");
  }
  if (searchParams.get("error_description")) {
    $("#errorDescription").text(searchParams.get("error_description"));
    $("#errorDescription").show();
  }
  /*
  var match = location.search.match(/response_type=(.*?)(&|$)/);
  if (match) {
    $("#response_type").val(match[1]);
  } else {
    $("#response_type").val("");
  }
  match = location.search.match(/redirect_uri=(.*?)(&|$)/);
  if (match) {
    $("#redirect_uri").val(match[1]);
  } else {
    $("#redirect_uri").val("");
  }
  match = location.search.match(/client_id=(.*?)(&|$)/);
  if (match) {
    $("#client_id").val(match[1]);
  } else {
    $("#client_id").val("");
  }
  match = location.search.match(/state=(.*?)(&|$)/);
  if (match) {
    $("#state").val(match[1]);
  } else {
    $("#state").val("");
  }
  match = location.search.match(/p_target=(.*?)(&|$)/);
  if (match) {
    $("#p_target").val(match[1]);
  } else {
    $("#p_target").val("");
  }
  match = location.search.match(/p_owner=(.*?)(&|$)/);
  if (match) {
    $("#p_owner").val(match[1]);
  } else {
    $("#p_owner").val("");
  }
  */
  let userCellUrl = action.replace("__authz", "");

  requestFile(
    "GET",
    $("#client_id").val() + "__/profile.json",
    userCellUrl + "__/profile.json",
    true
  );

  $('select[name="language"]').change(function () {
    var lng = $(this).val();
    i18next.changeLanguage(lng, function (err, t) {
      updateContent();
    });
  });
}

function initJqueryI18next() {
  jqueryI18next.init(i18next, $, {
    useOptionsAttr: true,
  });
}

function updateContent() {
  $("[data-i18n]").localize();
}

// Generate XMLHttpRequest object
function createHttpRequest() {
  // For Win ie
  if (window.ActiveXObject) {
    try {
      // For MSXML 2 or later
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        // For old MSXML
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e2) {
        return null;
      }
    }
  } else if (window.XMLHttpRequest) {
    // For XMLHttpRequest object implementing browser other than Win ie for browser
    return new XMLHttpRequest();
  } else {
    return null;
  }
}

// Access the file and confirm the received contents
function requestFile(method, appFileName, dataFileName, async) {
  // Generate XMLHttpRequest object
  var apphttpoj = createHttpRequest();
  var datahttpoj = createHttpRequest();

  // open method
  apphttpoj.open(method, appFileName, async);
  datahttpoj.open(method, dataFileName, async);

  // Events to be activated upon reception
  apphttpoj.onreadystatechange = function () {
    // ReadyState value is 4 and reception is completed
    if (apphttpoj.readyState == 4) {
      // Callback
      app_on_loaded(apphttpoj);
    }
  };
  datahttpoj.onreadystatechange = function () {
    // ReadyState value is 4 and reception is completed
    if (datahttpoj.readyState == 4) {
      // Callback
      data_on_loaded(datahttpoj);
    }
  };

  // send method
  apphttpoj.send(null);
  datahttpoj.send(null);
}

// Callback function (executed on reception)
function app_on_loaded(oj) {
  // Acquire response
  var res = oj.responseText;

  var data = JSON.parse(res || "null");
  // View on page
  if (data.DisplayName || data.Description) {
    document.getElementById("logo").src = data.Image;
    document.getElementById("appName").textContent = data.DisplayName;
  } else {
    document.getElementById("logo").src =
      "${HOME_APP_CELL_URL}__/authform/img/warning.svg";
    $("#appName").attr("data-i18n", "unknownApplication").localize();
    $("#appName").css("color", "red");
    $("#warningMessage").show();
  }
  document.getElementById("description").textContent = data.Description;
}

// Callback function (executed on reception)
function data_on_loaded(oj) {
  // Acquire response
  var res = oj.responseText;

  var data = JSON.parse(res || "null");
  // View on page
  document.getElementById("userimg").src = data.Image;
  document.getElementById("dataUserName").textContent = data.DisplayName;
}

// Cancel button
function onCancel() {
  document.getElementById("cancel_flg").value = "1";
  document.form.submit();
}
