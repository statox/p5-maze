// const toXY = (x) => x * W / COL;
const toXY = (x) => x+(x * W / COL);

const removeWalls = (me, neighbor) => {
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

function Cell(i, j) {
    this.i=i;
    this.j=j;
    this.visited = false;
    this.walls = [true, true, true, true];
    // this.walls = [false, false, false, false];

    this.show = () => {
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

        // mark the current one
        if (current && current.i === this.i && current.j === this.j) {
            fill(100, 0, 200);
            rect(toXY(this.i), toXY(this.j), toXY(1), toXY(1));
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
}


const W=700;
const COL=50;
const TOTAL_CELLS = COL*COL;
const grid = [];
const stack = [];
let current;
let visited;

function setup() {
    createCanvas(W*1.5, W*1.5);

    for (let j=0; j<COL; j++) {
        grid[j] = [];
        for (let i=0; i<COL; i++) {
            grid[j].push(new Cell(i, j));
        }
    }

    grid[0][0].visited = true;
    visited = 1;
    current = grid[0][0];
}

function draw() {
    // frameRate(5);
    background(0);

    grid.flat().forEach(cell => cell.show());

    console.log({visited, TOTAL_CELLS});
    if (visited < TOTAL_CELLS) {
        let neighbors = current.hasNeighbors();

        if (neighbors.length) {
            const index = Math.floor(Math.random() * neighbors.length);
            const neighbor = neighbors[index]

            stack.push(current);

            removeWalls(current, neighbor);
            current = neighbor;
            current.visited = true;
            visited++;
        } else if (stack.length) {
            current = stack.pop();
        }
    } else {
        current = undefined;
    }
}
