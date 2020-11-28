import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainSearchPatientComponent } from './main-search-patient/main-search-patient.component';

const routes: Routes = [
  {path:'',component:MainSearchPatientComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchPatientRoutingModule { }
