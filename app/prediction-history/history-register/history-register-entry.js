"use strict";
var HistoryRegisterEntry = (function () {
    function HistoryRegisterEntry(PClow, history, notTaken, path, taken) {
        if (PClow === void 0) { PClow = 0; }
        if (history === void 0) { history = ""; }
        if (notTaken === void 0) { notTaken = 0; }
        if (path === void 0) { path = 0; }
        if (taken === void 0) { taken = 0; }
        this.PClow = PClow;
        this.history = history;
        this.notTaken = notTaken;
        this.path = path;
        this.taken = taken;
    }
    return HistoryRegisterEntry;
}());
exports.HistoryRegisterEntry = HistoryRegisterEntry;
//# sourceMappingURL=history-register-entry.js.map