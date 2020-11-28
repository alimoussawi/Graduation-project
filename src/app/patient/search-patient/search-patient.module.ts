import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchPatientRoutingModule } from './search-patient-routing.module';
import { MainSearchPatientComponent } from './main-search-patient/main-search-patient.component';


@NgModule({
  declarations: [MainSearchPatientComponent],
  imports: [
    CommonModule,
    SearchPatientRoutingModule
  ]
})
export class SearchPatientModule { }
