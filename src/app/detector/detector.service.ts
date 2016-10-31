import { Injectable } from '@angular/core';

import { BenchmarkService } from '../benchmark';
import { HistoryRegister, HistoryRegisterEntry } from '../prediction-history';

@Injectable()
export class DetectorService {
  private HRg: HistoryRegister;
  private traces: any[];
  constructor(private benchmarkSvc: BenchmarkService) { 
    this.traces = [];
  }

  private initializeHRg(bitLength: number = 0, entries: HistoryRegisterEntry[] = [], size: number = 0): void {
    this.HRg = new HistoryRegister(bitLength, entries, size);
  }

  public detectBranches(benchmarks: string[], hrgBits: number, ubPolarization: number): void {
    this.initializeHRg(hrgBits);
    this.benchmarkSvc.getBenchmarcks(benchmarks).subscribe(
      data => {
        data.forEach((trace: any, index: number) => {
          this.traces.push({
            filename: benchmarks[index],
            info: trace._body.toString()
          });
          console.log(trace);
        });
      },
      error => console.error('Error: ' + error),
      () => console.log('Completed!')
    );
  }

}
