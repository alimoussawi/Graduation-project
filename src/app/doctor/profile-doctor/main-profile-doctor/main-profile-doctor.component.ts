import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import {faChevronRight,faPersonBooth,faUserEdit} from '@fortawesome/free-solid-svg-icons';
import { MapsAPILoader} from '@agm/core';
import { DoctorService } from 'src/app/services/db/doctor/doctor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from 'src/app/services/auth/auth.service';
import { Doctor } from 'src/app/services/Doctor';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-main-profile-doctor',
  templateUrl: './main-profile-doctor.component.html',
  styleUrls: ['./main-profile-doctor.component.scss']
})
export class MainProfileDoctorComponent implements OnInit {
  /*font awesome icons*/
  faChevronRight=faChevronRight;
  faUserEdit=faUserEdit;
  /*g maps variables*/
  loading:boolean=false;
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  /*form group */
  EditInfoForm: FormGroup;
  /*afs*/
  doctor: Doctor;
  userId: string;
  profileURL:string;
  idURL:string;
  licenseURL:string;
  constructor(authService: AuthService, private mapsAPILoader: MapsAPILoader,private ngZone: NgZone,private doctorService:DoctorService,
     private formBuilder: FormBuilder,private storage: AngularFireStorage, private toastr: ToastrService) {
      authService.user.subscribe(user => {
        if(user){
          this.userId = user.uid;
          doctorService.getDoctorByid(user.uid,user.isVerified).subscribe(doctor => {
            this.doctor = doctor;
          });
        }
    });
   }

   ngOnInit() {
    //load the google map 
    this.createEditForm();
   setTimeout(() => {
    if(!this.doctor.isVerified && !this.doctor.address){
      this.loadMap();
    }
    if(!this.doctor.isVerified && this.doctor.address){
      this.toastr.info("your profile is being reviewed by our team !, if you want to make changes contact our support team ","",
      {positionClass:'toast-bottom-full-width',disableTimeOut:true,tapToDismiss:false});
    }
   }, 1000);
  }

  loadMap(){
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.getAddress(this.latitude, this.longitude);

        });
      });
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  markerDragEnd($event: google.maps.MouseEvent) {
    console.log($event);
    this.latitude = $event.latLng.lat();
    this.longitude = $event.latLng.lng();
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.loading=true;
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
      this.loading=false;
    });
  }



  createEditForm(){
    this.EditInfoForm = this.formBuilder.group({
      name: ['', [Validators.required,Validators.minLength(4),Validators.pattern("/^[a-zA-Z\s]*$/")]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern("^[0-9]*$")]],
      email: ['', [Validators.required,Validators.email]],
      speciality: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      age:['', [Validators.required]],
      bio:['', [Validators.required,Validators.minLength(10)]],
      idFile:['', [Validators.required]],
      licenseFile:['', [Validators.required]],
      photo:['', [Validators.required]],
    });
  }

  onSubmit(){
    if (this.EditInfoForm.invalid) {
      console.log(this.EditInfoForm.status);
      return;
    }
    else {
      console.log(this.EditInfoForm.value);
      this.doctorService.updateDoctorData(this.doctor.id, this.EditInfoForm.value,
          this.profileURL,this.idURL,this.licenseURL,this.address,this.latitude,this.longitude);
    }
  }

  async changePhoto(event){
    const type:string='PROFILE_IMG';
    const file = event.target.files[0];
    const ext = file.name.match(/\.(.+)$/)[1];
    if (ext.toLowerCase() ==='jpg' || ext.toLowerCase() ==='jpeg' || ext.toLowerCase() ==='png') {
      const filePath = `doctorDocuments/doctors/${this.userId}/${this.userId}${type}`
      const fileref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      task.percentageChanges().subscribe();
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileref.getDownloadURL().subscribe(url => {
            this.profileURL=url;
            });
          })).subscribe();
    }
    else{
      this.toastr.error("choose an image file")
    }
  }
  async changeID(event){
    const type:string='ID_IMG';
    const file = event.target.files[0];
    const ext = file.name.match(/\.(.+)$/)[1];
    if (ext.toLowerCase() ==='jpg' || ext.toLowerCase() ==='jpeg' || ext.toLowerCase() ==='png') {
      const filePath = `doctorDocuments/doctors/${this.userId}/${this.userId}${type}`
      const fileref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      task.percentageChanges().subscribe();
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileref.getDownloadURL().subscribe(url => {
            this.idURL=url;
            });
          })).subscribe();
    }
    else{
      this.toastr.error("choose an image file")
    }
  }
  async changeLicense(event){
    const type:string='LICENSE_IMG';
    const file = event.target.files[0];
    const ext = file.name.match(/\.(.+)$/)[1];
    if (ext.toLowerCase() ==='jpg' || ext.toLowerCase() ==='jpeg' || ext.toLowerCase() ==='png') {
      const filePath = `doctorDocuments/doctors/${this.userId}/${this.userId}${type}`
      const fileref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      task.percentageChanges().subscribe();
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileref.getDownloadURL().subscribe(url => {
            this.licenseURL=url;
            });
          })).subscribe();
    }
    else{
      this.toastr.error("choose an image file")
    }
  }


  get h() {
    return this.EditInfoForm.controls;
  }
}
