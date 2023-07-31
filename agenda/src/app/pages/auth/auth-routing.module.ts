import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '../users/pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';

const routes : Routes = [
  {
  path: '',
  children: [
  { path: 'login', component:LoginComponent},
  { path:'registro', component: RegisterComponent},
  { path: '**', redirectTo: 'login'}
  ]
}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class AuthRoutingModule { }
