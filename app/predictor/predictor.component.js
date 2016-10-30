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
var history_table_1 = require('../prediction-history/history-table/history-table');
var PredictorComponent = (function () {
    function PredictorComponent() {
        this.biased = 0;
        this.history = 0;
        this.withPath = false;
    }
    PredictorComponent.prototype.ngOnInit = function () {
        this.pht = new history_table_1.HistoryTable();
    };
    PredictorComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-predictor',
            templateUrl: 'predictor.component.html',
            styleUrls: ['predictor.component.sass']
        }), 
        __metadata('design:paramtypes', [])
    ], PredictorComponent);
    return PredictorComponent;
}());
exports.PredictorComponent = PredictorComponent;
//# sourceMappingURL=predictor.component.js.map