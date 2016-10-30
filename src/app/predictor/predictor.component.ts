import { Component, OnInit } from '@angular/core';

import { HistoryTable } from '../prediction-history';

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.sass']
})
export class PredictorComponent implements OnInit {
  public pht: HistoryTable;
  constructor() { }

  ngOnInit() {
    this.pht = new HistoryTable();
  }

}
