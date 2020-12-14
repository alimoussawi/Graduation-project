import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { SearchPatientRoutingModule } from './search-patient-routing.module';
import { MainSearchPatientComponent } from './main-search-patient/main-search-patient.component';
// MDB Angular Pro
import { ButtonsModule, WavesModule, CardsModule, DropdownModule,ModalModule } from 'angular-bootstrap-md'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FilterPipe } from './pipes/filter.pipe';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';


@NgModule({
  declarations: [MainSearchPatientComponent, FilterPipe, DoctorDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    SearchPatientRoutingModule,
    AccordionModule,
    TabsModule,
    ModalModule,
    ButtonsModule, WavesModule, CardsModule,
    DropdownModule.forRoot(),
    FontAwesomeModule
  ]
})
export class SearchPatientModule { }
