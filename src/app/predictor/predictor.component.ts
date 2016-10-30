import { Component, OnInit } from '@angular/core';

import { HistoryTable } from '../prediction-history';

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.sass']
})
export class PredictorComponent implements OnInit {
  public biased: number = 0;
  public history: number = 0;
  public pht: HistoryTable;
  public withPath: boolean = false;
  constructor() { }

  ngOnInit() {
    this.pht = new HistoryTable();
  }

}
