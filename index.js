const Koa = require('koa');

const router = require('./router');
const config = require('./config');

const app = new Koa();

app.use(router.routes());

if(!config.port) throw new Error(`Port is ${config.port}`);

const server = app.listen(config.port);

module.exports = server;