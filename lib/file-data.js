const fs = require('fs');

const logger = console;

function init(path){
    let packages = fs.readFileSync(path);
    let total = packages.length;
    logger.log(`packages total:${ total }`);
    return { packages, total };
}

module.exports = { init };
