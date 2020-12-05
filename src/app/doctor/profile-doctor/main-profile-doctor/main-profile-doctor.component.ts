import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { faChevronRight, faPersonBooth, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { MapsAPILoader } from '@agm/core';
import { DoctorService } from 'src/app/services/db/doctor/doctor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from 'src/app/services/auth/auth.service';
import { Doctor } from 'src/app/services/Doctor';
import { AngularFireStorage } from '@angular/fire/storage';
import { filter, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase';
import { User } from 'src/app/services/User';


@Component({
  selector: 'app-main-profile-doctor',
  templateUrl: './main-profile-doctor.component.html',
  styleUrls: ['./main-profile-doctor.component.scss']
})
export class MainProfileDoctorComponent implements OnInit {
  /*font awesome icons*/
  faChevronRight = faChevronRight;
  faUserEdit = faUserEdit;
  /*terms btn*/
  termsCheck:boolean=false;
  /*g maps variables*/
  loading: boolean = false;
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  city:String;
  code:string;
  country:string;

  private geoCoder:google.maps.Geocoder;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  /*form group */
  EditInfoForm: FormGroup;
  /*afs*/
  user:User;
  doctor: Doctor;
  userId: string;
  //files
  photoFile: any;
  idFile: any;
  licenseFile: any;
  //storage urls 
  profileURL: string;
  idURL: string;
  licenseURL: string;
  // doctor specialities 
  specialities:string[]=['Dentistry (Teeth)','Psychiatry (Mental, Emotional or Behavioral Disorders)',
  'Pediatrics and New Born (Child)','Neurology (Brain &amp; Nerves)','Orthopedics (Bones)','Gynaecology and Infertility',
    'Ear, Nose and Throat','Cardiology and Vascular Disease (Heart)','Allergy and Immunology (Sensitivity and Immunity)','Andrology and Male Infertility'
    ,'Audiology','Cardiology and Thoracic Surgery (Heart &amp; Chest)','Chest and Respiratory','Diabetes and Endocrinology',
    'Diagnostic Radiology (Scan Centers)','Dietitian and Nutrition','Family Medicine','Gastroenterology and Endoscopy',
    'General Practice','General Surgery','Geriatrics (Old People Health)','Hematology','Hepatology (Liver Doctor)',
    'Internal Medicine','IVF and Infertility','Laboratories','Nephrology','Neurosurgery (Brain &amp; Nerves Surgery)',
    'Obesity and Laparoscopic Surgery','Oncology (Tumor)','Oncology Surgery (Tumor Surgery)','Ophthalmology (Eyes)',
    'Osteopathy (Osteopathic Medicine)','Pain Management','Pediatric Surgery','Phoniatrics (Speech)',
    'Physiotherapy and Sport Injuries','Plastic Surgery','Rheumatology','Spinal Surgery','Urology (Urinary System)','Vascular Surgery (Arteries and Vein Surgery)'];
  constructor(authService: AuthService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private doctorService: DoctorService,
    private formBuilder: FormBuilder, private storage: AngularFireStorage, private toastr: ToastrService) {
    authService.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.user=user;
        doctorService.getDoctorByid(user.uid, user.isVerified).subscribe(doctor => {
          this.doctor = doctor;
        });
      }
    });
  }

  ngOnInit() {
    //load the google map 
    this.createEditForm();
    setTimeout(()=>{
      if (!this.doctor?.isVerified && !this.doctor?.addressInfo?.address) {
        this.loadMap();
        }
      if (!this.doctor?.isVerified && this.doctor?.addressInfo?.address) {
        this.toastr.info("your profile is being reviewed by our team !, if you want to make changes contact our support team ", "",
          { positionClass: 'toast-bottom-full-width' ,disableTimeOut:true});
      }
    },500)
  }

  loadMap() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement,{componentRestrictions:{country:"ua"}});
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
    this.loading = true;
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude }}, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          results[0].address_components.forEach(address=>{
            if(address.types[0].toString()==='administrative_area_level_1'){
                this.city=address.long_name;
                console.log(this.city);
            }
            if(address.types[0].toString()==='country'){
              console.log("country"+address.short_name);
              if(address.short_name!='UA'){
                this.code='';
                this.country='';
                this.address='';
                this.city='';
                this.toastr.error("choose an address in ukraine please");
              }
              else{
                this.code='UA';
                this.country='Ukraine';
                this.address = results[0].formatted_address;
                if(this.address.includes(', Kyiv,')){
                  console.log('entered');
                  this.city='Kyiv';
                  console.log(this.city);

                }
              }
            }


          })
        } else {
          this.toastr.error("ERROR, TRY LATER");
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
      this.loading = false;
    });
  }



  createEditForm() {
    this.EditInfoForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern("^[0-9]+$")]],
      email: ['', [Validators.required, Validators.email]],
      speciality: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      price:['',[Validators.required,Validators.pattern("^[0-9]+$")]],
      birthDate: ['', [Validators.required]],
      bio: ['', [Validators.required, Validators.minLength(10)]],
      idFile: ['', [Validators.required]],
      licenseFile: ['', [Validators.required]],
      photo: ['', [Validators.required]],
    });
  }

   onSubmit() {
    if (this.EditInfoForm.invalid || !this.photoFile || !this.licenseFile || !this.idFile || !this.address||!this.code||!this.city) {
      console.log(this.EditInfoForm.status);
      this.toastr.error("please fill all fields");
      return;
    }
    else {
      console.log(this.EditInfoForm.value);
      this.uploadFilesAndUpdateData(this.photoFile, this.idFile, this.licenseFile)
    }
  }

  changePhoto(event) {
    const file = event.target.files[0];
    const ext = file.name.match(/\.(.+)$/)[1];
    if (ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'jpeg' || ext.toLowerCase() === 'png') {
      this.photoFile = file;
    }
    else {
      this.toastr.error("choose an image file")
    }
  }
  changeID(event) {
    const file = event.target.files[0];
    const ext = file.name.match(/\.(.+)$/)[1];
    if (ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'jpeg' || ext.toLowerCase() === 'png') {
      this.idFile = file;
    }
    else {
      this.toastr.error("choose an image file")
    }
  }
  changeLicense(event) {
    const file = event.target.files[0];
    const ext = file.name.match(/\.(.+)$/)[1];
    if (ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'jpeg' || ext.toLowerCase() === 'png') {
      this.licenseFile = file;
    }
    else {
      this.toastr.error("choose an image file")
    }
  }

  async uploadFilesAndUpdateData(photoFile, idFile, licenseFile) {
    let profileSuccess:boolean=false;
    let idSuccess:boolean=false;
    let licenseSuccess:boolean=false;
    //type
    const PROFILE_IMG: string = 'PROFILE_IMG';
    const ID_IMG: string = 'ID_IMG';
    const LICENSE_IMG: string = 'LICENSE_IMG';
    //path in fire storage
    const profileFilePath = `doctorDocuments/doctors/${this.userId}/${this.userId}${PROFILE_IMG}`
    const idFilePath = `doctorDocuments/doctors/${this.userId}/${this.userId}${ID_IMG}`
    const licenseFilePath = `doctorDocuments/doctors/${this.userId}/${this.userId}${LICENSE_IMG}`
    //storage ref
    const profileFileRef = this.storage.ref(profileFilePath);
    const idFileRef = this.storage.ref(idFilePath);
    const licenseFileRef = this.storage.ref(licenseFilePath);
    //Tasks
    const profileTask = this.storage.upload(profileFilePath, photoFile);
    const idTask = this.storage.upload(idFilePath, idFile);
    const licenseTask = this.storage.upload(licenseFilePath, licenseFile);
    profileTask.snapshotChanges()
      .pipe(
        finalize(() => {
          profileFileRef.getDownloadURL().subscribe(url => {
            this.profileURL = url;
            profileSuccess=true;
            this.checkUploaded(profileSuccess,idSuccess,licenseSuccess);
            console.log(this.profileURL);
          });
        })).subscribe();
    idTask.snapshotChanges()
      .pipe(
        finalize(() => {
          idFileRef.getDownloadURL().subscribe(url => {
            this.idURL = url;
            idSuccess=true;
            this.checkUploaded(profileSuccess,idSuccess,licenseSuccess);

            console.log(this.idURL);

          });
        })).subscribe();
    licenseTask.snapshotChanges()
      .pipe(
        finalize(() => {
          licenseFileRef.getDownloadURL().subscribe(url => {
            this.licenseURL = url;
            licenseSuccess=true;
            this.checkUploaded(profileSuccess,idSuccess,licenseSuccess);
            console.log(this.licenseURL);

          },error=>console.log(error));
        })).subscribe();

       
  }

checkUploaded(profileSuccess,idSuccess,licenseSuccess){
  if(profileSuccess&&idSuccess&&licenseSuccess){
    this.doctorService.updateDoctorData(this.userId, this.EditInfoForm.value,
      this.profileURL, this.idURL, this.licenseURL,this.code,this.country, this.address,this.city, this.latitude, this.longitude)
  }
}

  get h() {
    return this.EditInfoForm.controls;
  }
}
