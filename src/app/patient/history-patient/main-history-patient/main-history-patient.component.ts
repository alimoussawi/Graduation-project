import { Component, OnInit } from '@angular/core';
import {faCalendarTimes,faHourglassEnd } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientReservation } from 'src/app/services/ClientReservation';
import { ClientService } from 'src/app/services/db/client/client.service';

@Component({
  selector: 'app-main-history-patient',
  templateUrl: './main-history-patient.component.html',
  styleUrls: ['./main-history-patient.component.scss']
})
export class MainHistoryPatientComponent implements OnInit {
/* fa icons */
faCalendarTimes=faCalendarTimes;
faHourglassEnd=faHourglassEnd;
/* */
pageLoading:boolean;
clientId:string;
clientHistory:ClientReservation[];
constructor(private auth:AuthService,private clientService:ClientService) {
  this.pageLoading=true;
  auth.user.subscribe(user=>{
  if(user){
    this.clientId=user.uid;
    this.clientService.getClientHistory(this.clientId).subscribe(reservations=>{
      this.clientHistory=reservations;
    })
  }
  this.pageLoading=false;
})
}
  ngOnInit(): void {
  }

}
