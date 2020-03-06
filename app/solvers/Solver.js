function Solver (name, colors) {
    this.name = name;
    this.visited = new Set();
    this.isWorkDone = false;
    this.finalPath = [];
    this.colors = colors;
    this.iterationCounter = 0;

    this.iteration = () => {
        console.log('this.iteration IMPLEMENT ME');
    };

    this.solveFull = () => {
        while (!this.isWorkDone) {
            this.iteration();
        }
    };

    this.getStats = () => {
        return {
            name: this.name,
            iterations: this.iterationCounter,
            color: this.colors.head
        }
    }
}
