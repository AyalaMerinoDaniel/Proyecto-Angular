export class UserModel {
  userId?: number;
  userFullName: string;
  userName: string;
  userPassword: string;
  userEmail: string;
  userPhoto: string;

  constructor(userFullName: string, userName: string, userPassword:string, userEmail: string, userPhoto: string, userId?: number, ){
    this.userId = userId;
    this.userFullName = userFullName;
    this.userName = userName;
    this.userPassword = userPassword;
    this.userEmail = userEmail;
    this.userPhoto = userPhoto;
  }
  
  }

export class UserResponseData {
    succeed: boolean;
    statusCode: number;
    code: number;
    result: ResultModelUsers; 
    message: string;
    friendlyMessage: string[];
    htmlMessage: string;
    error: string;
    created: Date;

    constructor(succeed: boolean, statusCode: number, code: number,result: ResultModelUsers, message: string ,friendlyMessage: string[],htmlMessage: string, error: string, created: Date ){
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

export class ResultModelUsers{
  list: UserModel[];
  constructor(list: UserModel[]){
    this.list = list;

  }


}