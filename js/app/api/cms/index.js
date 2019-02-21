"use strict";

const {
  user
} = require("./user");
const {
  test
} = require("./test");
const {
  log
} = require("./log");
const {
  admin
} = require("./admin");
const {
  Redprint
} = require("lin-cms-test");

const cms = new Redprint({
  prefix: "/cms"
});

exports.cms = cms;

cms.use(user.routes()).use(user.allowedMethods());
cms.use(test.routes()).use(test.allowedMethods());
cms.use(log.routes()).use(log.allowedMethods());
cms.use(admin.routes()).use(admin.allowedMethods());