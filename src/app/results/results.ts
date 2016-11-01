import { UnbiasedBranch } from '../detector';

export class Results {
    constructor(
        public bias: number = 0,
        public branches: number = 0,
        public ubBranches: UnbiasedBranch[] = [],
        public goodPredictions: number = 0,
        public badPredictions: number = 0,
        public traceName: string = ""
    ) { }
}