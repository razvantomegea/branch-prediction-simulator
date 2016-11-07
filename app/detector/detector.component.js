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
var detector_service_1 = require('./detector.service');
var DetectorComponent = (function () {
    function DetectorComponent(detectSvc) {
        this.detectSvc = detectSvc;
        this.detectResults = new core_1.EventEmitter();
        this.bias = 0.9;
        this.hrgBits = 4;
        this.noSelection = true;
        this.path = 4;
        this.withPath = false;
    }
    DetectorComponent.prototype.startDetection = function () {
        var _this = this;
        if (this.withPath) {
            this.detectSvc.detectUBBranches(this.benchmarks, this.hrgBits, this.bias, this.path).then(function (results) { return _this.detectResults.emit(results); });
        }
        else {
            this.detectSvc.detectUBBranches(this.benchmarks, this.hrgBits, this.bias).then(function (results) { return _this.detectResults.emit(results); });
        }
    };
    DetectorComponent.prototype.ngOnChanges = function (changes) {
        this.noSelection = changes.benchmarks.currentValue.length === 0;
    };
    __decorate([
        core_1.Input('benchmarks'), 
        __metadata('design:type', Array)
    ], DetectorComponent.prototype, "benchmarks", void 0);
    __decorate([
        core_1.Output('detectSuccess'), 
        __metadata('design:type', core_1.EventEmitter)
    ], DetectorComponent.prototype, "detectResults", void 0);
    DetectorComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-detector',
            templateUrl: 'detector.component.html',
            styleUrls: ['detector.component.sass']
        }), 
        __metadata('design:paramtypes', [detector_service_1.DetectorService])
    ], DetectorComponent);
    return DetectorComponent;
}());
exports.DetectorComponent = DetectorComponent;
//# sourceMappingURL=detector.component.js.map