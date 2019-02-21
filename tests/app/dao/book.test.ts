import { createApp } from "../../../src/app/app";
import context from "../helper/context";
import Koa from "koa";
import { BookDao } from "../../../src/app/dao/v1/book";
import { CreateOrUpdateBookForm } from "../../../src/app/validators/forms";

describe("book.test.ts", () => {
  let app: Koa;
  let bookDao: BookDao;

  beforeAll(async () => {
    app = await createApp();
    bookDao = new BookDao();
  });

  afterAll(() => {
    setTimeout(() => {
      app.context.db.close();
    }, 500);
  });

  test("获取一本书", async () => {
    const book = await bookDao.getBook(1);
    expect(book).not.toBe(undefined);
  });

  test("搜索一本书", async () => {
    const book = await bookDao.getBookByKeyword("计算机");
    // console.log(book);
    expect(book).not.toBe(undefined);
    expect(book).toHaveProperty("title", "深入理解计算机系统");
  });

  test("获取所有书", async () => {
    const books = await bookDao.getBooks();
    expect(books).not.toBe(undefined);
  });

  test("创建书籍", async () => {
    const ctx = context({ url: "", body: {} });
    const form = new CreateOrUpdateBookForm(ctx);
    form.title = "平凡的程序";
    form.author = "pedro";
    form.summary = "~~~~~~~~~~~~~~~~~~~~~~~~~ a book";
    form.image = "$$$$$$$$$$$$$$$$$$$$$";
    await bookDao.createBook(form);
  });

  test("删除书籍", async () => {
    await bookDao.deleteBook(1);
  });
});
