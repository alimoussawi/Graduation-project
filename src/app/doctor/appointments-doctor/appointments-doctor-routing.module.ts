import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainAppointmentsDoctorComponent } from "./main-appointments-doctor/main-appointments-doctor.component";
const routes: Routes = [
  {path:'',component:MainAppointmentsDoctorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsDoctorRoutingModule { }
