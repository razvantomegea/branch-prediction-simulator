/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DetectorService } from './detector.service';

describe('Service: Detector', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetectorService]
    });
  });

  it('should ...', inject([DetectorService], (service: DetectorService) => {
    expect(service).toBeTruthy();
  }));
});
