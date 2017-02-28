function(request){
  // GET 以外は405
  if(request.method !== "GET") {
     return {
            status : 405,
            headers : {"Content-Type":"application/json"},
            body : ['{"error":"method not allowed"}']
     };
  }

  var queryValue = request.queryString;
  if (queryValue === "") {
      return {
             status : 400,
             headers : {"Content-Type":"application/json"},
             body : ['{"error":"required parameter not exist."}']
      };
  }
  var params = dc.util.queryParse(queryValue);

  if (!params.target) {
      return {
          status: 200,
          headers: {"Content-Type":"application/json"},
          body: ['{"error":"Missing required parameter"}']
      };
  }

  var dcx = {sports: {HTTP: {}}};
  var __a = new com.fujitsu.dc.client.DcContext(dcjvm.getBaseUrl(), dcjvm.getCellName(), dcjvm.getBoxSchema(), dcjvm.getBoxName()).withToken(null);
  dcx.sports.HTTP._ra = com.fujitsu.dc.client.http.RestAdapterFactory.create(__a);
  var formatRes = function(dcr) {
    var resp = {body: "" + dcr.bodyAsString(), status: dcr.getStatusCode(), headers: {}};
    return resp;
  }

  // get
  dcx.sports.HTTP.get = function(url, headers) {
    if (!headers) {
    	headers = {"Accept": "text/plain"};
    }
    var dcr = dcx.sports.HTTP._ra.get(url, dc.util.obj2javaJson(headers), null);
    return formatRes(dcr);
  };

  var headersY = {};
  // エンドポイントへのGET
  var apiRes = dcx.sports.HTTP.get(params.target, headersY);

  if (apiRes === null || apiRes.status !== 200) {
    return {
      status : apiRes.status,
      headers : {"Content-Type":"application/json"},
      body : ['{"error": {"status":' + apiRes.status + ', "message": "API call failed."}}']
    };
  }

  // resを定義
  if (apiRes.status === 200) {
    return {
      status: 200,
      headers: {"Content-Type":"text/plain"},
      body: ["test"]
    };
  }
}