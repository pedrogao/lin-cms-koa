"use strict";

const {
  toSafeInteger,
  get,
  isInteger
} = require("lodash");
const {
  ParametersException
} = require("lin-cms-test");

const {
  __decorate,
  __metadata
} = require("tslib");

function getSafeParamId (ctx) {
  const id = toSafeInteger(get(ctx.params, "id"));
  if (!isInteger(id)) {
    throw new ParametersException({
      msg: "路由参数错误"
    });
  }
  return id;
}

exports.getSafeParamId = getSafeParamId;

/**
 *  在js中使用装饰器语法的语法糖函数
 * @param {*} decorators 装饰器
 * @param {*} type 被装饰值的类型 String | Array
 * @param {*} target 被装饰类的原型
 * @param {*} key 被装饰器类的键
 * @example
 * tslib.__decorate([
 * Length(2, 20, {
 *  message: "昵称长度必须在2~10之间"
 * }),
 * IsNotEmpty({
 *  message: "昵称不可为空"
 * }),
 * tslib.__metadata("design:type", String)
 * ] , RegisterForm.prototype, "nickname", void 0);
 * // 可被转化为
 * decorate(
 * [Length(2, 20, {
 *  message: "昵称长度必须在2~10之间"
 * }),
 *  IsNotEmpty({
 *  message: "昵称不可为空"
 * })],
 * String,
 * RegisterForm.prototype,
 * "nickname"
 * )
 */
function decorateProp (decorators, type, target, key) {
  return __decorate([...decorators, __metadata("design:type", type)], target, key);
}

function decorateEntify (decorators, target) {
  return __decorate(decorators, target);
}

exports.decorateProp = decorateProp;
exports.decorateEntify = decorateEntify;