import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { CommonModule} from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactosDetailComponent } from './pages/contactos-detail/contactos-detail.component';
import { ContactosEditComponent } from './pages/contactos-edit/contactos-edit.component';
import { AboutComponent } from '../about/pages/about/about.component';
import { ContactosListComponent } from './pages/contactos-list/contactos-list.component';


const routes : Routes = [
  {
       path: '',
       children: [
       {path: 'contactos', component: ContactosListComponent},
       { path: 'detail/:id', component: ContactosDetailComponent},
       { path: 'new', component: ContactosEditComponent},
       { path: ':id/edit', component: ContactosEditComponent},
       { path: '**', redirectTo: 'contactos'}
       ]
      }
    ]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ContactsRoutingModule { }
