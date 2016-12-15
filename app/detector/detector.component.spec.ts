/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DetectorComponent } from './detector.component';

describe('DetectorComponent', () => {
  let component: DetectorComponent;
  let fixture: ComponentFixture<DetectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});