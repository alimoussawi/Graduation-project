import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainCalendarDoctorComponent } from './main-calendar-doctor/main-calendar-doctor.component';

const routes: Routes = [
  {path:'',component:MainCalendarDoctorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarDoctorRoutingModule { }
