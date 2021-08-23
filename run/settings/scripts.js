var root = 0;

var confirmation = false;

function root_get(property) {
    let rs = getComputedStyle(root);
    return rs.getPropertyValue(property);
}

function root_set(property, value) {
    root.style.setProperty(property, value);
}

function home() {
    window.history.back();
}

function check_confirmation() {
    root_set("--confirmation-opacity", "1")
    confirmation = true;
}

function confirmReset() {
    root_set("--confirmation-opacity", "0")
    confirmation = false;
    sessionStorage.setItem("HighScore", "0");
    sessionStorage.setItem("Score", "0");
    localStorage.setItem("HighScore", "0");
    localStorage.setItem("Score", "0");
}

function cancelReset() {
    root_set("--confirmation-opacity", "0")
    confirmation = false;
}

function start() {
    root = document.querySelector(":root");
}