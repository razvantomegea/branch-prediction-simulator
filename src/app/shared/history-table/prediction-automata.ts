export class PredictionAutomata {
    constructor(public currentState: number = 0b00) { }

    public changeState(isTaken: boolean): void {
        switch (this.currentState) {
            case 0b00:
                this.currentState = isTaken ? 0b00 : 0b01;
                break;
            case 0b01:
                this.currentState = isTaken ? 0b00 : 0b10;
                break;
            case 0b10:
                this.currentState = isTaken ? 0b11 : 0b10;
                break;
            case 0b11:
                this.currentState = isTaken ? 0b00 : 0b10;
                break;
        
            default:
                break;
        }
    }

    public predict(): boolean {
        return this.currentState <= 0b01;
    }
}
