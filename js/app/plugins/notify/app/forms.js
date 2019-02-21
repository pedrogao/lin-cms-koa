"use strict";

const {
  decorateProp
} = require("../../../libs/util");
const {
  Form
} = require("lin-cms-test");
const {
  Min,
  IsInt,
  IsNotEmpty
} = require("class-validator");

class EventsForm extends Form {}

decorateProp([
  Min(1, {
    message: "分组id必须大于0"
  }),
  IsInt({
    message: "分组id必须是整数"
  }),
  IsNotEmpty({
    message: "请输入分组id"
  })
], Number, EventsForm.prototype, "groupId");

decorateProp([
  IsNotEmpty({
    each: true,
    message: "请输入events字段"
  })
], Array, EventsForm.prototype, "events");

exports.EventsForm = EventsForm;

class IdsForm extends Form {}
decorateProp([
  Min(1, {
    message: "分组id必须大于0",
    each: true
  }),
  IsInt({
    message: "分组id必须是整数",
    each: true
  }),
  IsNotEmpty({
    message: "请输入分组id",
    each: true
  })
], Array, IdsForm.prototype, "ids");

exports.IdsForm = IdsForm;