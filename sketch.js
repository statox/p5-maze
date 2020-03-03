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

const W=650;
const COL=30;
const TOTAL_CELLS = COL*COL;
const grid = [];
const stack = [];
let generationDone;
let solvingDone;
let pause;
let generator;
let nextTick;

function setup() {
    createCanvas(W*1.5, W*1.5);

    newGrid();
    generator = new Generator();
    solver = new Solver();

    generationDone = false;
    solvingDone = false;
    pause = false;

    // Generate a grid before showing stuff
    // generator.generateAll();
}

function draw() {
    // frameRate(2);
    background(0);

    grid.flat().forEach(cell => cell.show());

    if (!generationDone && !pause) {
        generationDone = generator.iteration();
    }
    if (generationDone && !solvingDone && !pause) {
        solvingDone = solver.iteration();
    }
    if (generationDone && solvingDone && !pause) {
        pause = true;
        nextTick = frameCount + 120;
    }
    console.log({pause, frameCount, nextTick});
    if (pause && frameCount > nextTick) {
        pause = false;
        // Create a new maze
        newGrid();
        generator = new Generator();
        solver = new Solver();

        generationDone = false;
        solvingDone = false;
    }

}
