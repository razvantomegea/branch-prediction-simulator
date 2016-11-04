import { Injectable } from '@angular/core';

import { Benchmark, BenchmarkService } from '../benchmark';
import { HistoryRegister, HistoryRegisterEntry, UnbiasedBranch } from '../shared';
import { Results } from '../results';

@Injectable()
export class DetectorService {
  private hReG: HistoryRegister;
  private results: Results[];
  constructor(private benchmarkSvc: BenchmarkService) { }

  private initializeHRg(bitLength: number = 0, entries: HistoryRegisterEntry[] = [], size: number = 0): void {
    this.hReG = new HistoryRegister(bitLength, entries, size);
  }

  private getTraces(benchmarks: string[]): Promise<any[]> {
    return new Promise((resolve: any) => {
      let traces: any[] = [];
      this.benchmarkSvc.getBenchmarcks(benchmarks).subscribe(
        data => {
          data.forEach((trace: any, index: number) => {
            traces.push(new Benchmark(benchmarks[index], trace._body.toString()));
          });
        },
        error => console.error('Error: ' + error),
        () => resolve(traces));
    });
  }

  private calcResults(bias: number, result: Results, unbiasedBr: UnbiasedBranch, unbiasedBrNr: number): void {
    this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
      result.totalBranches += entry.taken + entry.notTaken;
      let f0: number = entry.taken / (entry.taken + entry.notTaken),
        f1 = entry.notTaken / (entry.taken + entry.notTaken),
        polarisation = Math.max(f0, f1);

      if (polarisation < bias) {
        unbiasedBrNr += entry.taken + entry.notTaken
        unbiasedBr.history = entry.history;
        unbiasedBr.pc = entry.pcLow;
        result.ubBranches.push(unbiasedBr);
      }
    });

    result.bias = (unbiasedBrNr * 100 / result.totalBranches).toFixed(2) + "%";
    this.results.push(result);
  }

  private hrgTraceQuery(branches: string[], cpuContext: string, currPC: number): void {
    branches.forEach((br: string) => {
      let brItems: string[] = br.split(" "),
        brType: string = brItems[0].charAt(0),
        hit: boolean = false;
      // Not sure if ok
      currPC = parseInt(brItems[1]) % Math.pow(2, 32);
      //
      switch (brType) {
        case 'B':
          this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
            if ((entry.pcLow === currPC) && (entry.history === cpuContext)) {
              entry.taken++;
              hit = true;
            }
          });

          if (!hit) {
            this.hReG.addEntry(cpuContext, 0, currPC, true);
          }

          cpuContext += "1";
          break;

        case 'N':
          this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
            if ((entry.pcLow === currPC) && (entry.history === cpuContext)) {
              entry.notTaken++;
              hit = true;
            }
          });

          if (!hit) {
            this.hReG.addEntry(cpuContext, 0, currPC, false);
          }

          cpuContext += "0";
          break;

        default:
          break;
      }

      cpuContext = cpuContext.slice(1);
    });
  }

  private hrgTraceQueryPath(branches: string[], cpuContext: string, currPC: number, path: number): void {
    let pcList: number[] = [];
    branches.forEach((br: string) => {
      let brItems: string[] = br.split(" "),
        brType: string = brItems[0].charAt(0),
        hit: boolean = false;
      // Not sure if ok
      currPC = parseInt(brItems[1]) % Math.pow(2, 32);
      //
      switch (brType) {
        case 'B':
          this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
            if ((entry.pcLow === currPC) && (entry.history === cpuContext) && (entry.path === path)) {
              entry.taken++;
              hit = true;
            }
          });
          if (!hit) {
            this.hReG.addEntry(cpuContext, path, currPC, true);
          }
          cpuContext += "1";
          break;

        case 'N':
          this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
            if ((entry.pcLow === currPC) && (entry.history === cpuContext) && (entry.path === path)) {
              entry.notTaken++;
              hit = true;
            }
          });

          if (!hit) {
            this.hReG.addEntry(cpuContext, path, currPC, false);
          }

          cpuContext += "0";
          break;

        default:
          break;
      }
      cpuContext = cpuContext.slice(1);
      // Not shure if okay...
      if (pcList.length === path) {
        pcList.forEach((pc: number, idx: number) => path = (idx === 0) ? pc : path ^ pc);
        pcList.splice(0, 1);
      }
      //
      pcList.push(currPC);
    });
  }

  public detectUBBranches(benchmarks: string[], hrgBits: number, bias: number, path?: number): Promise<Results[]> {
    return new Promise((resolve: any) => {

      this.getTraces(benchmarks).then(traces => {
        console.log(traces);
        let result: Results;
        this.results = [];
        this.initializeHRg(hrgBits);

        traces.forEach((trace: Benchmark, traceIdx: number) => {
          let branches: string[] = trace.info.split("\n"),
            cpuContext: string = "",
            currPC: number,
            unbiasedBr: UnbiasedBranch = new UnbiasedBranch(),
            unbiasedBrNr: number = 0;
          this.hReG.resetRegister();
          result = new Results("0%", 0, [], 0, 0, trace.filename);

          for (let i: number = 0; i < hrgBits; i++) {
            cpuContext += "0";
          }

          if (!path) {
            this.hrgTraceQuery(branches, cpuContext, currPC);
          } else {
            this.hrgTraceQueryPath(branches, cpuContext, currPC, path);
          }

          this.calcResults(bias, result, unbiasedBr, unbiasedBrNr);
        });

        console.log(this.results);

        resolve(this.results);
      });
    });
  }

}
