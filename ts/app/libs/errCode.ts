import { HttpException, Exception } from "lin-cms-test";
import assert from "assert";
import { isInteger } from "lodash";

export class BookNotFound extends HttpException {
  public code = 404;
  public msg = "没有找到相关图书";
  public errorCode = 80010;

  constructor(ex?: Exception) {
    super();
    if (ex && ex.code) {
      assert(isInteger(ex.code));
      this.code = ex.code;
    }
    if (ex && ex.msg) {
      this.msg = ex.msg;
    }
    if (ex && ex.errorCode) {
      assert(isInteger(ex.errorCode));
      this.errorCode = ex.errorCode;
    }
  }
}
