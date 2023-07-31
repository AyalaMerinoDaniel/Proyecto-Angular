import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from '../pages/auth/pages/login/login.service';
import { status } from '../enums/enum.enum';
import Swal  from 'sweetalert2';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
 

  constructor(private loginService: LoginService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body.statusCode === status.failed) {
           window.alert(event.body.friendlyMessage);
          }else if (event.body.statusCode=== status.error) {
            window.alert(event.body.friendlyMessage);
          }
          else if(event.body.statusCode === status.failed && !event.body.result.refreshToken){
                this.loginService.logout();
          }
        }
      })
      
    );
  }
}


