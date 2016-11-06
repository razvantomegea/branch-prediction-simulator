import { Component, Input, OnChanges } from '@angular/core';

import { BenchmarkService } from '../../benchmark';
import { Results } from '../results';

@Component({
  selector: 'app-standard-results',
  templateUrl: './standard-results.component.html',
  styleUrls: ['./standard-results.component.sass']
})
export class StandardResultsComponent implements OnChanges {
  @Input('results') results: Results[];
  public noPathResults: Results[];
  public pathResults: Results[];
  constructor(private benchmarkSvc: BenchmarkService) { }

  public saveResults(): void {
    this.benchmarkSvc.saveResults(this.results);
  }

  ngOnChanges(changes: any): void {
    let newResult: Results = changes.results.currentValue[0];
    if (!!newResult && newResult.withPath) {
      this.pathResults = [...this.results];
    } else {
      this.noPathResults = [...this.results];
    }
  }

}
