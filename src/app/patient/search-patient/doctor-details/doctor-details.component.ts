import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from 'src/app/services/db/doctor/doctor.service';
import {faCalendarDay} from '@fortawesome/free-solid-svg-icons';
import { Doctor } from 'src/app/services/Doctor';
import { from } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss']
})
export class DoctorDetailsComponent implements OnInit {
  /*fa icons */
  faCalendarDay=faCalendarDay;
  doctorId:string;
  doctor:Doctor;
  reservationsDates;
  afterTodayReservationDates=new Map();
  today:Date=new Date;
  timestamp = this.today.getTime();
  /*Variables inside confirm Modal */
  selectedDate;
  selectedTime;
  selectedTimeStatus;
  selectedPrice;

  constructor(private doctorService:DoctorService,private activeRoute:ActivatedRoute,private router:Router) {
    this.activeRoute.params.subscribe(params =>{
      this.doctorId=params['doctorId'];
      doctorService.getDoctorDetails(this.doctorId).subscribe(doctor=>{
        if(!doctor){
          this.router.navigate(['/patient/search']);
        }
        else{this.doctor=doctor;}
      })
      doctorService.getReservations(this.doctorId).subscribe(reservations=>{
        if(reservations){
        this.reservationsDates=reservations.dates;
        this.getAfterTodayRes();
        console.log(this.today);}
      });
    });
   }

  ngOnInit(): void {
    
  }
  getAfterTodayRes(){
    for(const [key,value] of Object.entries(this.reservationsDates)){
      let values=new Map();

      if(new Date(key).getDate()>=this.today.getDate()&&value){
        for(const [time,status] of Object.entries(value)){
         // console.log(new Date(time.split('-')[0]))
         console.log(this.timestamp+"##"+(new Date(`${this.today.toDateString()} ${time.split('-')[0]}`).getTime()));
          if(new Date(`${key} ${time.split('-')[0]}`).getTime()>this.timestamp &&status==='free'){
            values.set(time,status);
          }
          
        }
        this.afterTodayReservationDates.set(key,values);
      }
      
    }
    console.log(this.afterTodayReservationDates.values());
  }
  
  timeClick(date,time,timeStatus){
    this.selectedDate=date;
    this.selectedTime=time;
    this.selectedTimeStatus=timeStatus;
    this.selectedPrice=this.doctor.price;
  }
}
