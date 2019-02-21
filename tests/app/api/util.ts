import fs from "fs";

export function saveTokens(data: any) {
  fs.writeFileSync("tokens.json", JSON.stringify(data));
}

export function getToken(type: string = "access_token") {
  const buf = fs.readFileSync("tokens.json");
  return JSON.parse(buf.toString())[type];
}
