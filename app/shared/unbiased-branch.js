"use strict";
var UnbiasedBranch = (function () {
    function UnbiasedBranch(history, pc) {
        if (history === void 0) { history = ""; }
        if (pc === void 0) { pc = 0; }
        this.history = history;
        this.pc = pc;
    }
    return UnbiasedBranch;
}());
exports.UnbiasedBranch = UnbiasedBranch;
//# sourceMappingURL=unbiased-branch.js.map