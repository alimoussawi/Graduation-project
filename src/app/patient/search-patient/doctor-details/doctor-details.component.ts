import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from 'src/app/services/db/doctor/doctor.service';
import {faCalendarDay} from '@fortawesome/free-solid-svg-icons';
import { Doctor } from 'src/app/services/Doctor';
import { from } from 'rxjs';
import { Observable } from 'rxjs';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/db/client/client.service';
import { UserService } from 'src/app/services/db/user/user.service';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss']
})
export class DoctorDetailsComponent implements OnInit {
  userEmail:string;
  userName:string;
  userId:string;
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
  /*stripe */
  private stripe:Stripe
  paymentLoading:boolean=false;
  constructor(private auth:AuthService,private clientService:ClientService,private doctorService:DoctorService,private userService:UserService,private fns:AngularFireFunctions,private activeRoute:ActivatedRoute,private router:Router,private toastr:ToastrService) {
    this.auth.user.subscribe(user=>{
      if(user){
        this.clientService.getClientByid(user.uid).subscribe(client=>{
            this.userEmail=client?.email;
            this.userName=client?.name;
            this.userId=client?.id;
        });
      }
    })
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

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripe.testKey);
    const elements = this.stripe.elements();

    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: (window.innerWidth <= 500) ? '12px' : '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    const card = elements.create('card', { style });


    card.mount('#card-element');

    card.on('change', (event) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }

    });

    const button = document.getElementById('button');
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const ownerInfo = {
        owner: {
          name : this.userName,
          email:this.userEmail,
        },
        amount: this.selectedPrice*100,
        currency: 'uah'
      };

      this.stripe.createSource(card, ownerInfo).then((result) => {
        console.log(result);
        if (result.error) {
          const errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          this.stripeSourceHandler(result.source);
        }
      });
    });
    
  }
  getAfterTodayRes(){
    if(this.reservationsDates){
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
  }
    console.log(this.afterTodayReservationDates.values());
  }
  
  timeClick(date,time,timeStatus){
    this.selectedDate=date;
    this.selectedTime=time;
    this.selectedTimeStatus=timeStatus;
    this.selectedPrice=this.doctor.price;
  }
  private stripeSourceHandler(source): void {
    console.log(source);
    this.paymentLoading=true;
    const callable = this.fns.httpsCallable('stripeChargeCall');
    const obs = callable(source);
    obs.subscribe(res => {
      console.log(res);
      if (res.result === 'SUCCESSFUL') {
        this.toastr.success("payment succuss ,check your reservations")
        this.doctorService.updateReservations(this.doctorId,this.selectedDate,this.selectedTime).then(()=>{
          this.userService.createClientDoctorReservation(this.doctorId,this.doctor.name,this.userId,this.userName,this.selectedDate,this.selectedTime)
          .then(()=>{
            this.paymentLoading=false;
            this.router.navigate(['/patient/appointments'])
          });
        });
      } else {
        this.toastr.error("something went wrong!");
        this.paymentLoading=false;
        this.router.navigate(['/patient/search']);
      }
    });
  }

  proceedToPayment(basicModal){
    if(this.selectedTimeStatus!='busy'){
    this.doctorService.makeReservationBusy(this.doctorId,this.selectedDate,this.selectedTime).then(()=>{
      basicModal.hide();
    });
  }
}

onPaymentModalClose(event){
  this.doctorService.makeReservationFree(this.doctorId,this.selectedDate,this.selectedTime);
}
  testUpdate(){
    this.doctorService.updateReservations(this.doctorId,this.selectedDate,this.selectedTime);
  }
}
