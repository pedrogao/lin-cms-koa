import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import dayjs from "dayjs";

@Entity({ name: "notify_event" })
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "integer",
    name: "group_id",
    nullable: false
  })
  groupId!: number;

  // message type ['订单','修改密码']
  @Column({
    type: "varchar",
    name: "message_events",
    length: 250,
    nullable: true
  })
  messageEvents!: string;
}

@Entity({ name: "notify_message" })
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    name: "message",
    length: 600,
    nullable: false
  })
  message!: string;

  @Column({
    type: "varchar",
    name: "event",
    length: 50,
    nullable: false
  })
  event!: string;

  @Column({ name: "time", type: "timestamp", default: null })
  _time!: Date;

  @Column({
    name: "pushed",
    type: "tinyint",
    default: 0,
    comment: "0 表示未被推送； 1 表示已推送"
  })
  pushed!: number;

  @Column({
    name: "readed",
    type: "tinyint",
    default: 0,
    comment: "0 表示未读； 1 表示已读"
  })
  readed!: number;

  @Column({
    type: "integer",
    name: "user_id",
    nullable: false
  })
  userId!: number;

  @Column({
    type: "varchar",
    name: "user_name",
    length: 50,
    nullable: true
  })
  userName!: string;

  public get time(): number {
    return dayjs(this._time).unix();
  }

  public toJSON() {
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
}
