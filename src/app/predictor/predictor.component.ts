import { Component, OnInit } from '@angular/core';

import { PHT } from '../prediction';

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.sass']
})
export class PredictorComponent implements OnInit {
  public pht: PHT;
  constructor() { }

  ngOnInit() {
    this.pht = new PHT();
  }

}
