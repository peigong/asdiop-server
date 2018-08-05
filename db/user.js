const base = require('./user-base.js');

const logger = console;

let json = null;
let flag = false; // JSON内容是否变更

base.getJson()
.then((data) => {
    json = data;
})
.catch((err) => {
    logger.log(err.message);
});

let timer = setInterval(() => {
    if(json && flag){
        base.writeJson(json)
        .then((data) => data)
        .catch((err) => {
            logger.log(err.message);
        });
    }
}, 77777);

function save(userId, checked){
    if(!json){
        json = {};
    }
    json[userId] = checked;
    flag = true;
}

function getUser(userId){
    if(!json){
        json = {};
    }
    logger.log('db user getUser:');
    logger.log(json);
    logger.log(userId);
    return json[`${ userId }`] || 0;
}

function getUsers(){
    return json || {};
}

module.exports = {
    save,
    getUser,
    getUsers
};
