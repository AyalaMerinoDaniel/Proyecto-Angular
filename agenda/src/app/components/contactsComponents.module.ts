import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from './header/header.component';
import { ContactoService } from '../pages/contacts/services/contacto.service';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { PaginatorComponent } from './paginator/paginator.component';





@NgModule({
  declarations:[
    HeaderComponent,
    ToolbarComponent,
    PaginatorComponent
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  exports:[
   HeaderComponent,
   ToolbarComponent,
   PaginatorComponent
  ],
  providers: [ 
  ],
})
export class ModuleComponents { }
