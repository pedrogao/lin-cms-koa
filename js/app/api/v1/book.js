"use strict";

const {
  Redprint,
  NotFound,
  Success
} = require("lin-cms-test");
const {
  getSafeParamId
} = require("../../libs/util");
const {
  BookSearchForm,
  CreateOrUpdateBookForm
} = require("../../validators/forms");
const {
  BookNotFound
} = require("../../libs/errCode");
const {
  BookDao
} = require("../../dao/v1/book");
// book 的红图实例
const book = new Redprint({
  prefix: "/book"
});

exports.book = book;
// book 的dao 数据库访问层实例
const bookDto = new BookDao();

book.get("/:id", async (ctx) => {
  const id = getSafeParamId(ctx);
  const book = await bookDto.getBook(id);
  if (!book) {
    throw new NotFound({
      msg: "没有找到相关书籍"
    });
  }
  ctx.json(book);
});

book.get("/", async (ctx) => {
  const books = await bookDto.getBooks();
  if (!books || books.length < 1) {
    throw new NotFound({
      msg: "没有找到相关书籍"
    });
  }
  ctx.json(books);
});

book.get("/search", async (ctx) => {
  const form = new BookSearchForm(ctx).validate();
  const book = await bookDto.getBookByKeyword(form.q);
  if (!book) {
    throw new BookNotFound();
  }
  ctx.json(book);
});

book.post("/", async (ctx) => {
  const form = new CreateOrUpdateBookForm(ctx).validate();
  await bookDto.createBook(form);
  ctx.json(new Success({
    msg: "新建图书成功"
  }));
});

book.put("/:id", async (ctx) => {
  const id = getSafeParamId(ctx);
  const form = new CreateOrUpdateBookForm(ctx).validate();
  await bookDto.updateBook(form, id);
  ctx.json(new Success({
    msg: "更新图书成功"
  }));
});

book.redDelete("deleteBook", "/:id", {
  auth: "删除图书",
  module: "图书",
  mount: true
}, async (ctx) => {
  const id = getSafeParamId(ctx);
  await bookDto.deleteBook(id);
  ctx.json(new Success({
    msg: "删除图书成功"
  }));
});