import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
import {MainAppointmentsPatientComponent} from "./main-appointments-patient/main-appointments-patient.component"
const routes: Routes = [
  {path:'',component:MainAppointmentsPatientComponent},
  {path:':meetingId',component:AppointmentDetailsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsPatientRoutingModule { }
