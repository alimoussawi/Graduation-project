import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { DoctorReservation } from 'src/app/services/DoctorReservation';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DoctorService } from 'src/app/services/db/doctor/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-appointments-doctor',
  templateUrl: './main-appointments-doctor.component.html',
  styleUrls: ['./main-appointments-doctor.component.scss']
})
export class MainAppointmentsDoctorComponent implements OnInit {
pageLoading:boolean;
/* */
faBell=faBell;
/* */
doctorId:string;
doctorReservations:DoctorReservation[];
/* */
today:Date=new Date;
constructor(private auth:AuthService,private doctorService:DoctorService,private toastr:ToastrService,private router:Router) {
  this.pageLoading=true;
  auth.user.subscribe(user=>{
    if(user){
      this.doctorId=user.uid;
      this.doctorService.getDoctorReservations(this.doctorId).subscribe(reservation=>{
        this.doctorReservations=reservation;
      })
    }
    this.pageLoading=false;
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
    this.router.navigate([`appointment/${meetingDate}_${meetingTime}`])
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
