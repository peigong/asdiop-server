const net = require('net');
const path = require('path');

const { host, port } = require('./config.json');

const logger = console;
const server = net.createServer({
    // 允许一个半开的TCP连接
    // allowHalfOpen: true
});

server.listen(port, host, () => {
    const { address, port } = server.address();
    logger.log(`Server listening on ${ address }:${ port }`);
});

server.on('connection', function(socket) {
    const remoteAddress = socket.remoteAddress;
    const remotePort = socket.remotePort;

    logger.log(`connected on ${ remoteAddress }:${ remotePort }`);

    socket.on('connect', (data) => {
        logger.log(`connect on ${ remoteAddress }:${ remotePort }`);
    });
    socket.on('data', (data) => {
        // socket.pause(); // 暂停接收data事件
        let buf = Buffer.allocUnsafe(8); // 默认为0
        let now = Date.now();
        // buf.writeUIntLE(now, 0, 8);
        buf.writeUIntLE(1531889030648, 0, 8);
        socket.write(buf, (err) => {
            if(err){
                logger.error(err);
            }
        });
    });
    socket.on('drain', (data) => {
        logger.log(`drain on ${ remoteAddress }:${ remotePort }`);
    });
    socket.on('end', (data) => {
        logger.log(`end on ${ remoteAddress }:${ remotePort }`);
    });
    socket.on('close', (data) => {
        logger.log(`closed on ${ remoteAddress }:${ remotePort }`);
    });
    socket.on('timeout', (data) => {
        logger.log(`timeout on ${ remoteAddress }:${ remotePort }`);
    });
    socket.on('error', (err) => {
        err.message = ['socket', err.message].join(':');
        logger.error(err);
    });
});
server.on('error', (err) => {
    err.message = ['server', err.message].join(':');
    logger.error(err);
});
