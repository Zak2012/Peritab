var scoreObj = 0;
var highScoreObj = 0;
var frameObj = 0;
var root = 0;

var isLeaving = 0;
var isOnline = 0;
var score = localStorage.getItem("Score");
var highScore = localStorage.getItem("HighScore");

const MENU = ["/settings", "/info", "/game"]

function pad(num) {
    var s = "00000000" + num;
    return s.substr(s.length - 8);
}

function root_get(property) {
    let rs = getComputedStyle(root);
    return rs.getPropertyValue(property);
}

function root_set(property, value) {
    root.style.setProperty(property, value);
}

function home() {
    frameObj.src = "/game"
}

function confirmReset() {
    let reset = confirm("You sure you want to reset all? \n\nCaution: This action cannot be undone");
    if (reset) {
        let reset2 = confirm("Do you sure you want to continue? \n\nCaution: This action cannot be undone");
        if (reset2) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload()
            window.location.href = "/"
        }
    }
}

window.onbeforeunload = function() {
    if (isLeaving) {
        localStorage.setItem("Score", "0");
    }
}

async function start() {
    isOnline = window.navigator.onLine;
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
    }

    isLeaving = true;
    frameObj = document.getElementById("game");
    scoreObj = document.getElementById("score");
    highScoreObj = document.getElementById("high-score");
    root = document.querySelector(":root");
    localStorage.setItem("isLeaving", "true");

    highScore = localStorage.getItem("HighScore");
    score = localStorage.getItem("Score");

    if (score == null || highScore == null) {
        localStorage.setItem("HighScore", 0)
        localStorage.setItem("Score", 0)
    }

    highScore = localStorage.getItem("HighScore");
    score = localStorage.getItem("Score");


    highScoreObj.innerHTML = `High Score: ${pad(highScore)}`;
    scoreObj.innerHTML = `Score: ${pad(score)}`;

    update();
}

function update() {
    if (score != localStorage.getItem("Score")) {
        score = localStorage.getItem("Score");
        scoreObj.innerHTML = `Score: ${pad(score)}`;
    }
    if (highScore != localStorage.getItem("HighScore")) {
        highScore = localStorage.getItem("HighScore");
        highScoreObj.innerHTML = `High Score: ${pad(highScore)}`;
    }
    if (score >= highScore) {
        localStorage.setItem("HighScore", score)
    }
    if (window.navigator.onLine != isOnline) {
        isOnline = window.navigator.onLine;
    }

    setTimeout(update, (1 / 60 * 1000));
}