const frameObj = document.getElementById("game");
const scoreObj = document.getElementById("score");
const highScoreObj = document.getElementById("high-score");
const installBtnObj = document.getElementById("install");
const resetbtnObj = document.getElementById("reset");
const homebtnObj = document.getElementById("home");
const volumeSliderObj = document.getElementById("sound-slider");
const volumeSliderTxtObj = document.getElementById("sound-slider-value");
const volumeSliderPicObj = document.getElementById("sound-slider-pic");
const sectionObj = document.getElementById("main");

readTextFile("/navigation.json", function(text) {
    localStorage.setItem("navigation", text);
});

const nav = JSON.parse(localStorage.getItem("navigation"));

if (localStorage.getItem("first?") != "no") {
    localStorage.setItem("first?", "no")
    window.location.reload();
}

const sound = loadSound();

var isOnline = window.navigator.onLine;
var score = localStorage.getItem("Score");
var highScore = localStorage.getItem("HighScore");

const cacheName = "Page-Cache";
const urlsToCache = nav.cache.concat(nav.cards.concat(nav.cardsMatch).concat(nav.sounds).concat(nav.icons));

const buttonPressMs = 200;


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
}

if (localStorage.getItem("isLeaving") == "true") {
    if (isOnline) {
        deleteCache();
        caches.open(cacheName).then(function(e) {
            loadCache(e);
        })
    }
}

function loadSound() {
    let sound = arrayInit(nav.sounds.length);
    for (let i = 0; i < sound.length; i++) {
        sound[i] = new Audio(nav.sounds[i]);
    }
    return sound
}

function setVolume() {
    volume = localStorage.getItem("volume")
    for (let i = 0; i < sound.length; i++) {
        sound[i].volume = volume / 100;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pad(num) {
    var s = "00000000" + num;
    return s.substr(s.length - 8);
}

function arrayInit(n, val = 0) {
    let a = [];
    for (let i = 0; i < n; i++) {
        a.push(val);
    }
    return a;
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
    window.location.replace("/#main")
    frameObj.src = "/game.html"
    await sleep(buttonPressMs)
    homebtnObj.style.backgroundColor = "#4f4f4f77"
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

var deferredPrompt;

async function install() {
    installBtnObj.style.backgroundColor = "#aaffaa"
    await sleep(buttonPressMs)
    installBtnObj.style.backgroundColor = "#55ff55"
    await sleep(10)
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
}

function deleteCache() {
    caches.delete(cacheName)
}

function loadCache(e) {
    e.addAll(urlsToCache);
}

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

window.onbeforeunload = function() {
    if (localStorage.getItem("isLeaving") == "true") {
        localStorage.setItem("Score", "0");
    }
    localStorage.setItem("isLeaving", "true")
}

window.addEventListener('online', function() {
    isOnline = window.navigator.onLine;

});

window.addEventListener('offline', function() {
    isOnline = window.navigator.onLine;

});

document.addEventListener('scroll', function() {
    var scroll = window.scrollY;
    var winHeight = sectionObj.clientHeight;
    if (scroll == 0) {
        document.title = "Game - Peritab";
    } else if (scroll <= winHeight * 1) {
        document.title = "Settings - Peritab";
    } else if (scroll <= winHeight * 2) {
        document.title = "Infos - Peritab";
    } else {
        document.title = "Peritab";
    }

});

const button = document.querySelector("button");
button.addEventListener("click", function() {
    sound[0].play();
});

volumeSliderObj.addEventListener("input", function() {
    localStorage.setItem("volume", volumeSliderObj.value)
    volumeSliderTxtObj.innerHTML = `${localStorage.getItem("volume")}%`
    setVolume()
    if (volumeSliderObj.value > 50) {
        volumeSliderPicObj.src = nav.icons[6]
    } else if (volumeSliderObj.value == 0) {
        volumeSliderPicObj.src = nav.icons[4]
    } else {
        volumeSliderPicObj.src = nav.icons[5]
    }
});

window.addEventListener('storage', () => {
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
});