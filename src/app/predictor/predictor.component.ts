import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { PredictorService } from './predictor.service';
import { Results } from '../results';

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.sass']
})
export class PredictorComponent implements OnChanges {
  @Input('benchmarks') benchmarks: string[];
  @Output('predictSuccess') predictResults: EventEmitter<any> = new EventEmitter();
  public bias: number = 0.9;
  public hrgBits: number = 4;
  public noSelection: boolean = true;
  public path: number = 4;
  public pcLowLength: number = 32;
  public phtSize: number = 128;
  public withPath: boolean = false;
  constructor(private predictorSvc: PredictorService) { }

  public startPrediction(): void {
    if (this.withPath) {
      this.predictorSvc.predictUBBranches(
        this.benchmarks,
        this.hrgBits,
        this.bias,
        this.pcLowLength,
        this.phtSize,
        this.path
      ).then((results: Results[]) => this.predictResults.emit(results));
    } else {
      this.predictorSvc.predictUBBranches(
        this.benchmarks,
        this.hrgBits,
        this.bias,
        this.pcLowLength,
        this.phtSize
      ).then((results: Results[]) => this.predictResults.emit(results));
    }
  }

  ngOnChanges(changes: any): void {
    this.noSelection = changes.benchmarks.currentValue.length === 0;
  }

}
