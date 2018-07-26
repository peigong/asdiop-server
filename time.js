const net = require('net');
const path = require('path');

const { host, port } = require('./config.json');
const user = require('./db/user.js');

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
        let bufData = Buffer.from(data);
        let userId = bufData.readUInt32LE();
        logger.log('========= data ==========');
        logger.log(userId);
        let checked = user.getUser(userId);
        logger.log('========= checked ==========');
        logger.log(checked);
        let buf = Buffer.allocUnsafe(8); // 默认为0
        let now = Date.now();
        let seconds = Math.floor(now / 1e3);
        if(checked){
            buf.writeUIntLE(seconds, 0, 8);
        }else{
            buf.writeUIntLE(1848138973, 0, 8);
        }
        // let now = Date.now();
        // let userId = Buffer.from(data).toString('utf-8');
        // 1848138973
        // let time = user.getUser(userId);
        // let buf = Buffer.allocUnsafeSlow(4).fill(0); // 默认为0
        // if(time > now){
        //     buf.writeUInt32LE(1);
        // }
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
