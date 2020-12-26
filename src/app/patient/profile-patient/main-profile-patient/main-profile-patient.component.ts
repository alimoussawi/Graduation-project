import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientService } from 'src/app/services/db/client/client.service'
import { Client } from "src/app/services/Client";
import { faTimes, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-main-profile-patient',
  templateUrl: './main-profile-patient.component.html',
  styleUrls: ['./main-profile-patient.component.scss']
})
export class MainProfilePatientComponent implements OnInit {
  pageLoading:boolean;
  /*font awesome icons*/
  faTimes = faTimes;
  faEdit = faEdit;
  faCheck = faCheck;
  //photo upload percentage
  uploadPercent: number = null;

  EditInfoForm: FormGroup;
  canEdit: boolean = false;
  client: Client;
  userId: string;
  constructor(private storage: AngularFireStorage, private clientService: ClientService, authService: AuthService, private toastr: ToastrService, private formBuilder: FormBuilder) {
    this.pageLoading=true;
    authService.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        clientService.getClientByid(this.userId).subscribe(client => {
          this.client = client;
        });
      }
    });

  }
  ngOnInit(): void {
    this.createEditForm();
    setTimeout(() => {
      this.setDefaultValues();
      this.pageLoading=false;
    }, 2000);


  }
  setDefaultValues() {
    let defaultClient = {
      name: this.client?.name || "",
      email: this.client?.email || "",
      gender: this.client?.gender || "",
      phoneNumber: this.client?.phoneNumber || "",
      age: new Date(this.client?.age).toLocaleDateString() || "",
    }
    this.EditInfoForm.setValue(defaultClient);
  }
  editToggle() {
    this.canEdit = true;
  }

  handleConfirm() {
    this.canEdit = false;
  }
  get h() {
    return this.EditInfoForm.controls;
  }
  onSubmit() {
    if (this.EditInfoForm.invalid) {
      return;
    }
    else {
      this.clientService.updateClientData(this.client.id, this.EditInfoForm.value).then(() => {
        this.canEdit = false;
        this.toastr.success("info updated succesfully");
      }, (error) => {
        this.canEdit = false;
        this.toastr.error("an error occured");
        console.log(error);
      });
    }
  }

  async changePhoto(event) {
    const file = event.target.files[0];
    const ext = file.name.match(/\.(.+)$/)[1];

    if (ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'jpeg' || ext.toLowerCase() === 'png') {
      const filePath = `profileImages/clients/${this.userId}/${this.userId}`
      const fileref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      task.percentageChanges().subscribe((percentage) => {
        this.uploadPercent = percentage;
      });

      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileref.getDownloadURL().subscribe(url => {
              this.clientService.updateClientPhoto(this.userId, url).then(() => {
                this.toastr.success("photo updated");
              }, (error) => { this.toastr.error("something went wrong"); });
            });
          })).subscribe();
    }
    else {
      this.toastr.error("choose an image file")
    }
  }

  createEditForm() {
    this.EditInfoForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern("^[0-9]*$")]],
      age: ['', [Validators.required]]
    });
  }
}
