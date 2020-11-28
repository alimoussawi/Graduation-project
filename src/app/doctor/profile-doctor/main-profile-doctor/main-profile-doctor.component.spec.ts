import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainProfileDoctorComponent } from './main-profile-doctor.component';

describe('MainProfileDoctorComponent', () => {
  let component: MainProfileDoctorComponent;
  let fixture: ComponentFixture<MainProfileDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainProfileDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainProfileDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
