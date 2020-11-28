import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { MainLandingComponent } from './main-landing/main-landing.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SectionsComponent } from './sections/sections.component';
import { HomeLandingComponent } from './home-landing/home-landing.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonsModule, NavbarModule, WavesModule } from 'angular-bootstrap-md';


@NgModule({
  declarations: [NavbarComponent, MainLandingComponent, SignInComponent, SectionsComponent, HomeLandingComponent],
  imports: [
    CommonModule,
    LandingRoutingModule,
    FontAwesomeModule,
    NavbarModule, WavesModule, ButtonsModule
  ]
})
export class LandingModule { }
