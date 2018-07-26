
const logger = console;
const user = require('../db/user.js');

function save(ctx, next){
    let res = {};
    res.status = { code: 0, des: 'OJBK' };

    let o = ctx.query || {};
    let userId = o.userId || '';
    let checked = o.checked || 0;
    if(!userId || (-1 === [0, 1].indexOf(+checked))){
        res.status.code = 1;
        res.status.des = '瞎JB闹';
    }else{
        user.save(userId, +checked);
    }
    ctx.body = res;
}

function getUser(ctx, next){
    let o = ctx.query || {};
    let userId = o.userId || '';
    let checked = user.getUser(userId);
    ctx.body = checked ? '有效' : '无效';
}

function getUsers(ctx, next){
    let users = user.getUsers();
    logger.log(users);
    ctx.body = Object.keys(users).map((key) => {
        let checked = users[key] ? '有效' : '无效';
        return { user: key, checked: checked }; 
    });
}

module.exports = {
    save,
    getUser,
    getUsers
};
