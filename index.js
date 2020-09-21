const { request } = require('chai');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const config = require('./config');
const router = require('./router');

const app = new Koa();

app.use(bodyParser());
app.use(router.routes());

if(!config.port) throw new Error(`Port is ${config.port}`);

const server = app.listen(config.port);

module.exports = server;