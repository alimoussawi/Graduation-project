import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainHistoryPatientComponent } from './main-history-patient.component';

describe('MainHistoryPatientComponent', () => {
  let component: MainHistoryPatientComponent;
  let fixture: ComponentFixture<MainHistoryPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainHistoryPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainHistoryPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
