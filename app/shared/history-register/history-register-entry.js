"use strict";
var HistoryRegisterEntry = (function () {
    function HistoryRegisterEntry(pcLow, history, path, taken, notTaken) {
        if (pcLow === void 0) { pcLow = 0; }
        if (history === void 0) { history = ""; }
        if (path === void 0) { path = 0; }
        if (taken === void 0) { taken = 0; }
        if (notTaken === void 0) { notTaken = 0; }
        this.pcLow = pcLow;
        this.history = history;
        this.path = path;
        this.taken = taken;
        this.notTaken = notTaken;
    }
    return HistoryRegisterEntry;
}());
exports.HistoryRegisterEntry = HistoryRegisterEntry;
//# sourceMappingURL=history-register-entry.js.map