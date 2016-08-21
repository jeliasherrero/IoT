var createServer = require("auto-sni");

var server = createServer({
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
});

// Server is a "https.createServer" instance.
server.once("listening", ()=> {
    console.log("We are ready to go.");
});
