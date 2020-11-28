import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {faFacebook ,faGoogle} from '@fortawesome/free-brands-svg-icons';
import { Observable } from 'rxjs';
import {AuthService} from "./../../services/auth/auth.service";
import {UserService} from './../../services/db/user/user.service';
import {ClientService} from './../../services/db/client/client.service'
import { DoctorService } from "./../../services/db/doctor/doctor.service";
import { User } from "./../../services/User";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  faFacebook=faFacebook;
  faGoogle=faGoogle;
  user:User;
  selectedRole:string='';
  roles=['PATIENT','DOCTOR'];

  constructor(private authService:AuthService,private userService:UserService,private clientService:ClientService,private doctorService:DoctorService,private router:Router) {
    this.authService.user.subscribe(user=>{
      this.user=user;  
    },error=>console.log(error)
    );
   }

  ngOnInit(): void {
  }
  
  googleLogin(){
    this.authService.googleSignIn().then(()=>{
      this.checkUserRole();
    },(error)=>{console.log(error)});
  }  
  fbLogin(){
    this.authService.facebookSignIn().then(()=>{
      this.checkUserRole();
    });
  }
  
  logout(){
      this.authService.signOut();
  }
  checkUserRole(){
    if(this.user.role){
      if(this.user.role==='PATIENT'){
        this.router.navigate(['/patient']);
      } 
      if(this.user.role==='DOCTOR'){
        this.router.navigate(['/doctor']);
      }
      return this.user.role; 
    }
    else{return;}
  }
 
  roleChangeHandler(event){
    this.selectedRole=event.target.value;
  }
  roleSubmit(){
    if(this.selectedRole==='DOCTOR'||this.selectedRole==='PATIENT'){
      this.userService.updateUserRole(this.user,this.selectedRole).then(()=>{
        const role=this.checkUserRole();
        if(role==='PATIENT'){
          this.clientService.createClient(this.user);
        }
        else if(role==='DOCTOR'){
          this.doctorService.createDoctor(this.user);
        }
      });
    }
    else{
      alert("choose a valid role ");
    }
  }
}
