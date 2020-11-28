import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';
import { MainDoctorComponent } from './main-doctor/main-doctor.component';
import { NavbarDoctorComponent } from './navbar-doctor/navbar-doctor.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@NgModule({
  declarations: [MainDoctorComponent, NavbarDoctorComponent],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    FontAwesomeModule,
    NavbarModule, WavesModule, ButtonsModule,
    BsDropdownModule.forRoot(),
  ]
})
export class DoctorModule { }
