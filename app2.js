const Koa = require('koa');
const Router = require('koa-router');

const user = require('./routes/user-readonly.js');

const port = 8342;

const router = new Router();
router.get('/user', user.getUser);

const app = new Koa();
app
.use(router.routes())
.use(router.allowedMethods());

app.listen(port);
console.log(`app listening on port ${ port }.`);
