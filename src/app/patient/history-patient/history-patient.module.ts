import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HistoryPatientRoutingModule } from './history-patient-routing.module';
import { MainHistoryPatientComponent } from './main-history-patient/main-history-patient.component';


@NgModule({
  declarations: [MainHistoryPatientComponent],
  imports: [
    CommonModule,
    HistoryPatientRoutingModule,
    FontAwesomeModule
  ]
})
export class HistoryPatientModule { }
