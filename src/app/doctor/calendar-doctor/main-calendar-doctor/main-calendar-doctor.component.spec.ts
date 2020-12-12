import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCalendarDoctorComponent } from './main-calendar-doctor.component';

describe('MainCalendarDoctorComponent', () => {
  let component: MainCalendarDoctorComponent;
  let fixture: ComponentFixture<MainCalendarDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainCalendarDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCalendarDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
