import { Component, OnInit } from '@angular/core';
import { faFileSignature, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from 'src/app/services/db/doctor/doctor.service';
import { Doctor } from 'src/app/services/Doctor';

@Component({
  selector: 'app-main-search-patient',
  templateUrl: './main-search-patient.component.html',
  styleUrls: ['./main-search-patient.component.scss']
})
export class MainSearchPatientComponent implements OnInit {
  faFileSignature = faFileSignature;
  faUserMd = faUserMd;
  searchText: string;
  specRadio: string;
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

  doctors: any[];
  constructor(private doctorService: DoctorService, private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  specSave() {
    if (!this.specRadio) {
      this.toastr.error("choose a speciality");
      return;
    }
    else {
      this.doctorService.getDoctorsBySpeciality(this.specRadio).subscribe(doctors=>{
        this.doctors=doctors;}
      );
    }
  }
}
