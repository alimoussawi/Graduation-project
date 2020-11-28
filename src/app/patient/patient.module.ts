import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { MainPatientComponent } from './main-patient/main-patient.component';
import { NavbarPatientComponent } from './navbar-patient/navbar-patient.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@NgModule({
  declarations: [MainPatientComponent, NavbarPatientComponent],
  imports: [
    CommonModule,
    PatientRoutingModule,
    FontAwesomeModule,
    BsDropdownModule.forRoot(),
    NavbarModule, WavesModule, ButtonsModule
  ]
})
export class PatientModule { }
