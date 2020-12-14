import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Availability } from 'src/app/services/Availability';
import { DoctorService } from 'src/app/services/db/doctor/doctor.service';
import { Doctor } from 'src/app/services/Doctor';
import { Reservation } from 'src/app/services/Reservation';
import { User } from 'src/app/services/User';

@Component({
  selector: 'app-main-calendar-doctor',
  templateUrl: './main-calendar-doctor.component.html',
  styleUrls: ['./main-calendar-doctor.component.scss']
})
export class MainCalendarDoctorComponent implements OnInit {
  availability: Availability = {};
  enableEdit: boolean = false;
  editLoading: boolean = false;
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  minutes: number[] = [15, 30, 60, 75, 90];
  /*afs*/
  user: User;
  doctor: Doctor;
  userId: string;
  reservationsDates;
  constructor(private doctorService: DoctorService, private authService: AuthService,private toastr:ToastrService) {
    authService.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.user = user;
        doctorService.getDoctorByid(user.uid, user.isVerified).subscribe(doctor => {
          this.doctor = doctor;
          doctorService.getReservations(this.userId).subscribe(reservations=>{
            if(reservations){
            this.reservationsDates=reservations.dates;
            }
          });
        });
      }
    });
  }
  isChecked: boolean[] = new Array(7).fill(false);
  //time picker vars.
  minStartTime: Date[] = new Array(7).fill(new Date());
  maxEndTime: Date[] = new Array(7).fill(new Date());
  startTime: Date[] = new Array(7).fill(new Date());
  endTime: Date[] = new Array(7).fill(new Date());
  period: number[] = new Array(7).fill(0);
  //current week var
  week = [];
  ngOnInit(): void {
    let curr = new Date 
    //default start and end time
    for (let i = 0; i < 7; i++) {
      this.startTime[i].setHours(9);
      this.startTime[i].setMinutes(0);
      this.endTime[i].setHours(10);
      this.endTime[i].setMinutes(0);
      this.minStartTime[i].setHours(9);
      this.minStartTime[i].setMinutes(0);
      this.maxEndTime[i].setHours(20);
      this.maxEndTime[i].setMinutes(0);
    }
    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i
      let date = new Date(curr.setDate(first)).toISOString().slice(0, 10)
      this.week.push(date)
    }
  }



  valid: boolean[] = new Array(7).fill(true);



  getPeriods(startTime: Date, endTime: Date, period: number) {
    if ((!startTime || !endTime || !period) || (endTime.getHours() <= startTime.getHours()) && (endTime.getMinutes() <= startTime.getMinutes())) {
      return null;
    }
    let dayTimes: string[] = new Array();
    const intPeriod: number = parseInt(`${period}`);
    let mStartTime = moment().utc().set({ hour: startTime.getHours(), minute: startTime.getMinutes() });
    let intervalStart = moment().utc().set({ hour: startTime.getHours(), minute: startTime.getMinutes() });
    let mEndTime = moment().utc().set({ hour: endTime.getHours(), minute: endTime.getMinutes() });
    let intervalEnd = moment().utc().set({ hour: endTime.getHours(), minute: endTime.getMinutes() });
    if (period != 0) {
      while (mStartTime <= mEndTime) {
        if (intervalStart.add(intPeriod, 'minutes') > intervalEnd) {
          console.log("not valid");
          break;
        }
        const t1 = moment(mStartTime).format('HH:mm');
        mStartTime.add(intPeriod, 'minutes');
        const t2 = moment(mStartTime).format('HH:mm');
        dayTimes.push(t1 + "-" + t2);
      }
    }
    intervalStart = moment().utc().set({ hour: startTime.getHours(), minute: startTime.getMinutes() });
    intervalEnd = moment().utc().set({ hour: endTime.getHours(), minute: endTime.getMinutes() });
    return dayTimes;

  }

  calculateAvailability(modal) {
    for (let i = 0; i < this.isChecked.length; i++) {
      if (this.isChecked[i] == true) {
        const hours: string[] = this.getPeriods(this.startTime[i], this.endTime[i], this.period[i]);
        this.availability[this.days[i]] = hours;
      }
      else {
        this.availability[this.days[i]] = null;
      }
    }
    console.log(this.availability);
    modal.show();
  }

  updateAvailability() {
    this.editLoading = true;
    this.doctorService.updateAvailability(this.userId, this.availability).finally(() => {
      this.editLoading = false;
      this.enableEdit = false;
    });
  }


  confirmWeekDates() {
    let res: Reservation = {}
    let week = this.week;
    if(this.checkReservation()){
    for (const [key, value] of Object.entries(this.doctor.availability)) {
      if (value) {
        for (let i = 0; i < week.length; i++) {
          let day = this.days[(new Date(week[i]).getDay() + 6) % 7];
          if (day === key) {
            for (let j = 0; j < value.length; j++) {
              res[week[i]]=Object.assign({[value[j]]:"free"},res[week[i]]);
            }
          }
        }
      }
      else{
        for (let i = 0; i < week.length; i++) {
          let day = this.days[(new Date(week[i]).getDay() + 6) % 7];
          if(day===key){
        res[week[i]]=null;}
      }
      }
    }
    console.log(res);
    this.doctorService.createRes(this.userId,res).then(()=>{
      this.toastr.success(`Schedule from ${week[0]} to ${week[6]} has been confirmed`)
    });
  }
  else{
    console.log("not allowed")
  }
    
  }


  checkReservation():boolean{
    let keys=[]
    if(this.reservationsDates){
    for(const key of Object.keys(this.reservationsDates)){
      keys.push(key);
    }
    if(keys.includes(this.week[0]) &&keys.includes(this.week[6])){
      this.toastr.error("Week Schedule Already Confirmed !");
      return false;
    }
    else return true;
    }
     return true;
  }


}