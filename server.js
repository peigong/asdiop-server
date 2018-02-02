const net = require('net');
const fs = require('fs');
const path = require('path');

const { host, port } = require('./config.json');

const logger = console;
const server = net.createServer();

server.listen(port, host, () => {
    const { address, port } = server.address();
    logger.log(`Server listening on ${ address }:${ port }`);
});

let versionData;
const version = '3';
const versionPath = path.join(__dirname, '../../__data__', version);
fs.readFile(versionPath, (err, data) => {
    if(err){
        throw err;
    }else{
        versionData = data;
    }
});

server.on('connection', function(sock) {
    const remoteAddress = sock.remoteAddress;
    const remotePort = sock.remotePort;

    logger.log(`connected on ${ remoteAddress }:${ remotePort }`);

    sock.on('connect', (data) => {
        logger.log(`connect on ${ remoteAddress }:${ remotePort }`);
    });
    sock.on('data', (data) => {
        logger.log(`data on ${ remoteAddress }:${ data }`);
        var ver = data;
        if(ver < version){
            sock.write(versionData);
        }else{
            sock.write('0');
        }
    });
    sock.on('drain', (data) => {
        logger.log(`drain on ${ remoteAddress }:${ remotePort }`);
    });
    sock.on('end', (data) => {
        logger.log(`end on ${ remoteAddress }:${ remotePort }`);
    });
    sock.on('close', (data) => {
        logger.log(`closed on ${ remoteAddress }:${ remotePort }`);
    });
    sock.on('timeout', (data) => {
        logger.log(`timeout on ${ remoteAddress }:${ remotePort }`);
    });
    sock.on('error', (err) => {
        logger.error(err);
    });
});
server.on('error', (err) => {
    logger.error(err);
});
