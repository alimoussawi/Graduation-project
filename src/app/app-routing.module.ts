import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientGuard } from './guards/patient/patient.guard';
import { RoleGuard } from "./guards/role/role.guard";
import { DoctorGuard } from "./guards/doctor/doctor.guard";
const routes: Routes = [
  {path:'',loadChildren: () => import(`./landing/landing.module`).then(m => m.LandingModule)},
  {path:'patient',canLoad:[PatientGuard],loadChildren:()=>import(`./patient/patient.module`).then(m=>m.PatientModule)},
  {path:'doctor',canLoad:[DoctorGuard],loadChildren:()=>import(`./doctor/doctor.module`).then(m=>m.DoctorModule)},
  {path:'appointment',canLoad:[RoleGuard],loadChildren:()=>import(`./appointment/appointment.module`).then(m=>m.AppointmentModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
