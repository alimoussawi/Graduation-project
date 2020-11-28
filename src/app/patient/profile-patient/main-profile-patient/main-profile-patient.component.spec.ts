import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainProfilePatientComponent } from './main-profile-patient.component';

describe('MainProfilePatientComponent', () => {
  let component: MainProfilePatientComponent;
  let fixture: ComponentFixture<MainProfilePatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainProfilePatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainProfilePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
