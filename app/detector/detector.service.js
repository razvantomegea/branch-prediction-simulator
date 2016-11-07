"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var benchmark_1 = require('../benchmark/benchmark');
var benchmark_service_1 = require('../benchmark/benchmark.service');
var history_register_1 = require('../shared/history-register/history-register');
var unbiased_branch_1 = require('../shared/unbiased-branch');
var results_1 = require('../results/results');
var DetectorService = (function () {
    function DetectorService(benchmarkSvc) {
        this.benchmarkSvc = benchmarkSvc;
    }
    DetectorService.prototype.initializeHRg = function (bitLength, entries, size) {
        if (bitLength === void 0) { bitLength = 0; }
        if (entries === void 0) { entries = []; }
        if (size === void 0) { size = 0; }
        this.hReG = new history_register_1.HistoryRegister(bitLength, entries, size);
    };
    DetectorService.prototype.getTraces = function (benchmarks) {
        var _this = this;
        return new Promise(function (resolve) {
            var traces = [];
            _this.benchmarkSvc.getBenchmarcks(benchmarks).subscribe(function (data) {
                data.forEach(function (trace, index) {
                    traces.push(new benchmark_1.Benchmark(benchmarks[index], trace._body.toString()));
                });
            }, function (error) { return console.error('Error: ' + error); }, function () { return resolve(traces); });
        });
    };
    DetectorService.prototype.calcResults = function (bias, result, unbiasedBr, unbiasedBrNr) {
        var entryBranches = 0, f0 = 0, f1 = 0, polarisation = 0;
        this.hReG.entries.forEach(function (entry) {
            entryBranches = entry.taken + entry.notTaken;
            result.totalBranches += entryBranches;
            f0 = entry.taken / ((entryBranches === 0) ? 1 : entryBranches);
            f1 = entry.notTaken / ((entryBranches === 0) ? 1 : entryBranches);
            polarisation = Math.max(f0, f1);
            if (polarisation < bias) {
                unbiasedBrNr += entry.taken + entry.notTaken;
                unbiasedBr.history = entry.history;
                unbiasedBr.pc = entry.pcLow;
                result.ubBranches.push(unbiasedBr);
            }
        });
        result.bias = (unbiasedBrNr * 100 / result.totalBranches).toFixed(2) + "%";
        this.results.push(result);
    };
    DetectorService.prototype.hrgTraceQuery = function (branches, cpuContext, currPC) {
        var _this = this;
        branches.forEach(function (br) {
            var brItems = br.split(" "), brType = brItems[0].charAt(0), currPC = parseInt(brItems[1]), hit = false;
            switch (brType) {
                case 'B':
                    _this.hReG.entries.forEach(function (entry) {
                        if ((entry.pcLow === currPC) && (entry.history === cpuContext)) {
                            entry.taken++;
                            hit = true;
                        }
                    });
                    if (!hit) {
                        _this.hReG.addEntry(cpuContext, 0, currPC, true);
                    }
                    cpuContext += "1";
                    break;
                case 'N':
                    _this.hReG.entries.forEach(function (entry) {
                        if ((entry.pcLow === currPC) && (entry.history === cpuContext)) {
                            entry.notTaken++;
                            hit = true;
                        }
                    });
                    if (!hit) {
                        _this.hReG.addEntry(cpuContext, 0, currPC, false);
                    }
                    cpuContext += "0";
                    break;
                default:
                    break;
            }
            cpuContext = cpuContext.slice(1);
        });
    };
    DetectorService.prototype.hrgTraceQueryPath = function (branches, cpuContext, currPC, pathLength) {
        var _this = this;
        var pcList = [0];
        branches.forEach(function (br) {
            var brItems = br.split(" "), brType = brItems[0].charAt(0), currPC = parseInt(brItems[1]), hit = false, lastPC = pcList[pcList.length - 1];
            switch (brType) {
                case 'B':
                    _this.hReG.entries.forEach(function (entry) {
                        if ((entry.pcLow === currPC) && (entry.history === cpuContext) && (entry.path === lastPC)) {
                            entry.taken++;
                            hit = true;
                        }
                    });
                    if (!hit) {
                        _this.hReG.addEntry(cpuContext, lastPC, currPC, true);
                    }
                    cpuContext += "1";
                    pcList.push(currPC);
                    break;
                case 'N':
                    _this.hReG.entries.forEach(function (entry) {
                        if ((entry.pcLow === currPC) && (entry.history === cpuContext) && (entry.path === lastPC)) {
                            entry.notTaken++;
                            hit = true;
                        }
                    });
                    if (!hit) {
                        _this.hReG.addEntry(cpuContext, lastPC, currPC, false);
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
    };
    DetectorService.prototype.detectUBBranches = function (benchmarks, hrgBits, bias, pathLength) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getTraces(benchmarks).then(function (traces) {
                console.log(traces);
                var result;
                _this.results = [];
                _this.initializeHRg(hrgBits);
                traces.forEach(function (trace, traceIdx) {
                    var branches = trace.info.split("\n"), cpuContext = "", currPC, unbiasedBr = new unbiased_branch_1.UnbiasedBranch(), unbiasedBrNr = 0;
                    _this.hReG.resetRegister();
                    result = new results_1.Results("0%", 0, [], 0, 0, trace.filename);
                    for (var i = 0; i < hrgBits; i++) {
                        cpuContext += "0";
                    }
                    if (!pathLength) {
                        _this.hrgTraceQuery(branches, cpuContext, currPC);
                        result.withPath = true;
                    }
                    else {
                        _this.hrgTraceQueryPath(branches, cpuContext, currPC, pathLength);
                        result.withPath = false;
                    }
                    _this.calcResults(bias, result, unbiasedBr, unbiasedBrNr);
                });
                console.log(_this.results);
                resolve(_this.results);
            });
        });
    };
    DetectorService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [benchmark_service_1.BenchmarkService])
    ], DetectorService);
    return DetectorService;
}());
exports.DetectorService = DetectorService;
//# sourceMappingURL=detector.service.js.map