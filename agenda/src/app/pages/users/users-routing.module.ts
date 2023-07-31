import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './pages/register/register.component';


const routes : Routes = [
  {
  path: '',
  children: [
  { path: ':id/edit', component: RegisterComponent},
  { path: '**', redirectTo: 'registro'}
  ]
}
]

@NgModule({
  imports: [
  RouterModule.forChild(routes)
  ]
})
export class UsersRoutingModule { }
