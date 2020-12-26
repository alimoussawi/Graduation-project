import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import vanillaSmoothie from 'vanilla-smoothie'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  logout() {
    this.authService.signOut();
  }

  scrollTo(divId) {
    if (this.router.url === '/login') {
        this.router.navigate(['']).then(()=>{
         setTimeout(() => {
          vanillaSmoothie.scrollTo(divId, {
            duration: 1000,
            easing: 'easeOutQuart'
          }, () => { console.log('scrolled');
          })
         }, 500);
        })
    }
    else {
      vanillaSmoothie.scrollTo(divId, {
        duration: 1000,
        easing: 'easeOutQuart'
      }, () => { console.log('scrolled');
      })
    }
  }
}
