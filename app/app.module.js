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
var platform_browser_1 = require('@angular/platform-browser');
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var primeng_1 = require('primeng/primeng');
var app_component_1 = require('./app.component');
var benchmark_component_1 = require('./benchmark/benchmark.component');
var detector_component_1 = require('./detector/detector.component');
var chart_results_component_1 = require('./results/chart-results/chart-results.component');
var prediction_service_1 = require('./prediction-history/prediction.service');
var predictor_component_1 = require('./predictor/predictor.component');
var standard_results_component_1 = require('./results/standard-results/standard-results.component');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                predictor_component_1.PredictorComponent,
                detector_component_1.DetectorComponent,
                chart_results_component_1.ChartResultsComponent,
                standard_results_component_1.StandardResultsComponent,
                benchmark_component_1.BenchmarkComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                primeng_1.ChartModule,
                primeng_1.CheckboxModule,
                primeng_1.DataTableModule,
                primeng_1.FieldsetModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                primeng_1.PickListModule,
                primeng_1.SharedModule,
                primeng_1.SpinnerModule
            ],
            providers: [prediction_service_1.PredictionService],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map