const net = require('net');
const parsers = require('./parsers');

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
        socket.pause(); // 暂停接收data事件

        function send(message){
            let buf = Buffer.allocUnsafeSlow(4).fill(0); // 默认为0
            buf.writeUInt32LE(message);
            socket.write(buf, (err) => {
                if(err){
                    logger.error(err);
                }
                socket.resume(); // 恢复接收data事件
            });
        }

        const LENGTH = 10;
        let bufData = Buffer.from(data);

        let type = Buffer.from(bufData, 0, LENGTH).toString('utf-8');
        let message =  Buffer.from(bufData, LENGTH);
        logger.log(`type: ${ type }`);
        if(parsers.hasOwnProperty(type)){
            parsers[type](message).then(send).catch(logger.log);
        }else{
            send(10000); // 没有定义解析器的异常
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
