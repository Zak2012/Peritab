var cardDoc = arrayInit(4);
var cardFlipped = arrayInit(cardDoc.length, false);
var cardFinished = arrayInit(cardDoc.length, false);
var cardIndex = 0;
var isFinish = 0;
var cardValue = arrayInit(cardDoc.length);
var cardDefaultBg = "#ffffff";
var cardFlipBg = ["#ff0000", "#00ff00"];
var score = sessionStorage.getItem("Score");
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
            sessionStorage.setItem("Score", score.toString())
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
    await sleep(100);
    for (let i = 0; i < cardDoc.length; i++) {
        cardDoc[i].style.opacity = 1;
    }
}

function randomizeCard() {
    var cardTempIndex = arrayInit(cardDoc.length);
    for (let i = 0; i < cardDoc.length; i++) {
        cardTempIndex[i] = i;
    }

    cardValue = arrayInit(cardDoc.length);

    let temp1 = randRange(0, cardTempIndex.length - 1);
    let cardIndex1 = cardTempIndex[temp1];
    cardTempIndex.splice(cardIndex1, 1);

    let temp2 = randRange(0, cardTempIndex.length - 1);
    let cardIndex2 = cardTempIndex[temp2];
    cardTempIndex.splice(cardIndex2, 1);

    cardValue[cardIndex1] = 1;
    cardValue[cardIndex2] = 1;
}

function start() {
    for (let i = 0; i < cardDoc.length; i++) {
        cardDoc[i] = document.getElementById(`card-${i}`);
    }
    randomizeCard();
    update();
}
async function update() {
    for (let i = 0; i < cardFlipped.length; i++) {
        if (cardFlipped[i]) {
            cardDoc[i].style.backgroundColor = cardFlipBg[cardValue[i]];
        } else {
            cardDoc[i].style.backgroundColor = cardDefaultBg;
        }
    }
    if (isFinish == cardDoc.length) {
        await reset();
    }

    setTimeout(update, (1 / 60 * 1000));
}