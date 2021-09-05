var scoreObj;
var highScoreObj;
var frameObj;
var homebtnObj;
var installBtnObj;
var resetbtnObj;
var root;
var nav;
var isOnline;

var score = localStorage.getItem("Score");
var highScore = localStorage.getItem("HighScore");

const buttonPressMs = 200;

readTextFile("/navigation.json", function(text) {
    localStorage.setItem("navigation", text)
});

nav = JSON.parse(localStorage.getItem("navigation"))

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pad(num) {
    var s = "00000000" + num;
    return s.substr(s.length - 8);
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

async function home() {
    homebtnObj.style.backgroundColor = "#ffffff88"
    homebtnObj.style.filter = "none"
    homebtnObj.style.webkitFilter = "none"
    window.location.replace("/#main")
    frameObj.src = "/game/"
    await sleep(buttonPressMs)
    homebtnObj.style.backgroundColor = "#b0b0b088"
    homebtnObj.style.filter = "invert()"
    homebtnObj.style.webkitFilter = "invert()"
}

async function confirmReset() {
    resetbtnObj.style.backgroundColor = "#ffaaaa"
    await sleep(buttonPressMs)
    resetbtnObj.style.backgroundColor = "#ff5555"
    await sleep(10)
    let reset = confirm("You sure you want to reset all? \n\nCaution: This action cannot be undone");
    if (reset) {
        let reset2 = confirm("Do you sure you want to continue? \n\nCaution: This action cannot be undone");
        if (reset2) {
            localStorage.setItem("Score", "0");
            localStorage.setItem("HighScore", "0");
            localStorage.setItem("isLeaving", "false")
            window.location.reload()
            window.location.href = "/"
        }
    }
}

let deferredPrompt;

async function install() {
    installBtnObj.style.backgroundColor = "#aaffaa"
    await sleep(buttonPressMs)
    installBtnObj.style.backgroundColor = "#55ff55"
    await sleep(10)
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtnObj.style.display = "unset";
});

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    localStorage.setItem("isLeaving", "false")
    window.location.reload();
});

var cards = nav.cards.concat(nav.cardsMatch);

const CACHE_NAME = 'Page-Cache';
const urlsToCache = nav.cache.concat(cards);

function deleteCache() {
    caches.delete(CACHE_NAME)
}

function loadCache(e) {
    e.addAll(urlsToCache);
}

function updateCache() {
    if (isOnline) {
        deleteCache();
        caches.open(CACHE_NAME).then(function(e) {
            loadCache(e);
        })
    }
}

function setScore() {
    highScore = localStorage.getItem("HighScore");
    score = localStorage.getItem("Score");

    if (score == null || highScore == null) {
        localStorage.setItem("HighScore", "0")
        localStorage.setItem("Score", "0")
    }

    highScore = localStorage.getItem("HighScore");
    score = localStorage.getItem("Score");


    highScoreObj.innerHTML = `High Score: ${pad(highScore)}`;
    scoreObj.innerHTML = `Score: ${pad(score)}`;
}

function getElmId() {
    frameObj = document.getElementById("game");
    scoreObj = document.getElementById("score");
    highScoreObj = document.getElementById("high-score");
    installBtnObj = document.getElementById("install");
    resetbtnObj = document.getElementById("reset");
    homebtnObj = document.getElementById("home");
}

window.onbeforeunload = function() {
    if (localStorage.getItem("isLeaving") == "true") {
        localStorage.setItem("Score", "0");
    }
    localStorage.setItem("isLeaving", "true")
}

function setCSS() {
    installBtnObj.style.display = "none";
}

function start() {
    isOnline = window.navigator.onLine;
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
    }

    if (localStorage.getItem("isLeaving") == "true") {
        updateCache();
    }

    getElmId();
    setCSS();

    setScore();
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