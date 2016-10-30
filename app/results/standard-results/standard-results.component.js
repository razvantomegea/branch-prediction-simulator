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
var StandardResultsComponent = (function () {
    function StandardResultsComponent() {
    }
    StandardResultsComponent.prototype.ngOnInit = function () {
        this.results = [{
                benchmark: "FSORT",
                percentage: "98%"
            }];
    };
    StandardResultsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-standard-results',
            templateUrl: 'standard-results.component.html',
            styleUrls: ['standard-results.component.sass']
        }), 
        __metadata('design:paramtypes', [])
    ], StandardResultsComponent);
    return StandardResultsComponent;
}());
exports.StandardResultsComponent = StandardResultsComponent;
//# sourceMappingURL=standard-results.component.js.map