import { Component, OnInit} from '@angular/core';
import { ContactoService } from 'src/app/pages/contacts/services/contacto.service';
import { CountContactsService } from 'src/app/services/count-contacts.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent implements OnInit {
  count: number;

  constructor(private contactService : ContactoService, private countContactService: CountContactsService) {}

  ngOnInit() {
    this.countContactService.getContadorObservable().subscribe(countContacts =>{
      this.count = countContacts;
     });
    console.log(this.count);
  }

}
