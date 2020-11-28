import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const bootstrapComponents=[
  TooltipModule.forRoot(),
  BsDropdownModule.forRoot(),
  BsDatepickerModule.forRoot(),
]

@NgModule({
  imports: [
    bootstrapComponents
  ],
  exports:[
    bootstrapComponents
  ]
})
export class BootstrapModule { }
