const net = require('net');
const path = require('path');

// const data = require('./lib/text-data.js');
const data = require('./lib/buffer-data.js');
// const data = require('./lib/file-data.js');
const { host, port } = require('./config.json');

const STATE = {
    INIT: 0,
    RUNING: 1,
    TAIL: 2,
    END: 3
};

const logger = console;
const server = net.createServer({
    // 允许一个半开的TCP连接
    // allowHalfOpen: true
});

server.listen(port, host, () => {
    const { address, port } = server.address();
    logger.log(`Server listening on ${ address }:${ port }`);
});

const version = '4';
const versionPath = path.join(__dirname, '../../__data__', version);

let { packages, total, tail } = data.init(versionPath);

server.on('connection', function(socket) {
    const remoteAddress = socket.remoteAddress;
    const remotePort = socket.remotePort;

    logger.log(`connected on ${ remoteAddress }:${ remotePort }`);

    socket.on('connect', (data) => {
        logger.log(`connect on ${ remoteAddress }:${ remotePort }`);
    });
    socket.on('data', (data) => {
        socket.pause(); // 暂停接收data事件

        let flag = 0;
        let state = STATE.INIT;
        let bufData = Buffer.from(data);
        let message = bufData.toString('utf-8');
        // logger.log(`data on ${ remoteAddress }:${ data }`);
        switch(message){
            case 'v':
                state = STATE.INIT;
                break;
            case 'm':
                state = STATE.TAIL;
                break;
            default:
                state = STATE.RUNING;
                flag = bufData.readUInt32LE();
        }
        let buf = Buffer.allocUnsafeSlow(4).fill(0); // 默认为0
        switch(state){
            case STATE.INIT:
                let ver = version * 1;
                if(flag < ver){
                    buf.writeUInt32LE(packages.length);
                }
                socket.write(buf, (err) => {
                    if(err){
                        logger.error(err);
                    }
                    socket.resume(); // 恢复接收data事件
                });
                break;
            case STATE.TAIL:
                buf.writeUInt32LE(tail);
                socket.write(buf, (err) => {
                    if(err){
                        logger.error(err);
                    }
                    socket.resume(); // 恢复接收data事件
                });
                break;
            case STATE.RUNING:
                // socket.write(packages, (err) => {
                //     if(err){
                //         logger.error(err);
                //     }
                // });
                if(flag < total){
                    let b = packages[flag];
                    if(Buffer.isBuffer(b)){
                        socket.write(b, (err) => {
                            if(err){
                                logger.error(err);
                            }
                            socket.resume(); // 恢复接收data事件
                        });
                    }
                }else{
                    logger.log(['package exception', flag].join(':'));
                }
                break;
            default:
        }
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
