import { Component, OnInit } from '@angular/core';
import {faCalendarTimes,faHourglassEnd } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DoctorService } from 'src/app/services/db/doctor/doctor.service';
import { DoctorReservation } from 'src/app/services/DoctorReservation';

@Component({
  selector: 'app-main-history-doctor',
  templateUrl: './main-history-doctor.component.html',
  styleUrls: ['./main-history-doctor.component.scss']
})
export class MainHistoryDoctorComponent implements OnInit {
  /* fa icons */
  faCalendarTimes=faCalendarTimes;
  faHourglassEnd=faHourglassEnd;
  /* */
  pageLoading:boolean;
  doctorId:string;
  doctorHistory:DoctorReservation[];
  constructor(private auth:AuthService,private doctorService:DoctorService) {
    this.pageLoading=true;
    auth.user.subscribe(user=>{
    if(user){
      this.doctorId=user.uid;
      this.doctorService.getDoctorHistory(this.doctorId).subscribe(reservations=>{
        this.doctorHistory=reservations;
      })
    }
    this.pageLoading=false;
  })
   }

  ngOnInit(): void {
  }

}
