import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientReservation } from 'src/app/services/ClientReservation';
import { ClientService } from 'src/app/services/db/client/client.service';
import * as moment from 'moment';
import { AgoraClient, ClientEvent, NgxAgoraService, Stream, StreamEvent } from 'ngx-agora';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {
  clientId:string;
  meetingId:string;
  meeting:ClientReservation;
  today:Date=new Date;
  /*agora variables */
  localCallId = 'agora_local';
  remoteCalls: string[] = [];
  private agoraClient: AgoraClient;
  private localStream: Stream;
  private uid: string;

  constructor(private auth:AuthService,private clientService:ClientService,private router:Router,private activeRoute:ActivatedRoute,private ngxAgoraService:NgxAgoraService) {
    auth.user.subscribe(user=>{
      if(user){
        this.clientId=user.uid;
        this.activeRoute.params.subscribe(params =>{
          this.meetingId=params['meetingId'];
          this.clientService.getClientReservationById(this.clientId,this.meetingId).subscribe(meeting=>{
            if(meeting &&meeting?.status===`waiting`){
              if(this.checkIfToday(meeting.date,meeting.time)){
                this.meeting=meeting;
                this.uid=meeting.doctorId;
              }
              else{
                this.router.navigate(['/patient/appointments']);
              }
            }
            else{
              this.router.navigate(['/patient/appointments']);
            }
          });
        });
      }
    })
   }


  checkIfReady(meetingStartTime,meetingEndTime):boolean{
    return moment(this.today).isBetween(moment(meetingStartTime),moment(meetingEndTime));
  }
  checkIfToday(date,meetingTime){
    this.today=new Date;
     if(moment(date).date()==moment(this.today).date()){
      let meetingStartTime=new Date(`${this.today.toDateString()} ${meetingTime.split('-')[0]}`)
      let meetingEndTime=new Date(`${this.today.toDateString()} ${meetingTime.split('-')[1]}`);
      return this.checkIfReady(meetingStartTime,meetingEndTime);
     }
     return false;
  }

  //////
  ngOnInit(): void {
    this.agoraClient = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
    this.assignClientHandlers();
    this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
    this.assignLocalStreamHandlers();
    this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
  }

  /*agora methods */
/**
 * Attempts to connect to an online chat room where users can host and receive A/V streams.
 */
join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
  this.agoraClient.join('006b85b7d5dd9034e62923430027ccbba77IAB0eT0spbyEorVv3xLJv1nlN2za136WhCN3AOZB9R8n/WLMzZAAAAAAEAAPRLuFm/vdXwEAAQCb+91f', 'test-channel', this.uid, onSuccess, onFailure);
}
/**
 * Attempts to upload the created local A/V stream to a joined chat room.
 */
publish(): void {
  this.agoraClient.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
}

private assignClientHandlers(): void {
  this.agoraClient.on(ClientEvent.LocalStreamPublished, evt => {
    console.log('Publish local stream successfully');
  });

  this.agoraClient.on(ClientEvent.Error, error => {
    console.log('Got error msg:', error.reason);
    if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
      this.agoraClient.renewChannelKey(
        '',
        () => console.log('Renewed the channel key successfully.'),
        renewError => console.error('Renew channel key failed: ', renewError)
      );
    }
  });

  this.agoraClient.on(ClientEvent.RemoteStreamAdded, evt => {
    const stream = evt.stream as Stream;
    this.agoraClient.subscribe(stream, { audio: true, video: true }, err => {
      console.log('Subscribe stream failed', err);
    });
  });

  this.agoraClient.on(ClientEvent.RemoteStreamSubscribed, evt => {
    const stream = evt.stream as Stream;
    const id = this.getRemoteId(stream);
    if (!this.remoteCalls.length) {
      this.remoteCalls.push(id);
      setTimeout(() => stream.play(id), 1000);
    }
  });

  this.agoraClient.on(ClientEvent.RemoteStreamRemoved, evt => {
    const stream = evt.stream as Stream;
    if (stream) {
      stream.stop();
      this.remoteCalls = [];
      console.log(`Remote stream is removed ${stream.getId()}`);
    }
  });

  this.agoraClient.on(ClientEvent.PeerLeave, evt => {
    const stream = evt.stream as Stream;
    if (stream) {
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
      console.log(`${evt.uid} left from this channel`);
    }
  });
}

private getRemoteId(stream: Stream): string {
  return `agora_remote-${stream.getId()}`;
}
private assignLocalStreamHandlers(): void {
  this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
    console.log('accessAllowed');
  });

  // The user has denied access to the camera and mic.
  this.localStream.on(StreamEvent.MediaAccessDenied, () => {
    console.log('accessDenied');
  });
}
private initLocalStream(onSuccess?: () => any): void {
  this.localStream.init(
    () => {
       // The user has granted access to the camera and mic.
       this.localStream.play(this.localCallId);
       if (onSuccess) {
         onSuccess();
       }
    },
    err => console.error('getUserMedia failed', err)
  );
}
}
