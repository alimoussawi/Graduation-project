import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppointmentsDoctorRoutingModule } from './appointments-doctor-routing.module';
import { MainAppointmentsDoctorComponent } from './main-appointments-doctor/main-appointments-doctor.component';


@NgModule({
  declarations: [MainAppointmentsDoctorComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AppointmentsDoctorRoutingModule
  ]
})
export class AppointmentsDoctorModule { }
