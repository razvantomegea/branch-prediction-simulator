import { Injectable } from '@angular/core';

import { Benchmark, BenchmarkService } from '../benchmark';
import {
  HistoryRegister,
  HistoryRegisterEntry,
  HistoryTable,
  HistoryTableEntry
} from '../shared';
import { Results } from '../results';

@Injectable()
export class PredictorService {
  private hReG: HistoryRegister;
  private phT: HistoryTable;
  private results: Results[];
  constructor(private benchmarkSvc: BenchmarkService) { }

  private initializeHRg(bitLength: number = 0, entries: HistoryRegisterEntry[] = [], size: number = 0): void {
    this.hReG = new HistoryRegister(bitLength, entries, size);
  }

  private initializePHT(size: number = 0, entries: HistoryTableEntry[] = []): void {
    this.phT = new HistoryTable(entries, size);
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

  private phtTraceQuery(branches: string[], cpuContext: string, currPC: number, pcSplit: number, result: Results): void {
    branches.forEach((br: string) => {
      let brItems: string[] = br.split(" "),
        brType: string = brItems[0].charAt(0),
        hitHRg: boolean = false,
        hitPHT: boolean = false;
      currPC = parseInt(brItems[1]);
      let pcHigh: number = currPC / pcSplit,
        pcLow: number = currPC % pcSplit,
        tableIdx: number = parseInt(pcLow + cpuContext, 2),
        targetPC = parseInt(brItems[2]);

      switch (brType) {
        case 'B':
          this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
            if ((entry.pcLow === currPC) && (entry.history === cpuContext)) {
              entry.taken++;
              hitHRg = true;
            }
          });

          if (!hitHRg) {
            this.hReG.addEntry(cpuContext, pcLow, currPC, true);
          }

          this.phT.entries.forEach((entry: HistoryTableEntry) => {
            if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
              hitPHT = true;
              let prediction: boolean = entry.automata.predict();
              entry.automata.changeState(true);
              entry.LRU = this.phT.size;
              this.phT.updateLRU();
              if ((prediction) && (entry.nextPCTaken === targetPC)) {
                result.goodPredictions++
              } else {
                result.badPredictions++;
              }
              if (entry.nextPCTaken !== targetPC) {
                entry.nextPCTaken = targetPC;
                entry.nextPCNoTaken = currPC + 1;
              }
            }
          });

          if (!hitPHT) {
            this.phT.addEntry(tableIdx, targetPC, currPC + 1, pcHigh, true);
          }

          cpuContext += "1";
          break;

        case 'N':
          this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
            if ((entry.pcLow === currPC) && (entry.history === cpuContext)) {
              entry.notTaken++;
              hitHRg = true;
            }
          });

          if (!hitHRg) {
            this.hReG.addEntry(cpuContext, pcLow, currPC, false);
          }

          this.phT.entries.forEach((entry: HistoryTableEntry) => {
            if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
              hitPHT = true;
              let prediction: boolean = entry.automata.predict();
              entry.automata.changeState(false);
              entry.LRU = this.phT.size;
              this.phT.updateLRU();
              if ((!prediction) && (entry.nextPCTaken === targetPC)) {
                result.goodPredictions++
              } else {
                result.badPredictions++;
              }
              if (entry.nextPCTaken !== currPC + 1) {
                // targetPC === currPC + 1
                entry.nextPCTaken = currPC + 1;
              }
            }
          });

          if (!hitPHT) {
            this.phT.addEntry(tableIdx, currPC + 1, 0, pcHigh, false);
          }

          cpuContext += "0";
          break;

        default:
          break;
      }

      cpuContext = cpuContext.slice(1);
    });
    
    result.totalBranches = branches.length;
  }

  private phtTraceQueryPath(branches: string[], cpuContext: string, currPC: number, pcSplit: number, result: Results, path?: number): void {
    let pcList: number[] = [];
    branches.forEach((br: string) => {
      let brItems: string[] = br.split(" "),
        brType: string = brItems[0].charAt(0),
        hitHRg: boolean = false,
        hitPHT: boolean = false;
      currPC = parseInt(brItems[1]);
      let pcHigh: number = currPC / pcSplit,
        pcLow: number = currPC % pcSplit,
        tableIdx: number = parseInt(pcLow + cpuContext, 2),
        targetPC = parseInt(brItems[2]);

      switch (brType) {
        case 'B':
          this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
            if ((entry.pcLow === currPC) && (entry.history === cpuContext)  && (entry.path === path)) {
              entry.taken++;
              hitHRg = true;
            }
          });

          if (!hitHRg) {
            this.hReG.addEntry(cpuContext, pcLow, currPC, true);
          }

          this.phT.entries.forEach((entry: HistoryTableEntry) => {
            if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
              hitPHT = true;
              let prediction: boolean = entry.automata.predict();
              entry.automata.changeState(true);
              entry.LRU = this.phT.size;
              this.phT.updateLRU();
              if ((prediction) && (entry.nextPCTaken === targetPC)) {
                result.goodPredictions++
              } else {
                result.badPredictions++;
              }
              if (entry.nextPCTaken !== targetPC) {
                entry.nextPCTaken = targetPC;
                entry.nextPCNoTaken = currPC + 1;
              }
            }
          });

          if (!hitPHT) {
            this.phT.addEntry(tableIdx, targetPC, currPC + 1, pcHigh, true);
          }

          cpuContext += "1";
          // Not shure if okay...
          if (pcList.length === path) {
            pcList.forEach((pc: number, idx: number) => path = (idx === 0) ? pc : path ^ pc);
            pcList.splice(0, 1);
          }
          //
          pcList.push(currPC);
          break;

        case 'N':
          this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
            if ((entry.pcLow === currPC) && (entry.history === cpuContext)) {
              entry.notTaken++;
              hitHRg = true;
            }
          });

          if (!hitHRg) {
            this.hReG.addEntry(cpuContext, pcLow, currPC, false);
          }

          this.phT.entries.forEach((entry: HistoryTableEntry) => {
            if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
              hitPHT = true;
              let prediction: boolean = entry.automata.predict();
              entry.automata.changeState(false);
              entry.LRU = this.phT.size;
              this.phT.updateLRU();
              if ((!prediction) && (entry.nextPCTaken === targetPC)) {
                result.goodPredictions++
              } else {
                result.badPredictions++;
              }
              if (entry.nextPCTaken !== currPC + 1) {
                // targetPC === currPC + 1
                entry.nextPCTaken = currPC + 1;
              }
            }
          });

          if (!hitPHT) {
            this.phT.addEntry(tableIdx, currPC + 1, 0, pcHigh, false);
          }

          cpuContext += "0";
          // Not shure if okay...
          if (pcList.length === path) {
            pcList.forEach((pc: number, idx: number) => path = (idx === 0) ? pc : path ^ pc);
            pcList.splice(0, 1);
          }
          //
          pcList.push(currPC);
          break;

        default:
          break;
      }

      cpuContext = cpuContext.slice(1);
    });
    result.totalBranches = branches.length;
  }

  public predictUBBranches(benchmarks: string[], hrgBits: number, bias: number, pcLowLength: number, phtSize: number, path?: number): Promise<Results[]> {
    return new Promise((resolve: any) => {
      this.getTraces(benchmarks).then(traces => {
        console.log(traces);
        let pcSplit = Math.pow(2, pcLowLength),
          result: Results;
        this.results = [];
        this.initializeHRg(hrgBits);
        this.initializePHT(phtSize);

        traces.forEach((trace: Benchmark, traceIdx: number) => {
          let branches: string[] = trace.info.split("\n"),
            cpuContext: string = "",
            currPC: number,
            targetPc: number;
          this.hReG.resetRegister();
          this.phT.resetTable();
          result = new Results("0%", 0, [], 0, 0, trace.filename);

          for (let i: number = 0; i < hrgBits; i++) {
            cpuContext += "0";
          }

          if (!path) {
            this.phtTraceQuery(branches, cpuContext, currPC, pcLowLength, result);
          } else {
            this.phtTraceQueryPath(branches, cpuContext, currPC, pcLowLength, result, path);
          }

          result.bias = (result.goodPredictions * 100 / result.totalBranches).toFixed(2) + "%";

          this.results.push(result);

        });

        console.log(this.results);

        resolve(this.results);
      });
    });
  }

}
