"use strict";

const {
  Book
} = require("../../models/book");
const {
  Like
} = require("typeorm");
const {
  Forbidden,
  NotFound
} = require("lin-cms-test");

class BookDao {
  async getBook (id) {
    const book = await Book.findOne({
      where: {
        id,
        deleteTime: null
      }
    });
    return book;
  }

  async getBookByKeyword (q) {
    const book = await Book.findOne({
      where: {
        title: Like(`%${q}%`),
        deleteTime: null
      }
    });
    return book;
  }

  async getBooks () {
    const books = await Book.find({
      where: {
        deleteTime: null
      }
    });
    return books;
  }
  async createBook (form) {
    const book = await Book.findOne({
      where: {
        title: form.title,
        deleteTime: null
      }
    });
    if (book) {
      throw new Forbidden({
        msg: "图书已存在"
      });
    }
    const bk = new Book();
    bk.title = form.title;
    bk.author = form.author;
    bk.summary = form.summary;
    bk.image = form.image;
    // tslint:disable-next-line: no-floating-promises
    bk.save();
  }

  async updateBook (form, id) {
    const book = await Book.findOne({
      id
    });
    if (!book) {
      throw new NotFound({
        msg: "没有找到相关书籍"
      });
    }
    book.title = form.title;
    book.author = form.author;
    book.summary = form.summary;
    book.image = form.image;
    // tslint:disable-next-line: no-floating-promises
    book.save();
  }

  async deleteBook (id) {
    const book = await Book.findOne({
      where: {
        id,
        deleteTime: null
      }
    });
    if (!book) {
      throw new NotFound({
        msg: "没有找到相关书籍"
      });
    }
    book.softDelete();
  }
}

exports.BookDao = BookDao;