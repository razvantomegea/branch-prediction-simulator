"use strict";
/* tslint:disable:no-unused-variable */
var testing_1 = require('@angular/core/testing');
var benchmark_component_1 = require('./benchmark.component');
describe('BenchmarkComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [benchmark_component_1.BenchmarkComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(benchmark_component_1.BenchmarkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=benchmark.component.spec.js.map