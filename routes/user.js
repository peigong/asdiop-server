
const user = require('../db/user.js');

function save(ctx, next){
    let res = {};
    res.status = { code: 0, des: 'OJBK' };

    let o = ctx.query || {};
    let userId = o.userId || '';
    let year = o.year || 2018;
    let month = o.month || 7;
    let day = o.day || 25;
    if(userId){
        try{
            let date = new Date(year, month, day, 23, 59, 59);
            user.save(userId, date.getTime());
        }catch(ex){
            res.status.code = 2;
            res.status.des = ex.message;
        }
    }else{
        res.status.code = 1;
        res.status.des = '瞎JB闹';
    }
    ctx.body = res;
}

function getUser(ctx, next){
    let o = ctx.query || {};
    let userId = o.userId || '';
    let time = user.getUser(userId);
    let date = new Date(time);
    ctx.body = date.toLocaleString();
}

function getUsers(ctx, next){
    let users = user.getUsers();
    ctx.body = Object.keys(users).map((key) => {
        let expiration = new Date(users[key]);
        return { user: key, expiration: expiration.toLocaleString() }; 
    });
}

module.exports = {
    save,
    getUser,
    getUsers
};
