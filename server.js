const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = require('@koa/router')();
const Control = require("./Control");

app.use(bodyParser());

router.post('/updateControl', updateControl);

app.use(router.routes());

async function updateControl(ctx) {
  const { data } = ctx.request.body;
  console.log(data)
  Control.write(data);
  ctx.body = "OK";
};

if (!module.parent) app.listen(3000);