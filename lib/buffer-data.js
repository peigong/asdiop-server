const fs = require('fs');

const LENGTH = 200;
const logger = console;

function init(path){
    let packages = [];
    let total = 0;

    let data = fs.readFileSync(path);
    let len = data.length;
    total = Math.ceil(len / LENGTH);
    for(let i = 0; i < total; i++){
        let buf = Buffer.allocUnsafeSlow(LENGTH).fill(0);
        let sourceStart = i * LENGTH; // 开始拷贝的偏移量
        let sourceEnd = sourceStart + LENGTH; // 结束拷贝的偏移量（不包含）
        if(sourceEnd > len){
            sourceEnd = len;
        }
        data.copy(buf, 0, sourceStart, sourceEnd);
        packages.push(buf);
        logger.log(`package index:${ i }`);
    }
    data = null;
    logger.log(`package total:${ total }`);
    return { packages, total };
}

module.exports = { init };
