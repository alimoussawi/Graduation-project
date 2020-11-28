import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainProfileDoctorComponent } from './main-profile-doctor/main-profile-doctor.component';

const routes: Routes = [
  {path:'',component:MainProfileDoctorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileDoctorRoutingModule { }
