import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainHistoryPatientComponent} from './main-history-patient/main-history-patient.component';
const routes: Routes = [
  {path:'',component:MainHistoryPatientComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryPatientRoutingModule { }
