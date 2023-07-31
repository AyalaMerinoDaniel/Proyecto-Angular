import { Component } from '@angular/core';
import { ContactoService } from '../../../contacts/services/contacto.service';
import { CountContactsService } from 'src/app/services/count-contacts.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

constructor(private contactService: ContactoService, private countContactService: CountContactsService){}

reduccion(){
this.countContactService.countIncrement();
console.log(this.countContactService.getContadorObservable());
}

}
