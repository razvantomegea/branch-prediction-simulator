import { Component, Input, OnInit } from '@angular/core';

import { DetectorService } from './detector.service';

@Component({
  selector: 'app-detector',
  templateUrl: './detector.component.html',
  styleUrls: ['./detector.component.sass']
})
export class DetectorComponent implements OnInit {
  @Input('benchmarks') benchmarks: string[];
  public bias: number = 1;
  public hrgBits: number = 4;
  public path: number = 4;
  public withPath: boolean = false;

  constructor(private detectSvc: DetectorService) { }

  public startDetection(): void {
    this.detectSvc.detectUBBranches(this.benchmarks, this.hrgBits, this.bias);
  }

  ngOnInit() {
  }

}
