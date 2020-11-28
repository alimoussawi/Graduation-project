import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSearchPatientComponent } from './main-search-patient.component';

describe('MainSearchPatientComponent', () => {
  let component: MainSearchPatientComponent;
  let fixture: ComponentFixture<MainSearchPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainSearchPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSearchPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
