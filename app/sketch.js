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

const W=900;
let COL=10;
let TOTAL_CELLS = COL*COL;
const grid = [];
let pause;
let generator;
let nextTick;
let showGeneration = true;
let showSolving = true;

function resetMaze() {
    pause = false;

    TOTAL_CELLS = COL*COL;
    newGrid();
    generator = new Generator();
    solver = new Solver();

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

    // Show the grid
    grid.flat().forEach(cell => cell.show());

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
    if (generator.isWorkDone && !solver.isWorkDone && !pause) {
        if (showSolving) {
            solver.iteration();
        } else {
            solver.solveFull();
        }
    }
    // When the solving is done create a pause to show the result
    // for a few frames
    if (generator.isWorkDone && solver.isWorkDone && !pause) {
        pause = true;
        nextTick = frameCount + 120;
        solver.iteration();
    }
    // When we paused long enough reset the maze and the solver
    if (pause && frameCount > nextTick) {
        pause = false;

        newGrid();
        generator = new Generator();
        solver = new Solver();
    }
}
