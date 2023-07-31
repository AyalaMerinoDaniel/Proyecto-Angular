import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { CommonModule} from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from '../about/pages/about/about.component';


const routes : Routes = [
  {
       path: '',
       children: [
       {path: 'about', component: AboutComponent},
       { path: '**', redirectTo: 'about'}
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
export class AboutRoutingModule { }
