"use strict";
var prediction_automata_1 = require('./prediction-automata');
var HistoryTableEntry = (function () {
    function HistoryTableEntry(nextPCNoTaken, nextPCTaken, tag, tableIndex) {
        if (nextPCNoTaken === void 0) { nextPCNoTaken = 0; }
        if (nextPCTaken === void 0) { nextPCTaken = 0; }
        if (tag === void 0) { tag = 0; }
        if (tableIndex === void 0) { tableIndex = 0; }
        this.nextPCNoTaken = nextPCNoTaken;
        this.nextPCTaken = nextPCTaken;
        this.tag = tag;
        this.tableIndex = tableIndex;
        this.automata = new prediction_automata_1.PredictionAutomata();
        this.LRU = 0;
    }
    return HistoryTableEntry;
}());
exports.HistoryTableEntry = HistoryTableEntry;
//# sourceMappingURL=history-table-entry.js.map