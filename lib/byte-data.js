const fs = require('fs');

const LENGTH = 1024;

function init(path){
    let packages = [];
    let total = 0;

    let data = fs.readFileSync(path);
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
    return { packages, total };
}

module.exports = { init };
