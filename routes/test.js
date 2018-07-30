
const logger = console;
const user = require('../db/user.js');

function getUsers(ctx, next){
    let users = user.getUsers();
    logger.log(users);
    ctx.body = Object.keys(users).map((key) => {
        let checked = users[key] ? '有效' : '无效';
        return { user: key, checked: checked }; 
    });
}

module.exports = {
    getUsers
};
