$(document).ready(function(){
  i18next
    .use(i18nextXHRBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
        fallbackLng: 'en',
        ns: ['translation'],
        defaultNS: 'translation',
        debug: true,
        backend: {
            loadPath: 'https://app-cc-home.demo.personium.io/__/authform/locales/{{lng}}/{{ns}}.json'
           ,crossDomain: true
        }
    }, function(err, t) {
        initJqueryI18next();
        init();
        updateContent();
    });  
});

function init() {
  $('select[name="language"]').val(i18next.language);

  let pos = location.href.substring(0, 42);
  let action = location.href.substring(0, pos);
  $("#form").attr('action', action);

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
  let userCellUrl = action.replace("__authz", "");

  requestFile("GET", $("#client_id").val() + "__/profile.json", userCellUrl + "__/profile.json" ,true )

  $('select[name="language"]').change(function() {
    var lng = $(this).val();
    i18next.changeLanguage(lng, function (err, t){
        updateContent();
    });
  });
}

function initJqueryI18next() {
  jqueryI18next.init(i18next, $, { 
      useOptionsAttr: true 
  });
}

function updateContent() {
  $('[data-i18n]').localize();
}

//XMLHttpRequestオブジェクト生成
function createHttpRequest(){

  //Win ie用
  if(window.ActiveXObject){
      try {
          //MSXML2以降用
          return new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
          try {
              //旧MSXML用
              return new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e2) {
              return null;
          }
       }
  } else if(window.XMLHttpRequest){
      //Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用
      return new XMLHttpRequest();
  } else {
      return null;
  }
}

//ファイルにアクセスし受信内容を確認します
function requestFile(method , appFileName , dataFileName , async )
{
  //XMLHttpRequestオブジェクト生成
  var apphttpoj = createHttpRequest();
  var datahttpoj = createHttpRequest();

  //open メソッド
  apphttpoj.open( method , appFileName , async );
  datahttpoj.open( method , dataFileName , async );

  //受信時に起動するイベント
  apphttpoj.onreadystatechange = function() {

    //readyState値は4で受信完了
    if (apphttpoj.readyState==4) {
      //コールバック
      app_on_loaded(apphttpoj);
    }
  };
  datahttpoj.onreadystatechange = function() {

      //readyState値は4で受信完了
      if (datahttpoj.readyState==4) {
        //コールバック
        data_on_loaded(datahttpoj);
      }
    };

  //send メソッド
  apphttpoj.send(null);
  datahttpoj.send(null);
}

//コールバック関数 ( 受信時に実行されます )
function app_on_loaded(oj)
{
      //レスポンスを取得
      var res  = oj.responseText;

      var data= JSON.parse(res || "null");
      //ページで表示
      if (data.DisplayName || data.Description) {
        document.getElementById("logo").src = data.Image;
        document.getElementById("appName").textContent = data.DisplayName;
      } else {
        document.getElementById("logo").src = "https://app-cc-home.demo.personium.io/__/authform/img/warning.svg";
        $("#appName").attr("data-i18n", "unknownApplication").localize();
        $("#appName").css("color", "red");
        $("#warningMessage").show();
      }
      document.getElementById("description").textContent = data.Description;
}

//コールバック関数 ( 受信時に実行されます )
function data_on_loaded(oj)
{
      //レスポンスを取得
      var res  = oj.responseText;

      var data= JSON.parse(res || "null");
      //ページで表示
      document.getElementById("userimg").src = data.Image;
      document.getElementById("dataUserName").textContent = data.DisplayName;
}

// キャンセルボタン
function onCancel() {
    document.getElementById("cancel_flg").value = "1";
    document.form.submit();
}

