import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPatientComponent } from './main-patient/main-patient.component';
import { PatientGuard } from "./../guards/patient/patient.guard";

const routes: Routes = [
  {path:'',component:MainPatientComponent,canActivate:[PatientGuard],children:[
    {path:'',loadChildren:()=>import(`./profile-patient/profile-patient.module`).then(m=>m.ProfilePatientModule)},
    {path:'search',canActivateChild:[PatientGuard],loadChildren:()=>import('./search-patient/search-patient.module').then(m=>m.SearchPatientModule)},
    {path:'appointments',canActivateChild:[PatientGuard],loadChildren:()=>import('./appointments-patient/appointments-patient.module').then(m=>m.AppointmentsPatientModule)}

  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    
  ],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
