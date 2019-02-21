"use strict";

const {
  InfoCrud
} = require("lin-cms-test");
const {
  PrimaryGeneratedColumn,
  Column,
  Entity
} = require("typeorm");
const {
  decorateProp,
  decorateEntify
} = require("../libs/util");

let Book = class Book extends InfoCrud {
  toJSON () {
    let origin = {
      id: this.id,
      title: this.title,
      author: this.author,
      summary: this.summary,
      image: this.image,
      create_time: this.createTime
    };
    return origin;
  }
};

decorateProp([
  PrimaryGeneratedColumn()
], Number, Book.prototype, "id");

decorateProp([
  Column({
    length: 50,
    nullable: false
  })
], String, Book.prototype, "title");

decorateProp([
  Column({
    length: 30,
    nullable: true,
    default: "未名"
  })
], String, Book.prototype, "author");

decorateProp([
  Column({
    length: 1000,
    nullable: true
  })
], String, Book.prototype, "summary");

decorateProp([
  Column({
    length: 100,
    nullable: true
  })
], String, Book.prototype, "image");

Book = decorateEntify([
  Entity("book")
], Book);

exports.Book = Book;