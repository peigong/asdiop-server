const net = require('net');

const { host, port } = require('./config.json');

const logger = console;
const client = new net.Socket();

client.connect(port, host, () => {
    logger.log(`connected to: ${ host }:${ port }`);
    client.write('1');
});

client.on('data', (data) => {
    logger.log(data.toString('utf-8'));
    client.destroy();
});

client.on('close', (data) => {
    logger.log('client closed.');
});
