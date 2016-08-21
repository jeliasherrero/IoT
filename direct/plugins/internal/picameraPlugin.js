var resources = require('./../../resources/model');

var interval, camera;
var model = resources.pi.sensors.piCamera;
var pluginName = resources.pi.sensors.camera.name;
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) { //#A
  localParams = params;
  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () { //#A
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    camera.stop();
  }
  //console.info('%s plugin stopped!', pluginName);
};

function connectHardware() { //#B
  var RaspiCam = require('raspicam');
  camera = new RaspiCam({
	mode: "photo",
	output: "./photo/image.jpg",
	encoding: "jpg",
	vflip: "true"
  });

  camera.on("started", function(err, timestamp){
  	//console.log("foto tomada a las " + timestamp);
  });

  camera.on("read", function(err,timestamp,filename){
	if (err) console.log('Ha surgido un problema: ' + err);
	//console.log("imagen capturada con el nombre: " + filename);
  });

  camera.on("exit", function(err, timestamp){
	camera.stop();
  	//console.log("Restaurando la camara");
	camera.start();
  });

  setTimeout(function () {
	camera.start();
  }, localParams.frequency); 
  //console.info('Hardware %s sensor started!', pluginName);
};

function simulate() { //#E
  interval = setInterval(function () {
    showValue();
  }, localParams.frequency);
  console.info('Simulated %s sensor started!', pluginName);
};

function showValue() {
  console.info('Imagen capturada');
};