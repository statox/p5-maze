function PathCell (prev, next) {
    this.prev = prev;
    this.next = next;
}

function Solver () {
    this.current = grid[0][0];
    this.visited = new Set();
    this.stack = [this.current];
    this.solved = false;
    this.path = [];
    this.pathHead = PathCell(undefined, this.current);

    this.iteration = () => {
        if (!this.solved && this.stack.length) {
            this.current.isCurrent = false;
            this.current = this.stack.pop();

            this.current.isInPath = true;

            if (this.current.isFinish) {
                this.solved = true;
            } else {
                if (!this.visited.has(this.current.getRep())) {
                    const neighbors = this.current.hasWays();
                    neighbors.forEach(n => {
                        if (!this.visited.has(n.getRep())) {
                            this.stack.push(n);
                        }
                    });
                }
            }

            this.visited.add(this.current.getRep())
            this.current.isCurrent = true;
        }

        return this.solved;
    }
}
