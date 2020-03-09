const makeCellAlive = (i, j) => {
    grid[j][i].isAlive = true;
    grid[j][i].walls = [true, true, true, true];

    // top
    if (j>0) {
        grid[j-1][i].walls[2] = true;
    }
    // right
    if (i<COL-1) {
        grid[j][i+1].walls[3] = true;
    }
    // bottom
    if (j<COL-1) {
        grid[j+1][i].walls[0] = true;
    }
    // left
    if (i>0) {
        grid[j][i-1].walls[1] = true;
    }
};

const makeCellDead = (i, j) => {
    grid[j][i].isAlive = false;
    grid[j][i].walls = [false, false, false, false];

    // top
    if (j>0) {
        grid[j-1][i].walls[2] = false;
    }
    // right
    if (i<COL-1) {
        grid[j][i+1].walls[3] = false;
    }
    // bottom
    if (j<COL-1) {
        grid[j+1][i].walls[0] = false;
    }
    // left
    if (i>0) {
        grid[j][i-1].walls[1] = false;
    }
};

/*
 * The B and S parameters represent the rules of the generator
 * B: int[] - number of alive neighbors required to make a dead cell alive
 * S: int[] - number of alive neighbors required to keep a cell alive
 */
function GeneratorCellularAutomata(B, S, name) {
    this.B = B;
    this.S = S;
    this.name = `Cellular automata - ${name || 'unamed'} - B${this.B.join('')}/S${this.S.join('')}`;
    this.current = grid[0][0];
    this.stack = [];
    this.isWorkDone = false;
    grid[0][0].visited = true;
    grid[0][0].isCurrent = true;

    this.maxInitialAliveCells = (COL**2)/4;
    this.iterationCounter = 0;
    this.maxIterations = 100;
    this.previousStates = new Set();
    this.looped = false;

    // Make all the cells dead
    for(let j=0; j<COL; j++) {
        for(let i=0; i<COL; i++) {
            grid[j][i].isAlive = false;
            grid[j][i].walls = [false, false, false, false];
        }
    }
    // Initial alive cells
    for (let _=0; _<this.maxInitialAliveCells; _++) {
        const randX = Math.floor(map(Math.random(), 0, 1, 0, COL));
        const randY = Math.floor(map(Math.random(), 0, 1, 0, COL));
        if (!grid[randY][randX].isStart && !grid[randY][randX].isFinish) {
            makeCellAlive(randX, randY);
        }
    }

    // Get a representation of the grid we can store
    this.getGridStateRep = () => {
        return grid.flat().map(c => c.isAlive ? '1' : '0').join(',');
    };

    this.iteration = () => {
        this.iterationCounter++;
        if (!this.previousStates.has(this.getGridStateRep(grid)) && this.iterationCounter < this.maxIterations) {
            // Store the state in a set
            const gridRep = this.getGridStateRep(grid);
            this.previousStates.add(gridRep);

            // Get the number of alive neighbors for each cell
            const neighborCounts = {};
            for (let j=0; j<COL; j++) {
                for (let i=0; i<COL; i++) {
                    const key = grid[j][i].getRep();
                    const count  = grid[j][i].getAliveNeighbors();
                    neighborCounts[key] = count;
                }
            }

            // Change the state of the cell if it follows the rules
            for (let j=0; j<COL; j++) {
                for (let i=0; i<COL; i++) {
                    const key = grid[j][i].getRep();
                    const count  = neighborCounts[key];

                    if (grid[j][i].isAlive) {
                        if (!this.S.includes(count)) {
                            makeCellDead(i, j);
                        }
                    } else {
                        if (this.B.includes(count)) {
                            makeCellAlive(i, j);
                        }
                    }
                }
            }

            return false;
        }

        // temporary fix to not close the first cell and the last one
        makeCellDead(0, 0);
        makeCellDead(0, 1);
        makeCellDead(1, 0);
        makeCellDead(1, 1);

        makeCellDead(COL-1, COL-1);
        makeCellDead(COL-2, COL-1);
        makeCellDead(COL-1, COL-2);
        makeCellDead(COL-2, COL-2);

        this.isWorkDone = true;
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

    this.generateFull = () => {
        while (!this.isWorkDone) {
            this.iteration();
        }
        this.cleanGrid();
    };
}

