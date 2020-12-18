import { Component, OnInit } from '@angular/core';
import {faReply} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-landing',
  templateUrl: './home-landing.component.html',
  styleUrls: ['./home-landing.component.scss']
})
export class HomeLandingComponent implements OnInit {
  faReply=faReply;
  constructor() { }

  ngOnInit(): void {
  }

}
