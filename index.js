const Koa = require('koa');
const app = new Koa();
const router = require('./router');

if(process.env.PORT == undefined) {
    throw new Error(`Port is ${process.env.PORT} !`);
}

app.use(router.routes());

app.listen(process.env.PORT);