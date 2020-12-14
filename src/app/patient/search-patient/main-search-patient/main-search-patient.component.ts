import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MapsAPILoader } from '@agm/core';
import { faFileSignature, faUserMd,faMale,faFemale,faCity,faVenusMars,faMoneyBill,faFilter } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from 'src/app/services/db/doctor/doctor.service';
import { Doctor } from 'src/app/services/Doctor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-search-patient',
  templateUrl: './main-search-patient.component.html',
  styleUrls: ['./main-search-patient.component.scss']
})
export class MainSearchPatientComponent implements OnInit {
  /* location variables*/
  latitude;
  longitude;
  private geoCoder:google.maps.Geocoder;
  defaultcity;
  address;
  /*font awesome icons */
  faFileSignature = faFileSignature;
  faUserMd = faUserMd;
  faCity=faCity;
  faVenusMars=faVenusMars;
  faMoneyBill=faMoneyBill;
  faMale=faMale;
  faFemale=faFemale;
  /**/
  doctorsLoading:boolean=false;
  searchSpeciality: string;
  searchCity:string;
  specRadio: string;
  prices:number[]=[50,100,200,300,400,500];
  priceRadio:number;
  cities:string[]=['Kyiv',`Kharkivs'ka oblast`,`Dnipropetrovs'ka oblast`,`Poltavs'ka oblast`,`L'vivs'ka oblast`]
  cityRadio:string;
  sorting:string[]=['asc','desc'];
  sortRadio:firebase.default.firestore.OrderByDirection;
  /**/
  specialities: string[] = ['Dermatology (Skin)', 'Dentistry (Teeth)', 'Psychiatry (Mental, Emotional or Behavioral Disorders)',
    'Pediatrics and New Born (Child)', 'Neurology (Brain &amp; Nerves)', 'Orthopedics (Bones)', 'Gynaecology and Infertility',
    'Ear, Nose and Throat', 'Cardiology and Vascular Disease (Heart)', 'Allergy and Immunology (Sensitivity and Immunity)', 'Andrology and Male Infertility'
    , 'Audiology', 'Cardiology and Thoracic Surgery (Heart &amp; Chest)', 'Chest and Respiratory', 'Diabetes and Endocrinology',
    'Diagnostic Radiology (Scan Centers)', 'Dietitian and Nutrition', 'Family Medicine', 'Gastroenterology and Endoscopy',
    'General Practice', 'General Surgery', 'Geriatrics (Old People Health)', 'Hematology', 'Hepatology (Liver Doctor)',
    'Internal Medicine', 'IVF and Infertility', 'Laboratories', 'Nephrology', 'Neurosurgery (Brain &amp; Nerves Surgery)',
    'Obesity and Laparoscopic Surgery', 'Oncology (Tumor)', 'Oncology Surgery (Tumor Surgery)', 'Ophthalmology (Eyes)',
    'Osteopathy (Osteopathic Medicine)', 'Pain Management', 'Pediatric Surgery', 'Phoniatrics (Speech)',
    'Physiotherapy and Sport Injuries', 'Plastic Surgery', 'Rheumatology', 'Spinal Surgery', 'Urology (Urinary System)', 'Vascular Surgery (Arteries and Vein Surgery)'];
  /**/
   //Models for Input fields
   nameValue: string;
   placeValue: string;
 
   //Data object for listing items
   tableData: any[] = [];
 
   //Save first document in snapshot of items received
   firstInResponse: any = [];
 
   //Save last document in snapshot of items received
   lastInResponse: any = [];
 
   //Keep the array of first document of previous pages
   prev_strt_at: any = [];
 
   //Maintain the count of clicks on Next Prev button
   pagination_clicked_count = 0;
 
   //Disable next and prev buttons
   disable_next: boolean = false;
   disable_prev: boolean = false;

  
  doctors: any[];
  constructor(private afs:AngularFirestore,private doctorService: DoctorService,private mapsAPILoader: MapsAPILoader, private toastr: ToastrService,private router:Router) { }

  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();

    });
  }

  specSave() {
    if (!this.specRadio) {
      this.toastr.error("choose a speciality");
      return;
    }
    else {
    //  this.doctorService.getDoctorsBySpeciality().subscribe(doctors=>{
      //  this.tableData=doctors;
    //  });
     this.loadItems(this.specRadio,this.cityRadio,this.priceRadio);
    }
  }


  loadItems(speciality:string,city:string=this.defaultcity,price:number=1000,sort:firebase.default.firestore.OrderByDirection='asc') {
    this.doctorsLoading=true;
    this.afs.collection('doctors', ref => ref
    .limit(2)
    .where(`speciality`,'==',`${speciality}`)
    .where(`addressInfo.city`,'==',`${city}`)
    .where(`price`,'<=', parseInt(`${price}`))
    .orderBy('price',sort)
    ).snapshotChanges()
      .subscribe(response => {
        if (!response.length) {
          console.log("No Data Available");
          this.tableData = [];
          this.doctorsLoading=false;
          return false;
        }
        this.firstInResponse = response[0].payload.doc;
        this.lastInResponse = response[response.length - 1].payload.doc;

        this.tableData = [];
        for (let item of response) {
          console.log(item);
          this.tableData.push(item.payload.doc.data());
        }

        //Initialize values
        this.prev_strt_at = [];
        this.pagination_clicked_count = 0;
        this.disable_next = false;
        this.disable_prev = false;

        //Push first item to use for Previous action
        this.push_prev_startAt(this.firstInResponse);
        this.doctorsLoading=false;
      }, error => {
      });
  }

  //Show previous set 
  prevPage(speciality:string,city:string="Kharkivs'ka oblast",price:number=1000,sort:firebase.default.firestore.OrderByDirection='asc') {
    this.doctorsLoading=true;
    this.disable_prev = true;
    this.afs.collection('doctors', ref => ref
    .where(`speciality`,'==',`${speciality}`)
    .where(`addressInfo.city`,'==',`${city}`)
    .where(`price`,'<=', parseInt(`${price}`))
    .orderBy('price',sort)
      .startAt(this.get_prev_startAt())
      .endBefore(this.firstInResponse)
      .limit(2)
    ).get()
      .subscribe(response => {
        this.firstInResponse = response.docs[0];
        this.lastInResponse = response.docs[response.docs.length - 1];
        
        this.tableData = [];
        for (let item of response.docs) {
          this.tableData.push(item.data());
        }

        //Maintaing page no.
        this.pagination_clicked_count--;

        //Pop not required value in array
        this.pop_prev_startAt(this.firstInResponse);

        //Enable buttons again
        this.disable_prev = false;
        this.disable_next = false;
        this.doctorsLoading=false;
      }, error => {
        this.disable_prev = false;
      });
  }

  nextPage(speciality:string,city:string="Kharkivs'ka oblast",price:number=1000,sort:firebase.default.firestore.OrderByDirection='asc') {
    this.doctorsLoading=true;
    this.disable_next = true;
    this.afs.collection('doctors', ref => ref
    .limit(2)
    .where(`speciality`,'==',`${speciality}`)
    .where(`addressInfo.city`,'==',`${city}`)
    .where(`price`,'<=', parseInt(`${price}`))
    .orderBy('price',sort)
      .startAfter(this.lastInResponse)
    ).get()
      .subscribe(response => {

        if (!response.docs.length) {
          this.disable_next = true;
          this.doctorsLoading=false;
          return;
        }

        this.firstInResponse = response.docs[0];

        this.lastInResponse = response.docs[response.docs.length - 1];
        this.tableData = [];
        for (let item of response.docs) {
          this.tableData.push(item.data());
        }

        this.pagination_clicked_count++;

        this.push_prev_startAt(this.firstInResponse);

        this.disable_next = false;
        this.doctorsLoading=false;
      }, error => {
        this.disable_next = false;
      });
  }

  push_prev_startAt(prev_first_doc) {
    this.prev_strt_at.push(prev_first_doc);
  }

  //Remove not required document 
  pop_prev_startAt(prev_first_doc) {
    this.prev_strt_at.forEach(element => {
      if (prev_first_doc.data().id == element.data().id) {
        element = null;
      }
    });
  }

  //Return the Doc rem where previous page will startAt
  get_prev_startAt() {
    if (this.prev_strt_at.length > (this.pagination_clicked_count + 1))
      this.prev_strt_at.splice(this.prev_strt_at.length - 2, this.prev_strt_at.length - 1);
    return this.prev_strt_at[this.pagination_clicked_count - 1];
  }


  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      this.geoCoder = new google.maps.Geocoder;
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude }}, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          results[0].address_components.forEach(address=>{
            if(address.types[0].toString()==='administrative_area_level_1'){
                this.defaultcity=address.long_name;
                console.log(this.defaultcity);
            }
            if(address.types[0].toString()==='country'){
              console.log("country"+address.short_name);
              if(address.short_name!='UA'){
                this.defaultcity='';
                this.toastr.error("choose an address in ukraine please");
              }
              else{
                this.address = results[0].formatted_address;
                if(this.address.includes(', Kyiv,')){
                  console.log('entered');
                  this.defaultcity='Kyiv';
                  console.log(this.defaultcity);

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
    });
  }

  cardClick(id){
    alert("card  "+id+"  clicked");
    this.router.navigate([`/patient/search/${id}`]);
  }

}
