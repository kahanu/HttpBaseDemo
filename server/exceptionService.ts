import { ResponseBase } from './ResponseBase';

export class ExceptionService {
  handleError(res: any, reason: any, message: string, code: any = null) {
    console.log('DB ERROR: ', reason);
    const response = new ResponseBase();
    response.success = false;
    response.message = message;

    res.status(code || 500).json(response);
  }
}
