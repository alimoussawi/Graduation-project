import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class DoctorGuard implements CanActivate, CanActivateChild,CanLoad {
  constructor(private authService:AuthService,private router:Router,private afs:AngularFirestore,private toastr:ToastrService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve,reject)=>{
      this.authService.user.subscribe(user=>{
        if(!user || !user.role){
          this.router.navigate(['/login']);
          resolve(false);
        }
        else if (user && user.role==='PATIENT'){
          this.router.navigate(['/patient']);
          resolve(false);
        }
        else if(user && user.role==='DOCTOR'){
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
        else if (user && user.role==='PATIENT'){
          this.router.navigate(['/patient']);
          resolve(false);
        }
        else if(user && user.role==='DOCTOR'){
          resolve(true);
        }
      });
    });
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return true;
  }
}
