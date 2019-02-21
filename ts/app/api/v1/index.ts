import { book } from "./book";
import { Redprint } from "lin-cms-test";

const v1 = new Redprint({ prefix: "/v1" });

v1.use(book.routes()).use(book.allowedMethods());

export { v1 };
