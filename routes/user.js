
const user = require('../db/user.js');

function save(ctx, next){
    let res = {};
    res.status = { code: 0, des: 'OJBK' };

    let o = ctx.query || {};
    let userId = o.userId || '';
    let checked = o.checked || 0;
    // let year = o.year || 2018;
    // let month = o.month || 7;
    // let day = o.day || 25;
    if(!userId || (-1 === [0, 1].indexOf(+checked))){
        res.status.code = 1;
        res.status.des = '瞎JB闹';
    }else{
        user.save(userId, +checked);
        // try{
        //     let date = new Date(year, month, day, 23, 59, 59);
        //     user.save(userId, date.getTime());
        // }catch(ex){
        //     res.status.code = 2;
        //     res.status.des = ex.message;
        // }
    }
    ctx.body = res;
}

function getUser(ctx, next){
    let o = ctx.query || {};
    let userId = o.userId || '';
    let checked = user.getUser(userId);
    // let date = new Date(time);
    ctx.body = checked ? '有效' : '无效';
}

function getUsers(ctx, next){
    let users = user.getUsers();
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
