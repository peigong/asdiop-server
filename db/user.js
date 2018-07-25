
const fs = require('fs');
const path = require('path');
const logger = console;

let json = null;
let flag = false; // JSON内容是否变更
let filename = path.join(__dirname, 'users.json');
fs.readFile(filename, (err, data) => {
    if(err){
        logger.log(err.message);
    }else{
        try{
            json = JSON.parse(data);
        }catch(ex){
            logger.log(ex.message);
        }
    }
});
let timer = setInterval(() => {
    if(json && flag){
        fs.writeFile(filename, JSON.stringify(json), (err) => {
            if(err){
                logger.log(err.message);
            }
        });
    }
}, 5e3);

function save(userId, date){
    if(!json){
        json = {};
    }
    json[userId] = date;
    flag = true;
}

function getUser(userId){
    return json[userId] || 0;
}

function getUsers(){
    return json || {};
}

function getDate(userId){
    if(!json){
        json = {};
    }
    return json[userId] || '';
}

module.exports = {
    save,
    getUser,
    getUsers,
    getDate
};
