var scoreObj = 0;
var highScoreObj = 0;

function pad(num) {
    var s = "00000000" + num;
    return s.substr(s.length - 8);
}

window.onbeforeunload = function() {
    localStorage.setItem("HighScore", sessionStorage.getItem("HighScore"))
}

function start() {
    scoreObj = document.getElementById("score");
    highScoreObj = document.getElementById("highScore");
    sessionStorage.setItem("Score", "0")
    if (localStorage.getItem("HighScore") === null) {
        localStorage.setItem("HighScore", "0");
        sessionStorage.setItem("HighScore", "0");
    } else {
        sessionStorage.setItem("HighScore", localStorage.getItem("HighScore"));
    }

    update();
}

function update() {
    let score = sessionStorage.getItem("Score");
    let highScore = sessionStorage.getItem("HighScore");
    scoreObj.innerHTML = `Score: ${pad(score)}`;
    highScoreObj.innerHTML = `High Score: ${pad(highScore)}`;

    if (score >= highScore) {
        sessionStorage.setItem("HighScore", score.toString())
    }



    setTimeout(update, (1 / 60 * 1000));
}