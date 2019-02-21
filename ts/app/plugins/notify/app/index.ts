import { sseApi } from "./api/sse";
import { messageApi } from "./api/message";
import { Event, Message } from "./model";

// 所有被自动加载的项必须以default的方式
export default {
  sseApi,
  messageApi,
  Event,
  Message
};
