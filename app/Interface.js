function initializeInterface() {
    // Set the values of the different inputs on the page based on the default values
    document.getElementById("inputSize").value = COL;
    document.getElementById("inputShowGeneration").checked = showGeneration;
    document.getElementById("inputShowSolving").checked = showSolving;
    document.getElementById("inputEnableBFSSolver").checked = enabledSolvers['BFS'];
    document.getElementById("inputEnableDFSSolver").checked = enabledSolvers['DFS'];
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
