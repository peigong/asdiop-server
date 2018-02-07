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
    let buf = Buffer.from('v');
    client.write(buf);
});

client.on('data', (data) => {
    let bufData = Buffer.from(data);
    let filePath = path.join(__dirname, '../../__tmp__', (new Date()).getHours () + '.jpg');
    switch(state){
        case STATE.INIT:
            total = bufData.readUInt32LE();
            logger.log(`package count:${ total }`);
            if(total > 0){ // 分包数大于0
                state = STATE.RUNING;
                let buf = Buffer.alloc(4); // 默认为0
                client.write(buf);
            }
            break;
        case STATE.RUNING:
            counter++;
            logger.log(`${ counter }`);
            let write = (1 === counter) ? fs.writeFileSync : fs.appendFileSync;
            try{
                write(filePath, bufData);
            }catch(ex){
                logger.error(ex);
            }
            if(counter < total){
                let buf = Buffer.alloc(4);
                buf.writeUInt32LE(counter);
                client.write(buf);
            }else{ // 接收完毕
                state = STATE.END;
                client.destroy();
            }
            break;
        default:
    }
});

client.on('close', (data) => {
    logger.log('client closed.');
});
