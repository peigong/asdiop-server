
const logger = console;
const user = require('../db/user-readonly.js');

function getUser(ctx, next){
    let o = ctx.query || {};
    let userId = o.userId || '';
    let checked = user.getUser(userId);
    ctx.body = checked ? '有效' : '无效';
}

module.exports = {
    getUser
};
