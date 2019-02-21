// 不要以controller来命名
import ossApi from "./controller";
import { Image } from "./model";

// 所有被自动加载的项必须以default的方式
export default {
  ossApi,
  Image
};
