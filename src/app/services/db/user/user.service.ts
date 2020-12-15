import { Injectable } from '@angular/core';
import { User } from '../../User';
import { ClientReservation } from '../../ClientReservation';
import {DoctorReservation} from '../../DoctorReservation'
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs:AngularFirestore) { }

  updateUserRole(user,role){
    const userRef:AngularFirestoreDocument<User>=this.afs.doc(`users/${user.uid}`);
    return userRef.update({role:role});
  }

   addUnverifiedDoctor(user){
    const userRef:AngularFirestoreDocument<User>=this.afs.doc(`users/${user.uid}`);
    return userRef.update({isVerified:false});
  }
  createClientDoctorReservation(doctorId,doctorName,clientId,clientName,selectedDate,selectedTime){
    const clientResRef:AngularFirestoreDocument<ClientReservation>=this.afs.doc(`clients/${clientId}/reservations/${selectedDate}_${selectedTime}`);
    const doctorResRef:AngularFirestoreDocument<DoctorReservation>=this.afs.doc(`doctors/${doctorId}/reservations/${selectedDate}_${selectedTime}`);
    const clientReservation:ClientReservation={
      doctorId:doctorId,
      doctorName:doctorName,
      date:selectedDate,
      time:selectedTime,
      status:"waiting"
    }
    const doctorReservation:DoctorReservation={
      clientId:clientId,
      clientName:clientName,
      date:selectedDate,
      time:selectedTime,
      status:"waiting"
    }
    return clientResRef.set(clientReservation).then(()=>{doctorResRef.set(doctorReservation)});
  }
}
