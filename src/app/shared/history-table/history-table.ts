import { HistoryTableEntry } from './history-table-entry';

export class HistoryTable {
    constructor(
        public entries: HistoryTableEntry[] = [],
        public size: number = 0
    ) { }

    public addEntry(tableIdx: number, nextPCTaken: number, nextPCNoTaken: number, tag: number, isTaken: boolean): void {
        let entry: HistoryTableEntry = new HistoryTableEntry(nextPCNoTaken, nextPCTaken, tag, tableIdx);

        if (this.entries.length === this.size) {
            let minLRU: number = this.size;
            this.entries.forEach((entry: HistoryTableEntry) => {
                if (entry.LRU < minLRU) {
                    minLRU = entry.LRU;
                }
            });

            this.entries.forEach((entry: HistoryTableEntry, entryIdx: number) => {
                if (entry.LRU === minLRU) {
                    this.entries.splice(entryIdx, 1);
                    return;
                }   
            });
            entry.automata.changeState(isTaken);
        }
        this.entries.push(entry);
    }

    public resetTable():void {
        this.entries = [];
    }

    public updateLRU(): void {
        this.entries.forEach((entry: HistoryTableEntry) => entry.LRU--);
    }
}
