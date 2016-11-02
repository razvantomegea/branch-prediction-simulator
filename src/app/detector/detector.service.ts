import { Injectable } from '@angular/core';

import { Benchmark, BenchmarkService } from '../benchmark';
import { HistoryRegister, HistoryRegisterEntry, UnbiasedBranch } from '../shared';
import { Results } from '../results';

@Injectable()
export class DetectorService {
  private HRg: HistoryRegister;
  private results: Results[];
  private traces: any[];
  constructor(private benchmarkSvc: BenchmarkService) { }

  private initializeHRg(bitLength: number = 0, entries: HistoryRegisterEntry[] = [], size: number = 0): void {
    this.HRg = new HistoryRegister(bitLength, entries, size);
  }

  public detectUBBranches(benchmarks: string[], hrgBits: number, bias: number): Promise<Results[]> {
    return new Promise((resolve: any) => {
      this.traces = [];
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
          let result: Results;
          this.results = [];
          this.initializeHRg(hrgBits);

          this.traces.forEach((trace: Benchmark, traceIdx: number) => {
            let branches: string[] = trace.info.split("\n"),
              context: string = "",
              currPC: number,
              unbiasedBr: UnbiasedBranch = new UnbiasedBranch(), unbiasedBrNr: number = 0;
            this.HRg.resetRegister();
            result = new Results("0%", 0, [], 0, 0, trace.filename);

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

            this.HRg.entries.forEach((entry: HistoryRegisterEntry) => {
              result.totalBranches += entry.taken + entry.notTaken;
              let f0: number = entry.taken / (entry.taken + entry.notTaken),
                f1 = entry.notTaken / (entry.taken + entry.notTaken),
                polarisation = Math.max(f0, f1);

              if (polarisation < bias) {
                unbiasedBrNr += entry.taken + entry.notTaken
                unbiasedBr.context = entry.context;
                unbiasedBr.pc = entry.pcLow;
                result.ubBranches.push(unbiasedBr);
              }
            });

            result.bias = (unbiasedBrNr * 100 / result.totalBranches).toFixed(2) + "%";
            this.results.push(result);
          });
          resolve(this.results);
        }
      );
    });
  }

}
