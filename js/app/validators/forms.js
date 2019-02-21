"use strict";

const {
  Length,
  IsNotEmpty,
  Min,
  IsInt,
  IsEmail,
  IsOptional,
  Matches,
  Validate
} = require("class-validator");
const {
  Form,
  EqualFeild,
  DateFormat
} = require("lin-cms-test");
const {
  decorateProp
} = require("../libs/util");

class RegisterForm extends Form {}
decorateProp([
  Length(2, 20, {
    message: "昵称长度必须在2~10之间"
  }),
  IsNotEmpty({
    message: "昵称不可为空"
  })
], String, RegisterForm.prototype, "nickname");

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
], Number, RegisterForm.prototype, "groupId");

decorateProp([
  IsEmail({}, {
    message: "电子邮箱不符合规范，请输入正确的邮箱"
  }),
  IsOptional()
], String, RegisterForm.prototype, "email");

decorateProp([
  EqualFeild("confirmPassword", {
    message: "两次输入的密码不一致，请输入相同的密码"
  }),
  Matches(/^[A-Za-z0-9_*&$#@]{6,22}$/, {
    message: "密码长度必须在6~22位之间，包含字符、数字和 _ "
  }),
  IsNotEmpty({
    message: "新密码不可为空"
  })
], String, RegisterForm.prototype, "password");

decorateProp([
  IsNotEmpty({
    message: "请输入确认密码"
  })
], String, RegisterForm.prototype, "confirmPassword");

exports.RegisterForm = RegisterForm;

class LoginForm extends Form {}
decorateProp([
  IsNotEmpty({
    message: "请填写昵称"
  })
], String, LoginForm.prototype, "nickname");

decorateProp([
  IsNotEmpty({
    message: "密码不可为空"
  })
], String, LoginForm.prototype, "password");

exports.LoginForm = LoginForm;
/**
 * 用户更新自己的邮箱
 */
class UpdateInfoForm extends Form {}
decorateProp([
  IsEmail({}, {
    message: "电子邮箱不符合规范，请输入正确的邮箱"
  })
], String, UpdateInfoForm.prototype, "email");
exports.UpdateInfoForm = UpdateInfoForm;

class ResetPasswordForm extends Form {}
decorateProp([
  EqualFeild("confirmPassword", {
    message: "两次输入的密码不一致，请输入相同的密码"
  }),
  Matches(/^[A-Za-z0-9_*&$#@]{6,22}$/, {
    message: "密码长度必须在6~22位之间，包含字符、数字和 _ "
  }),
  IsNotEmpty({
    message: "新密码不可为空"
  })
], String, ResetPasswordForm.prototype, "newPassword");

decorateProp([
  IsNotEmpty({
    message: "请确认密码"
  })
], String, ResetPasswordForm.prototype, "confirmPassword");

exports.ResetPasswordForm = ResetPasswordForm;

class ChangePasswordForm extends Form {}
decorateProp([
  EqualFeild("confirmPassword", {
    message: "两次输入的密码不一致，请输入相同的密码"
  }),
  Matches(/^[A-Za-z0-9_*&$#@]{6,22}$/, {
    message: "密码长度必须在6~22位之间，包含字符、数字和 _ "
  }),
  IsNotEmpty({
    message: "新密码不可为空"
  })
], String, ChangePasswordForm.prototype, "newPassword");

decorateProp([
  IsNotEmpty({
    message: "请确认密码"
  })
], String, ChangePasswordForm.prototype, "confirmPassword");

decorateProp([
  IsNotEmpty({
    message: "请输入旧密码"
  })
], String, ChangePasswordForm.prototype, "oldPassword");

exports.ChangePasswordForm = ChangePasswordForm;

class LogFindForm extends Form {}
decorateProp([
  IsOptional()
], String, LogFindForm.prototype, "name");

decorateProp([
  Validate(DateFormat, {
    message: "请输入正确格式开始时间"
  })
], String, LogFindForm.prototype, "start");

decorateProp([
  Validate(DateFormat, {
    message: "请输入正确格式结束时间"
  })
], String, LogFindForm.prototype, "end");

exports.LogFindForm = LogFindForm;

class UpdateUserInfoForm extends Form {}
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
], Number, UpdateUserInfoForm.prototype, "groupId");

decorateProp([
  IsEmail({}, {
    message: "电子邮箱不符合规范，请输入正确的邮箱"
  }),
  IsNotEmpty({
    message: "请输入新邮箱"
  })
], String, UpdateUserInfoForm.prototype, "email");

exports.UpdateUserInfoForm = UpdateUserInfoForm;

class NewGroupForm extends Form {}
decorateProp([
  IsNotEmpty({
    message: "请输入分组名称"
  })
], String, NewGroupForm.prototype, "name");

decorateProp([
  IsOptional()
], String, NewGroupForm.prototype, "info");

decorateProp([
  IsNotEmpty({
    each: true,
    message: "请输入auths字段"
  })
], String, NewGroupForm.prototype, "auths");

exports.NewGroupForm = NewGroupForm;

class UpdateGroupForm extends Form {}
decorateProp([
  IsNotEmpty({
    message: "请输入分组名称"
  })
], String, UpdateGroupForm.prototype, "name");

decorateProp([
  IsOptional()
], String, UpdateGroupForm.prototype, "info");

exports.UpdateGroupForm = UpdateGroupForm;

class DispatchAuthForm extends Form {}
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
], Number, DispatchAuthForm.prototype, "groupId");

decorateProp([
  IsNotEmpty({
    message: "请输入auth字段"
  })
], String, DispatchAuthForm.prototype, "auth");

exports.DispatchAuthForm = DispatchAuthForm;

class DispatchAuthsForm extends Form {}
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
], Number, DispatchAuthForm.prototype, "groupId");

decorateProp([
  IsNotEmpty({
    each: true,
    message: "请输入auths字段"
  })
], Array, DispatchAuthForm.prototype, "auths");

exports.DispatchAuthsForm = DispatchAuthsForm;

class RemoveAuthsForm extends Form {}
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
], Number, RemoveAuthsForm.prototype, "groupId");

decorateProp([
  IsNotEmpty({
    each: true,
    message: "请输入auths字段"
  })
], Array, RemoveAuthsForm.prototype, "auths");

exports.RemoveAuthsForm = RemoveAuthsForm;

class BookSearchForm extends Form {}
decorateProp([
  IsNotEmpty({
    message: "必须传入搜索关键字"
  })
], String, BookSearchForm.prototype, "q");

exports.BookSearchForm = BookSearchForm;

class CreateOrUpdateBookForm extends Form {}
decorateProp([
  IsNotEmpty({
    message: "必须传入图书名"
  })
], String, CreateOrUpdateBookForm.prototype, "title");

decorateProp([
  IsNotEmpty({
    message: "必须传入图书作者"
  })
], String, CreateOrUpdateBookForm.prototype, "author");

decorateProp([
  IsNotEmpty({
    message: "必须传入图书综述"
  })
], String, CreateOrUpdateBookForm.prototype, "summary");

decorateProp([
  IsNotEmpty({
    message: "必须传入图书插图"
  })
], String, CreateOrUpdateBookForm.prototype, "image");

exports.CreateOrUpdateBookForm = CreateOrUpdateBookForm;