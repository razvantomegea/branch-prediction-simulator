"use strict";
var Results = (function () {
    function Results(bias, totalBranches, ubBranches, goodPredictions, badPredictions, traceName, withPath) {
        if (bias === void 0) { bias = ""; }
        if (totalBranches === void 0) { totalBranches = 0; }
        if (ubBranches === void 0) { ubBranches = []; }
        if (goodPredictions === void 0) { goodPredictions = 0; }
        if (badPredictions === void 0) { badPredictions = 0; }
        if (traceName === void 0) { traceName = ""; }
        if (withPath === void 0) { withPath = false; }
        this.bias = bias;
        this.totalBranches = totalBranches;
        this.ubBranches = ubBranches;
        this.goodPredictions = goodPredictions;
        this.badPredictions = badPredictions;
        this.traceName = traceName;
        this.withPath = withPath;
    }
    return Results;
}());
exports.Results = Results;
//# sourceMappingURL=results.js.map