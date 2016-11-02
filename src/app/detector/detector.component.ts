import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DetectorService } from './detector.service';
import { Results } from '../results';

@Component({
  selector: 'app-detector',
  templateUrl: './detector.component.html',
  styleUrls: ['./detector.component.sass']
})
export class DetectorComponent {
  @Input('benchmarks') benchmarks: string[];
  @Output('detectSuccess') detectResults: EventEmitter<any> = new EventEmitter();
  public bias: number = 1;
  public hrgBits: number = 4;
  public path: number = 4;
  public withPath: boolean = false;

  constructor(private detectSvc: DetectorService) { }

  public startDetection(): void {
    this.detectSvc.detectUBBranches(this.benchmarks, this.hrgBits, this.bias).then((results: Results[]) => this.detectResults.emit(results));
  }

}
