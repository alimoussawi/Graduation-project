import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainHistoryDoctorComponent } from './main-history-doctor.component';

describe('MainHistoryDoctorComponent', () => {
  let component: MainHistoryDoctorComponent;
  let fixture: ComponentFixture<MainHistoryDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainHistoryDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainHistoryDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
