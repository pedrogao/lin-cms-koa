import { Book } from "../../models/book";
import { Like } from "typeorm";
import { CreateOrUpdateBookForm } from "../../validators/forms";
import { Forbidden, NotFound } from "lin-cms-test";

export class BookDao {
  async getBook(id: number) {
    const book = await Book.findOne({
      where: {
        id,
        deleteTime: null
      }
    });
    return book;
  }

  async getBookByKeyword(q: string) {
    const book = await Book.findOne({
      where: {
        title: Like(`%${q}%`),
        deleteTime: null
      }
    });
    return book;
  }

  async getBooks() {
    const books = await Book.find({
      where: {
        deleteTime: null
      }
    });
    return books;
  }

  async createBook(form: CreateOrUpdateBookForm) {
    const book = await Book.findOne({
      where: {
        title: form.title,
        deleteTime: null
      }
    });
    if (book) {
      throw new Forbidden({ msg: "图书已存在" });
    }
    const bk = new Book();
    bk.title = form.title;
    bk.author = form.author;
    bk.summary = form.summary;
    bk.image = form.image;
    // tslint:disable-next-line: no-floating-promises
    bk.save();
  }

  async updateBook(form: CreateOrUpdateBookForm, id: number) {
    const book = await Book.findOne({ id });
    if (!book) {
      throw new NotFound({ msg: "没有找到相关书籍" });
    }
    book.title = form.title;
    book.author = form.author;
    book.summary = form.summary;
    book.image = form.image;
    // tslint:disable-next-line: no-floating-promises
    book.save();
  }

  async deleteBook(id: number) {
    const book = await Book.findOne({
      where: {
        id,
        deleteTime: null
      }
    });
    if (!book) {
      throw new NotFound({ msg: "没有找到相关书籍" });
    }
    book.softDelete();
  }
}
