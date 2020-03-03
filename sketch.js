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

const W=1500;
const COL=50;
const TOTAL_CELLS = COL*COL;
const grid = [];
const stack = [];
let generationDone;
let solvingDone;
let pause;
let generator;
let nextTick;
let showGeneration;
let showSolving;

function setup() {
    createCanvas(W, W);

    newGrid();
    generator = new Generator();
    solver = new Solver();

    generationDone = false;
    solvingDone = false;
    pause = false;
    showGeneration = false;
    showSolving = true;
}

function draw() {
    background(0);

    // Show the grid
    grid.flat().forEach(cell => cell.show());

    // Generate the maze either step by step to show the generation
    // or all at one to show only the solving
    if (!generationDone && !pause) {
        if (showGeneration) {
            generationDone = generator.iteration();
        } else {
            while (!generationDone) {
                generationDone = generator.iteration();
            }
        }
    }
    // Solve the maze step by step
    if (generationDone && !solvingDone && !pause) {
        if (showSolving) {
            solvingDone = solver.iteration();
        } else {
            while (!solvingDone) {
                solvingDone = solver.iteration();
            }
        }
    }
    // When the solving is done create a pause to show the result
    // for a few frames
    if (generationDone && solvingDone && !pause) {
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

        generationDone = false;
        solvingDone = false;
    }
}
