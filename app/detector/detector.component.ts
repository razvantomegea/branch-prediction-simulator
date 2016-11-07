import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { DetectorService } from './detector.service';
import { Results } from '../results/results';

@Component({
  moduleId: module.id,
  selector: 'app-detector',
  templateUrl: 'detector.component.html',
  styleUrls: ['detector.component.sass']
})
export class DetectorComponent implements OnChanges {
  @Input('benchmarks') benchmarks: string[];
  @Output('detectSuccess') detectResults: EventEmitter<any> = new EventEmitter();
  public bias: number = 0.9;
  public hrgBits: number = 4;
  public noSelection: boolean = true;
  public path: number = 4;
  public withPath: boolean = false;

  constructor(private detectSvc: DetectorService) { }

  public startDetection(): void {
    if (this.withPath) {
      this.detectSvc.detectUBBranches(this.benchmarks, this.hrgBits, this.bias, this.path).then((results: Results[]) => this.detectResults.emit(results));
    } else {
      this.detectSvc.detectUBBranches(this.benchmarks, this.hrgBits, this.bias).then((results: Results[]) => this.detectResults.emit(results));
    }
  }

  ngOnChanges(changes: any): void {
    this.noSelection = changes.benchmarks.currentValue.length === 0;
  }

}
