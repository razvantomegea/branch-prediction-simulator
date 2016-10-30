"use strict";
var PredictionAutomata = (function () {
    function PredictionAutomata(currentState) {
        if (currentState === void 0) { currentState = 0; }
        this.currentState = currentState;
    }
    PredictionAutomata.prototype.changeState = function (isTaken) {
        switch (this.currentState) {
            case 0:
                this.currentState = isTaken ? 0 : 1;
                break;
            case 1:
                this.currentState = isTaken ? 0 : 2;
                break;
            case 2:
                this.currentState = isTaken ? 3 : 2;
                break;
            case 3:
                this.currentState = isTaken ? 0 : 2;
                break;
            default:
                break;
        }
    };
    PredictionAutomata.prototype.predict = function () {
        return this.currentState <= 1;
    };
    return PredictionAutomata;
}());
exports.PredictionAutomata = PredictionAutomata;
//# sourceMappingURL=prediction-automata.js.map