import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const appRoutes: Routes = [
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)},
  {path: 'users', loadChildren: ()=> import('./pages/users/users.module').then(m => m.UsersModule)},
  {path: 'contact', loadChildren: ()=> import('./pages/contacts/contacts.module').then(m => m.ContactsModule)},
  {path: 'about',loadChildren: ()=> import('./pages/about/about.module').then(m => m.AboutModule)},
  {path: '**', redirectTo: 'contact'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}