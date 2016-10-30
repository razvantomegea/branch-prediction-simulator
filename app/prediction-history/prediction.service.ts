import { Injectable } from '@angular/core';

import { HistoryRegister } from './history-register/history-register';
import { HistoryRegisterEntry } from './history-register/history-register-entry';
import { HistoryTable } from './history-table/history-table';
import { HistoryTableEntry } from './history-table/history-table-entry';

@Injectable()
export class PredictionService {
  public HRg: HistoryRegister;
  public PHT: HistoryTable;
  constructor() { }

  public initializeHRg(bitLength: number, entries: HistoryRegisterEntry[], size: number): void {
    this.HRg = new HistoryRegister(bitLength, entries, size);
  }

  public initializePHT(entries: HistoryTableEntry[], size: number): void {
    this.PHT = new HistoryTable(entries, size);
  }

}
