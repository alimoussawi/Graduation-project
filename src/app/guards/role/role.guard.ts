import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/services/User';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate{
  constructor(private authService:AuthService,private router:Router){
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     return new Promise((resolve,reject)=>{
       this.authService.user.subscribe(user=>{
         if(!user || !user.role){
           resolve(true);
         }
         else{
           if(user.role==='PATIENT'){
            this.router.navigate(['/patient']);
           }
           if(user.role==='DOCTOR'){
            this.router.navigate(['/doctor']);
           }
           resolve(false);
         }
       });
     });  
    
    }
    
}
