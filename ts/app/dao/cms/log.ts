import { set } from "lodash";
import { Log } from "lin-cms-test";
import { Between, Like, getRepository } from "typeorm";
import { LogFindForm } from "../../validators/forms";

export class LogDao {
  async getLogs(form: LogFindForm, start: number, count: number) {
    let condition = {};
    form.name && set(condition, "userName", form.name);
    form.start &&
      form.end &&
      set(condition, "_time", Between(form.start, form.end));
    const [logs, total] = await Log.findAndCount({
      where: {
        ...condition
      },
      skip: start,
      take: count,
      order: {
        _time: "DESC"
      }
    });
    return { logs, total };
  }

  async searchLogs(
    form: LogFindForm,
    start: number,
    count: number,
    keyword: string
  ) {
    let condition = {};
    form.name && set(condition, "userName", form.name);
    form.start &&
      form.end &&
      set(condition, "_time", Between(form.start, form.end));
    const [logs, total] = await Log.findAndCount({
      where: {
        ...condition,
        message: Like(`%${keyword}%`)
      },
      skip: start,
      take: count,
      order: {
        _time: "DESC"
      }
    });
    return { logs, total };
  }

  async getUserNames(start: number, count: number) {
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
