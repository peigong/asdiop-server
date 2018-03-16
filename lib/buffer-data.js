const fs = require('fs');

const LENGTH = 1024;
const logger = console;

function init(path){
    let packages = [];

    let data = fs.readFileSync(path);
    let len = data.length;
    let total = Math.ceil(len / LENGTH);
    let tail = len % LENGTH;
    if(0 === tail){
        tail = LENGTH;
    }
    for(let i = 0; i < total; i++){
        let l = LENGTH;
        let counter = i + 1;
        let sourceStart = i * LENGTH; // 开始拷贝的偏移量
        if(counter === total){
            l = tail;
        }
        let buf = Buffer.allocUnsafeSlow(l).fill(0);
        let sourceEnd = sourceStart + l; // 结束拷贝的偏移量（不包含）
        data.copy(buf, 0, sourceStart, sourceEnd);
        packages.push(buf);
        logger.log(`package index:${ i }`);
    }
    data = null;
    logger.log(`packages total:${ total }`);
    logger.log(`tail package:${ tail }`);
    return { packages, total, tail };
}

module.exports = { init };
