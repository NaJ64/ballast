const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');

(async function() {

    const packageJson = require(path.resolve(__dirname, './package.json'));
    const serverConfigJson = require(path.resolve(__dirname, './server-config.json'));
    
    // function export
    const server = module.exports = async function() {
        try {

            let useHttps = serverConfigJson.expressUseHttps;
            let redirectToHttps = serverConfigJson.redirectToHttps || false;

            // Server config display (don't show https/certs if not using)
            let serverConfigDisplay = {
                expressUseHttps: serverConfigJson.expressUseHttps,
                expressHost: serverConfigJson.expressHost,
                expressPort: serverConfigJson.expressPort,
                redirectToHttps: serverConfigJson.redirectToHttps,
                redirectHost: serverConfigJson.redirectHost || "",
                redirectPort: serverConfigJson.redirectPort || 80
            };
            if (useHttps) {
                Object.assign(serverConfigDisplay, {
                    sslCertificatePath: serverConfigJson.sslCertificatePath,
                    sslPrivateKeyPath: serverConfigJson.sslPrivateKeyPath,
                    sslPrivateKeyPassphrase: serverConfigJson.sslPrivateKeyPassphrase
                });
            }

            // new app instance
            console.log('\n' + 'Starting new "' + packageJson.name + '" server with config: \n\n  ' + JSON.stringify(serverConfigDisplay) + '\n');

            // determine host/ports to listen on
            let host = serverConfigJson.expressHost;
            let port = serverConfigJson.expressPort;
            let redirectToHost = serverConfigJson.redirectHost;
            let redirectToPort = serverConfigJson.redirectPort;

            // create express App
            let expressApp = express();
            expressApp.use('/', express.static(path.join(__dirname, 'wwwroot')));

            // check if using https
            if (useHttps) {
                
                let sslCertificate = fs.readFileSync(path.resolve(serverConfigJson.sslCertificatePath));
                let sslPrivateKey = fs.readFileSync(path.resolve(serverConfigJson.sslPrivateKeyPath));
                let sslPrivateKeyPassphrase = serverConfigJson.sslPrivateKeyPassphrase;

                // Get certificate & key
                let key = sslPrivateKey;
                let cert = sslCertificate;
                let passphrase = sslPrivateKeyPassphrase;

                // Https listen
                let httpsOptions = { key: key, cert: cert, passphrase: passphrase };
                await new Promise((resolve) => 
                    https.createServer(httpsOptions, expressApp).listen(port, host, () => {
                        resolve(expressApp);
                    })
                );

            } else {

                // Http listen
                await new Promise((resolve) => 
                    http.createServer(expressApp).listen(port, host, () => {
                        resolve(expressApp);
                    })
                );

            }

            console.log('Express app now listening on: \n\n  ' + (useHttps ? 'https': 'http') +'://' + host + ':' + port + '/\n');
        
            // listen on http and redirect all traffic to https
            if (useHttps && redirectToHttps) {

                // redirect to secure address
                http.createServer(function (req, res) {
                    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
                    res.end();
                }).listen(redirectToPort, redirectToHost);

                console.log('Secure redirect http server now listening on: \n\n  ' + 'http://' + redirectToHost + ':' + redirectToPort + '/\n');
                
            }
            
        }
        catch (err) {
            console.log('server error: ' + err)
        }
    };

    if (!module.parent) {
        await server();
    }

})();