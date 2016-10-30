"use strict";
var history_register_entry_1 = require('./history-register-entry');
var HistoryRegister = (function () {
    function HistoryRegister(bitLength, entries, size) {
        if (bitLength === void 0) { bitLength = 0; }
        if (entries === void 0) { entries = []; }
        if (size === void 0) { size = entries.length; }
        this.bitLength = bitLength;
        this.entries = entries;
        this.size = size;
    }
    HistoryRegister.prototype.addEntry = function (history, path, PClow, taken) {
        var HRentry = new history_register_entry_1.HistoryRegisterEntry(PClow, history, taken ? 0 : 1, path, taken ? 1 : 0);
        this.entries.push(HRentry);
    };
    HistoryRegister.prototype.resetRegister = function () {
        this.entries = [];
    };
    return HistoryRegister;
}());
exports.HistoryRegister = HistoryRegister;
//# sourceMappingURL=history-register.js.map