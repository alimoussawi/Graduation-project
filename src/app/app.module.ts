import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BootstrapModule } from "./bootstrap/bootstrap.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireFunctionsModule,REGION } from '@angular/fire/functions';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AgmCoreModule } from '@agm/core';
import {NgxAgoraModule} from 'ngx-agora';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    BootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    ToastrModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    AgmCoreModule.forRoot({apiKey:environment.googleMapsKey,libraries: ['places'],language:'en'}),
    NgxAgoraModule.forRoot({AppID:environment.agora.appId}),
  ],
  providers: [{ provide: REGION, useValue: 'us-central1' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
