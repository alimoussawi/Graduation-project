import { Injectable } from '@angular/core';
import { Client } from '../../Client';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../../User';
import { ClientReservation } from '../../ClientReservation';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private afs:AngularFirestore) { }
  
  createClient(user:User){
    const clientRef:AngularFirestoreDocument<Client>=this.afs.doc(`clients/${user.uid}`);
    const data={
      id:user.uid,
      email:user.email,
      name:user.displayName,
      photoURL:user.photoURL,
      role:user.role,
    }

    return clientRef.set(data);
  }

  getClientByid(clientId:string){
    const clientRef:AngularFirestoreDocument<Client>=this.afs.doc(`clients/${clientId}`);
    return clientRef.valueChanges();
  }

  updateClientData(clientId:string,data:Client){
    const {name,email,gender,phoneNumber,age}=data;
    const clientData={
      name:name,
      email:email,
      gender:gender,
      phoneNumber:phoneNumber,
      age:Date.parse(age),
    }    
    const clientRef:AngularFirestoreDocument<Client>=this.afs.doc(`clients/${clientId}`);
    alert(clientData.age);
    return clientRef.set(clientData,{merge:true}); 
  }

  updateClientPhoto(clientId:string,photoPath:string){
    const clientRef:AngularFirestoreDocument<Client>=this.afs.doc(`clients/${clientId}`);
    return clientRef.update({photoURL:photoPath});
  }

  getClientReservations(clientId){
    const clientReservationsRef:AngularFirestoreCollection<ClientReservation>= this.afs.collection(`clients`)
    .doc(`${clientId}`)
    .collection(`reservations`,ref=>ref.where(`status`,'==',`waiting`).orderBy('createdAt'));
    return clientReservationsRef.valueChanges();
  }
  getClientHistory(clientId){
    const clientReservationsRef:AngularFirestoreCollection<ClientReservation>= this.afs.collection(`clients`)
    .doc(`${clientId}`)
    .collection(`reservations`,ref=>ref.where(`status`,'==',`terminated`).orderBy('createdAt'));
    return clientReservationsRef.valueChanges();
  }
  getClientReservationById(clientId,reservationId){
    const clientReservationRef:AngularFirestoreDocument<ClientReservation>= this.afs.collection(`clients`)
    .doc(`${clientId}`)
    .collection(`reservations`)
    .doc(`${reservationId}`);
    return clientReservationRef.valueChanges();
  }
  terminateMeeting(clientId:string,meetingId:string){
    const meeting:ClientReservation={
     status:"terminated" 
    }
    const clientReservationRef:AngularFirestoreDocument<ClientReservation>= this.afs.collection(`clients`)
    .doc(`${clientId}`)
    .collection(`reservations`)
    .doc(`${meetingId}`);
    ;
    return clientReservationRef.set(meeting,{merge:true});
  }
}
