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
var detector_service_1 = require('../detector/detector.service');
var history_register_1 = require('../shared/history-register/history-register');
var history_table_1 = require('../shared/history-table/history-table');
var results_1 = require('../results/results');
var PredictorService = (function () {
    function PredictorService(benchmarkSvc, detectSvc) {
        this.benchmarkSvc = benchmarkSvc;
        this.detectSvc = detectSvc;
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
    PredictorService.prototype.phtTraceQuery = function (branches, cpuContext, pcSplit, traceName, traceIdx) {
        var _this = this;
        return new Promise(function (resolve) {
            var result = new results_1.Results("0%", 0, [], 0, 0, traceName, true, false);
            console.log("Context", cpuContext);
            branches.forEach(function (br) {
                var brItems = br.split(" "), brType = brItems[0].charAt(0), currPC = parseInt(brItems[1]), hitHRg = false, hitPHT = false, hitUb = false, pcHigh = currPC / pcSplit, pcLow = currPC % pcSplit, tableIdx = parseInt((pcLow).toString(2) + cpuContext, 2), targetPC = parseInt(brItems[2]);
                _this.detectionResults[traceIdx].ubBranches.forEach(function (uBranch) {
                    if ((uBranch.pc === currPC % Math.pow(2, 4)) && (uBranch.history === cpuContext)) {
                        hitUb = true;
                    }
                });
                switch (brType) {
                    case 'B':
                        if (hitUb) {
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
                        }
                        cpuContext += "1";
                        break;
                    case 'N':
                        if (hitUb) {
                            _this.phT.entries.forEach(function (entry) {
                                if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
                                    hitPHT = true;
                                    var prediction = entry.automata.predict();
                                    entry.automata.changeState(false);
                                    entry.LRU = _this.phT.size;
                                    _this.phT.updateLRU();
                                    if ((!prediction) && (entry.nextPCNoTaken === targetPC)) {
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
                            if (!hitPHT) {
                                _this.phT.addEntry(tableIdx, currPC + 1, targetPC, pcHigh, false);
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
    };
    PredictorService.prototype.phtTraceQueryPath = function (branches, cpuContext, pcSplit, traceName, traceIdx, pathLength) {
        var _this = this;
        return new Promise(function (resolve) {
            var path = 0, pcList = [], result = new results_1.Results("0%", 0, [], 0, 0, traceName, true, true);
            branches.forEach(function (br, brIndex) {
                var brItems = br.split(" "), brType = brItems[0].charAt(0), currPC = parseInt(brItems[1]), hitHRg = false, hitPHT = false, hitUb = true, pcHigh = currPC / pcSplit, pcLow = currPC % pcSplit, tableIdx = parseInt((pcLow).toString(2) + cpuContext + path.toString(2), 2), targetPC = parseInt(brItems[2]);
                _this.detectionResults[traceIdx].ubBranches.forEach(function (uBranch) {
                    if ((uBranch.pc === currPC % Math.pow(2, 4)) && (uBranch.history === cpuContext)) {
                        hitUb = true;
                    }
                });
                switch (brType) {
                    case 'B':
                        if (hitUb) {
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
                        }
                        cpuContext += "1";
                        pcList.push(currPC);
                        break;
                    case 'N':
                        if (hitUb) {
                            _this.phT.entries.forEach(function (entry) {
                                if ((entry.tableIndex === tableIdx) && (entry.tag === pcHigh)) {
                                    hitPHT = true;
                                    var prediction = entry.automata.predict();
                                    entry.automata.changeState(false);
                                    entry.LRU = _this.phT.size;
                                    _this.phT.updateLRU();
                                    if ((!prediction) && (entry.nextPCNoTaken === targetPC)) {
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
                            if (!hitPHT) {
                                _this.phT.addEntry(tableIdx, currPC + 1, targetPC, pcHigh, false);
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
                    pcList.forEach(function (pc, pcIdx) { return path = (pcIdx === 0) ? pc : path ^ pc; });
                    pcList.splice(0, 1);
                }
            });
            result.totalBranches = branches.length;
            result.bias = (result.goodPredictions * 100 / result.totalBranches).toFixed(2) + "%";
            resolve(result);
        });
    };
    PredictorService.prototype.predictUBBranches = function (benchmarks, hrgBits, bias, pcLowLength, phtSize, pathLength) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getTraces(benchmarks).then(function (traces) {
                var pcSplit = Math.pow(2, pcLowLength);
                _this.results = [];
                _this.initializeHRg(hrgBits);
                _this.initializePHT(phtSize);
                traces.forEach(function (trace, traceIdx) {
                    var branches = trace.info.split("\n"), cpuContext = "";
                    _this.hReG.resetRegister();
                    _this.phT.resetTable();
                    for (var i = 0; i < hrgBits; i++) {
                        cpuContext += "0";
                    }
                    if (!!pathLength) {
                        _this.detectSvc.detectUBBranches(benchmarks, hrgBits, bias, pathLength).then(function (res) {
                            _this.detectionResults = res;
                            _this.phtTraceQueryPath(branches, cpuContext, pcSplit, trace.filename, traceIdx, pathLength).then(function (results) { return _this.results.push(results); });
                        });
                    }
                    else {
                        _this.detectSvc.detectUBBranches(benchmarks, hrgBits, bias).then(function (res) {
                            _this.detectionResults = res;
                            _this.phtTraceQuery(branches, cpuContext, pcSplit, trace.filename, traceIdx).then(function (results) { return _this.results.push(results); });
                        });
                    }
                });
                setTimeout(function () {
                    console.log("Prediction results", _this.results);
                    resolve(_this.results);
                }, 1000);
            });
        });
    };
    PredictorService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [benchmark_service_1.BenchmarkService, detector_service_1.DetectorService])
    ], PredictorService);
    return PredictorService;
}());
exports.PredictorService = PredictorService;
//# sourceMappingURL=predictor.service.js.map