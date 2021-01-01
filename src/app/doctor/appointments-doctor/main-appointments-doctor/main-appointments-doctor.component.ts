import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { faBell,faCalendarTimes } from '@fortawesome/free-solid-svg-icons';
import { DoctorReservation } from 'src/app/services/DoctorReservation';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DoctorService } from 'src/app/services/db/doctor/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/db/client/client.service';

@Component({
  selector: 'app-main-appointments-doctor',
  templateUrl: './main-appointments-doctor.component.html',
  styleUrls: ['./main-appointments-doctor.component.scss']
})
export class MainAppointmentsDoctorComponent implements OnInit {
pageLoading:boolean;
/* */
faBell=faBell;
faCalendarTimes=faCalendarTimes;
/* */
doctorId:string;
doctorReservations:DoctorReservation[];
/* */
today:Date=new Date;
constructor(private auth:AuthService,private doctorService:DoctorService,private clientService:ClientService,private toastr:ToastrService,private router:Router) {
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
    if(this.checkIfExpiredToday(meetingEndTime)){
      this.toastr.error("this meeting already expired, Meeting terminated !");
      this.terminateMeeting(meetingDate,meetingTime);
    }
   else{
   this.toastr.warning("wait for the appointment to start");
    }
  }
}

notTodayClick(meetingDate,meetingTime){
  if(this.checkIfExpiredNotToday(meetingDate)){
    this.toastr.error("this meeting already expired, Meeting terminated !");
    this.terminateMeeting(meetingDate,meetingTime);
  }
  else{
    this.toastr.info("please wait for your meeting date");
  }
}

checkIfToday(date){
  return moment(date).date()==moment(this.today).date();
}

checkIfReady(meetingStartTime,meetingEndTime):boolean{
  this.today=new Date;
  return moment(this.today).isBetween(moment(meetingStartTime),moment(meetingEndTime));
}
checkIfExpiredToday(meetingEndTime){
  this.today=new Date;
  return moment(this.today).isAfter(moment(meetingEndTime));
}
checkIfExpiredNotToday(meetingDate){
  this.today=new Date;
  return moment(this.today).isAfter(moment(meetingDate));
}

terminateMeeting(meetingDate,meetingTime){
  let clientId;
  return this.doctorService.getDoctoreservationById(this.doctorId,`${meetingDate}_${meetingTime}`).subscribe(meeting=>{
    clientId=meeting.clientId;
    this.doctorService.terminateMeeting(this.doctorId,`${meetingDate}_${meetingTime}`);
    this.clientService.terminateMeeting(clientId,`${meetingDate}_${meetingTime}`);
  }
  );
}
}
