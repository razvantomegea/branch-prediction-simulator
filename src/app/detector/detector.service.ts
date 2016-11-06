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
    let entryBranches: number = 0,
      f0: number = 0,
      f1: number = 0,
      polarisation: number = 0;
    this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
      entryBranches = entry.taken + entry.notTaken;
      result.totalBranches += entryBranches;
      f0 = entry.taken / ((entryBranches === 0) ? 1 : entryBranches);
      f1 = entry.notTaken / ((entryBranches === 0) ? 1 : entryBranches);
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
        currPC = parseInt(brItems[1]),
        hit: boolean = false;
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

  private hrgTraceQueryPath(branches: string[], cpuContext: string, currPC: number, pathLength: number): void {
    let pcList: number[] = [0];
    branches.forEach((br: string) => {
      let brItems: string[] = br.split(" "),
        brType: string = brItems[0].charAt(0),
        currPC = parseInt(brItems[1]),
        hit: boolean = false,
        lastPC: number = pcList[pcList.length - 1];
        
      switch (brType) {
        case 'B':
          this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
            if ((entry.pcLow === currPC) && (entry.history === cpuContext) && (entry.path === lastPC)) {
              entry.taken++;
              hit = true;
            }
          });

          if (!hit) {
            this.hReG.addEntry(cpuContext, lastPC, currPC, true);
          }

          cpuContext += "1";
          pcList.push(currPC);
          break;

        case 'N':
          this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
            if ((entry.pcLow === currPC) && (entry.history === cpuContext) && (entry.path === lastPC)) {
              entry.notTaken++;
              hit = true;
            }
          });

          if (!hit) {
            this.hReG.addEntry(cpuContext, lastPC, currPC, false);
          }

          cpuContext += "0";
          pcList.push(currPC);
          break;

        default:
          break;
      }

      cpuContext = cpuContext.slice(1);
      if (pcList.length === pathLength) {
        pcList.splice(0, 1);
      }
    });
  }

  public detectUBBranches(benchmarks: string[], hrgBits: number, bias: number, pathLength?: number): Promise<Results[]> {
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

          if (!pathLength) {
            this.hrgTraceQuery(branches, cpuContext, currPC);
          } else {
            this.hrgTraceQueryPath(branches, cpuContext, currPC, pathLength);
          }

          this.calcResults(bias, result, unbiasedBr, unbiasedBrNr);
        });

        console.log(this.results);

        resolve(this.results);
      });
    });
  }

}
