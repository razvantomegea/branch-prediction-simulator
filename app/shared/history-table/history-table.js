"use strict";
var history_table_entry_1 = require('./history-table-entry');
var HistoryTable = (function () {
    function HistoryTable(entries, size) {
        if (entries === void 0) { entries = []; }
        if (size === void 0) { size = 0; }
        this.entries = entries;
        this.size = size;
    }
    HistoryTable.prototype.addEntry = function (tableIdx, nextPCTaken, nextPCNoTaken, tag, isTaken) {
        var _this = this;
        var entry = new history_table_entry_1.HistoryTableEntry(nextPCNoTaken, nextPCTaken, tag, tableIdx);
        if (this.entries.length === this.size) {
            var minLRU_1 = this.size;
            this.entries.forEach(function (entry) {
                if (entry.LRU < minLRU_1) {
                    minLRU_1 = entry.LRU;
                }
            });
            this.entries.forEach(function (entry, entryIdx) {
                if (entry.LRU === minLRU_1) {
                    _this.entries.splice(entryIdx, 1);
                    return;
                }
            });
            entry.automata.changeState(isTaken);
        }
        this.entries.push(entry);
    };
    HistoryTable.prototype.resetTable = function () {
        this.entries = [];
    };
    HistoryTable.prototype.updateLRU = function () {
        this.entries.forEach(function (entry) { return entry.LRU--; });
    };
    return HistoryTable;
}());
exports.HistoryTable = HistoryTable;
//# sourceMappingURL=history-table.js.map