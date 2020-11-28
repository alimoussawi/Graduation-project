import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainProfilePatientComponent } from './main-profile-patient/main-profile-patient.component';

const routes: Routes = [
  {path:'',component:MainProfilePatientComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilePatientRoutingModule { }
