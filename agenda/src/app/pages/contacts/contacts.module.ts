import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactsModuleComponents } from './components/contactsComponents.module';
import { ContactsRoutingModule } from './contacts-routing.module';

import { ContactosDetailComponent } from './pages/contactos-detail/contactos-detail.component';
import { ContactosEditComponent } from './pages/contactos-edit/contactos-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { ContactoService } from './services/contacto.service';
import { DropdownDirective } from 'src/app/pages/contacts/directives/dropdown.directive';
import { AboutComponent } from '../about/pages/about/about.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ContactosListComponent } from './pages/contactos-list/contactos-list.component';
import { ModuleComponents } from 'src/app/components/contactsComponents.module';



@NgModule({
  declarations: [
    ContactosDetailComponent,
    ContactosEditComponent, 
    ContactosListComponent,
    DropdownDirective
    ],
  imports: [
    CommonModule,
    NgxSpinnerModule.forRoot(),
    ReactiveFormsModule,
    ContactsRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule, 
    ContactsModuleComponents,
    ModuleComponents
  ],
  exports:[
    ContactosDetailComponent,
    ContactosEditComponent,
    ContactosListComponent
  ],
  providers: [LocalstorageService
  ],
})
export class ContactsModule { }
