import { Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgoraClient, ClientEvent, NgxAgoraService, Stream, StreamEvent } from 'ngx-agora';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {faPhoneSlash,faMicrophoneSlash,faVideoSlash} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/db/client/client.service';
import { DoctorService } from 'src/app/services/db/doctor/doctor.service';
import * as moment from 'moment';
import { AngularFireFunctions } from '@angular/fire/functions';
import { User } from 'src/app/services/User';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit,OnDestroy {
  /* fa icons*/
  faPhoneSlash=faPhoneSlash;
  faMicrophoneSlash=faMicrophoneSlash;
  faVideoSlash=faVideoSlash;
  /*toggle buttons */
  microToggle:boolean;
  videoToggle:boolean;
  pageLoading:boolean=true;
  joinClicked:boolean=false;
  doctorId:string;
  clientId:string;
  meetingId:string;
  meeting;
  today:Date=new Date;
  /*bootstrap modal*/
  modalRef: BsModalRef;
  /*agora variables */
  fnDoctorId:string;
  fnClientId:string;
  localCallId = 'agora_local';
  remoteCalls: string[] = [];
  agoraToken;
  private agoraClient: AgoraClient;
  private localStream: Stream;
  uid:number=0;
  
  currentUser:User;
  constructor(private auth:AuthService,private doctorService:DoctorService,private clientService:ClientService,private fns:AngularFireFunctions,private router:Router,private activeRoute:ActivatedRoute,private ngxAgoraService:NgxAgoraService,private modalService: BsModalService,private toastr:ToastrService) {
    auth.user.subscribe(user=>{
      if(user){
        this.currentUser=user;
        if(user.role==='PATIENT'){
          this.clientId=user.uid;
          this.activeRoute.params.subscribe(params =>{
            this.meetingId=params['meetingId'];
            this.clientService.getClientReservationById(this.clientId,this.meetingId).subscribe(meeting=>{
              if(meeting &&meeting?.status===`waiting`){
                if(this.checkIfToday(meeting.date,meeting.time)){
                  this.meeting=meeting;
                  this.fnDoctorId=meeting.doctorId;
                  this.fnClientId=this.clientId;
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
        if(user.role==='DOCTOR'){
          this.doctorId=user.uid;
          this.activeRoute.params.subscribe(params =>{
            this.meetingId=params['meetingId'];
            this.doctorService.getDoctoreservationById(this.doctorId,this.meetingId).subscribe(meeting=>{
              if(meeting &&meeting?.status===`waiting`){
                if(this.checkIfToday(meeting.date,meeting.time)){
                  this.meeting=meeting;
                  this.fnDoctorId=this.doctorId;
                  this.fnClientId=meeting.clientId;
                }
                else{
                  this.router.navigate(['/doctor/appointments']);
                }
              }
              else{
                this.router.navigate(['/doctor/appointments']);
              }
            });
          });
        }
       
      }
    });
    
   }
  
/*window closed*/
@HostListener('window:beforeunload', ['$event'])
 beforeunloadHandler($event) {
  $event.preventDefault();
  $event.returnValue='Your data will be lost!';
  window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Older browsers supported custom message
    event.returnValue = '';
  }); 
return $event; 
}
 confirmClose(): void {
  this.modalRef.hide();
}

declineClose(): void {
  this.modalRef.hide();
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

  ngOnInit(): void {
    this.pageLoading=true;
    setTimeout(() => {
      this.uid=0;
      this.pageLoading=false;
    }, 3000);
   
  }

   async startMeeting(){
     this.pageLoading=true;
      const data={
      doctorId:this.fnDoctorId,
      clientId:this.fnClientId,
      }
    const callable = this.fns.httpsCallable('createAgoraToken');
    const obs = callable(data);
    obs.subscribe(async res=>{
      console.log(res);
        if(res.result==='SUCCESSFUL'){
          this.agoraToken= await res.token;
          setTimeout(() => {
            this.agoraClient = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' });
            this.assignClientHandlers();
            this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
            this.assignLocalStreamHandlers();
            this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
            this.pageLoading=false;
            }, 2000);
        }
        else{
          alert('failed')
         this.pageLoading=false;
        }
      });
   this.joinClicked=true;
    
  }
/*agora methods */
/**
 * Attempts to connect to an online chat room where users can host and receive A/V streams.
 */
join(onSuccess?: (uid: number|string) => void, onFailure?: (error: Error) => void): void {
  this.agoraClient.join(this.agoraToken,`${this.fnDoctorId}_${this.fnClientId}`,this.uid, onSuccess, onFailure);
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

mircoClick(){
this.microToggle=!this.microToggle;
if(this.microToggle===false){
  this.localStream.unmuteAudio();
}
if(this.microToggle===true){
  this.localStream.muteAudio();
}
}

videoClick(){
this.videoToggle=!this.videoToggle;
if(this.videoToggle===false){
  this.localStream.unmuteVideo();
}
if(this.videoToggle===true){
  this.localStream.muteVideo();
}
}

endCallClick(endCallTemplate:TemplateRef<any>){
  this.modalRef = this.modalService.show(endCallTemplate, {class: 'modal-sm'});
}
confirmEndCall(){
  this.agoraClient.leave(()=>{
    this.localStream.stop();
    this.localStream.close();
    if(this.currentUser.role==='PATIENT'){
      this.router.navigate(['/patient/appointments']);
    }
    if(this.currentUser.role==='DOCTOR'){
      this.router.navigate(['/doctor/appointments']);
    }
  });
  this.modalRef.hide();

}
declineEndCall(){
  this.modalRef.hide();
}
ngOnDestroy(): void {
  if(this.currentUser.role==='DOCTOR' &&this.joinClicked){
    this.toastr.info("meeting has been terninated");
    this.terminateMeeting();
  }
  if(this.agoraClient){
  this.agoraClient.leave(()=>{
    this.localStream.stop((error)=>{console.log(error+"  already left")});
    this.localStream.close();
  });
  }
}
terminateMeeting(){
  this.doctorService.terminateMeeting(this.fnDoctorId,this.meetingId);
  this.clientService.terminateMeeting(this.fnClientId,this.meetingId);
}
}
