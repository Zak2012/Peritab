var scoreObj = 0;
var highScoreObj = 0;
var optionObj = 0;

var isOptionOpened = false;
var score = sessionStorage.getItem("Score");
var highScore = sessionStorage.getItem("HighScore");

function pad(num) {
    var s = "00000000" + num;
    return s.substr(s.length - 8);
}

function option() {
    let optionWidth = "50px"
    if (isOptionOpened) {
        optionObj.style.width = "0px"
        isOptionOpened = false
    } else {
        optionObj.style.width = optionWidth;
        isOptionOpened = true
    }
}

window.onbeforeunload = function() {
    localStorage.setItem("HighScore", sessionStorage.getItem("HighScore"))
}

function start() {
    scoreObj = document.getElementById("score");
    highScoreObj = document.getElementById("high-score");
    optionObj = document.getElementById("option-container");
    optionObj.style.width = "0px"

    sessionStorage.setItem("Score", "0")
    if (localStorage.getItem("HighScore") === null) {
        localStorage.setItem("HighScore", "0");
        sessionStorage.setItem("HighScore", "0");
    } else {
        sessionStorage.setItem("HighScore", localStorage.getItem("HighScore"));
    }
    highScoreObj.innerHTML = `High Score: ${pad(highScore)}`;
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