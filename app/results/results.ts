import { UnbiasedBranch } from '../shared/unbiased-branch';

export class Results {
    constructor(
        public bias: string = "",
        public totalBranches: number = 0,
        public ubBranches: UnbiasedBranch[] = [],
        public goodPredictions: number = 0,
        public badPredictions: number = 0,
        public traceName: string = "",
        public isPrediction: boolean = false,
        public withPath: boolean = false
    ) { }
}