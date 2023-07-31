import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { ContactModel } from '../../models/contactos.model';
import { ContactoService } from '../../services/contacto.service';
import { CountContactsService } from 'src/app/services/count-contacts.service';

@Component({
  selector: 'app-contactos-detail',
  templateUrl: './contactos-detail.component.html',
  styleUrls: ['./contactos-detail.component.css']
})
export class ContactosDetailComponent implements OnInit{
  contactos;
  contacto: ContactModel;
  id: number;
  exito: string[] = null;
  countContacts: number;
  isPopupVisible = false;

  constructor(private contactService: ContactoService, 
              private route: ActivatedRoute, 
              private router: Router,
              private localStorageS : LocalstorageService,
              private countContactsService: CountContactsService
              ){}
  
  ngOnInit(){
    this.contactos = this.localStorageS.getItem('contactos');
    //console.log(contactos);
     this.route.params
       .subscribe(
       (params: Params) => {
        this.id = +params['id'];
        this.contacto = this.contactos[this.id];
        console.log(this.contacto);
       }
    );

  }

  onEditContacto(){
    this.router.navigate(['/contact/',this.id,'edit']);
  
  }

  onDeleteContacto(){
    
     const confirmation = window.confirm('¿Estás seguro de que deseas eliminar este contactos?');
     if(confirmation){
       this.countContactsService.countDecrement();
     console.log("Después de decrementar - Valor del contador:", this.countContactsService.getContadorObservable());
    this.contactService.deleteContact(this.id).subscribe(data=>{
       console.log(data);
       this.exito = data.friendlyMessage;
    });
    this.isPopupVisible = true;
   }else{
    alert('Acción cancelada');
   }


  }

  // openPopup(): void {
  //   this.isPopupVisible = true;
  // }
  
  closePopup(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/contact/contactos'], {relativeTo: this.route});
  }
  
  onContacts(){
    this.router.navigate(['/contact/contactos'], {relativeTo: this.route})
  }

}

