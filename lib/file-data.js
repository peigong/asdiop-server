const fs = require('fs');

const logger = console;

function init(path){
    let packages = fs.readFileSync(path);
    let total = packages.length;
    let tail = 0;
    logger.log(`packages total:${ total }`);
    return { packages, total, tail };
}

module.exports = { init };
