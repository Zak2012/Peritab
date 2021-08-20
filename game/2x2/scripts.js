var cardDefaultBg = "#ffffff"

var isFlipped = [false, false, false, false]

var cardFlipBg = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"]

function flip(obj, card) {
    isFlipped[card] = !isFlipped[card]
    if (isFlipped[card]) {
        obj.style.backgroundColor = cardFlipBg[card];
    } else {
        obj.style.backgroundColor = cardDefaultBg;
    }
}

function cardFlip(obj, card) {
    flip(obj, card);
}