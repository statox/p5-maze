function initializeInterface() {
    // Set the values of the different inputs on the page based on the default values
    document.getElementById("inputSize").value = COL;
    document.getElementById("inputShowGeneration").checked = showGeneration;
    document.getElementById("inputShowSolving").checked = showSolving;
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
