"use strict";

const {
  book
} = require("./book");
const {
  Redprint
} = require("lin-cms-test");

const v1 = new Redprint({
  prefix: "/v1"
});

exports.v1 = v1;

v1.use(book.routes()).use(book.allowedMethods());