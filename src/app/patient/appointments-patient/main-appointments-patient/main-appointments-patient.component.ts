import { Component, OnInit } from '@angular/core';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientReservation } from 'src/app/services/ClientReservation';
import { ClientService } from 'src/app/services/db/client/client.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-appointments-patient',
  templateUrl: './main-appointments-patient.component.html',
  styleUrls: ['./main-appointments-patient.component.scss']
})
export class MainAppointmentsPatientComponent implements OnInit {
  /* */
  faBell=faBell;
  /* */
  clientId:string;
  clientReservations:ClientReservation[];
  /* */
  today:Date=new Date;
  constructor(private auth:AuthService,private clientService:ClientService,private toastr:ToastrService,private router:Router) {
    auth.user.subscribe(user=>{
      if(user){
        this.clientId=user.uid;
        this.clientService.getClientReservations(this.clientId).subscribe(reservation=>{
          this.clientReservations=reservation;
        })
      }
    })
   }

  ngOnInit(): void {
    
  }
  todayClick(meetingDate,meetingTime){
    let meetingStartTime=new Date(`${this.today.toDateString()} ${meetingTime.split('-')[0]}`)
    let meetingEndTime=new Date(`${this.today.toDateString()} ${meetingTime.split('-')[1]}`);
    let isReady=this.checkIfReady(meetingStartTime,meetingEndTime);
    if(isReady){
      this.toastr.success("allowed to enter");
      this.router.navigate([`/patient/appointments/${meetingDate}_${meetingTime}`])
    }
    else{
      if(this.checkIfExpired(meetingEndTime)){
        this.toastr.error("Too late, Meeting has ended");
      }
     else{
     this.toastr.warning("wait for the appointment to start");
      }
    }
  }

  checkIfToday(date){
    return moment(date).date()==moment(this.today).date();
  }

  checkIfReady(meetingStartTime,meetingEndTime):boolean{
    this.today=new Date;
    return moment(this.today).isBetween(moment(meetingStartTime),moment(meetingEndTime));
  }
  checkIfExpired(meetingEndTime){
    this.today=new Date;
    return moment(this.today).isAfter(moment(meetingEndTime));
  }
}
