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
var history_table_1 = require('../shared/history-table/history-table');
var results_1 = require('../results/results');
var PredictorService = (function () {
    function PredictorService(benchmarkSvc) {
        this.benchmarkSvc = benchmarkSvc;
    }
    PredictorService.prototype.initializeHRg = function (bitLength, entries, size) {
        if (bitLength === void 0) { bitLength = 0; }
        if (entries === void 0) { entries = []; }
        if (size === void 0) { size = 0; }
        this.hReG = new history_register_1.HistoryRegister(bitLength, entries, size);
    };
    PredictorService.prototype.initializePHT = function (size, entries) {
        if (size === void 0) { size = 0; }
        if (entries === void 0) { entries = []; }
        this.phT = new history_table_1.HistoryTable(entries, size);
    };
    PredictorService.prototype.getTraces = function (benchmarks) {
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
    PredictorService.prototype.phtTraceQuery = function (branches, cpuContext, currPC, pcSplit, result) {
        var _this = this;
        branches.forEach(function (br) {
            var brItems = br.split(" "), brType = brItems[0].charAt(0), currPC = parseInt(brItems[1]), hitHRg = false, hitPHT = false, pcHigh = currPC / pcSplit, pcLow = currPC % pcSplit, tableIdx = parseInt((pcLow).toString(2) + cpuContext, 2), targetPC = parseInt(brItems[2]);
            switch (brType) {
                case 'B':
                    _this.hReG.entries.forEach(function (entry) {
                        if ((entry.pcLow === pcLow) && (entry.history === cpuContext)) {
                            entry.taken++;
                            hitHRg = true;
                        }
                    });
                    if (!hitHRg) {
                        _this.hReG.addEntry(cpuContext, 0, pcLow, true);
                    }
                    _this.phT.entries.forEach(function (entry) {
                        if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
                            hitPHT = true;
                            var prediction = entry.automata.predict();
                            entry.automata.changeState(true);
                            entry.LRU = _this.phT.size;
                            _this.phT.updateLRU();
                            if ((prediction === true) && (entry.nextPCTaken === targetPC)) {
                                result.goodPredictions++;
                            }
                            else {
                                result.badPredictions++;
                            }
                            if (entry.nextPCTaken !== targetPC) {
                                entry.nextPCTaken = targetPC;
                                entry.nextPCNoTaken = currPC + 1;
                            }
                        }
                    });
                    if (!hitPHT) {
                        _this.phT.addEntry(tableIdx, targetPC, currPC + 1, pcHigh, true);
                    }
                    cpuContext += "1";
                    break;
                case 'N':
                    _this.hReG.entries.forEach(function (entry) {
                        if ((entry.pcLow === pcLow) && (entry.history === cpuContext)) {
                            entry.notTaken++;
                            hitHRg = true;
                        }
                    });
                    if (!hitHRg) {
                        _this.hReG.addEntry(cpuContext, 0, pcLow, false);
                    }
                    _this.phT.entries.forEach(function (entry) {
                        if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
                            hitPHT = true;
                            var prediction = entry.automata.predict();
                            entry.automata.changeState(false);
                            entry.LRU = _this.phT.size;
                            _this.phT.updateLRU();
                            if ((prediction === false) && (entry.nextPCTaken === targetPC)) {
                                result.goodPredictions++;
                            }
                            else {
                                result.badPredictions++;
                            }
                            if (entry.nextPCTaken !== currPC + 1) {
                                // targetPC === currPC + 1
                                entry.nextPCTaken = currPC + 1;
                            }
                        }
                    });
                    cpuContext += "0";
                    break;
                default:
                    break;
            }
            cpuContext = cpuContext.slice(1);
        });
    };
    PredictorService.prototype.phtTraceQueryPath = function (branches, cpuContext, currPC, pcSplit, result, pathLength) {
        var _this = this;
        var pcList = [];
        branches.forEach(function (br) {
            var brItems = br.split(" "), brType = brItems[0].charAt(0), hitHRg = false, hitPHT = false, currPC = parseInt(brItems[1]), lastPC = pcList[pcList.length - 1], pcHigh = currPC / pcSplit, pcLow = currPC % pcSplit, tableIdx = parseInt((pcLow).toString(2) + cpuContext, 2), targetPC = parseInt(brItems[2]);
            switch (brType) {
                case 'B':
                    _this.hReG.entries.forEach(function (entry) {
                        if ((entry.pcLow === pcLow) && (entry.history === cpuContext) && (entry.path === lastPC)) {
                            entry.taken++;
                            hitHRg = true;
                        }
                    });
                    if (!hitHRg) {
                        _this.hReG.addEntry(cpuContext, lastPC, pcLow, true);
                    }
                    _this.phT.entries.forEach(function (entry) {
                        if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
                            hitPHT = true;
                            var prediction = entry.automata.predict();
                            entry.automata.changeState(true);
                            entry.LRU = _this.phT.size;
                            _this.phT.updateLRU();
                            if ((prediction) && (entry.nextPCTaken === targetPC)) {
                                result.goodPredictions++;
                            }
                            else {
                                result.badPredictions++;
                            }
                            if (entry.nextPCTaken !== targetPC) {
                                entry.nextPCTaken = targetPC;
                                entry.nextPCNoTaken = currPC + 1;
                            }
                        }
                    });
                    if (!hitPHT) {
                        _this.phT.addEntry(tableIdx, targetPC, currPC + 1, pcHigh, true);
                    }
                    cpuContext += "1";
                    pcList.push(currPC);
                    break;
                case 'N':
                    _this.hReG.entries.forEach(function (entry) {
                        if ((entry.pcLow === pcLow) && (entry.history === cpuContext)) {
                            entry.notTaken++;
                            hitHRg = true;
                        }
                    });
                    if (!hitHRg) {
                        _this.hReG.addEntry(cpuContext, lastPC, pcLow, false);
                    }
                    _this.phT.entries.forEach(function (entry) {
                        if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
                            hitPHT = true;
                            var prediction = entry.automata.predict();
                            entry.automata.changeState(false);
                            entry.LRU = _this.phT.size;
                            _this.phT.updateLRU();
                            if ((!prediction) && (entry.nextPCTaken === targetPC)) {
                                result.goodPredictions++;
                            }
                            else {
                                result.badPredictions++;
                            }
                            if (entry.nextPCTaken !== currPC + 1) {
                                // targetPC === currPC + 1
                                entry.nextPCTaken = currPC + 1;
                            }
                        }
                    });
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
    PredictorService.prototype.predictUBBranches = function (benchmarks, hrgBits, bias, pcLowLength, phtSize, pathLength) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getTraces(benchmarks).then(function (traces) {
                console.log(traces);
                var pcSplit = Math.pow(2, pcLowLength), result;
                _this.results = [];
                _this.initializeHRg(hrgBits);
                _this.initializePHT(phtSize);
                traces.forEach(function (trace, traceIdx) {
                    var branches = trace.info.split("\n"), cpuContext = "", currPC, targetPc;
                    _this.hReG.resetRegister();
                    _this.phT.resetTable();
                    result = new results_1.Results("0%", 0, [], 0, 0, trace.filename);
                    for (var i = 0; i < hrgBits; i++) {
                        cpuContext += "0";
                    }
                    if (!pathLength) {
                        _this.phtTraceQuery(branches, cpuContext, currPC, pcLowLength, result);
                        result.totalBranches = branches.length;
                        result.withPath = false;
                    }
                    else {
                        _this.phtTraceQueryPath(branches, cpuContext, currPC, pcLowLength, result, pathLength);
                        result.totalBranches = branches.length;
                        result.withPath = true;
                    }
                    result.bias = (result.goodPredictions * 100 / result.totalBranches).toFixed(2) + "%";
                    _this.results.push(result);
                });
                console.log(_this.results);
                resolve(_this.results);
            });
        });
    };
    PredictorService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [benchmark_service_1.BenchmarkService])
    ], PredictorService);
    return PredictorService;
}());
exports.PredictorService = PredictorService;
//# sourceMappingURL=predictor.service.js.map