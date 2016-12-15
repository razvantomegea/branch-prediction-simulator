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
var benchmark_service_1 = require('../benchmark/benchmark.service');
var results_service_1 = require('./results.service');
var ResultsComponent = (function () {
    function ResultsComponent(benchmarkSvc, resultSvc) {
        this.benchmarkSvc = benchmarkSvc;
        this.resultSvc = resultSvc;
        this.showDetectionChart = false;
        this.showPredictionChart = false;
        this.chartData = {
            labels: [],
            datasets: [
                {
                    label: 'Bias without path',
                    backgroundColor: 'silver',
                    borderColor: 'silver',
                    data: []
                },
                {
                    label: 'Bias with path',
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    data: []
                }
            ]
        };
        this.chartOptions = {
            legend: {
                labels: {
                    fontColor: 'white'
                }
            },
            title: {
                display: true,
                fontColor: 'white',
                text: ''
            },
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white'
                        },
                    }],
                xAxes: [{
                        ticks: {
                            fontColor: 'white'
                        },
                    }]
            }
        };
    }
    ResultsComponent.prototype.saveResults = function () {
        this.benchmarkSvc.saveResults(this.results);
    };
    ResultsComponent.prototype.showDetectionCharts = function () {
        this.chartData = this.resultSvc.setChartData(this.pathResultsDetection, this.noPathResultsDetection);
        this.chartOptions.title.text = 'Detection results';
        this.showDetectionChart = true;
    };
    ResultsComponent.prototype.showPredictionCharts = function () {
        this.chartData = this.resultSvc.setChartData(this.pathResultsPrediction, this.noPathResultsPrediction);
        this.chartOptions.title.text = 'Prediction results';
        this.showPredictionChart = true;
    };
    ResultsComponent.prototype.ngOnChanges = function (changes) {
        var newResult = changes.results.currentValue[0];
        this.noResults = changes.results.currentValue.length === 0;
        if (!!newResult) {
            if (newResult.withPath) {
                if (newResult.isPrediction) {
                    this.pathResultsPrediction = this.results.slice();
                }
                else {
                    this.pathResultsDetection = this.results.slice();
                }
            }
            else {
                if (newResult.isPrediction) {
                    this.noPathResultsPrediction = this.results.slice();
                }
                else {
                    this.noPathResultsDetection = this.results.slice();
                }
            }
        }
        console.log(this.chartData);
    };
    __decorate([
        core_1.Input('results'), 
        __metadata('design:type', Array)
    ], ResultsComponent.prototype, "results", void 0);
    ResultsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-results',
            templateUrl: 'results.component.html',
            styleUrls: ['results.component.sass']
        }), 
        __metadata('design:paramtypes', [benchmark_service_1.BenchmarkService, results_service_1.ResultsService])
    ], ResultsComponent);
    return ResultsComponent;
}());
exports.ResultsComponent = ResultsComponent;
//# sourceMappingURL=results.component.js.map