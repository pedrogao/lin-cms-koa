"use strict";

const {
  sseApi
} = require("./api/sse");
const {
  messageApi
} = require("./api/message");
const {
  Event,
  Message
} = require("./model");
// 所有被自动加载的项必须以default的方式

exports.default = {
  sseApi: sseApi,
  messageApi: messageApi,
  Event: Event,
  Message: Message
};