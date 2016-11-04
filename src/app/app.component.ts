import { Component, OnInit } from '@angular/core';

import { Results } from './results';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
    public benchmarks: string[];
    public results: Results[];
    constructor() { }

    public addBenchmark(ev: string[]): void {
        this.benchmarks = [...ev];
    }

    public getDetection(ev: Results[]): void {
        this.results = [...ev];
    }

    public getPrediction(ev: Results[]): void {
        this.results = [...ev];
    }

    ngOnInit(): void {
        this.benchmarks = [];
        this.results = [];
    }
}
