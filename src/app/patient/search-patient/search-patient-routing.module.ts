import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import { MainSearchPatientComponent } from './main-search-patient/main-search-patient.component';

const routes: Routes = [
  {path:'',component:MainSearchPatientComponent},
  {path:':doctorId',component:DoctorDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchPatientRoutingModule { }
