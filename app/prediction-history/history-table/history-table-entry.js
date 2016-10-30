"use strict";
var prediction_automata_1 = require('./prediction-automata');
var HistoryTableEntry = (function () {
    function HistoryTableEntry(automata, index, LRU, nextPCNoTaken, nextPCTaken, tag) {
        if (automata === void 0) { automata = new prediction_automata_1.PredictionAutomata(); }
        if (index === void 0) { index = 0; }
        if (LRU === void 0) { LRU = 0; }
        if (nextPCNoTaken === void 0) { nextPCNoTaken = 0; }
        if (nextPCTaken === void 0) { nextPCTaken = 0; }
        if (tag === void 0) { tag = 0; }
        this.automata = automata;
        this.index = index;
        this.LRU = LRU;
        this.nextPCNoTaken = nextPCNoTaken;
        this.nextPCTaken = nextPCTaken;
        this.tag = tag;
    }
    return HistoryTableEntry;
}());
exports.HistoryTableEntry = HistoryTableEntry;
//# sourceMappingURL=history-table-entry.js.map