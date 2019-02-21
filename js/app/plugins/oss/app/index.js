"use strict";

// 不要以controller来命名
const controller = require("./controller");
const {
  Image
} = require("./model");
// 所有被自动加载的项必须以default的方式
exports.default = {
  ossApi: controller,
  Image: Image
};