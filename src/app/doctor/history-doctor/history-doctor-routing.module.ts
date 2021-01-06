import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainHistoryDoctorComponent } from './main-history-doctor/main-history-doctor.component';

const routes: Routes = [
  {path:'',component:MainHistoryDoctorComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryDoctorRoutingModule { }
