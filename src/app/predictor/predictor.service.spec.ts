/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PredictorService } from './predictor.service';

describe('Service: Predictor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PredictorService]
    });
  });

  it('should ...', inject([PredictorService], (service: PredictorService) => {
    expect(service).toBeTruthy();
  }));
});
