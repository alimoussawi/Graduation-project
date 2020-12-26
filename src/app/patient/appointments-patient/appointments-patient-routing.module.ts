import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainAppointmentsPatientComponent} from "./main-appointments-patient/main-appointments-patient.component"
const routes: Routes = [
  {path:'',component:MainAppointmentsPatientComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsPatientRoutingModule { }
