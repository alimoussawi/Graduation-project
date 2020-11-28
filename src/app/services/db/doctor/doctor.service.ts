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
  updateDoctorData(doctorId:string,data:Doctor,profileURL,idURL,licenseURL,address,latitude,longitude){
    const point = new firebase.default.firestore.GeoPoint(latitude, longitude);
    const { name,email,age,phoneNumber,gender,speciality,bio} = data;
    const doctorRef:AngularFirestoreDocument<Doctor>=this.afs.doc(`unverifiedDoctors/${doctorId}`);
      const doctorInfo={
      id:doctorId,
      name:name,
      email:email,
      age:age,
      phoneNumber:phoneNumber,
      gender:gender,
      speciality:speciality,
      bio:bio,
      profileURL:profileURL,
      idURL:idURL,
      licenseURL:licenseURL,
      address:address,
      location:point
    }
    return doctorRef.set(doctorInfo,{merge:true});
  }

}
