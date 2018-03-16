const fs = require('fs');

const LENGTH = 200;
const logger = console;

// let it = `As an asynchronous event driven JavaScript runtime, Node is designed to build scalable network applications. In the following "hello world" example, many connections can be handled concurrently. Upon each connection the callback is fired, but if there is no work to be done, Node will sleep.`;
// let data = (new Array(7).fill(it)).join('');

function init(path){
    let data = fs.readFileSync([ path, 'txt' ].join('.'));
    let len = data.length;
    let tail = 0;
    let packages = [];
    let total = Math.ceil(len / LENGTH);
    let mod = len % LENGTH;
    let appendage = new Array(LENGTH - mod).fill('-');
    data += appendage.join('');

    for(let i = 0; i < total; i++){
        let start = i * LENGTH;
        let part = data.substr(start, LENGTH);
        packages.push(Buffer.from(part));
        logger.log(`${ i } => ${ part }`);
    }
    logger.log(`package total:${ total }`);
    return { packages, total, tail };
}

module.exports = { init };
