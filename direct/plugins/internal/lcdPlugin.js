var resources = require('./../../resources/model');

var lcd, interval;
var model = resources.pi.actuators.display;
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) {
  localParams = params;
  observe(model); //#A

  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () {
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    actuator.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
};

function observe(what) {
  Object.observe(what, function (changes) {
    console.info('Change detected by plugin for %s...', pluginName);
    switchOnOff(model.value); //#B
  });
};

function switchOnOff(value) {
  if (!localParams.simulate) {
    lcd.init().then(function() {
	  return lcd.createChar(0, [0x1b, 0x15, 0x0e, 0x1b, 0x15, 0x1b, 0x15, 0x0e]);
	}).then(function() {
	  return lcd.createChar(1, [0x0c, 0x12, 0x12, 0x0c, 0x00, 0x00, 0x00, 0x00]);
	}).then(function() {
	  return lcd.home();
	}).then(function() {
	  return lcd.print(value);
});
  }
};

function connectHardware() {
  var LCD = require("../../temp/i2c-lcd/lib/lcd");
  lcd = new LCD("/dev/i2c-1", 0x27);
  lcd.init().then(function() {
  return lcd.createChar(0, [0x1b, 0x15, 0x0e, 0x1b, 0x15, 0x1b, 0x15, 0x0e]);
}).then(function() {
  return lcd.createChar(1, [0x0c, 0x12, 0x12, 0x0c, 0x00, 0x00, 0x00, 0x00]);
}).then(function() {
  return lcd.home();
}).then(function() {
  return lcd.print("Bienvenido a ...");
}).then(function() {
  return lcd.setCursor(0, 2);
}).then(function() {
  return lcd.cursorUnder();
}).then(function() {
  return lcd.print("Elias Home Control!");
});
};

function simulate() {
  console.info('Simulated %s actuator started!', pluginName);
};