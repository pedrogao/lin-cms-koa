import { IRouterContext } from "koa-router";
import { get } from "lodash";
import { createQueryBuilder, getConnection } from "typeorm";
import { Message } from "../model";
import { NotFound, Forbidden } from "lin-cms-test";
import { MessageIsReaded } from "../enums";
import { IdsForm } from "../forms";

export class MessageDao {
  async getMessages(ctx: IRouterContext, start: number, count: number) {
    const currentUser = ctx.currentUser!;
    let condition: any = {};
    const readed = get(ctx.query, "readed");
    readed && (condition["readed"] = readed);
    const pushed = get(ctx.query, "pushed");
    pushed && (condition["pushed"] = pushed);
    const [messages, total] = await createQueryBuilder(Message, "message")
      .where({ ...condition })
      .andWhere("message.user_id = :id", { id: currentUser.id })
      .skip(start)
      .take(count)
      .getManyAndCount();
    return { messages, total };
  }

  async readMessage(id: number) {
    const msg = await Message.findOne(id);
    if (!msg) {
      throw new NotFound({ msg: "未找到消息" });
    }
    if (msg.readed === MessageIsReaded.READED) {
      throw new Forbidden({ msg: "不可重复设置为已读" });
    }
    msg.readed = MessageIsReaded.READED;
    // tslint:disable-next-line: no-floating-promises
    msg.save();
  }

  async readMessages(form: IdsForm) {
    await getConnection()
      .createQueryBuilder()
      .update(Message)
      .set({ readed: MessageIsReaded.READED })
      .whereInIds(form.ids)
      .execute();
  }

  async deleteMessage(id: number) {
    const msg = await Message.findOne(id);
    if (!msg) {
      throw new NotFound({ msg: "未找到消息" });
    }
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Message)
      .where("id = :id", { id })
      .execute();
  }
}
