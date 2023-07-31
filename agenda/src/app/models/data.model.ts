import { ResultModel } from "../pages/contacts/models/result.model";


export class DataModel{
    public code: number;
    public created: Date;
    public error: string;
    public friendlyMessage: string[];
    public message: string; 
    public result : ResultModel;
    public statusCode: number;
    public succeed : boolean;


constructor(code: number, created: Date, error: string, friendlyMessage: string[], message: string ,result: ResultModel,statusCode: number, succeed: boolean){
    this.code = code;
    this.created = created;
    this.error = error;
    this.friendlyMessage = friendlyMessage;
    this.message = message;
    this.result = result;
    this.statusCode = statusCode;
    this.succeed = succeed;
}



}