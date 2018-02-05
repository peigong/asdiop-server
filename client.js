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
let packages = [];

client.connect(port, host, () => {
    logger.log(`connected to: ${ host }:${ port }`);
    client.write(`${ state }${ version }`);
});

client.on('data', (data) => {
    switch(state){
        case STATE.INIT:
            total = data * 1;
            if(total > 0){ // 分包数大于0
                state = STATE.RUNING;
                client.write(`${ state }`);
            }
            break;
        case STATE.RUNING:
            total--;
            counter ++;
            packages.push(data);
            if(total){
                client.write(`${ state }${ counter }`);
            }else{ // 接收完毕
                state = STATE.END;
                let buf = Buffer.concat(packages, packages.length * 1024);
                let filePath = path.join(__dirname, '../../__tmp__', (new Date()).getTime() + '.jpg');
                fs.writeFile(filePath, buf, (err){
                    if(err){
                        logger.error(err);
                    }
                    client.destroy();
                });
            }
            break;
        default:
    }
});

client.on('close', (data) => {
    logger.log('client closed.');
});
