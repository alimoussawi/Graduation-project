import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainAppointmentsDoctorComponent } from "./main-appointments-doctor/main-appointments-doctor.component";
import { AppointmentDetailsComponent } from "./appointment-details/appointment-details.component";
const routes: Routes = [
  {path:'',component:MainAppointmentsDoctorComponent},
  {path:':meetingId',component:AppointmentDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsDoctorRoutingModule { }
