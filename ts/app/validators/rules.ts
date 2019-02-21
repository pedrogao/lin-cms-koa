export const registerRule = {
  nickname: {
    type: "string",
    message: "昵称不可为空,且长度必须在2~10之间",
    min: 2,
    max: 10
  },
  group_id: {
    type: "int",
    min: 1,
    message: "请输入分组id，且分组必须大于0"
  },
  email: {
    type: "email",
    required: false,
    message: "电子邮箱不符合规范，请输入正确的邮箱"
  },
  password: {
    type: "password",
    compare: "confirm_password",
    format: /^[A-Za-z0-9_*&$#@]{8,22}$/,
    message:
      "密码长度必须在8~22位之间，包含字符、数字和 _ ，且必须与确认密码一致"
  },
  confirm_password: {
    type: "password",
    message: "确认密码不可为空"
  }
};
