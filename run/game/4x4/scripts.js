var cardDoc = arrayInit(16);
var cardFlipped = arrayInit(cardDoc.length, false);
var cardFinished = arrayInit(cardDoc.length, false);
var isFinish = 0;
var cardValue = arrayInit(cardDoc.length);
var cardBg = arrayInit(cardDoc.lenght);
var cardMatchBg = arrayInit(cardDoc.lenght)
var cardDefaultBg = "#ffffff";
var cardFlipBg = [
    "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff", "#44ffaa", "#aa44ff",
    "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff", "#44ffaa", "#aa44ff"
];
var score = localStorage.getItem("Score");
var lastCard = null;
var curCard = 0;

function randRange(start, stop) {
    return Math.floor(Math.random() * (stop - start + 1)) + start;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function arrayInit(n, val = 0) {
    let a = [];
    for (let i = 0; i < n; i++) {
        a.push(val);
    }
    return a;
}

function cardFlip(card) {
    curCard = card;
    if (!cardFinished[card]) {
        cardIndex = index(cardFlipped, true);
        cardFlipped[card] = !cardFlipped[card]
        if (count(cardFlipped, true) <= 2) {
            checkCard();
        } else {
            for (let i = 0; i < cardIndex.length; i++) {
                cardFlipped[cardIndex[i]] = !cardFlipped[cardIndex[i]];
            }
        }
    }
    lastCard = curCard;
}

async function checkCard() {
    let cdIndex = index(cardFlipped, true);
    let cdVal0 = cardValue[curCard];
    let cdVal1 = cardValue[lastCard];
    if (cdIndex[0] === lastCard && cdIndex[1] === curCard || cdIndex[0] === curCard && cdIndex[1] === lastCard) {
        await sleep(500)
        if (cdVal0 === cdVal1) {
            for (let i = 0; i < 2; i++) {
                cardFlipped[cdIndex[i]] = true;
                cardDoc[cdIndex[i]].style.opacity = 0;
                cardFinished[cdIndex[i]] = true;
                isFinish++;
            }
            score++;
            localStorage.setItem("Score", score)
        } else {
            for (let i = 0; i < 2; i++) {
                cardFlipped[cdIndex[i]] = false;
            }
        }
    }

}

function count(arr, item) {
    let itemCount = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
            itemCount++;
        }
    }
    return itemCount;
}

function index(arr, item) {
    let itemIndex = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == item) {
            itemIndex.push(i);
        }
    }
    return itemIndex;
}
async function reset() {
    randomizeCard();

    isFinish = 0;
    cardFinished = arrayInit(cardDoc.length, false);
    cardFlipped = arrayInit(cardDoc.length, false);
    localStorage.setItem("Score", Number(localStorage.getItem("Score")))
    await sleep(100);
    for (let i = 0; i < cardDoc.length; i++) {
        cardDoc[i].style.opacity = 1;
    }
}

function randomizeCard() {
    let cardTempIndex = arrayInit(cardDoc.length);

    for (let i = 0; i < cardDoc.length; i++) {
        cardTempIndex[i] = i;
    }

    for (let i = 0; i < cardDoc.length; i++) {
        let temp = randRange(0, cardTempIndex.length - 1);
        cardBg[i] = cardTempIndex[temp];
        cardValue[i] = cardMatchBg[cardTempIndex[temp]]
        cardTempIndex.splice(temp, 1);
    }
}

function start() {
    for (let i = 0; i < cardDoc.length; i++) {
        cardMatchBg[i] = i % (cardDoc.length / 2);
    }
    for (let i = 0; i < cardDoc.length; i++) {
        cardDoc[i] = document.getElementById(`card-${i}`);
    }
    randomizeCard();
    update();
}
async function update() {
    for (let i = 0; i < cardDoc.length; i++) {
        if (cardFlipped[i]) {
            cardDoc[i].style.backgroundColor = cardFlipBg[cardBg[i]];
        } else {
            cardDoc[i].style.backgroundColor = cardDefaultBg;
        }
    }
    if (isFinish == cardDoc.length) {
        await reset();
    }

    setTimeout(update, (1 / 60 * 1000));
}