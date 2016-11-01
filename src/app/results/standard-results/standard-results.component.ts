import { Component, OnInit } from '@angular/core';

import { BenchmarkService } from '../../benchmark';
@Component({
  selector: 'app-standard-results',
  templateUrl: './standard-results.component.html',
  styleUrls: ['./standard-results.component.sass']
})
export class StandardResultsComponent implements OnInit {
  public results: any[];
  constructor(private benchmarkSvc: BenchmarkService) { }

  public saveResults(): void {
    this.benchmarkSvc.saveResults(this.results);
  }

  ngOnInit() {
    this.results = [{
      benchmark: "FSORT",
      bias: "98%"
    }];
  }

}
