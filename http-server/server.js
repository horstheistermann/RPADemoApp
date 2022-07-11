/*
This module creates an HTTPS web server and serves static content
from a specified directory on a specified port.
To generate a new cert:
  openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
To remove the passphrase requirement:
  openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
Or just include the "passphrase" option when configuring the HTTPS server.
Sources:
- http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
- https://expressjs.com/en/starter/static-files.html
*/

const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');
const cors = require('cors');
const compression = require('compression')
const morgan = require('morgan');

const app = express();
app.use(cors({
    exposedHeaders: ['opc-request-id'],
}));
app.use(morgan('combined'));
app.use(compression());
app.use(express.static(getDirectory()));
app.get('/', function (req, res) {
    return res.end('<p>This server serves up static files.</p>');
});

function getDirectory() {
    return process.env.SERVER_DIRECTORY || 'dist';
}

function getHttpPort() {
    return process.env.SERVER_PORT || 8080;
}

function getHttpsPort() {
    return process.env.SERVER_PORT || 8484;
}

const options = {
    key: fs.readFileSync('server.key', 'utf8'),
    cert: fs.readFileSync('server.cert', 'utf8'),
    passphrase: process.env.HTTPS_PASSPHRASE || ''
};

const http_server = http.createServer(app);
const https_server = https.createServer(options, app);


http_server.listen(getHttpPort(), () => {
    console.error("Static HTTP server started on port=" + getHttpPort() + ", dir=" + getDirectory())
});

https_server.listen(getHttpsPort(), () => {
    console.error("Static HTTPS server started on port=" + getHttpsPort() + ", dir=" + getDirectory())
});

