import { Injectable } from '@angular/core';

import { Benchmark } from '../benchmark/benchmark';
import { BenchmarkService } from '../benchmark/benchmark.service';
import { DetectorService } from '../detector/detector.service';
import { HistoryRegister } from '../shared/history-register/history-register';
import { HistoryRegisterEntry } from '../shared/history-register/history-register-entry';
import { HistoryTable } from '../shared/history-table/history-table';
import { HistoryTableEntry } from '../shared/history-table/history-table-entry';
import { Results } from '../results/results';
import { UnbiasedBranch } from '../shared/unbiased-branch';

@Injectable()
export class PredictorService {
    private detectionResults: Results[];
    private hReG: HistoryRegister;
    private phT: HistoryTable;
    private results: Results[];
    constructor(private benchmarkSvc: BenchmarkService, private detectSvc: DetectorService) { }

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

    private phtTraceQuery(branches: string[], cpuContext: string, pcSplit: number, traceName: string, traceIdx): Promise<Results> {
        return new Promise(resolve => {
            let result: Results = new Results("0%", 0, [], 0, 0, traceName, true, false);
            console.log("Context", cpuContext);
            branches.forEach((br: string) => {
                let brItems: string[] = br.split(" "),
                    brType: string = brItems[0].charAt(0),
                    currPC = parseInt(brItems[1]),
                    hitHRg: boolean = false,
                    hitPHT: boolean = false,
                    hitUb: boolean = false,
                    pcHigh: number = currPC / pcSplit,
                    pcLow: number = currPC % pcSplit,
                    tableIdx: number = parseInt((pcLow).toString(2) + cpuContext, 2),
                    targetPC = parseInt(brItems[2]);

                this.detectionResults[traceIdx].ubBranches.forEach((uBranch: UnbiasedBranch) => {
                    if ((uBranch.pc === currPC % Math.pow(2, 4)) && (uBranch.history === cpuContext)) {
                        hitUb = true;
                    }
                });

                switch (brType) {
                    case 'B':
                        if (hitUb) {
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
                        }

                        cpuContext += "1";
                        break;

                    case 'N':
                        if (hitUb) {
                            this.phT.entries.forEach((entry: HistoryTableEntry) => {
                                if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
                                    hitPHT = true;
                                    let prediction: boolean = entry.automata.predict();
                                    entry.automata.changeState(false);
                                    entry.LRU = this.phT.size;
                                    this.phT.updateLRU();
                                    if ((!prediction) && (entry.nextPCNoTaken === targetPC)) {
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
                                this.phT.addEntry(tableIdx, currPC + 1, targetPC, pcHigh, false);
                            }
                        }

                        cpuContext += "0";
                        break;

                    default:
                        break;
                }

                cpuContext = cpuContext.slice(1);
            });
            result.totalBranches = branches.length;
            result.bias = (result.goodPredictions * 100 / result.totalBranches).toFixed(2) + "%";
            resolve(result);
        });
    }

    private phtTraceQueryPath(branches: string[], cpuContext: string, pcSplit: number, traceName: string, traceIdx: number, pathLength: number): Promise<Results> {
        return new Promise(resolve => {
            let path: number = 0,
                pcList: number[] = [],
                result: Results = new Results("0%", 0, [], 0, 0, traceName, true, true);

            branches.forEach((br: string, brIndex: number) => {
                let brItems: string[] = br.split(" "),
                    brType: string = brItems[0].charAt(0),
                    currPC = parseInt(brItems[1]),
                    hitHRg: boolean = false,
                    hitPHT: boolean = false,
                    hitUb: boolean = true,
                    pcHigh: number = currPC / pcSplit,
                    pcLow: number = currPC % pcSplit,
                    tableIdx: number = parseInt((pcLow).toString(2) + cpuContext + path.toString(2), 2),
                    targetPC = parseInt(brItems[2]);

                this.detectionResults[traceIdx].ubBranches.forEach((uBranch: UnbiasedBranch) => {
                    if ((uBranch.pc === currPC % Math.pow(2, 4)) && (uBranch.history === cpuContext)) {
                        hitUb = true;
                    }
                });

                switch (brType) {
                    case 'B':
                        if (hitUb) {
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
                        }

                        cpuContext += "1";
                        pcList.push(currPC);
                        break;

                    case 'N':
                        if (hitUb) {
                            this.phT.entries.forEach((entry: HistoryTableEntry) => {
                                if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
                                    hitPHT = true;
                                    let prediction: boolean = entry.automata.predict();
                                    entry.automata.changeState(false);
                                    entry.LRU = this.phT.size;
                                    this.phT.updateLRU();
                                    if ((!prediction) && (entry.nextPCNoTaken === targetPC)) {
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
                                this.phT.addEntry(tableIdx, currPC + 1, targetPC, pcHigh, false);
                            }
                        }

                        cpuContext += "0";
                        pcList.push(currPC);
                        break;

                    default:
                        break;
                }

                cpuContext = cpuContext.slice(1);
                if (pcList.length === pathLength) {
                    pcList.forEach((pc: number, pcIdx: number) => path = (pcIdx === 0) ? pc : path ^ pc);
                    pcList.splice(0, 1);
                }
            });

            result.totalBranches = branches.length;
            result.bias = (result.goodPredictions * 100 / result.totalBranches).toFixed(2) + "%";
            resolve(result);
        });
    }

    public predictUBBranches(benchmarks: string[], hrgBits: number, bias: number, pcLowLength: number, phtSize: number, pathLength?: number): Promise<Results[]> {
        return new Promise((resolve: any) => {
            this.getTraces(benchmarks).then(traces => {
                let pcSplit = Math.pow(2, pcLowLength);
                this.results = [];
                this.initializeHRg(hrgBits);
                this.initializePHT(phtSize);

                traces.forEach((trace: Benchmark, traceIdx: number) => {
                    let branches: string[] = trace.info.split("\n"),
                        cpuContext: string = "";
                    this.hReG.resetRegister();
                    this.phT.resetTable();

                    for (let i: number = 0; i < hrgBits; i++) {
                        cpuContext += "0";
                    }

                    if (!!pathLength) {
                        this.detectSvc.detectUBBranches(benchmarks, hrgBits, bias, pathLength).then((res: Results[]) => {
                            this.detectionResults = res;
                            this.phtTraceQueryPath(branches, cpuContext, pcSplit, trace.filename, traceIdx, pathLength).then(
                                (results: Results) => this.results.push(results)
                            );
                        });
                    } else {
                        this.detectSvc.detectUBBranches(benchmarks, hrgBits, bias).then((res: Results[]) => {
                            this.detectionResults = res;
                            this.phtTraceQuery(branches, cpuContext, pcSplit, trace.filename, traceIdx).then(
                                (results: Results) => this.results.push(results)
                            );
                        });
                    }
                });

                setTimeout(() => {
                    console.log("Prediction results", this.results);
                    resolve(this.results);
                }, 1000);
            });
        });
    }

}
