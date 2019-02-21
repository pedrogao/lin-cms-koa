"use strict";

const { Event } = require("../model");
const { NotFound, Forbidden } = require("lin-cms-test");
class EventDao {
  async getEvents (groupId) {
    const event = await Event.findOne({
      where: {
        groupId
      }
    });
    if (!event) {
      throw new NotFound({
        msg: "当前用户没有推送项"
      });
    }
    return event.messageEvents.split(",");
  }
  async createEvents (form) {
    const event = await Event.findOne({
      where: {
        groupId: form.groupId
      }
    });
    if (event) {
      throw new Forbidden({
        msg: "当前权限组已存在推送项"
      });
    }
    const ev = new Event();
    ev.groupId = form.groupId;
    ev.messageEvents = form.events.join(",");
    // tslint:disable-next-line: no-floating-promises
    ev.save();
  }
  async updateEvents (form) {
    const event = await Event.findOne({
      where: {
        groupId: form.groupId
      }
    });
    if (!event) {
      throw new NotFound({
        msg: "当前权限组不存在推送项"
      });
    }
    event.messageEvents = form.events.join(",");
    // tslint:disable-next-line: no-floating-promises
    event.save();
  }
}
exports.EventDao = EventDao;