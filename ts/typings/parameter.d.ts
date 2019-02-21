// export = Parameter;
declare class Parameter {
  constructor();
  validate(rule: any, data: any): any;
}

//  declare let parameter: Parameter;

declare module "parameter" {
  export default Parameter;
}
