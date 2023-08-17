import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription, tap } from "rxjs";
import { LoginResponseData } from '../models/login.model';
import { BehaviorSubject } from 'rxjs';
import { apiUrl } from 'src/app/environment/environmet-urls';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { status } from 'src/app/enums/enum.enum';

@Injectable({ providedIn: 'root' })
export class LoginService implements OnDestroy{

  user = new BehaviorSubject<LoginResponseData>(null);
  currentDateTime
  newCurrentDateTime;
  tokenExpirationTimer: any;
  private headers = new HttpHeaders().set('Content-Type','application/json').set('X-API-Key' , '7802c4c0');
  private headers2 = new HttpHeaders().set('Content-Type','application/json').set('Authorization', 'Bearer {}').set('X-API-Key' , '7802c4c0')
  subscription: Subscription;

 constructor(private http: HttpClient, 
  private router: Router,
  private localStorageS : LocalstorageService) {
     this.checkAutoLogout();
  }
    
      login(email: string, password: string): Observable<LoginResponseData>{
        return this.http
          .put<LoginResponseData>(
            apiUrl.baseUrl+'auth/login',
            {
              authUser: email,
              authPassword: password
            },
            {headers: this.headers}).pipe(
              tap(resData => {
              this.currentDateTime = new Date();
              this.currentDateTime.setMinutes(this.currentDateTime.getMinutes() + 2);
              console.log(resData.result.expiresAt, this.currentDateTime);
                this.handleAuthentication(
                  resData.result.accessToken,
                  this.currentDateTime,
                  resData.result.refreshToken
                );
              })
            )
      }

      refreshToken(): Observable<LoginResponseData>{
        const refreshToken = this.localStorageS.getItem('refreshToken');
          if (!refreshToken) {
             // Si no hay un refresh token, cierra la sesión
             this.logout();
              return;
          }
           return this.http.post<LoginResponseData>(
            apiUrl.baseUrl+'auth/refresh',
           {
            refreshToken: refreshToken
           },
           {headers: this.headers}).pipe(
            tap(resData => {
            this.newCurrentDateTime = new Date();
            this.newCurrentDateTime.setMinutes(this.newCurrentDateTime.getMinutes() + 2);
            console.log("refreshToken:"+resData.result.expiresAt, this.newCurrentDateTime);
              this.handleAuthentication(
                resData.result.accessToken,
                this.newCurrentDateTime,
                refreshToken
              );
              window.alert('El token se refresco.');
            })
          )
      }

      logout(){
        if (this.tokenExpirationTimer) {
          clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        const accesToken = this.localStorageS.getItem('accessToken');
        this.logoutUser(accesToken).subscribe(resData=>{
          if(resData.statusCode === status.success){
            this.router.navigate(['/auth/login']);
            console.log(resData);
          }
        })
       this.deleteData();
      }

      deleteData(){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiresDate');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('users');
        localStorage.removeItem('contactos');
        localStorage.removeItem('etiquetas');
      }
      
      logoutUser(accessToken: string):Observable<LoginResponseData>{
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-API-Key': '7802c4c0',
        });
        return this.http.delete<LoginResponseData>(apiUrl.baseUrl+'auth/logout',{headers: headers});
      }

      autoLogout(expirationDate: Date) {
        const currentDate = new Date();
        const timeDifference = expirationDate.getTime() - currentDate.getTime();
        if (timeDifference > 0) {
          this.tokenExpirationTimer = setTimeout(() => {
           this.subscription = this.refreshToken().subscribe();
          }, timeDifference);
        } else {
          this.logout();
        }
      }

      handleAuthentication(
        token: string,
        expiresIn: Date,
        refreshToken: string
      ) {
        console.log(expiresIn);
        this.autoLogout(expiresIn);
        this.localStorageS.setItem('accessToken', token)
        this.localStorageS.setItem('expiresDate', expiresIn.toString());
        this.localStorageS.setItem('refreshToken', refreshToken);
      }

      checkAutoLogout() {
        const expirationDate = this.localStorageS.getItem('expiresDate')
        console.log(expirationDate);
        if (expirationDate) {
          const currentDate = new Date();
          const parsedExpirationDate = new Date(expirationDate);
          const timeDifference = parsedExpirationDate.getTime() - currentDate.getTime();
         console.log(parsedExpirationDate);
          if (timeDifference > 0) {
            this.autoLogout(parsedExpirationDate);
          }else{
            this.logout();
            }
        }
      }

      ngOnDestroy(): void {
          if(this.subscription){
            this.subscription.unsubscribe();
          }
      }
      
}