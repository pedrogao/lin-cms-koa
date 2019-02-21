"use strict";

const {
  get
} = require("lodash");
const {
  createQueryBuilder,
  getConnection
} = require("typeorm");
const {
  Message
} = require("../model");
const {
  NotFound,
  Forbidden
} = require("lin-cms-test");
const { MessageIsReaded } = require("../enums");

class MessageDao {
  async getMessages (ctx, start, count) {
    const currentUser = ctx.currentUser;
    let condition = {};
    const readed = get(ctx.query, "readed");
    readed && (condition["readed"] = readed);
    const pushed = get(ctx.query, "pushed");
    pushed && (condition["pushed"] = pushed);
    const [messages, total] = await createQueryBuilder(Message, "message")
      .where(Object.assign({}, condition))
      .andWhere("message.user_id = :id", {
        id: currentUser.id
      })
      .skip(start)
      .take(count)
      .getManyAndCount();
    return {
      messages,
      total
    };
  }
  async readMessage (id) {
    const msg = await Message.findOne(id);
    if (!msg) {
      throw new NotFound({
        msg: "未找到消息"
      });
    }
    if (msg.readed === MessageIsReaded.READED) {
      throw new Forbidden({
        msg: "不可重复设置为已读"
      });
    }
    msg.readed = MessageIsReaded.READED;
    // tslint:disable-next-line: no-floating-promises
    msg.save();
  }
  async readMessages (form) {
    await getConnection()
      .createQueryBuilder()
      .update(Message)
      .set({
        readed: MessageIsReaded.READED
      })
      .whereInIds(form.ids)
      .execute();
  }
  async deleteMessage (id) {
    const msg = await Message.findOne(id);
    if (!msg) {
      throw new NotFound({
        msg: "未找到消息"
      });
    }
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Message)
      .where("id = :id", {
        id
      })
      .execute();
  }
}
exports.MessageDao = MessageDao;