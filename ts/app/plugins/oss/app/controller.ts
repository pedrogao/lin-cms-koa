import Router from "koa-router";

const ossApi = new Router({ prefix: "/oss" });

ossApi.get("/", async ctx => {
  ctx.json({
    msg: "hello plugin"
  });
});

export default ossApi;
