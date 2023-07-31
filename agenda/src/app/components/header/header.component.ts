import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';

import { LocalstorageService } from 'src/app/services/localstorage.service';
import { LoginService } from 'src/app/pages/auth/pages/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['styles.css']
  
})
export class HeaderComponent implements OnInit{
  users;
  user;
  id = 1;
  rutaActual: string;
  count: number;
  

constructor(private route: ActivatedRoute, 
  private router: Router, 
  private localStorageService: LocalstorageService,
  private loginService: LoginService){
}

ngOnInit(){
   this.users= this.localStorageService.getItem('users');
  //this.users = this.cookieService.get('users');
  console.log(this.users);
  this.user = this.users[this.id];
  console.log(this.user);
  
  this.localStorageService.userUpdate$.subscribe(usersUpdate=>{
    if (usersUpdate && usersUpdate.length > 1) {
    this.users = usersUpdate;
    this.user = this.users[this.id];
    }
  });
  }


onEditUser(){
  this.router.navigate(['/users/',this.id,'edit']);
 //this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
}

onContacts(){
  this.router.navigate(['/contact'], {relativeTo: this.route})
}

onAboutUs(){
  this.router.navigate(['/about/about'], {relativeTo: this.route})
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
  // const confirmation = window.confirm('¿Estás seguro de cerrar la Sesión?');
  //    if(confirmation){
  //     this.loginService.logout();
  //  }else{
  //   alert('Acción cancelada');
  //  }
}


  
}
