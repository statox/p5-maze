const toXY = (x) => x * W / COL;

const newGrid = () => {
    for (let j=0; j<COL; j++) {
        grid[j] = [];
        for (let i=0; i<COL; i++) {
            grid[j].push(new Cell(i, j));
        }
    }

    grid[0][0].makeStart();
    grid[COL-1][COL-1].makeFinish();
};

const showGrid = () => {
    grid.flat().forEach(cell => cell.show());
}

const W=900;
let COL=25;
let TOTAL_CELLS = COL*COL;
const grid = [];
let pause;
let generator;
let solvers;
let nextTick;
let showGeneration = false;
let showSolving = true;
let customFrameRate = 60;
let showVisitedCells = false;
let solversStats;

let enabledSolvers = {
    'BFS': true,
    'DFS': true,
    'Euristic': true,
    'WallFollower': true
}

function resetMaze() {
    TOTAL_CELLS = COL*COL;

    newGrid();
    generator = new Generator();

    solvers = [];

    if (enabledSolvers['DFS']) {
        solvers.push(new SolverDFS());
    }
    if (enabledSolvers['BFS']) {
        solvers.push(new SolverBFS());
    }
    if (enabledSolvers['Euristic']) {
        solvers.push(new SolverEuristic());
    }
    if (enabledSolvers['WallFollower']) {
        solvers.push(new SolverWallFollower());
    }

    pause = false;
}

function setup() {
    // Create the canvas and put it in its div
    var myCanvas = createCanvas(W, W);
    myCanvas.parent("canvasDiv");

    initializeInterface();
    resetMaze();
}

function draw() {
    background(0);

    // Change the animation speed
    frameRate(customFrameRate);

    // Show the grid
    showGrid();

    // Generate the maze either step by step to show the generation
    // or all at one to show only the solving
    if (!generator.isWorkDone && !pause) {
        if (showGeneration) {
            generator.iteration();
        } else {
            generator.generateFull();
        }
    }
    // Solve the maze step by step
    if (generator.isWorkDone && !pause) {
        solvers.filter(s => s.isWorkDone === false).forEach(solver => {
            if (showSolving) {
                solver.iteration();
            } else {
                solver.solveFull();
            }
        });

        // Get the stats and put them in the view
        solversStats = solvers.map(s => s.getStats());
        updateStats(solversStats)
    }
    // When the solving is done create a pause to show the result
    // for a few frames
    const allSolversDone = solvers.filter(s => s.isWorkDone === false).length === 0;
    if (generator.isWorkDone && allSolversDone && !pause) {
        pause = true;
        nextTick = millis() + (5 * 1000);

        solvers.forEach(s => s.iteration());
    }
    // When we paused long enough reset the maze and the solver
    if (pause && millis() > nextTick) {
        pause = false;

        resetMaze();
    }
}
