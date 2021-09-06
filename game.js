var cardObj = [];
var cardFlipped = [];
var cardFinished = [];
var isFinish = 0;
var cardValue;
var cardBg = [];
var cardMatchBg = [];
var lastCard;
var curCard;
var root;
var btnObj2x2;
var btnObj4x4;
var cardFlipBg = [];
var cardDefaultBg = "#ffffff";
var score = localStorage.getItem("Score");
var nav = JSON.parse(localStorage.getItem("navigation"));
var sound = loadSound()

function loadSound() {
    let sound = arrayInit(nav.sounds.length);
    for (let i = 0; i < sound.length; i++) {
        sound[i] = new Audio(nav.sounds[i]);
    }
    return sound
}

function randRange(start, stop) {
    return Math.floor(Math.random() * (stop - start + 1)) + start;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function root_get(property) {
    let rs = getComputedStyle(root);
    return rs.getPropertyValue(property);
}

function root_set(property, value) {
    root.style.setProperty(property, value);
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
        changeCardImg(card);
        if (count(cardFlipped, true) <= 2) {
            checkCard();
        } else {
            for (let i = 0; i < cardIndex.length; i++) {
                cardFlipped[cardIndex[i]] = !cardFlipped[cardIndex[i]];
                changeCardImg(cardIndex[i]);
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
                changeCardImg(cdIndex[i])
                cardObj[cdIndex[i]].style.display = "none";
                cardFinished[cdIndex[i]] = true;
                isFinish++;
                if (isFinish == cardObj.length) {
                    reset();
                }
            }
            score++;
            localStorage.setItem("Score", score)
        } else {
            for (let i = 0; i < 2; i++) {
                cardFlipped[cdIndex[i]] = false;
                changeCardImg(cdIndex[i])
            }
        }
    }

}

function changeCardImg(index) {
    cardObj[index].style.backgroundImage = cardFlipped[index] ? cardFlipBg[cardBg[index]] : "none"
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
    cardFinished = arrayInit(cardObj.length, false);
    cardFlipped = arrayInit(cardObj.length, false);


    await sleep(100);

    for (let i = 0; i < cardObj.length; i++) {
        changeCardImg(i)
        cardObj[i].style.display = "unset";
    }
}

function randomizeCard() {
    let cardTempIndex = arrayInit(cardObj.length);

    let cardTemp = arrayInit(cardObj.length / 2);
    let cardTempM = arrayInit(cardObj.length / 2);
    let cardTemp2 = nav.cards;
    let cardTempM2 = nav.cardsMatch;


    for (let i = 0; i < cardTemp.length; i++) {
        let temp = randRange(0, cardTemp2.length - 1);
        cardTemp[i] = cardTemp2[temp];
        cardTempM[i] = cardTempM2[temp];
        cardTemp2.splice(temp, 1);
        cardTempM2.splice(temp, 1);
    }


    cardFlipBg = [];
    for (let i = 0; i < cardObj.length / 2; i++) {
        cardFlipBg.push(`url('${cardTemp[i]}')`);
    }
    for (let i = 0; i < cardObj.length / 2; i++) {
        cardFlipBg.push(`url('${cardTempM[i]}')`);
    }

    for (let i = 0; i < cardObj.length; i++) {
        cardTempIndex[i] = i;
    }

    for (let i = 0; i < cardObj.length; i++) {
        let temp = randRange(0, cardTempIndex.length - 1);
        cardBg[i] = cardTempIndex[temp];
        cardValue[i] = cardMatchBg[cardTempIndex[temp]]
        cardTempIndex.splice(temp, 1);
    }
}

function initVar(n) {
    cardObj = arrayInit(n);
    cardFlipped = arrayInit(n, false);
    cardFinished = arrayInit(n, false);
    cardValue = arrayInit(n);
    cardBg = arrayInit(n);
    cardMatchBg = arrayInit(n);
    root = document.querySelector(":root");
    btnObj2x2 = document.getElementById("a2x2");
    btnObj4x4 = document.getElementById("a4x4");
    btnObj2x2.style.display = "none";
    btnObj4x4.style.display = "none";
}

function setCSS(n) {
    var cardSize = "0";
    var card1 = "0";
    var card2 = "0";

    switch (n) {
        case 4:
            cardSize = "45%";
            card1 = "4%";

            cardObj[0].style.top = card1;
            cardObj[0].style.left = card1;

            cardObj[1].style.top = card1;
            cardObj[1].style.right = card1;

            cardObj[2].style.bottom = card1;
            cardObj[2].style.left = card1;

            cardObj[3].style.bottom = card1;
            cardObj[3].style.right = card1;
            break;

        case 16:
            cardSize = "23.5%";
            card1 = "2%";
            card2 = "26.25%";

            cardObj[0].style.top = card1;
            cardObj[0].style.left = card1;

            cardObj[1].style.top = card1;
            cardObj[1].style.left = card2;

            cardObj[2].style.top = card1;
            cardObj[2].style.right = card2;

            cardObj[3].style.top = card1;
            cardObj[3].style.right = card1;

            cardObj[4].style.top = card2;
            cardObj[4].style.left = card1;

            cardObj[5].style.top = card2;
            cardObj[5].style.left = card2;

            cardObj[6].style.top = card2;
            cardObj[6].style.right = card2;

            cardObj[7].style.top = card2;
            cardObj[7].style.right = card1;

            cardObj[8].style.bottom = card2;
            cardObj[8].style.left = card1;

            cardObj[9].style.bottom = card2;
            cardObj[9].style.left = card2;

            cardObj[10].style.bottom = card2;
            cardObj[10].style.right = card2;

            cardObj[11].style.bottom = card2;
            cardObj[11].style.right = card1;

            cardObj[12].style.bottom = card1;
            cardObj[12].style.left = card1;

            cardObj[13].style.bottom = card1;
            cardObj[13].style.left = card2;

            cardObj[14].style.bottom = card1;
            cardObj[14].style.right = card2;

            cardObj[15].style.bottom = card1;
            cardObj[15].style.right = card1;
            break;
    }
    root_set("--card-size", cardSize);
}

function createCard(n) {
    for (let i = 0; i < n; i++) {
        cardObj[i] = document.createElement("button");
        cardObj[i].className = "card";
        cardObj[i].style.backgroundColor = cardDefaultBg;
        cardObj[i].onclick = function() { cardFlip(i) };
        document.body.appendChild(cardObj[i]);
    }
}

const button = document.querySelector("button");
button.addEventListener("click", function() {
    sound[0].play();
})

function start(n) {
    initVar(n);
    for (let i = 0; i < n; i++) {
        cardMatchBg[i] = i % (n / 2);
    }
    createCard(n)
    setCSS(n);
    randomizeCard();
}