import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataModel } from 'src/app/models/data.model';
import { Observable } from "rxjs";
import { UserModel, UserResponseData } from '../models/user.model';
import { apiUrl } from 'src/app/environment/environmet-urls';

interface RegisterResponseData {
    succeed: boolean;
    statusCode: number;
    code: number;
    result: {}; 
    message: string;
    friendlyMessage: string[];
    htmlMessage: string;
    error: string;
    created: Date;
    }


@Injectable({ providedIn: 'root' })
export class RegisterService {

    private headers = new HttpHeaders().set('Authorization', 'Bearer 12345678at'
    ).set('Content-Type','application/json').set('X-API-Key' , '7802c4c0');

 constructor(private http: HttpClient) {}
    
      signUp(newUser: UserModel) {
        return this.http
          .post<RegisterResponseData>(
            apiUrl.baseUrl+'users/create',
            {
              userFullName: newUser.userFullName,
              userName: newUser.userName,
              userPassword: newUser.userPassword,
              userEmail: newUser.userEmail,
              userPhoto: newUser.userPhoto

            }, {headers: this.headers});
      }

    updateUser(newUser: UserModel){
      return this.http
      .put<DataModel>(apiUrl.baseUrl+'users/update/'+newUser.userId,
      {
        userFullName: newUser.userFullName,
              userName: newUser.userName,
              userPassword: newUser.userPassword,
              userEmail: newUser.userEmail,
              userPhoto: newUser.userPhoto
      }, {headers: this.headers});

    }

    getUser(): Observable <UserResponseData>{
      const body = {
          "offset": 0,
          "limit": 10,
          "searchTerm": "test"
      }
  
      return this.http.put<UserResponseData>(apiUrl.baseUrl+'users', body,
      {headers: this.headers});
  
  }

  
}