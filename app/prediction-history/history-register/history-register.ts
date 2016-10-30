import { HistoryRegisterEntry } from './history-register-entry';

export class HistoryRegister {
    constructor(
        public bitLength: number = 0,
        public entries: HistoryRegisterEntry[] = [],
        public size: number = entries.length
    ) { }

    public addEntry(history: string, path: number, PClow: number, taken: boolean): void {
        let HRentry = new HistoryRegisterEntry(PClow, history, taken ? 0 : 1, path, taken ? 1 : 0);
        this.entries.push(HRentry);
    }

    public resetRegister(): void {
        this.entries = [];
    }
}
