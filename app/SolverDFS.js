function PathCell (prev, current) {
    this.prev = prev;
    this.current = current;
}

function SolverDFS () {
    this.current = grid[0][0];
    this.visited = new Set();
    this.stack = [new PathCell(undefined, this.current)];
    this.currentPathCell;
    this.solved = false;
    this.finalPath = [];
    this.isWorkDone = false;
    this.showVisited = false;

    this.colors = {
        head:    [150, 100, 50],
        path:    [200, 100, 50],
        visited: [250, 100, 50]
    }

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

            if (this.showVisited) {
                this.current.permanentColors.push(this.colors.visited);
            }
            this.visited.add(this.current.getRep())
            this.current.isCurrent = true;
        }

        // Mark the cells in path
        while (this.currentPathCell.prev !== undefined) {
            // Keep the final path in memory
            if (this.solved) {
                this.currentPathCell.current.permanentColors.push(this.colors.path);
            }
            this.currentPathCell.current.tmpColors.push(this.colors.head);
            this.currentPathCell = this.currentPathCell.prev;
        }


        this.isWorkDone = this.solved;
        return this.isWorkDone;
    }

    this.solveFull = () => {
        while (!this.isWorkDone) {
            this.iteration();
        }
    };
}
