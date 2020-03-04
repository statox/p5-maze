function Solver (colors) {
    this.visited = new Set();
    this.isWorkDone = false;
    this.finalPath = [];
    this.colors = colors;

    this.iteration = () => {
        console.log('this.iteration IMPLEMENT ME');
    };

    this.solveFull = () => {
        while (!this.isWorkDone) {
            this.iteration();
        }
    };
}
