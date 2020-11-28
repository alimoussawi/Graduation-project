import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileDoctorRoutingModule } from './profile-doctor-routing.module';
import { MainProfileDoctorComponent } from './main-profile-doctor/main-profile-doctor.component';
// MDB Angular 
import { ButtonsModule, WavesModule, CardsModule } from 'angular-bootstrap-md'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [MainProfileDoctorComponent],
  imports: [
    CommonModule,
    ProfileDoctorRoutingModule,
    FontAwesomeModule,
    ButtonsModule, WavesModule, CardsModule,
    AgmCoreModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule
  ]
})
export class ProfileDoctorModule { }
