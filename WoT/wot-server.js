var restApp = require('./servers/http'),
  wsServer = require('./servers/websockets'),
  resources = require('./resources/model'),
  fs = require('fs'),
  serverSecure = require("auto-sni");


var createServer = function (port, secure) {
  if (process.env.PORT) port = process.env.PORT;
  else if (port === undefined) port = resources.customFields.port;
  if (secure === undefined) secure = resources.customFields.secure;

  initPlugins(); //#A

  if(secure) {
    var https = require('https'); //#B
    var certFile = './resources/caCert.pem'; //#C
    var keyFile = './resources/privateKey.pem'; //#D
    var passphrase = '1Anagal1'; //#E

    var config = {
      cert: fs.readFileSync(certFile),
      key: fs.readFileSync(keyFile),
      passphrase: passphrase
    };


    return server = https.createServer({
 	    key: fs.readFileSync('/etc/letsencrypt/live/domoticuz.duckdns.org/privkey.pem', 'ascii'),
	    cert: fs.readFileSync('/etc/letsencrypt/live/domoticuz.duckdns.org/cert.pem', 'ascii'),
	    email: "jelias@unizar.es", // Emailed when certificates expire.
	    agreeTos: true, // Required for letsencrypt.
	    debug: true, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
	    domains: [["domoticuz.duckdns.org", "www.domoticuz.duckdns.org"]], // List of accepted domain names. (You can use nested arrays to register bundles with LE).
	    forceSSL: true, // Make this false to disable auto http->https redirects (default true).
	    redirectCode: 301, // If forceSSL is true, decide if redirect should be 301 (permanent) or 302 (temporary). Defaults to 302
	    ports: {
	        http: 80, // Optionally override the default http port.
	        https: 443 // // Optionally override the default https port.
	    }
	    }, restApp).listen(port, function () {
	        	wsServer.listen(server); //#G
	        	console.log('Secure WoT server started on port %s', port);
    		});

    //return server = https.createServer(config, restApp) //#F
    //  .listen(port, function () {
    //    wsServer.listen(server); //#G
    //    console.log('Secure WoT server started on port %s', port);
    //})
  } else {
    var http = require('http');
    return server = http.createServer(restApp)
      .listen(process.env.PORT | port, function () {
        wsServer.listen(server);
        console.log('Insecure WoT server started on port %s', port);
    })
  }
};

function initPlugins() {
  var LedsPlugin = require('./plugins/internal/ledsPlugin').LedsPlugin;
  var PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
  var Dht22Plugin = require('./plugins/internal/dht22Plugin').Dht22Plugin;

  pirPlugin = new PirPlugin({'simulate': false, 'frequency': 5000});
  pirPlugin.start();

  ledsPlugin = new LedsPlugin({'simulate': false, 'frequency': 5000});
  ledsPlugin.start();

  dht22Plugin = new Dht22Plugin({'simulate': false, 'frequency': 5000});
  dht22Plugin.start();
}

module.exports = createServer;

process.on('SIGINT', function () {
  ledsPlugin.stop();
  pirPlugin.stop();
  dht22Plugin.stop();
  console.log('Bye, bye!');
  process.exit();
});

//#A Start the internal hardware plugins
//#B If in secure mode, import the HTTPS module
//#C The actual certificate file of the server
//#D The private key of the server generated earlier
//#E The password of the private key
//#F Create an HTTPS server using the config object
//#G By passing it the server you create, the WebSocket library will automatically detect and enable TLS support