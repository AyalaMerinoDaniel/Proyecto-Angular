import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { HousePhoneComponent } from './house-phone/house-phone.component';
import { ContactosListComponent } from '../pages/contactos-list/contactos-list.component';
import { ContactosItemComponent } from './contactos-item/contactos-item.component';
import { MovilPhoneComponent } from './movil-phone/movil-phone.component';
import { WhatsAppPhoneComponent } from './whats-app-phone/whats-app-phone.component';
import { ContactsRoutingModule } from '../contacts-routing.module';
import { ModuleComponents } from 'src/app/components/contactsComponents.module';
import { NgxSpinnerModule } from 'ngx-spinner';




@NgModule({
  declarations:[
    ContactosItemComponent, 
     HousePhoneComponent,
     MovilPhoneComponent,
     WhatsAppPhoneComponent
    ],
  imports: [
    CommonModule,
    NgxSpinnerModule.forRoot(),
    ReactiveFormsModule,
    ContactsRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    ModuleComponents
  ],
  exports:[
   ContactosItemComponent,

   HousePhoneComponent,
   MovilPhoneComponent,
   WhatsAppPhoneComponent
  ],
  providers: [
  ],
})
export class ContactsModuleComponents { }
