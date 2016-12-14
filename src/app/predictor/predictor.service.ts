import { Injectable } from '@angular/core';

import { Benchmark, BenchmarkService } from '../benchmark';
import {
    HistoryRegister,
    HistoryRegisterEntry,
    HistoryTable,
    HistoryTableEntry
} from '../shared';
import { DetectorService } from '../detector/detector.service';
import { Results } from '../results';
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

    private phtTraceQuery(branches: string[], cpuContext: string, currPC: number, pcSplit: number, result: Results, traceIdx: number): void {
        branches.forEach((br: string) => {
            let brItems: string[] = br.split(" "),
                brType: string = brItems[0].charAt(0),
                currPC = parseInt(brItems[1]),
                hitHRg: boolean = false,
                hitPHT: boolean = false,
                pcHigh: number = currPC / pcSplit,
                pcLow: number = currPC % pcSplit,
                tableIdx: number = parseInt((pcLow).toString(2) + cpuContext, 2),
                targetPC = parseInt(brItems[2]);

                // FIXME: Make prediction only on unbiased branches
            this.detectionResults[traceIdx].ubBranches.forEach((uBranch: UnbiasedBranch) => {
                if ((uBranch.pc === currPC) && (uBranch.history === cpuContext)) {
                    switch (brType) {
                    case 'B':
                        this.phT.entries.forEach((entry: HistoryTableEntry) => {
                            if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
                                hitPHT = true;
                                let prediction: boolean = entry.automata.predict();
                                entry.automata.changeState(true);
                                entry.LRU = this.phT.size;
                                this.phT.updateLRU();

                                if ((prediction === true) && (entry.nextPCTaken === targetPC)) {
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

                        this.phT.entries.forEach((entry: HistoryTableEntry) => {
                            if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
                                hitPHT = true;
                                let prediction: boolean = entry.automata.predict();
                                entry.automata.changeState(false);
                                entry.LRU = this.phT.size;
                                this.phT.updateLRU();

                                if ((prediction === false) && (entry.nextPCNoTaken === targetPC)) {
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

                        cpuContext += "0";
                        break;

                    default:
                        break;
                }
                }
            });

            cpuContext = cpuContext.slice(1);
        });
    }

    private phtTraceQueryPath(branches: string[], cpuContext: string, currPC: number, pcSplit: number, result: Results, traceIdx: number, pathLength: number): void {
        let pcList: number[] = [];
        branches.forEach((br: string, brIndex: number) => {
            let brItems: string[] = br.split(" "),
                brType: string = brItems[0].charAt(0),
                hitHRg: boolean = false,
                hitPHT: boolean = false,
                currPC = parseInt(brItems[1]),
                path: number = 0,
                pcHigh: number = currPC / pcSplit,
                pcLow: number = currPC % pcSplit,
                tableIdx: number = parseInt((pcLow).toString(2) + cpuContext + path.toString(2), 2),
                targetPC = parseInt(brItems[2]);

                // FIXME: Make prediction only on unbiased branches
            this.detectionResults[traceIdx].ubBranches.forEach((uBranch: UnbiasedBranch) => {
                console.log(uBranch);
                if ((uBranch.pc === currPC) && (uBranch.history === cpuContext)) {
                    switch (brType) {
                        case 'B':
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
                            pcList.push(currPC);
                            break;

                        case 'N':

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

                            cpuContext += "0";
                            pcList.push(currPC);
                            break;

                        default:
                            break;
                    }
                }
            });
            cpuContext = cpuContext.slice(1);
            if (pcList.length === pathLength) {
                pcList.forEach((pc: number, pcIdx: number) => path = (pcIdx === 0) ? pc : path ^ pc);
                pcList.splice(0, 1);
            }
        });
    }

    public predictUBBranches(benchmarks: string[], hrgBits: number, bias: number, pcLowLength: number, phtSize: number, pathLength?: number): Promise<Results[]> {
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

                    if (!!pathLength) {
                        this.detectSvc.detectUBBranches(benchmarks, hrgBits, bias, pathLength).then((res: Results[]) => {
                            this.detectionResults = res;
                            this.phtTraceQueryPath(branches, cpuContext, currPC, pcLowLength, result, traceIdx, pathLength);
                            result.withPath = true;
                            result.isPrediction = true;
                            result.totalBranches = branches.length;
                            result.bias = (result.goodPredictions * 100 / result.totalBranches).toFixed(2) + "%";
                            this.results.push(result);
                        });
                    } else {
                        this.detectSvc.detectUBBranches(benchmarks, hrgBits, bias).then((res: Results[]) => {
                            this.detectionResults = res;
                            this.phtTraceQuery(branches, cpuContext, currPC, pcLowLength, result, traceIdx);
                            result.withPath = false;
                            result.isPrediction = true;
                            result.totalBranches = branches.length;
                            result.bias = (result.goodPredictions * 100 / result.totalBranches).toFixed(2) + "%";
                            this.results.push(result);
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
