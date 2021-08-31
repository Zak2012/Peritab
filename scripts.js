var scoreObj = 0;
var highScoreObj = 0;
var frameObj = 0;
var homebtnObj = 0;
var installBtnObj = 0;
var resetbtnObj = 0;
var root = 0;

var isOnline = 0;
var score = localStorage.getItem("Score");
var highScore = localStorage.getItem("HighScore");

const buttonPressMs = 200;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
    console.log(`User response to the install prompt: ${outcome}`);
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

const CACHE_NAME = 'Page-Cache';
const urlsToCache = [
    "/",
    "/assets/github.png",
    "/assets/vercel.png",
    "/game/",
    "/game/2x2/",
    "/game/2x2/scripts.js",
    "/game/2x2/styles.css",
    "/game/4x4/",
    "/game/4x4/scripts.js",
    "/game/4x4/styles.css",
    "/game/styles.css",
    "/icons/download.png",
    "/icons/home.png",
    "/icons/settings.png",
    "/icons/trash.png",
    "/scripts.js",
    "/styles.css",
];

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
    root = document.querySelector(":root");
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

    if (localStorage.getItem("isLeaving") != "false") {
        updateCache();
    }
    getElmId();

    installBtnObj.style.display = "none";

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