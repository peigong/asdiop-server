const net = require('net');

const HOST = '127.0.0.1';
const PORT = '8314';

const logger = console;
const server = net.createServer();
server.listen(PORT, HOST, () => {
    const { address, port } = server.address();
    logger.log(`Server listening on ${ address }:${ port }`);
});

server.on('connection', function(sock) {
    const remoteAddress = sock.remoteAddress;
    const remotePort = sock.remotePort;
    logger.log(`connected on ${ remoteAddress } : ${ remotePort }`);
    sock.on('connect', (data) => {
        logger.log(`connect on ${ remoteAddress } : ${ remotePort }`);
    });
    sock.on('data', (data) => {
        logger.log(`data on ${ remoteAddress } : ${ data }`);
        sock.write(`You said: ${ data }`);
    });
    sock.on('drain', (data) => {
        logger.log(`drain on ${ remoteAddress } : ${ remotePort }`);
    });
    sock.on('end', (data) => {
        logger.log(`end on ${ remoteAddress } : ${ remotePort }`);
    });
    sock.on('close', (data) => {
        logger.log(`closed on ${ remoteAddress } : ${ remotePort }`);
    });
    sock.on('timeout', (data) => {
        logger.log(`timeout on ${ remoteAddress } : ${ remotePort }`);
    });
    sock.on('error', (err) => {
        logger.error(err);
    });
});
server.on('error', (err) => {
    logger.error(err);
});
