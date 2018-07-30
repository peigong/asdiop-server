const path = require('path');

const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');

const user = require('./routes/user.js');
const test = require('./routes/test.js');

const port = 8341;
const WEBAPPS_ROOT = path.join(__dirname, '../../webapps');

const router = new Router();
router.get('/user', user.getUser);
router.get('/save', user.save);
router.get('/users', test.getUsers);

const app = new Koa();
app
.use(serve(WEBAPPS_ROOT))
.use(router.routes())
.use(router.allowedMethods());

app.listen(port);
console.log(`app listening on port ${ port }.`);
