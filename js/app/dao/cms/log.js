"use strict";

const {
  set
} = require("lodash");
const {
  Log
} = require("lin-cms-test");
const {
  Between,
  Like,
  getRepository
} = require("typeorm");

class LogDao {
  async getLogs (form, start, count) {
    let condition = {};
    form.name && set(condition, "userName", form.name);
    form.start &&
      form.end &&
      set(condition, "_time", Between(form.start, form.end));
    const [logs, total] = await Log.findAndCount({
      where: Object.assign({}, condition),
      skip: start,
      take: count,
      order: {
        _time: "DESC"
      }
    });
    return {
      logs,
      total
    };
  }

  async searchLogs (form, start, count, keyword) {
    let condition = {};
    form.name && set(condition, "userName", form.name);
    form.start &&
      form.end &&
      set(condition, "_time", Between(form.start, form.end));
    const [logs, total] = await Log.findAndCount({
      where: Object.assign({}, condition, {
        message: Like(`%${keyword}%`)
      }),
      skip: start,
      take: count,
      order: {
        _time: "DESC"
      }
    });
    return {
      logs,
      total
    };
  }

  async getUserNames (start, count) {
    const userNames = await getRepository(Log)
      .createQueryBuilder("log")
      .select("log.user_name")
      .groupBy("log.user_name")
      .andHaving("count(log.user_name) > 0")
      .skip(start)
      .take(count)
      .getRawMany();
    return userNames.map(it => it["user_name"]);
  }
}

exports.LogDao = LogDao;