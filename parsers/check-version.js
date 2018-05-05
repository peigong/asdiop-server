const logger = console;

module.exports = function checkVersion(message){
    // let buf = Buffer.allocUnsafeSlow(4).fill(0); // 默认为0
    let version = bufData.readUInt32LE();
    let result = (9527 === version) ? 0 : 1;
    logger.log(`check version: ${ version }`);
    return Promise.resolve(result);
};
