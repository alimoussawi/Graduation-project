import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLandingComponent } from './main-landing/main-landing.component';
import { SectionsComponent } from './sections/sections.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { RoleGuard } from "./../guards/role/role.guard";
const routes: Routes = [
  {path:'',component:MainLandingComponent,children:[
    {path:'',component:SectionsComponent},
    {path:'login',canActivate:[RoleGuard],component:SignInComponent}
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
