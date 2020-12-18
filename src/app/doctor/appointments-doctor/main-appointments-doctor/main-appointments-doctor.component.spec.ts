import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAppointmentsDoctorComponent } from './main-appointments-doctor.component';

describe('MainAppointmentsDoctorComponent', () => {
  let component: MainAppointmentsDoctorComponent;
  let fixture: ComponentFixture<MainAppointmentsDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainAppointmentsDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainAppointmentsDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
