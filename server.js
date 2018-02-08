const net = require('net');
const fs = require('fs');
const path = require('path');

const { host, port } = require('./config.json');
const STATE = {
    INIT: 0,
    RUNING: 1,
    END: 2
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

let packages = [];
let total = 0;

const version = '4';
const LENGTH = 1024;
const versionPath = path.join(__dirname, '../../__data__', version);
fs.readFile(versionPath, (err, data) => {
    if(err){
        logger.error(err);
    }else{
        let buf = Buffer.from(data);
        let bufLength = buf.length;
        total = Math.ceil(bufLength / LENGTH);
        for(let i = 0; i < total; i++){
            let tail = null;
            let byteOffset = i * LENGTH;
            let len = bufLength - byteOffset;
            if(len > LENGTH){
                len = LENGTH;
            }else{
                tail = Buffer.alloc(LENGTH - len);
            }
            let bufArr = [Buffer.from(buf, byteOffset, len)];
            if(tail){
                bufArr.push(tail);
            }
            packages.push(Buffer.concat(bufArr));
            logger.log(`package index:${ i }`);
        }
        logger.log(`package total:${ total }`);
    }
});

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
        let v = bufData.toString('utf-8');
        // logger.log(`data on ${ remoteAddress }:${ data }`);
        if(v !== 'v'){
            state = STATE.RUNING;
            flag = bufData.readUInt32LE();
        }
        switch(state){
            case STATE.INIT:
                let ver = version * 1;
                let buf = Buffer.alloc(4); // 默认为0
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
            case STATE.RUNING:
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
        // err.message = ['socket', err.message].join(':');
        // logger.error(err);
    });
});
server.on('error', (err) => {
    err.message = ['server', err.message].join(':');
    logger.error(err);
});
