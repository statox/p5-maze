function Generator() {
    this.current = grid[0][0];
    grid[0][0].visited = true;
    grid[0][0].isCurrent = true;

    this.visited = 1;

    this.iteration = () => {
        if (this.visited < TOTAL_CELLS) {
            let neighbors = this.current.hasNeighbors();
            this.current.isCurrent = false;
            if (neighbors.length) {
                const index = Math.floor(Math.random() * neighbors.length);
                const neighbor = neighbors[index]

                stack.push(this.current);
                this.removeWalls(this.current, neighbor);

                this.current = neighbor;
                this.current.visited = true;
                this.visited++;
            } else if (stack.length) {
                this.current = stack.pop();
            }
            this.current.isCurrent = true;
            return false;
        }

        this.cleanGrid();
        return true;
    };

    this.cleanGrid = () => {
        for (let y=0; y<COL; y++) {
            for (let x=0; x<COL; x++) {
                grid[y][x].isCurrent = false;
            }
        }
    };

    this.generateAll = () => {
        let generationEnded = false;
        while (!generationEnded) { 
            generationEnded = generator.iteration();
        }
        this.cleanGrid();
    };

    this.removeWalls = (me, neighbor) => {
    if (neighbor.j < me.j) { // top
        grid[me.j][me.i].walls[0] = false;
        grid[neighbor.j][neighbor.i].walls[2] = false;
    }
    if (grid[neighbor.j][neighbor.i].i > grid[me.j][me.i].i) { // right
        grid[me.j][me.i].walls[1] = false;
        grid[neighbor.j][neighbor.i].walls[3] = false;
    }
    if (grid[neighbor.j][neighbor.i].j > grid[me.j][me.i].j) { // bottom
        grid[me.j][me.i].walls[2] = false;
        grid[neighbor.j][neighbor.i].walls[0] = false;
    }
    if (grid[neighbor.j][neighbor.i].i < grid[me.j][me.i].i) { // left
        grid[me.j][me.i].walls[3] = false;
        grid[neighbor.j][neighbor.i].walls[1] = false;
    }
};
}

