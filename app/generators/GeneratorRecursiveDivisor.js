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

const makeWalls = (me, neighbor) => {
    if (neighbor.j < me.j) { // top
        grid[me.j][me.i].walls[0] = true;
        grid[neighbor.j][neighbor.i].walls[2] = true;
    }
    if (grid[neighbor.j][neighbor.i].i > grid[me.j][me.i].i) { // right
        grid[me.j][me.i].walls[1] = true;
        grid[neighbor.j][neighbor.i].walls[3] = true;
    }
    if (grid[neighbor.j][neighbor.i].j > grid[me.j][me.i].j) { // bottom
        grid[me.j][me.i].walls[2] = true;
        grid[neighbor.j][neighbor.i].walls[0] = true;
    }
    if (grid[neighbor.j][neighbor.i].i < grid[me.j][me.i].i) { // left
        grid[me.j][me.i].walls[3] = true;
        grid[neighbor.j][neighbor.i].walls[1] = true;
    }
};

const getGridColumn = (index, start, end) => {
    return grid.map(l => l[index]).slice(start, end);
}

const getGridLine = (index, start, end) => {
    return grid[index].slice(start, end);
}

const makeLine = ([startI, endI], j, exception) => {
    for (let i=startI; i<=endI; i++) {
        if (i !== exception && j>0) {
            makeWalls(grid[j][i], grid[j-1][i]);
        }
    }
}

const makeColumn = (i, [startJ, endJ], exception) => {
    for (let j=startJ; j<=endJ; j++) {
        if (j !== exception && i>0) {
            makeWalls(grid[j][i], grid[j][i-1]);
        }
    }
}

const getMiddleIndex = (a, b) => Math.floor(a + (b-a)/2);

function GeneratorRecursiveDivisor() {
    this.name = 'Recursive divisor';
    this.current = { i: 0, j: 0, di: COL-1, dj: COL-1 };
    this.stack = [this.current];
    this.isWorkDone = false;
    this.iterationCounter = 0;

    this.color = [20, 30, 40];

    // Make all the cells open
    for(let j=0; j<COL; j++) {
        for(let i=0; i<COL; i++) {
            grid[j][i].walls = [false, false, false, false];
        }
    }
    // but not the outer walls
    for (let x=0; x<COL; x++) {
        grid[0][x].walls[0]      = true; // top
        grid[x][COL-1].walls[1]  = true; // right
        grid[COL-1][x].walls[2]  = true; // bottom
        grid[x][0].walls[3]      = true; // left
    }

    this.iteration = () => {
        if (this.stack.length) {

            this.iterationCounter++;
            this.current = this.stack.pop();

            const {i, j, di, dj} = this.current;

            if (di > 1 && dj > 1) {
                const splitI = getMiddleIndex(i, i+di);
                const splitJ = getMiddleIndex(j, j+dj);

                makeColumn(splitI, [j, j+dj]);
                makeLine([i, i+di], splitJ);

                const zoneToClose = Math.floor(random(4));
                // const zoneToClose = 5;

                // top
                if (zoneToClose !== 0) {
                    const openJ = Math.floor(random(j, splitJ));
                    grid[openJ][splitI].makeWay('W');
                }
                // right
                if (zoneToClose !== 1) {
                    const openI = Math.floor(random(splitI, i+di));
                    grid[splitJ][openI].makeWay('N');
                }
                // bottom
                if (zoneToClose !== 2) {
                    const openJ = Math.floor(random(splitJ, j+dj));
                    grid[openJ][splitI].makeWay('W');
                }
                // left
                if (zoneToClose !== 3) {
                    const openI = Math.floor(random(i, splitI));
                    grid[splitJ][openI].makeWay('N');
                }

                // top left
                const childZones = [
                    // top left
                    {
                        i,
                        j,
                        di: splitI - i - 1,
                        dj: splitJ - j - 1 
                    },
                    // top right
                    {
                        i: splitI,
                        j,
                        di: i + di - splitI,
                        dj: splitJ - j - 1
                    },
                    // bottom right
                    {
                        i: splitI,
                        j: splitJ,
                        di: i + di - splitI,
                        dj: j + dj - splitJ
                    },
                    // bottom left
                    {
                        i: i,
                        j: splitJ,
                        di: splitI - i - 1,
                        dj: j + dj - splitJ
                    }
                ]
                this.stack.push( ...childZones);
            }

            return false;
        }

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

