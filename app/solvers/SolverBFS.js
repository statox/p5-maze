function PathCell (prev, current) {
    this.prev = prev;
    this.current = current;
}

function SolverBFS () {
    const myColors = {
        head:      [0, 0, 255],
        path:      [50, 100, 200],
        finalPath: [50, 100, 200],
        visited:   [50, 100, 250]
    }
    Solver.call(this, 'BFS', myColors);

    this.current = grid[0][0];
    this.stack = [new PathCell(undefined, this.current)];
    this.currentPathCell;
    this.solved = false;

    this.iteration = () => {
        if (!this.solved && this.stack.length) {
            this.iterationCounter++;
            this.current.isCurrent = false;
            this.currentPathCell = this.stack.shift();
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

            this.visited.add(this.current.getRep())
            this.current.isCurrent = true;

            // Add a color to mark the current cell
            this.current.currentColor = this.colors.head;
            // Keep a visual track of the visited cells if enabled
            if (showVisitedCells) {
                this.current.permanentColors.push(this.colors.visited);
            }
        }

        // Mark the cells in path
        while (this.currentPathCell.prev !== undefined) {
            // Keep the final path in memory
            if (this.solved) {
                this.currentPathCell.current.permanentColors.push(this.colors.finalPath);
            }
            this.currentPathCell.current.tmpColors.push(this.colors.path);
            this.currentPathCell = this.currentPathCell.prev;
        }


        this.isWorkDone = this.solved;
        return this.isWorkDone;
    }
}
