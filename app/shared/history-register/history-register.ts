import { HistoryRegisterEntry } from './history-register-entry';

export class HistoryRegister {
    constructor(
        public bitLength: number = 0,
        public entries: HistoryRegisterEntry[] = [],
        public size: number = entries.length
    ) { }

    public addEntry(history: string, pcPath: number, pcLow: number, taken: boolean): void {
        let HRentry = new HistoryRegisterEntry(pcLow, history, pcPath, taken ? 1 : 0, !taken ? 1 : 0);
        this.entries.push(HRentry);
    }

    public resetRegister(): void {
        this.entries = [];
    }
}
