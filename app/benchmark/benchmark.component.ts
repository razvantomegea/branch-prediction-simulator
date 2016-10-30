import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-benchmark',
  templateUrl: 'benchmark.component.html',
  styleUrls: ['benchmark.component.sass']
})
export class BenchmarkComponent implements OnInit {
  public availableBenchmarks: string[];
  public selectedBenchmarks: string[];
  constructor() { }

  ngOnInit(): void {
    this.availableBenchmarks = [
      "FBUBBLE",
      "FMATRIX",
      "FPERM",
      "FPUZZLE",
      "FQUEENS",
      "FSORT",
      "FTOWER",
      "FTREE"
    ];
    this.selectedBenchmarks = [];
  }

}
