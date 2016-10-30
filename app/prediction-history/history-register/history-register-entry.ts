export class HistoryRegisterEntry {
    constructor(
        public PClow: number = 0,
        public history: string = "",
        public notTaken: number = 0,
        public path: number = 0,
        public taken: number = 0
    ) { }
}