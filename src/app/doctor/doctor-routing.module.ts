import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoctorGuard } from '../guards/doctor/doctor.guard';
import { MainDoctorComponent } from './main-doctor/main-doctor.component';

const routes: Routes = [
  {path:'',component:MainDoctorComponent,canActivate:[DoctorGuard],children:[
    {path:'',loadChildren:()=>import('./profile-doctor/profile-doctor.module').then(m=>m.ProfileDoctorModule)},
    {path:'calendar',canActivateChild:[DoctorGuard],loadChildren:()=>import('./calendar-doctor/calendar-doctor.module').then(m=>m.CalendarDoctorModule)}

  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
