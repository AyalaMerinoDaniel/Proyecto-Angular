import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './pages/auth/pages/login/login.service';
import { ContactoService } from './pages/contacts/services/contacto.service';
import { ResultModelUsers, UserModel } from './pages/users/models/user.model';
import { RegisterService } from './pages/users/services/register.service';
import { LocalstorageService } from './services/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  user: UserModel[] = [];

  constructor(private router: Router){}

  ngOnInit(): void {
  
  }
  

getRutaActual(): string{
   return this.router.url;
}

}
