import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/services/User';
import { faIdCard, faEnvelope, faSearch, faNotesMedical, faCalendarDay, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/db/client/client.service';
import { Client } from 'src/app/services/Client';

@Component({
  selector: 'app-navbar-patient',
  templateUrl: './navbar-patient.component.html',
  styleUrls: ['./navbar-patient.component.scss']
})
export class NavbarPatientComponent implements OnInit {
  /*font awesome icons*/
  faIdCard = faIdCard;
  faSearch = faSearch;
  faNotesMedical = faNotesMedical;
  faCalendarDay = faCalendarDay;
  faSignOutAlt = faSignOutAlt;
  faEnvelope = faEnvelope;

  user: User;
  client: Client;
  constructor(public authService: AuthService, public clientService: ClientService, private router: Router) {
    authService.user.subscribe(user => {
      if (user) {
        this.user = user;
        clientService.getClientByid(this.user.uid).subscribe(client => {
          this.client = client;
        });
      }
    });
  }

  logout() {
    this.router.navigate(['/']);
    return this.authService.signOut();
  }

  ngOnInit(): void {
  }

}
