import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../../User';
import {Doctor} from '../../Doctor'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import * as geofirestore from 'geofirestore';
import { UserService } from '../user/user.service';
import { AddressInfo } from '../../AddressInfo';
import { Availability } from '../../Availability';
import { Reservation } from '../../Reservation';
import { first, take } from 'rxjs/operators';

firebase.default.initializeApp(environment.firebaseConfig);
const firestore = firebase.default.firestore();
const GeoFirestore = geofirestore.initializeApp(firestore);


@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  points:Observable<any>;
  
  constructor(private afs:AngularFirestore,private userService:UserService) {
   }
  createDoctor(user:User){
    this.userService.addUnverifiedDoctor(user).then(()=>{
      const doctorRef:AngularFirestoreDocument<Doctor>=this.afs.doc(`unverifiedDoctors/${user.uid}`);
      const data={
      id:user.uid,
      email:user.email,
      name:user.displayName,
      photoURL:user.photoURL,
      role:user.role,
      isVerified:false,
    }
    return doctorRef.set(data);
    });
  }
 /* updateLocation(lat,lng){
    const point = new firebase.default.firestore.GeoPoint(lat, lng);
    const doctorRef:AngularFirestoreDocument<Doctor>=this.afs.doc(`doctors/bUV8zQUfxmfzukq2R7EuRZqXKXj2`);
    return doctorRef.update({location:point}).then(()=>{
      console.log(lat,lng)
    });
  }*/
  getDoctorByid(userId,isVerified){ 
    const unverifieddoctorRef:AngularFirestoreDocument<Doctor>=this.afs.doc(`unverifiedDoctors/${userId}`);
    const doctorRef:AngularFirestoreDocument<Doctor>=this.afs.doc(`doctors/${userId}`);
    return (!isVerified)?unverifieddoctorRef.valueChanges()
          :(isVerified)?doctorRef.valueChanges()
          :null;

  /*  if(user.role==="DOCTOR" &&!user.isVerified){
      const unverifieddoctorRef:AngularFirestoreDocument<Doctor>=this.afs.doc(`unverifiedDoctors/${user.uid}`);
      return unverifieddoctorRef.valueChanges();
    }
    else if(user.role==="DOCTOR" &&user.isVerified){
      const doctorRef:AngularFirestoreDocument<Doctor>=this.afs.doc(`doctors/${user.uid}`);
      return doctorRef.valueChanges();
    }*/
  }
  updateDoctorData(doctorId:string,data:Doctor,profileURL:string,idURL:string,licenseURL:string,code,country,address,city,latitude,longitude){
    const point = new firebase.default.firestore.GeoPoint(latitude, longitude);
    const { name,email,birthDate,phoneNumber,gender,speciality,bio,price} = data;
    const addressInformation:AddressInfo={
      location:point,
      countryCode:code,
      country:country,
      address:address,
      city:city,
    }
    const doctorRef:AngularFirestoreDocument<Doctor>=this.afs.doc(`unverifiedDoctors/${doctorId}`);
      const doctorInfo:Doctor={
      name:name,
      email:email,
      birthDate:Date.parse(birthDate),
      phoneNumber:phoneNumber,
      gender:gender,
      speciality:speciality,
      bio:bio,
      photoURL:profileURL,
      idCardUrl:idURL,
      medicalLicenseUrl:licenseURL,
      addressInfo:addressInformation,
      price:price,
      status:'IN_PROGRESS'
    }
    return doctorRef.update(doctorInfo);
  }

  getDoctorsBySpeciality(){
      const doctorsRef:AngularFirestoreCollection<Doctor>=this.afs.collection(`doctors`,ref=>ref
    .limit(5)
    .where(`speciality`,'==',`IVF and Infertility`)
    .where(`addressInfo.city`,'==',`Kyiv`)
    .where(`price`,'<=', 1000)
    .where(`gender`,'==',`Male`)
    .orderBy('price','asc'));
  
    return doctorsRef.valueChanges();
  }

  updateAvailability(userId:String,availability:Availability){
    const doctorRef:AngularFirestoreDocument<Doctor>=this.afs.doc(`doctors/${userId}`);
    const doctorAv:Doctor={
      availability:availability
    }
    return doctorRef.set(doctorAv,{merge:true});
  }

  getReservations(userId:String){
    const resRef:AngularFirestoreDocument<any>=this.afs.doc(`reservations/${userId}`);  
  return resRef.valueChanges();
  }

  createRes(userId,res:Reservation){    
    const resRef:AngularFirestoreDocument<any>=this.afs.doc(`reservations/${userId}`); 
    const obj={
      dates:res
    }
   return resRef.set(obj);
  }

  getDoctorDetails(doctorId:string){
    const doctorRef:AngularFirestoreDocument<Doctor>=this.afs.doc(`doctors/${doctorId}`);
    return doctorRef.valueChanges();
  }

  updateReservations(doctorId,selectedDate,selectedTime){
    const resRef:AngularFirestoreDocument<any>=this.afs.doc(`reservations/${doctorId}`);;
    const obj={
      dates:{
        [selectedDate]:{
          [selectedTime]:"reserved"
        }        
      },
    }
    console.log(obj)
    return resRef.set(obj,{merge:true});
  }

}
