import { Injectable } from '@angular/core';

import { Benchmark, BenchmarkService } from '../benchmark';
import { HistoryRegister, HistoryRegisterEntry } from '../prediction-history';
import { Results } from '../results';

@Injectable()
export class DetectorService {
  private HRg: HistoryRegister;
  private results: any[];
  private traces: any[];
  constructor(private benchmarkSvc: BenchmarkService) {
    this.traces = [];
    this.results = [];
  }

  private initializeHRg(bitLength: number = 0, entries: HistoryRegisterEntry[] = [], size: number = 0): void {
    this.HRg = new HistoryRegister(bitLength, entries, size);
  }

  public detectUBBranches(benchmarks: string[], hrgBits: number, bias: number): void {
    let result: Results;
    this.initializeHRg(hrgBits);

    this.benchmarkSvc.getBenchmarcks(benchmarks).subscribe(
      data => {
        data.forEach((trace: any, index: number) => {
          this.traces.push(new Benchmark(benchmarks[index], trace._body.toString()));
          console.log(trace);
        });
      },
      error => console.error('Error: ' + error),
      () => {
        console.log(this.traces);
        this.traces.forEach((trace: Benchmark) => {
          this.HRg.resetRegister();
          let branches: string[] = trace.info.split("\n"),
            context: string = "",
            currPC: number;
          result = new Results(0, 0, [], 0, 0, trace.filename);

          for (let i: number = 0; i < hrgBits; i++) {
            context += "0";
          }

          branches.forEach((br: string) => {
            let brItems: string[] = br.split(" "),
                brType: string = brItems[0].charAt(0),
                hit: boolean;
                switch (brType) {
                  case 'B':
                  hit = false;
                    currPC = parseInt(brItems[1]);
                    this.HRg.entries.forEach((entry: HistoryRegisterEntry) => {
                      if ((entry.pcLow === currPC) && (entry.context === context)) {
                        entry.taken++;
                        hit = true;
                      }
                    });

                    if (!hit) {
                      this.HRg.addEntry(context, 0, currPC, true);
                    }

                    context += "1";
                    break;
                  
                  case 'N':
                    hit = false;
                    currPC = parseInt(brItems[1]);
                    this.HRg.entries.forEach((entry: HistoryRegisterEntry) => {
                      if ((entry.pcLow === currPC) && (entry.context === context)) {
                        entry.notTaken++;
                        hit = true;
                      }
                    });

                    if (!hit) {
                      this.HRg.addEntry(context, 0, currPC, false);
                    }

                    context += "0";
                    break;
                
                  default:
                    break;
                }

                context = context.slice(1);
          });

          console.log(this.HRg);

        });
      }
    );

  }

}
