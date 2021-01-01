import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {faIdCard,faCalendarCheck,faNotesMedical,faCalendarDay,faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DoctorService } from 'src/app/services/db/doctor/doctor.service';
import { Doctor } from 'src/app/services/Doctor';
import { User } from 'src/app/services/User';

@Component({
  selector: 'app-navbar-doctor',
  templateUrl: './navbar-doctor.component.html',
  styleUrls: ['./navbar-doctor.component.scss']
})
export class NavbarDoctorComponent implements OnInit {
   /*font awesome icons*/
   faIdCard=faIdCard;
   faCalendarCheck=faCalendarCheck;
   faNotesMedical=faNotesMedical;
   faCalendarDay=faCalendarDay;
   faSignOutAlt=faSignOutAlt;

   user:User;
   doctor:Doctor;
  constructor(public authService:AuthService,private doctorService:DoctorService,private router:Router) {
    authService.user.subscribe(user=>{
      if(user){
        this.user=user; 
        doctorService.getDoctorByid(this.user.uid,this.user.isVerified).subscribe(doctor=>{
        this.doctor=doctor;
      });
    }  
  });
   }

  ngOnInit(): void {
  }

  logout(){
    return this.authService.signOut();
  }
}
