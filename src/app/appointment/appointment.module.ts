import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppointmentRoutingModule } from './appointment-routing.module';
import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    FontAwesomeModule,
    AppointmentRoutingModule
  ],
  providers:[ModalModule],
})
export class AppointmentModule { }
