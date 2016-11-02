export class HistoryRegisterEntry {
    constructor(
        public pcLow: number = 0,
        public context: string = "",
        public path: number = 0,
        public taken: number = 0,
        public notTaken: number = 0
    ) { }
}