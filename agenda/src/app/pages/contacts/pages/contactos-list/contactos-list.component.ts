import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContactoService } from '../../services/contacto.service';
import { ResultModel} from 'src/app/pages/contacts/models/result.model';
import { ContactModel } from '../../models/contactos.model';
import { UserModel } from 'src/app/pages/users/models/user.model';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { CountContactsService } from 'src/app/services/count-contacts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contactos-list',
  templateUrl: './contactos-list.component.html',
  styleUrls: ['./contactos-list.component.css']
})
export class ContactosListComponent implements OnInit, OnDestroy {
  contactos: ContactModel[] = [];
  subscription: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  datos: ResultModel[] = [] ;
  user: UserModel[] = [];
  exito: string[] = null;
  isPopupVisible = false;
  public page!: number;
  currentPage = 1;
  totalPages: number ;
  totalPagesArray: number[] = [];
  visiblePages = 4;
  pageTimer: any;

  constructor(private contactoService: ContactoService, 
    private router: Router, 
    private localStorageS: LocalstorageService,
    private countContactsService: CountContactsService,
    private spinner: NgxSpinnerService){
  }
 
  ngOnInit(){
    this.localStorageS.setItem('etiquetas', this.contactoService.tagsList);
    this.localStorageS.getItem('users');

    this.loadData();      
  }

  onDeleteContacto(id: number){
    Swal.fire({
      title: '¿Estás seguro de Eliminar el contacto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.countContactsService.countDecrement();
        this.subscription=this.contactoService.deleteContact(id).subscribe(data=>{
        this.exito = data.friendlyMessage;
    });
      this.isPopupVisible = true;
      }
    });
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }

  
  onNewContacto(){
    this.router.navigate(['/contact/new']);
  }


  onDetail(id:number){
      // Navegar al componente 2 con el ID seleccionado
      this.router.navigate(['/contact/detail', id]);
  }

  //--------------PAGINATOR------------------//

   loadData(){
     const limit = 10; // Cantidad de elementos a mostrar por página
     const offset = (this.currentPage - 1) * limit;
     this.subscription2 =  this.contactoService.storeContacts(offset,limit).subscribe(response =>{
      const data: ResultModel = response.result;
      this.contactos = data.list;
       this.localStorageS.setItem('contactos',this.contactos);
         console.log(response.result);
         this.totalPages = Math.ceil(response.result.count / limit);
         this.totalPagesArray = Array.from({ length: this.totalPages }, (_, index) => index + 1);
         });
   }
  

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
       this.spinner.show();

       this.pageTimer = setTimeout(()=>{
        this.currentPage = page;
        this.loadData();
        this.spinner.hide();
      },2000);
     }
   }

   ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }

    if (this.pageTimer) {
      clearTimeout(this.pageTimer); 
    }
  }

}
