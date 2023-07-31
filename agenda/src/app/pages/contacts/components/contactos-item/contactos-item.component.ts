import { Component, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from 'src/app/pages/users/services/register.service';
import { ContactModel } from '../../models/contactos.model';
import { ContactoService } from '../../services/contacto.service';

@Component({
  selector: 'app-contactos-item',
  templateUrl: './contactos-item.component.html',
  styleUrls: ['./contactos-item.component.css']
})
export class ContactosItemComponent {
  @Input() contacto: ContactModel;
  @Input() index: number;
  exito: string[] = null;
  isPopupVisible = false;
  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private contactService: ContactoService){}


  onItem(){
    this.router.navigate(['/contact/detail:id'], {relativeTo: this.route})
  }

  onDeleteContacto(id: number){
    
    const confirmation = window.confirm('¿Estás seguro de que deseas eliminar este contacto?');
    if(confirmation){
    this.contactService.deleteContact(id).subscribe(data=>{
       console.log(data);
       this.exito = data.friendlyMessage;
    }
    );
  }
  this.isPopupVisible = true;
  
   }

   closePopup(): void {
    this.isPopupVisible = false;
    this.router.navigate(['/contact/contactos'], {relativeTo: this.route})
  }
  

}
