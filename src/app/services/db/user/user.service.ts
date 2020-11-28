import { Injectable } from '@angular/core';
import { User } from '../../User';
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
  
}
