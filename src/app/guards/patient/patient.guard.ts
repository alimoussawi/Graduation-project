import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable,of } from 'rxjs';
import { first, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PatientGuard implements CanActivate, CanActivateChild,CanLoad {
  constructor(private authService:AuthService,private router:Router,private afs:AngularFirestore,private toastr:ToastrService){}
 

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve,reject)=>{
      this.authService.user.subscribe(user=>{
       
         if (user && user.role==='DOCTOR'){
          this.router.navigate(['/doctor']);
          resolve(false);
        }
        else if(user && user.role==='PATIENT'){
          resolve(true);
        }
      });
    });  
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return new Promise((resolve,reject)=>{
      this.authService.user.subscribe(user=>{
        if(!user || !user.role){
          this.router.navigate(['/login']);
          resolve(false);
        }
        else if (user && user.role==='DOCTOR'){
          this.router.navigate(['/doctor']);
          resolve(false);
        }
        else if(user && user.role==='PATIENT'){
          resolve(true);
        }
      });
    });  
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve,reject)=>{
      this.authService.user.pipe(
        switchMap(user=>{
          if(user){
            return this.afs.doc(`clients/${user.uid}`).valueChanges();
          }else{
            return of(null);
          }
        })
      ).pipe(first(client=>client!=null)).subscribe(client=>{
        if(!client.name || !client.email || !client.age || !client.phoneNumber){
          console.log("data not avail");
          this.router.navigate(['/patient']);
          this.toastr.error("complete your profile first");
          resolve(false);
        }
        else{
          console.log("data avail");
          resolve(true);
        }
      
     });
    });
  }
  
}


