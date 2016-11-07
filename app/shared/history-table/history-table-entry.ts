import { PredictionAutomata } from './prediction-automata';

export class HistoryTableEntry {
    public automata: PredictionAutomata;
    public LRU: number;
    constructor(
        public nextPCNoTaken: number = 0,
        public nextPCTaken: number = 0,
        public tag: number = 0,
        public tableIndex: number = 0
    ) {
        this.automata = new PredictionAutomata();
        this.LRU = 0;
    }
}