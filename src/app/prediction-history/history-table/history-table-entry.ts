import { PredictionAutomata } from './prediction-automata';

export class HistoryTableEntry {
    constructor(
        public automata: PredictionAutomata = new PredictionAutomata(),
        public index: number = 0,
        public LRU: number = 0,
        public nextPCNoTaken: number = 0,
        public nextPCTaken: number = 0,
        public tag: number = 0
    ) { }
}