function Cell(i, j) {
    this.i=i;
    this.j=j;
    this.visited = false;
    this.isStart = false;
    this.isFinish = false;
    this.walls = [true, true, true, true];
    this.tmpColors = [];
    this.permanentColors = [];
    this.currentColor;
    this.isAlive = false;

    // Initialisations to do to mark the cell as the start of the maze
    this.makeStart = () => {
        this.isStart=true;
        this.walls[3] = false;
    };

    // Initialisations to do to mark the cell as the finish of the maze
    this.makeFinish = () => {
        this.isFinish=true;
        this.walls[1] = false;
    };

    // String representation to use in a Set
    this.getRep = () => [this.i, this.j].join(',')

    // Distance to the end of the maze used for euristics
    this.getDistanceToFinish = () => {
        return COL**2 - (this.i + COL * this.j);
    };

    this.show = () => {
        // mark the temporary colors
        while (this.tmpColors.length) {
            const [R, G, B] = this.tmpColors.pop();
            fill(R, G, B);
            noStroke();
            rect(toXY(this.i), toXY(this.j), toXY(1), toXY(1));
        }

        // mark the permanent colors
        for (let i=0; i<this.permanentColors.length; i++) {
            const [R, G, B] = this.permanentColors[i];
            fill(R, G, B, 90);
            noStroke();
            rect(toXY(this.i), toXY(this.j), toXY(1), toXY(1));
        }

        // mark the current one
        if (this.currentColor) {
            const [R, G, B] = this.currentColor;
            fill(R, G, B);
            noStroke();
            rect(toXY(this.i), toXY(this.j), toXY(1), toXY(1));
            this.currentColor = undefined;
        }

        // mark the cells with four walls as full
        if (this.isAlive && this.walls.filter(w => w === false).length === 0) {
            fill(255, 255, 255);
            noStroke();
            rect(toXY(this.i), toXY(this.j), toXY(1), toXY(1));
        }

        // mark the start
        if (this.isStart) {
            fill(50, 150, 50);
            noStroke();
            rect(toXY(this.i), toXY(this.j), toXY(1), toXY(1));
        }

        // mark the finish
        if (this.isFinish) {
            fill(150, 50, 50);
            noStroke();
            rect(toXY(this.i), toXY(this.j), toXY(1), toXY(1));
        }

        stroke(255);
        // top
        if (this.walls[0]) {
            line(toXY(this.i), toXY(this.j), toXY(this.i+1), toXY(this.j));
        }
        // right
        if (this.walls[1]) {
            line(toXY(this.i+1), toXY(this.j), toXY(this.i+1), toXY(this.j+1));
        }
        // bottom
        if (this.walls[2]) {
            line(toXY(this.i+1), toXY(this.j+1), toXY(this.i), toXY(this.j+1));
        }
        // left
        if (this.walls[3]) {
            line(toXY(this.i), toXY(this.j+1), toXY(this.i), toXY(this.j));
        }
    };

    // Return the list of unvisited neighbors cells
    this.hasNeighbors = () => {
        const neighbors = [];
        // top
        if (this.j>0 && !grid[this.j-1][this.i].visited) {
            neighbors.push(grid[this.j-1][this.i]);
        }
        // right
        if (this.i<COL-1 && !grid[this.j][this.i+1].visited) {
            neighbors.push(grid[this.j][this.i+1]);
        }
        // bottom
        if (this.j<COL-1 && !grid[this.j+1][this.i].visited) {
            neighbors.push(grid[this.j+1][this.i]);
        }
        // left
        if (this.i>0 && !grid[this.j][this.i-1].visited) {
            neighbors.push(grid[this.j][this.i-1]);
        }

        return neighbors;
    }

    // Return the number of alive neighbors from 0 to 8
    this.getAliveNeighbors = () => {
        const aliveNeighbors = [];
        if (this.j>0) {
            if (this.i>0) {
                aliveNeighbors.push(grid[this.j-1][this.i-1].isAlive);
            }
            aliveNeighbors.push(grid[this.j-1][this.i].isAlive);
            if (this.i<COL-1) {
                aliveNeighbors.push(grid[this.j-1][this.i+1].isAlive);
            }
        }
        if (this.i>0) {
            aliveNeighbors.push(grid[this.j][this.i-1].isAlive);
        }
        if (this.i<COL-1) {
            aliveNeighbors.push(grid[this.j][this.i+1].isAlive);
        }
        if (this.j<COL-1) {
            if (this.i>0) {
                aliveNeighbors.push(grid[this.j+1][this.i-1].isAlive);
            }
            aliveNeighbors.push(grid[this.j+1][this.i].isAlive);
            if (this.i<COL-1) {
                aliveNeighbors.push(grid[this.j+1][this.i+1].isAlive);
            }
        }

        return aliveNeighbors.filter(a => a === true).length;
    }

    // Return the list of neighbor cells with an open wall
    this.hasWays = () => {
        const neighbors = [];
        // top
        if (this.j>0 && !this.walls[0]) {
            neighbors.push(grid[this.j-1][this.i]);
        }
        // right
        if (this.i<COL-1 && !this.walls[1]) {
            neighbors.push(grid[this.j][this.i+1]);
        }
        // bottom
        if (this.j<COL-1 && !this.walls[2]) {
            neighbors.push(grid[this.j+1][this.i]);
        }
        // left
        if (this.i>0 && !this.walls[3]) {
            neighbors.push(grid[this.j][this.i-1]);
        }

        return neighbors;
    }

    // Return the cell on the required direction or undefined
    this.getWay = (way) => {
        // top
        if (way === 'N' && this.j>0 && !this.walls[0]) {
            return grid[this.j-1][this.i];
        }
        // right
        if (way === 'E' && this.i<COL-1 && !this.walls[1]) {
            return grid[this.j][this.i+1];
        }
        // bottom
        if (way === 'S' && this.j<COL-1 && !this.walls[2]) {
            return grid[this.j+1][this.i];
        }
        // left
        if (way === 'W' && this.i>0 && !this.walls[3]) {
            return grid[this.j][this.i-1];
        }
        return;
    }
}
