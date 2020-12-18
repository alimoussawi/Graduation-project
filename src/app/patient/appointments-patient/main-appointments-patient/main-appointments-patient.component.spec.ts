import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAppointmentsPatientComponent } from './main-appointments-patient.component';

describe('MainAppointmentsPatientComponent', () => {
  let component: MainAppointmentsPatientComponent;
  let fixture: ComponentFixture<MainAppointmentsPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainAppointmentsPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainAppointmentsPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
