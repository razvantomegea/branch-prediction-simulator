/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BenchmarkService } from './benchmark.service';

describe('Service: Benchmark', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BenchmarkService]
    });
  });

  it('should ...', inject([BenchmarkService], (service: BenchmarkService) => {
    expect(service).toBeTruthy();
  }));
});
