import { Injectable } from '@angular/core';

import { HistoryTable } from './history-table/history-table';
import { HistoryTableEntry } from './history-table/history-table-entry';

@Injectable()
export class PredictionService {
  public PHT: HistoryTable;
  constructor() { }

  public initializePHT(entries: HistoryTableEntry[], size: number): void {
    this.PHT = new HistoryTable(entries, size);
  }

}
