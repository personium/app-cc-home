// QRCODE reader Copyright 2011 Lazar Laszlo
// https://github.com/LazarSoft/jsqrcode

/*
 * Please prepare a <div> of id = "pqrdiv".
 * Display the web camera in <div> and load the QR code.
 */

// QR Canvas Context
var qCtx = null;
// QR Canvas
var qCanvas = null;
// QR Start Type(0:Shut Down,1:Start Up)
var stype = 0;
// getUserMedia Acquisition status
var gUM = false;
// webkit used status
var webkit = false;
// moz used status
var moz = false;
// video object
var v = null;
// media stream
var localMediaStream = null;

var vidhtml = '<p id="pqrm"></p><video id="v" style="max-width:100%;height:auto;" autoplay></video><canvas id="qr-canvas" width="800" height="600" style="display:none;">';

function initCanvas()
{
    document.getElementById("pqrdiv").innerHTML = vidhtml;
    v = document.getElementById("v");

    qCanvas = document.getElementById("qr-canvas");
    qCtx = qCanvas.getContext("2d");
}

function captureToCanvas() {
    console.count("setTimeoutTest");
    if(stype!=1)
        return;
    if(gUM)
    {
        try{
            qCtx.drawImage(v,0,0);
            try{
                qrcode.decode();
            }
            catch(e){       
                console.log(e);
                setTimeout(captureToCanvas, 500);
            };
        }
        catch(e){       
                console.log(e);
                setTimeout(captureToCanvas, 500);
        };
    }
}

function read(a)
{
    
}

/**
 * Quit the QR scanner
 */
function quit_pQR() {
    try {
        if (localMediaStream) {
            localMediaStream.getVideoTracks()[0].stop();
        }
        stype = 0;
    } catch (e) {
        console.log(e.message + ": localMediaStream=" + localMediaStream);
    }
}

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
function success(stream) {
    localMediaStream = stream;
    if(webkit)
        v.src = window.URL.createObjectURL(stream);
    else
    if(moz)
    {
        v.mozSrcObject = stream;
        v.play();
    }
    else
        v.src = stream;
    gUM=true;
    setTimeout(captureToCanvas, 500);
}
		
function error(error) {
    gUM = false;
    $("#pqrm").html("sorry, QR scanner can not be used. " + error.name + ":" + error.message);
    return;
}

/**
 * QR scanner start processing
 * @param {any} callback Callback function after completion of reading.
 *                       The QR code result is passed to the return value.
 */
function start_pQR(callback)
{
	if(isCanvasSupported() && window.File && window.FileReader)
	{
        initCanvas();
        if (callback) {
            qrcode.callback = callback;
        } else {
            qrcode.callback = read;
        }
        
        setwebcam();
	}
	else
    {
        $("#pqrm").html("sorry your browser is not supported");
	}
}

function setwebcam()
{
	
	var options = true;
	if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
	{
		try{
			navigator.mediaDevices.enumerateDevices()
			.then(function(devices) {
			  devices.forEach(function(device) {
				if (device.kind === 'videoinput') {
				  if(device.label.toLowerCase().search("back") >-1)
					options={'deviceId': {'exact':device.deviceId}, 'facingMode':'environment'} ;
				}
				console.log(device.kind + ": " + device.label +" id = " + device.deviceId);
			  });
			  setwebcam2(options);
			});
		}
		catch(e)
		{
			console.log(e);
		}
	}
	else{
		console.log("no navigator.mediaDevices.enumerateDevices" );
		setwebcam2(options);
	}
	
}

function setwebcam2(options)
{
	console.log(options);
    if(stype==1)
    {
        setTimeout(captureToCanvas, 500);    
        return;
    }
    var n=navigator.mediaDevices;
    
    if(n.getUserMedia)
	{
		webkit=true;
        n.getUserMedia({ video: options, audio: false }).then(success, error);
	}
    else
    if(n.webkitGetUserMedia)
    {
        webkit=true;
        n.webkitGetUserMedia({ video: options, audio: false }).then(success, error);
    }
    else
    if(n.mozGetUserMedia)
    {
        moz=true;
        n.mozGetUserMedia({ video: options, audio: false }).then(success, error);
    }

    stype=1;
    setTimeout(captureToCanvas, 500);
}