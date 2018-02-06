const fs = require('fs');
const net = require('net');
const path = require('path');

const { host, port } = require('./config.json');

const logger = console;
const client = new net.Socket();

const version = 1;
const STATE = {
    INIT: 0,
    RUNING: 1,
    END: 2
};

let total = 0;
let counter = 0;
let state = STATE.INIT;

client.connect(port, '127.0.0.1', () => {
    logger.log(`connected to: ${ host }:${ port }`);
    // client.write(`${ state }${ version }`);
    client.write('v');
});

client.on('data', (data) => {
    let filePath = path.join(__dirname, '../../__tmp__', (new Date()).getHours () + '.jpg');
    switch(state){
        case STATE.INIT:
            total = data.toString() * 1;
            logger.log(`package count:${ total }`);
            if(total > 0){ // 分包数大于0
                state = STATE.RUNING;
                // client.write(`${ state }`);
                client.write(`${ counter }`);
            }
            break;
        case STATE.RUNING:
            total--;
            counter++;
            logger.log(`${ counter }`);
            if(Buffer.isBuffer(data)){
                fs.appendFile(filePath, data, (err) => {
                    if(err){
                        logger.error(err);
                    }
                });
            }
            if(total){
                // client.write(`${ state }${ counter }`);
                client.write(`${ counter }`);
            }else{ // 接收完毕
                state = STATE.END;
                client.end();
                client.destroy();
            }
            break;
        default:
    }
});

client.on('close', (data) => {
    logger.log('client closed.');
});
