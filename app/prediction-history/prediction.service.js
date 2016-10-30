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
var history_register_1 = require('./history-register/history-register');
var history_table_1 = require('./history-table/history-table');
var PredictionService = (function () {
    function PredictionService() {
    }
    PredictionService.prototype.initializeHRg = function (bitLength, entries, size) {
        this.HRg = new history_register_1.HistoryRegister(bitLength, entries, size);
    };
    PredictionService.prototype.initializePHT = function (entries, size) {
        this.PHT = new history_table_1.HistoryTable(entries, size);
    };
    PredictionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], PredictionService);
    return PredictionService;
}());
exports.PredictionService = PredictionService;
//# sourceMappingURL=prediction.service.js.map