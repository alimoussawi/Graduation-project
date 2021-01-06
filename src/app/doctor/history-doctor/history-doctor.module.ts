import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HistoryDoctorRoutingModule } from './history-doctor-routing.module';
import { MainHistoryDoctorComponent } from './main-history-doctor/main-history-doctor.component';


@NgModule({
  declarations: [MainHistoryDoctorComponent],
  imports: [
    CommonModule,
    HistoryDoctorRoutingModule,
    FontAwesomeModule
  ]
})
export class HistoryDoctorModule { }
