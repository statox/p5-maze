function Cell(i, j) {
    this.i=i;
    this.j=j;
    this.visited = false;
    this.isCurrent = false;
    this.isStart = false;
    this.isFinish = false;
    this.isInPath = false;
    this.walls = [true, true, true, true];
    this.tmpColors = [];
    this.permanentColors = [];

    this.makeStart = () => {
        this.isStart=true;
        this.walls[3] = false;
    };

    this.makeFinish = () => {
        this.isFinish=true;
        this.walls[1] = false;
    };

    // String representation to use in a Set
    this.getRep = () => [this.i, this.j].join(',')

    this.show = () => {
        // mark the cells in path
        if (this.isInPath) {
            fill(150, 150, 50);
            noStroke();
            rect(toXY(this.i), toXY(this.j), toXY(1), toXY(1));
        }

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
        if (this.isCurrent) {
            fill(100, 0, 200);
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

    // Cells with an open wall
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
}
