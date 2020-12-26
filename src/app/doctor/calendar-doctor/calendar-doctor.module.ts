import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import {ModalModule,BadgeModule } from 'angular-bootstrap-md'
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarDoctorRoutingModule } from './calendar-doctor-routing.module';
import { MainCalendarDoctorComponent } from './main-calendar-doctor/main-calendar-doctor.component';


@NgModule({
  declarations: [MainCalendarDoctorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    BadgeModule,
    AccordionModule,
    FontAwesomeModule,
    TimepickerModule.forRoot(),
    CalendarDoctorRoutingModule
  ]
})
export class CalendarDoctorModule { }
