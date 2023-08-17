import { Component, OnDestroy, OnInit} from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LocalstorageService } from 'src/app/services/localstorage.service';
import { LoginService } from 'src/app/pages/auth/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['styles.css']
  
})
export class HeaderComponent implements OnInit, OnDestroy{
  users;
  user;
  id = 1;
  rutaActual: string;
  count: number;
  subscription: Subscription;
  

constructor(private route: ActivatedRoute, 
  private router: Router, 
  private localStorageService: LocalstorageService,
  private loginService: LoginService){
}

ngOnInit(){
   this.users= this.localStorageService.getItem('users');
   if (this.users && this.users.length > this.id) {
    this.user = this.users[this.id];
    console.log('User:', this.user);
  }
  this.editDataUser();
 
  }

editDataUser(){
  if (this.localStorageService.userUpdate$) {
  this.subscription = this.localStorageService.userUpdate$.subscribe(usersUpdate=>{
    if (usersUpdate && usersUpdate.length > 1) {
    this.users = usersUpdate;
    this.user = this.users[this.id];
    }
  });
}
}


onEditUser(){
  this.router.navigate(['/users/',this.id,'edit']);
 
}

onContacts(){
  this.router.navigate(['/contact']);
}

onAboutUs(){
  this.router.navigate(['/about/about']);
}

onLogout(){
  Swal.fire({
    title: '¿Estás seguro de cerrar Sesión?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      this.loginService.logout();
    }
  });
}

ngOnDestroy(): void {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}


  
}
