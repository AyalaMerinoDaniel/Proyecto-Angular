
export class LoginResponseData {
    succeed: boolean;
    statusCode: number;
    code: number;
    result: ResultModelLogin; 
    message: string;
    friendlyMessage: string[];
    htmlMessage: string;
    error: string;
    created: Date;

    constructor(succeed: boolean, statusCode: number, code: number,result: ResultModelLogin, message: string ,friendlyMessage: string[],htmlMessage: string, error: string, created: Date ){
      this.succeed = succeed;
      this.statusCode = statusCode;
      this.code = code;
      this.result = result;
      this.message = message;
      this.friendlyMessage = friendlyMessage;
      this.htmlMessage = htmlMessage;
      this.error = error;
      this.created = created;
  }
}

  
export class ResultModelLogin{
     accessToken: string;
     refreshToken: string;
     expiresAt: Date;

    constructor(accessToken: string,
     refreshToken: string,
     expiresAt: Date){
      this.accessToken= accessToken;
      this.refreshToken = refreshToken;
      this.expiresAt = expiresAt;
  
    }
  
} 
