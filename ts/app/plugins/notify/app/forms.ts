import { Form } from "lin-cms-test";
import { IsNotEmpty, Min, IsInt } from "class-validator";

export class EventsForm extends Form {
  @Min(1, { message: "分组id必须大于0" })
  @IsInt({ message: "分组id必须是整数" })
  @IsNotEmpty({ message: "请输入分组id" })
  groupId!: number;

  @IsNotEmpty({
    each: true,
    message: "请输入events字段"
  })
  events!: string[];
}

export class IdsForm extends Form {
  @Min(1, { message: "分组id必须大于0", each: true })
  @IsInt({ message: "分组id必须是整数", each: true })
  @IsNotEmpty({ message: "请输入分组id", each: true })
  ids!: number[];
}
