"use strict";

const {
  createApp
} = require("./app");

const run = async () => {
  const app = await createApp();
  app.listen(3000, () => {
    app.context.logger.start("listening at http://localhost:3000");
  });
};
// 启动应用
// tslint:disable-next-line: no-floating-promises
run();