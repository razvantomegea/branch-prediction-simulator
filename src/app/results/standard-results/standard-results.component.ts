import { Component, Input } from '@angular/core';

import { BenchmarkService } from '../../benchmark';
import { Results } from '../results';

@Component({
  selector: 'app-standard-results',
  templateUrl: './standard-results.component.html',
  styleUrls: ['./standard-results.component.sass']
})
export class StandardResultsComponent {
  @Input('results') results: Results[];
  constructor(private benchmarkSvc: BenchmarkService) { }

  public saveResults(): void {
    this.benchmarkSvc.saveResults(this.results);
  }

}
