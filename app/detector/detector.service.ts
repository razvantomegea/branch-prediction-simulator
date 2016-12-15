import { Injectable } from '@angular/core';

import { Benchmark } from '../benchmark/benchmark';
import { BenchmarkService } from '../benchmark/benchmark.service';
import { HistoryRegister } from '../shared/history-register/history-register';
import { HistoryRegisterEntry } from '../shared/history-register/history-register-entry';
import { UnbiasedBranch } from '../shared/unbiased-branch';
import { Results } from '../results/results';

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

    private calcResults(bias: number, result: Results): void {
        let entryBranches: number = 1,
            f0: number = 0,
            f1: number = 0,
            polarisation: number = 0,
            unbiasedBrNr: number = 0;
        this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
            entryBranches = entry.taken + entry.notTaken;
            result.totalBranches += entryBranches;
            f0 = entry.taken / entryBranches;
            f1 = entry.notTaken / entryBranches;
            polarisation = Math.max(f0, f1);

            if (polarisation < bias) {
                let unbiasedBr: UnbiasedBranch = new UnbiasedBranch(entry.history, entry.pcLow);
                unbiasedBrNr += entry.taken + entry.notTaken
                result.ubBranches.push(unbiasedBr);
            }
        });
        result.bias = (unbiasedBrNr * 100 / result.totalBranches).toFixed(2) + "%";
        this.results.push(result);
    }

    private hrgTraceQuery(branches: string[], cpuContext: string, pcLow: number): void {
        branches.forEach((br: string) => {
            let brItems: string[] = br.split(" "),
                brType: string = brItems[0].charAt(0),
                hit: boolean = false,
                // PC is on 8bits
                pcLow: number = parseInt(brItems[1]) % Math.pow(2, 4);
            switch (brType) {
                case 'B':
                    this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
                        if ((entry.pcLow === pcLow) && (entry.history === cpuContext)) {
                            entry.taken++;
                            hit = true;
                        }
                    });

                    if (!hit) {
                        this.hReG.addEntry(cpuContext, 0, pcLow, true);
                    }

                    cpuContext += "1";
                    break;

                case 'N':
                    this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
                        if ((entry.pcLow === pcLow) && (entry.history === cpuContext)) {
                            entry.notTaken++;
                            hit = true;
                        }
                    });

                    if (!hit) {
                        this.hReG.addEntry(cpuContext, 0, pcLow, false);
                    }

                    cpuContext += "0";
                    break;

                default:
                    break;
            }

            cpuContext = cpuContext.slice(1);
        });
    }

    private hrgTraceQueryPath(branches: string[], cpuContext: string, pcLow: number, pathLength: number): void {
        let path: number = 0, pcList: number[] = [];

        branches.forEach((br: string) => {
            let brItems: string[] = br.split(" "),
                brType: string = brItems[0].charAt(0),
                currPC: number = parseInt(brItems[1]),
                hit: boolean = false,
                // PC is on 8bits
                pcLow: number = currPC % Math.pow(2, 4);

            switch (brType) {
                case 'B':
                    this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
                        if ((entry.pcLow === pcLow) && (entry.history === cpuContext) && (entry.path === path)) {
                            entry.taken++;
                            hit = true;
                        }
                    });

                    if (!hit) {
                        this.hReG.addEntry(cpuContext, path, pcLow, true);
                    }

                    cpuContext += "1";
                    pcList.push(currPC);
                    break;

                case 'N':
                    this.hReG.entries.forEach((entry: HistoryRegisterEntry) => {
                        if ((entry.pcLow === pcLow) && (entry.history === cpuContext) && (entry.path === path)) {
                            entry.notTaken++;
                            hit = true;
                        }
                    });

                    if (!hit) {
                        this.hReG.addEntry(cpuContext, path, pcLow, false);
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
                        pcLow: number,
                        result = new Results("0%", 0, [], 0, 0, trace.filename);
                    this.hReG.resetRegister();

                    for (let i: number = 0; i < hrgBits; i++) {
                        cpuContext += "0";
                    }

                    if (!pathLength) {
                        this.hrgTraceQuery(branches, cpuContext, pcLow);
                        result.withPath = false;
                    } else {
                        this.hrgTraceQueryPath(branches, cpuContext, pcLow, pathLength);
                        result.withPath = true;
                    }

                    this.calcResults(bias, result);
                });

                console.log("Detection results", this.results);

                resolve(this.results);
            });
        });
    }

}
