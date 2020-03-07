function initializeInterface() {
    // Set the values of the different inputs on the page based on the default values
    document.getElementById("inputSize").value = COL;

    document.getElementById("inputShowGeneration").checked = showGeneration;
    document.getElementById("inputShowSolving").checked = showSolving;

    document.getElementById("inputEnableRecursiveBacktrackerGenerator").checked = enabledGenerators['RecursiveBacktracker'];
    document.getElementById("inputEnableCellularAutomataGenerator").checked = enabledGenerators['CellularAutomata'];

    document.getElementById("inputEnableBFSSolver").checked = enabledSolvers['BFS'];
    document.getElementById("inputEnableDFSSolver").checked = enabledSolvers['DFS'];
    document.getElementById("inputEnableEuristicSolver").checked = enabledSolvers['Euristic'];
    document.getElementById("inputEnableWallFollowerSolver").checked = enabledSolvers['WallFollower'];

    document.getElementById("inputFrameRate").value = customFrameRate;
    document.getElementById("inputShowVisitedCells").value = showVisitedCells;
}

function setSize() {
    let newValue = document.getElementById("inputSize").value;
    COL = Math.max(newValue, 1);
    resetMaze();
}

function setShowGeneration(button) {
    showGeneration = button.checked;
}

function setShowSolving(button) {
    showSolving = button.checked;
}

function setSolverEnabling(solverName, button) {
    enabledSolvers[solverName] = button.checked;
    resetMaze();
}

function setGeneratorEnabling(generatorName, button) {
    enabledGenerators[generatorName] = button.checked;
    if (Object.values(enabledGenerators).filter(e => e===true).length === 0) {
        enabledGenerators['RecursiveBacktracker'] = true;
        document.getElementById("inputEnableRecursiveBacktrackerGenerator").checked = true;
    }
}

function setAnimationFrameRate () {
    let newValue = document.getElementById("inputFrameRate").value;
    customFrameRate = Math.max(newValue, 1);
}

function setShowVisitedCells(button) {
    showVisitedCells = button.checked;
    resetMaze();
}

function updateStats (stats) {
    const statsTable = document.getElementById("stats-table");
    while (statsTable.lastElementChild) {
        statsTable.removeChild(statsTable.lastElementChild);
    }

    stats.sort((s1, s2) => s1.name - s2.name).forEach(s => {
        var row = document.createElement('tr');
        row.className += ' row';

        var nameCol = document.createElement('td');
        nameCol.className += ' col-sm-6';
        nameCol.appendChild(document.createTextNode(s.name));
        var iterationsCol = document.createElement('td');
        iterationsCol.className += ' col-sm-6';
        iterationsCol.appendChild(document.createTextNode(s.iterations));

        row.appendChild(nameCol);
        row.appendChild(iterationsCol);
        statsTable.appendChild(row);
    });
}
