export class ResponseBase {
  success: boolean;
  message: string;
  data: {} | any[];
}

export class Entity {
  // tslint:disable-next-line: variable-name
  _id: any;
}
