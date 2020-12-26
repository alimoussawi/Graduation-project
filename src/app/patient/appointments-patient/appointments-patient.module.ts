import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppointmentsPatientRoutingModule } from './appointments-patient-routing.module';
import { MainAppointmentsPatientComponent } from './main-appointments-patient/main-appointments-patient.component';


@NgModule({
  declarations: [MainAppointmentsPatientComponent],
  imports: [
    CommonModule,
    AppointmentsPatientRoutingModule,
    FontAwesomeModule,
  ]
})
export class AppointmentsPatientModule { }
