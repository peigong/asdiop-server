const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');


const port = 8341;
const WEBAPPS_ROOT = path.join(__dirname, '../../webapps');

const app = new Koa();
app.use(serve(WEBAPPS_ROOT));
app.listen(port);
console.log(`app listening on port ${ port }.`);
