var scoreObj = 0;
var highScoreObj = 0;
var root = 0;
var menuBtnObj = 0;

var isMenuOpen = 0;
var score = sessionStorage.getItem("Score");
var highScore = sessionStorage.getItem("HighScore");

const MENU = ["/run/settings", "/run/info"]

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
        menuBtnObj.innerHTML = "+";
    } else {
        root_set("--option-opacity", "1");
        isMenuOpen = true
        menuBtnObj.innerHTML = "~";
    }

}

function optionChild(index) {
    if (isMenuOpen) {
        localStorage.setItem("isLeaving", "false");
        if (index < 2) {
            window.location.href = MENU[index];
        } else {
            window.location.reload()
        }
    }
}

window.onbeforeunload = function() {
    localStorage.setItem("HighScore", sessionStorage.getItem("HighScore"))

    if (localStorage.getItem("isLeaving") === "true") {
        localStorage.setItem("Score", "0");
    } else {
        localStorage.setItem("Score", sessionStorage.getItem("Score"))
    }
}

function start() {
    scoreObj = document.getElementById("score");
    highScoreObj = document.getElementById("high-score");
    root = document.querySelector(":root");
    menuBtnObj = document.getElementById("menu-button");
    localStorage.setItem("isLeaving", "true");

    sessionStorage.setItem("Score", localStorage.getItem("Score"))

    if (localStorage.getItem("HighScore") === null) {
        localStorage.setItem("HighScore", "0");
        sessionStorage.setItem("HighScore", "0");
    } else {
        sessionStorage.setItem("HighScore", localStorage.getItem("HighScore"));
    }
    highScore = sessionStorage.getItem("HighScore");
    score = sessionStorage.getItem("Score");

    highScoreObj.innerHTML = `High Score: ${pad(highScore)}`;
    scoreObj.innerHTML = `Score: ${pad(score)}`;

    let optionOpacity = root_get("--option-opacity");
    if (optionOpacity === "1") {
        isMenuOpen = true;
        menuBtnObj.innerHTML = "~";
    } else {
        isMenuOpen = false;
        menuBtnObj.innerHTML = "+";
    }
    update();
}

function update() {
    if (score != sessionStorage.getItem("Score")) {
        score = sessionStorage.getItem("Score");
        scoreObj.innerHTML = `Score: ${pad(score)}`;
        if (score >= highScore) {
            sessionStorage.setItem("HighScore", score.toString())
        }
    }
    if (highScore != sessionStorage.getItem("HighScore")) {
        highScore = sessionStorage.getItem("HighScore");
        highScoreObj.innerHTML = `High Score: ${pad(highScore)}`;


    }



    setTimeout(update, (1 / 60 * 1000));
}