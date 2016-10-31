import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
    public benchmarks: string[];
    constructor() { }

    public addBenchmark(ev: string[]): void {
        this.benchmarks = ev;
    }

    ngOnInit(): void {
        this.benchmarks = [];
    }
}
