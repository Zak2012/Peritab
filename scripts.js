var scoreObj = 0;
var highScoreObj = 0;
var menuBtnObj = 0;
var frameObj = 0;
var root = 0;

var isMenuOpen = 0;
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

function option() {
    if (isMenuOpen) {
        root_set("--option-opacity", "0");
        isMenuOpen = false
        menuBtnObj.style.backgroundImage = "url('/icons/right.png')";
    } else {
        root_set("--option-opacity", "1");
        isMenuOpen = true
        menuBtnObj.style.backgroundImage = "url('/icons/left.png')";
    }

}

function optionChild(index) {
    if (isMenuOpen) {
        isLeaving = false;
        switch (index) {
            case 0:
                window.location.href = MENU[0];
                break;
            case 1:
                window.location.reload();
                break;
            case 2:
                break;
            case 3:
                break;
        }
        root_set("--option-opacity", "0");
        isMenuOpen = false
        menuBtnObj.style.backgroundImage = "url('/icons/right.png')";
    }
}

function loadCache() {
    //window.location.href = "/icons"
}

window.onbeforeunload = function() {
    if (isLeaving) {
        localStorage.setItem("Score", "0");
    }
}

window.addEventListener('offline', function(e) { isOnline = false; });

window.addEventListener('online', function(e) { isOnline = true; });

async function start() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
    }

    isLeaving = true;
    frameObj = document.getElementById("game");
    scoreObj = document.getElementById("score");
    highScoreObj = document.getElementById("high-score");
    menuBtnObj = document.getElementById("menu-button");
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

    let optionOpacity = root_get("--option-opacity");
    if (optionOpacity === "1") {
        isMenuOpen = true;
        menuBtnObj.style.ba
        menuBtnObj.style.backgroundImage = "url('/icons/left.png')";
    } else {
        isMenuOpen = false;
        menuBtnObj.style.backgroundImage = "url('/icons/right.png')";
    }

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

    setTimeout(update, (1 / 60 * 1000));
}