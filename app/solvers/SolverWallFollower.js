function PathCell (prev, current) {
    this.prev = prev;
    this.current = current;
}

function SolverWallFollower () {
    const myColors = {
        head:      [56, 45, 74],
        path:      [119, 95, 156],
        finalPath: [119, 95, 156],
        visited:   [119, 95, 156]
    }
    Solver.call(this, 'Wall follower', myColors);

    this.current = grid[0][0];
    this.stack = [new PathCell(undefined, this.current)];
    this.currentPathCell;
    this.solved = false;
    this.directions = {
        W: ['N', 'W', 'S', 'E'],
        S: ['W', 'S', 'E', 'N'],
        E: ['S', 'E', 'N', 'W'],
        N: ['E', 'N', 'W', 'S']
    };
    this.direction = 'S';

    this.iteration = () => {
        if (!this.solved && this.stack.length) {
            this.iterationCounter++;
            this.current.isCurrent = false;

            this.currentPathCell = this.stack.pop();
            this.current = this.currentPathCell.current;

            if (this.current.isFinish) {
                this.solved = true;
            } else {
                let choosenCell;
                let newDirection;
                let newDirectionIndex = 0;
                while (!choosenCell) {
                    newDirection = this.directions[this.direction][newDirectionIndex]
                    choosenCell = this.current.getWay(newDirection)
                    console.log('test', {newDirection, choosenCell});
                    newDirectionIndex++;
                }
                console.log('chosen', {newDirection, choosenCell});
                this.direction = newDirection;
                this.stack.push(new PathCell(this.currentPathCell, choosenCell));
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
