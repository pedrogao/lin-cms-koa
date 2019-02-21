"use strict";

const {
  decorateEntify,
  decorateProp
} = require("../../../libs/util");
const {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity
} = require("typeorm");
const dayjs = require("dayjs");

let Event = class Event extends BaseEntity {};
decorateProp([PrimaryGeneratedColumn()], Number, Event.prototype, "id");
decorateProp([
  Column({
    type: "integer",
    name: "group_id",
    nullable: false
  })
], Number, Event.prototype, "groupId");

decorateProp([
  Column({
    type: "varchar",
    name: "message_events",
    length: 250,
    nullable: true
  })
], String, Event.prototype, "messageEvents");

Event = decorateEntify([
  Entity({
    name: "notify_event"
  })
], Event);
exports.Event = Event;

let Message = class Message extends BaseEntity {
  get time () {
    return dayjs(this._time).unix();
  }
  toJSON () {
    let origin = {
      id: this.id,
      message: this.message,
      event: this.event,
      time: this.time,
      pushed: this.pushed,
      readed: this.readed,
      user_id: this.userId,
      user_name: this.userName
    };
    return origin;
  }
};
decorateProp([PrimaryGeneratedColumn()], Number, Message.prototype, "id");
decorateProp([
  Column({
    type: "varchar",
    name: "message",
    length: 600,
    nullable: false
  })
], String, Message.prototype, "message");

decorateProp([
  Column({
    type: "varchar",
    name: "event",
    length: 50,
    nullable: false
  })
], String, Message.prototype, "event");

decorateProp([
  Column({
    name: "time",
    type: "timestamp",
    default: null
  })
], Date, Message.prototype, "_time");

decorateProp([
  Column({
    name: "pushed",
    type: "tinyint",
    default: 0,
    comment: "0 表示未被推送； 1 表示已推送"
  })
], Number, Message.prototype, "pushed");

decorateProp([
  Column({
    name: "readed",
    type: "tinyint",
    default: 0,
    comment: "0 表示未读； 1 表示已读"
  })
], Number, Message.prototype, "readed");

decorateProp([
  Column({
    type: "integer",
    name: "user_id",
    nullable: false
  })
], Number, Message.prototype, "userId");

decorateProp([
  Column({
    type: "varchar",
    name: "user_name",
    length: 50,
    nullable: true
  })
], String, Message.prototype, "userName");

Message = decorateEntify([
  Entity({
    name: "notify_message"
  })
], Message);
exports.Message = Message;