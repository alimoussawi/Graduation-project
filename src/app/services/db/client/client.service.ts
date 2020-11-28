import { Injectable } from '@angular/core';
import { Client } from '../../Client';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../../User';

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
    const clientRef:AngularFirestoreDocument<Client>=this.afs.doc(`clients/${clientId}`);
    return clientRef.set(data,{merge:true}); 
  }

  updateClientPhoto(clientId:string,photoPath:string){
    const clientRef:AngularFirestoreDocument<Client>=this.afs.doc(`clients/${clientId}`);
    return clientRef.update({photoURL:photoPath});
  }
}
