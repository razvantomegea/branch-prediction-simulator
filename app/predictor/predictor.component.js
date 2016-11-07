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
var predictor_service_1 = require('./predictor.service');
var PredictorComponent = (function () {
    function PredictorComponent(predictorSvc) {
        this.predictorSvc = predictorSvc;
        this.predictResults = new core_1.EventEmitter();
        this.bias = 0.9;
        this.hrgBits = 4;
        this.noSelection = true;
        this.path = 4;
        this.pcLowLength = 16;
        this.phtSize = 128;
        this.withPath = false;
    }
    PredictorComponent.prototype.startPrediction = function () {
        var _this = this;
        if (this.withPath) {
            this.predictorSvc.predictUBBranches(this.benchmarks, this.hrgBits, this.bias, this.pcLowLength, this.phtSize, this.path).then(function (results) { return _this.predictResults.emit(results); });
        }
        else {
            this.predictorSvc.predictUBBranches(this.benchmarks, this.hrgBits, this.bias, this.pcLowLength, this.phtSize).then(function (results) { return _this.predictResults.emit(results); });
        }
    };
    PredictorComponent.prototype.ngOnChanges = function (changes) {
        this.noSelection = changes.benchmarks.currentValue.length === 0;
    };
    __decorate([
        core_1.Input('benchmarks'), 
        __metadata('design:type', Array)
    ], PredictorComponent.prototype, "benchmarks", void 0);
    __decorate([
        core_1.Output('predictSuccess'), 
        __metadata('design:type', core_1.EventEmitter)
    ], PredictorComponent.prototype, "predictResults", void 0);
    PredictorComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-predictor',
            templateUrl: 'predictor.component.html',
            styleUrls: ['predictor.component.sass']
        }), 
        __metadata('design:paramtypes', [predictor_service_1.PredictorService])
    ], PredictorComponent);
    return PredictorComponent;
}());
exports.PredictorComponent = PredictorComponent;
//# sourceMappingURL=predictor.component.js.map