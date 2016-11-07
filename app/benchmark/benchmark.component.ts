import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-benchmark',
  templateUrl: 'benchmark.component.html',
  styleUrls: ['benchmark.component.sass']
})
export class BenchmarkComponent implements OnInit {
  @Output() bmkSelection: EventEmitter<any> = new EventEmitter();
  public availableBenchmarks: string[];
  public selectedBenchmarks: string[];

  constructor() { }

  public emitBenchmarks(): void {
    this.bmkSelection.emit(this.selectedBenchmarks);
  }

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
