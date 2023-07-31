import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from '../about/pages/about/about.component';
import { AboutRoutingModule } from './about-routing.module';


@NgModule({
  declarations: [
    AboutComponent,
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AboutRoutingModule ,
    FormsModule,
  ],
  exports:[
   AboutComponent
  ],
  providers: [
  ],
})
export class AboutModule { }