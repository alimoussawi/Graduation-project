import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilePatientRoutingModule } from './profile-patient-routing.module';
import { MainProfilePatientComponent } from './main-profile-patient/main-profile-patient.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [MainProfilePatientComponent],
  imports: [
    CommonModule,
    ProfilePatientRoutingModule,
    FontAwesomeModule,
    BsDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfilePatientModule { }
