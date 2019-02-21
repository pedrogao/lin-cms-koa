import dayjs from "dayjs";

test("测试日期格式化", async () => {
  const template = "YYYY-MM-DD HH:mm:ss";
  const date1 = "2018-03-15 12:23:55";

  expect(checkDateFormat(date1)).toBe(true);

  const date2 = "2018-03-15 12:23:5";

  expect(checkDateFormat(date2)).toBe(false);
});

function checkDateFormat(time: string) {
  const r = time.match(
    /^(\d{4})(-|\/)(\d{2})\2(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
  );
  if (r === null) return false;
  const d = new Date(
    parseInt(r[1], 10),
    parseInt(r[3], 10) - 1,
    parseInt(r[4], 10),
    parseInt(r[5], 10),
    parseInt(r[6], 10),
    parseInt(r[7], 10)
  );
  return (
    d.getFullYear() === parseInt(r[1], 10) &&
    d.getMonth() + 1 === parseInt(r[3], 10) &&
    d.getDate() === parseInt(r[4], 10) &&
    d.getHours() === parseInt(r[5], 10) &&
    d.getMinutes() === parseInt(r[6], 10) &&
    d.getSeconds() === parseInt(r[7], 10)
  );
}
