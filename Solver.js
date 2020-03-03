function PathCell (prev, current) {
    this.prev = prev;
    this.current = current;
}

function Solver () {
    this.current = grid[0][0];
    this.visited = new Set();
    this.stack = [new PathCell(undefined, this.current)];
    this.currentPathCell;
    this.solved = false;
    this.finalPath = [];

    this.iteration = () => {
        if (!this.solved && this.stack.length) {
            this.current.isCurrent = false;
            this.currentPathCell = this.stack.pop();
            this.current = this.currentPathCell.current;

            if (this.current.isFinish) {
                this.solved = true;
            } else {
                if (!this.visited.has(this.current.getRep())) {
                    const neighbors = this.current.hasWays();
                    neighbors.forEach(n => {
                        if (!this.visited.has(n.getRep())) {
                            this.stack.push(new PathCell(this.currentPathCell, n));
                        }
                    });
                }
            }

            this.current.permanentColors.push([250, 100, 50]);
            this.visited.add(this.current.getRep())
            this.current.isCurrent = true;
        }

        // Mark the cells in path
        while (this.currentPathCell.prev !== undefined) {
            // Keep the final path in memory
            if (this.solved) {
                this.currentPathCell.current.permanentColors.push([200, 100, 50]);
            }
            this.currentPathCell.current.tmpColors.push([150, 150, 50]);
            this.currentPathCell = this.currentPathCell.prev;
        }


        return this.solved;
    }
}
