import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { LoginService } from '../../services/login.service';
import {ResultModelUsers } from '../../../users/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from 'src/app/pages/users/services/register.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  mostrarHeader: boolean = false;
  user;
  error: string[] = null;
  exito: string[] = null;
  isPopupVisible = false;
  isLoading = false;
  loginForm: FormGroup;

constructor(private loginService: LoginService, 
  private router : Router, 
  private route : ActivatedRoute,
  private userService: RegisterService,
  private localStorage: LocalstorageService) {
  
  
    this.loginForm= new FormGroup({
    email : new FormControl('', [ Validators.required]),
    password : new FormControl('', Validators.required)
})
}

ngOnInit(): void {
  this.userService.getUser().subscribe(Response =>{
    const data: ResultModelUsers = Response.result;
     this.user = data.list;
     this.localStorage.setItem('users', this.user);
    console.log(Response.result);
  });
}



 onRegistrate(){
  this.router.navigate(['/auth/registro']);
}

  onSubmit() {
  let  email =  this.loginForm.value.email ;
  let password = this.loginForm.value.password;
    this.loginService.login(email, password).subscribe(resData =>{
      console.log(resData);
      if(email=== 'admin' && password === 'admin'){
        this.exito = resData.friendlyMessage;
        this.router.navigate(['/contact'], {relativeTo: this.route})
      }else{
        this.isPopupVisible = true;
       this.error= resData.friendlyMessage;
       console.log(this.error);
       this.loginForm.reset();
      }
    });
   
  }

  public get f():any{
    return this.loginForm.controls;
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }

}