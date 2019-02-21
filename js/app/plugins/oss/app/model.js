"use strict";

const {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  BaseEntity
} = require("typeorm");
const {
  decorateProp,
  decorateEntify
} = require("../../../libs/util");

let Image = class Image extends BaseEntity {};

decorateProp([PrimaryGeneratedColumn()], Number, Image.prototype, "id");

decorateProp([Column({
  type: "smallint",
  default: 1,
  comment: "1 表示来自oss，2 表示来自本地"
})], String, Image.prototype, "from");

decorateProp([
  Column({
    type: "varchar",
    length: 255,
    nullable: true,
    comment: "图片url"
  })
], String, Image.prototype, "from");

Image = decorateEntify([
  Entity({
    name: "image"
  })
], Image);
exports.Image = Image;