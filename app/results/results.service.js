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
var ResultsService = (function () {
    function ResultsService() {
    }
    ResultsService.prototype.setChartData = function (pathRes, noPathRes) {
        var chartObj = {
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
        var sum = 0, average = 0;
        pathRes.forEach(function (res) {
            var bias = parseInt(res.bias.substring(0, res.bias.length - 1));
            chartObj.labels.push(res.traceName);
            chartObj.datasets[0].data.push(bias);
            sum += bias;
        });
        average = sum / chartObj.datasets[0].data.length;
        chartObj.labels.push('Average');
        chartObj.datasets[0].data.push(average);
        sum = average = 0;
        noPathRes.forEach(function (res) {
            if (chartObj.labels.indexOf(res.traceName) === -1) {
                chartObj.labels.push(res.traceName);
            }
            var bias = parseInt(res.bias.substring(0, res.bias.length - 1));
            chartObj.datasets[1].data.push(bias);
            sum += bias;
        });
        average = sum / chartObj.datasets[1].data.length;
        chartObj.datasets[1].data.push(average);
        return chartObj;
    };
    ResultsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ResultsService);
    return ResultsService;
}());
exports.ResultsService = ResultsService;
//# sourceMappingURL=results.service.js.map