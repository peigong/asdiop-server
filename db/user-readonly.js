const base = require('./user-base.js');

const logger = console;

let json = null;

function getJson(){
    base.getJson()
    .then((data) => {
        json = data;
    })
    .catch((err) => {
        logger.log(err.message);
    });
}
getJson();

let timer = setInterval(getJson, 99999);

function getUser(userId){
    if(!json){
        json = {};
    }
    logger.log('readonly db user getUser:');
    logger.log(json);
    logger.log(userId);
    return json[`${ userId }`] || 0;
}
module.exports = {
    getUser
};
