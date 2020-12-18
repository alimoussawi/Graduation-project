import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientReservation } from 'src/app/services/ClientReservation';
import { ClientService } from 'src/app/services/db/client/client.service';
import * as moment from 'moment';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {
  clientId:string;
  meetingId:string;
  meeting:ClientReservation;
  today:Date=new Date;
  constructor(private auth:AuthService,private clientService:ClientService,private router:Router,private activeRoute:ActivatedRoute) {
    auth.user.subscribe(user=>{
      if(user){
        this.clientId=user.uid;
        this.activeRoute.params.subscribe(params =>{
          this.meetingId=params['meetingId'];
          this.clientService.getClientReservationById(this.clientId,this.meetingId).subscribe(meeting=>{
            if(meeting &&meeting?.status===`waiting`){
              if(this.checkIfToday(meeting.date,meeting.time)){
                this.meeting=meeting;
              }
              else{
                this.router.navigate(['/patient/appointments']);
              }
            }
            else{
              this.router.navigate(['/patient/appointments']);
            }
          });
        });
      }
    })
   }

  ngOnInit(): void {
  }


  checkIfReady(meetingStartTime,meetingEndTime):boolean{
    return moment(this.today).isBetween(moment(meetingStartTime),moment(meetingEndTime));
  }
  checkIfToday(date,meetingTime){
    this.today=new Date;
     if(moment(date).date()==moment(this.today).date()){
      let meetingStartTime=new Date(`${this.today.toDateString()} ${meetingTime.split('-')[0]}`)
      let meetingEndTime=new Date(`${this.today.toDateString()} ${meetingTime.split('-')[1]}`);
      return this.checkIfReady(meetingStartTime,meetingEndTime);
     }
     return false;
  }
}
