import { Injectable } from '@angular/core';
import { Observable,of } from 'rxjs';
import { switchMap,map} from 'rxjs/operators';
import { User } from "./../User";
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:Observable<User>;

  constructor(private auth: AngularFireAuth,private afs:AngularFirestore,private router:Router) {
    this.user=this.auth.authState.pipe(
      switchMap(user=>{
        if(user){
          return this.afs.doc(`users/${user.uid}`).valueChanges();
        }else{
          return of(null);
        }
      })
    );
   }

   async googleSignIn(){
    const provider=new firebase.auth.GoogleAuthProvider();
    const credential=await this.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }
  async facebookSignIn(){
    const provider=new firebase.auth.FacebookAuthProvider();
    const credential=await this.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }
  
  async signOut(){
    this.router.navigate(['/']).finally(()=>{
      this.auth.signOut();
    });
  }
  
  updateUserData(user){
    const userRef:AngularFirestoreDocument<User>=this.afs.doc(`users/${user.uid}`);
    const data={
      uid:user.uid,
      email:user.email,
      displayName:user.displayName,
      photoURL:user.photoURL,
    }
    return userRef.set(data,{merge:true})
  }
}
