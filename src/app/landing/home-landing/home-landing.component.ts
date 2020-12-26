import { Component, OnInit } from '@angular/core';
import {faReply,faViruses,faHourglassHalf,faMoneyCheck,faSearchPlus,faBookMedical,faDownload,faUserPlus,faVideo,faCalendarPlus} from '@fortawesome/free-solid-svg-icons';
import {faInstagram,faLinkedin,faGooglePlus,faGithub}from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-home-landing',
  templateUrl: './home-landing.component.html',
  styleUrls: ['./home-landing.component.scss']
})
export class HomeLandingComponent implements OnInit {
  /*fa icons */
  faDownload=faDownload;
  faUserPlus=faUserPlus;
  faReply=faReply;
  faViruses=faViruses;
  faHourglassHalf=faHourglassHalf;
  faMoneyCheck=faMoneyCheck;
  faSearchPlus=faSearchPlus;
  faBookMedical=faBookMedical;
  faVideo=faVideo;
  faCalendarPlus=faCalendarPlus;
  /*fa brands*/
  faInstagram=faInstagram;faLinkedin=faLinkedin;faGooglePlus=faGooglePlus;faGithub=faGithub;
  constructor() { }

  ngOnInit(): void {
  }

}
