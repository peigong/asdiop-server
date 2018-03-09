
const LENGTH = 10;
const logger = console;

let data = `As an asynchronous event driven JavaScript runtime, Node is designed to build scalable network applications. In the following "hello world" example, many connections can be handled concurrently. Upon each connection the callback is fired, but if there is no work to be done, Node will sleep.`;
let len = data.length;
let packages = [];
let total = Math.ceil(len / LENGTH);
let mod = len % LENGTH;
let tail = new Array(LENGTH - mod).fill('-');
data += tail.join('');

function init(path){
    for(let i = 0; i < total; i++){
        let start = i * LENGTH;
        let part = data.substr(start, LENGTH);
        packages.push(Buffer.from(part));
        logger.log(`${ i } => ${ part }`);
    }
    logger.log(`package total:${ total }`);
    return { packages, total };
}

module.exports = { init };
