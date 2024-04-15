// sets----------------------------------------------------------------
// Royal Flush
// Straight Flush
// Four of a Kind
// Full House
// Flush
// Straight
// Three of a Kind
// Two Pair
// One Pair
// High Card
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
//royal flush
function checkRoyalFlush(cards) {
    try {
        if (checkFlush(cards) && checkRoyalStraight(cards))
            return true;
        return false;
    }
    catch (error) {
        console.error(error);
    }
}
//straight flush
function checkStraightFlush(cards) {
    try {
        if (checkStraight(cards) && checkRoyalStraight(cards))
            return true;
        return false;
    }
    catch (error) {
        console.error(error);
    }
}
//four of a kind
function checkFourOfAKind(cards) {
    var copiedCards = __spreadArrays(cards);
    var _loop_1 = function (i) {
        var tempArray = copiedCards.slice(i + 1);
        var sameNumberCards = tempArray.filter(function (card) { return card.cardNumber === copiedCards[i].cardNumber; });
        if (sameNumberCards.length == 3) {
            return { value: true };
        }
    };
    for (var i = 0; i < copiedCards.length; i++) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
}
//full house
function checkFullHouse(cards) {
    var pairs = {};
    cards.forEach(function (card) {
        if (!pairs[card.cardNumber]) {
            pairs[card.cardNumber] = 1;
        }
        else {
            pairs[card.cardNumber]++;
        }
    });
    var pairValues = Object.values(pairs);
    var pairCounts = pairValues.filter(function (count) { return count === 2; }).length > 0 ? true : false;
    var threeOfKindCounts = pairValues.filter(function (count) { return count === 3; }).length > 0 ? true : false;
    return pairCounts && threeOfKindCounts;
}
//flush
function checkFlush(cards) {
    try {
        var _loop_2 = function (i) {
            var tempCardsSign = cards.filter(function (c) { return c.cardSign == cards[i].cardSign; });
            if (tempCardsSign.length >= 5) {
                return { value: true };
            }
        };
        for (var i = 0; i < cards.length - 4; i++) {
            var state_2 = _loop_2(i);
            if (typeof state_2 === "object")
                return state_2.value;
        }
        return false;
    }
    catch (error) {
        console.error(error);
    }
}
//straight
function checkStraight(cards) {
    try {
        var cardsNumbers = cards.map(function (card) {
            return getCardNumberValue(card.cardNumber);
        });
        var sortedCardsNumbers = cardsNumbers.sort();
        var count = 0;
        for (var i = 0; i < sortedCardsNumbers.length - 1; i++) {
            if (sortedCardsNumbers[i + 1] - sortedCardsNumbers[i] === 1) {
                count++;
                if (count === 4) {
                    return true;
                }
            }
            else {
                count = 0;
            }
        }
        if (checkRoyalStraight(cards)) {
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(error);
    }
}
function checkRoyalStraight(cards) {
    var cardsNumbers = cards.map(function (card) { return getCardNumberValue(card.cardNumber); });
    var sortedCardsNumbers = cardsNumbers.sort();
    if (sortedCardsNumbers.includes(10) &&
        sortedCardsNumbers.includes(11) &&
        sortedCardsNumbers.includes(12) &&
        sortedCardsNumbers.includes(13) &&
        sortedCardsNumbers.includes(1)) {
        return true;
    }
    return false;
}
//three of a kind
function checkThreeOfAKind(cards) {
    var copiedCards = __spreadArrays(cards);
    var _loop_3 = function (i) {
        var tempArray = copiedCards.slice(i + 1);
        var sameNumberCards = tempArray.filter(function (card) { return card.cardNumber === copiedCards[i].cardNumber; });
        if (sameNumberCards.length == 2) {
            return { value: true };
        }
    };
    for (var i = 0; i < copiedCards.length; i++) {
        var state_3 = _loop_3(i);
        if (typeof state_3 === "object")
            return state_3.value;
    }
    return false;
}
//two pairs
function checkTwoPairs(cards) {
    var pairs = {};
    cards.forEach(function (card) {
        if (!pairs[card.cardNumber]) {
            pairs[card.cardNumber] = 1;
        }
        else {
            pairs[card.cardNumber]++;
        }
    });
    var pairValues = Object.values(pairs);
    var pairCounts = pairValues.filter(function (count) { return count === 2; });
    return pairCounts.length >= 2;
}
//one pair
function checkPair(cards) {
    var copiedCards = __spreadArrays(cards);
    var _loop_4 = function (i) {
        var tempArray = copiedCards.slice(i);
        var sameNumberCards = tempArray.filter(function (card) { return card.cardNumber === copiedCards[i].cardNumber; });
        if (sameNumberCards.length == 1) {
            return { value: true };
        }
    };
    for (var i = 0; i < copiedCards.length; i++) {
        var state_4 = _loop_4(i);
        if (typeof state_4 === "object")
            return state_4.value;
    }
    return false;
}
function getPair(cards) {
    var cardCounts = {};
    var duplicateCards;
    cards.forEach(function (card) {
        var cardNumber = card.cardNumber;
        if (cardCounts[cardNumber]) {
            duplicateCards = [cardCounts[cardNumber], card];
        }
        else {
            cardCounts[cardNumber] = card;
        }
    });
    return duplicateCards;
}
function getTwoPairs(cards) {
    var cardCounts = {};
    cards.forEach(function (card) {
        var cardNumber = card.cardNumber;
        if (cardCounts[cardNumber]) {
            cardCounts[cardNumber].push(card);
        }
        else {
            cardCounts[cardNumber] = [card];
        }
    });
    var twoPairs = Object.values(cardCounts).filter(function (group) { return group.length === 2; });
    if (twoPairs.length === 2) {
        return __spreadArrays(twoPairs[0], twoPairs[1]);
    }
    return null;
}
function getFullHouse(cards) {
    var cardCounts = {};
    cards.forEach(function (card) {
        var cardNumber = card.cardNumber;
        if (cardCounts[cardNumber]) {
            cardCounts[cardNumber].push(card);
        }
        else {
            cardCounts[cardNumber] = [card];
        }
    });
    var twoOfAKind = null;
    var threeOfAKind = null;
    Object.values(cardCounts).forEach(function (group) {
        if (group.length === 2) {
            twoOfAKind = group;
        }
        else if (group.length === 3) {
            threeOfAKind = group;
        }
    });
    if (twoOfAKind && threeOfAKind) {
        return __spreadArrays(twoOfAKind, threeOfAKind);
    }
    return null;
}
function getThreeOfKind(cards) {
    var cardCounts = {};
    cards.forEach(function (card) {
        var cardNumber = card.cardNumber;
        if (cardCounts[cardNumber]) {
            cardCounts[cardNumber].push(card);
        }
        else {
            cardCounts[cardNumber] = [card];
        }
    });
    var threeOfAKind = Object.values(cardCounts).find(function (group) { return group.length === 3; });
    if (threeOfAKind) {
        return threeOfAKind;
    }
    return null;
}
function getFourOfAKind(cards) {
    var cardCounts = {};
    cards.forEach(function (card) {
        var cardNumber = card.cardNumber;
        if (cardCounts[cardNumber]) {
            cardCounts[cardNumber].push(card);
        }
        else {
            cardCounts[cardNumber] = [card];
        }
    });
    var fourOfAKind = Object.values(cardCounts).find(function (group) { return group.length === 4; });
    if (fourOfAKind) {
        return fourOfAKind;
    }
    return null;
}
function getFlush(cards) {
    var signCounts = {};
    // Iterate through the cards and group them by cardSign
    cards.forEach(function (card) {
        var cardSign = card.cardSign;
        if (signCounts[cardSign]) {
            signCounts[cardSign].push(card);
        }
        else {
            signCounts[cardSign] = [card];
        }
    });
    // Find five of a kind (if any)
    var fiveOfAKind = Object.values(signCounts).find(function (group) { return group.length === 5; });
    // Check if we found five of a kind
    if (fiveOfAKind) {
        return fiveOfAKind;
    }
    // If no five of a kind found, return null
    return null;
}
function getStraight(cards) {
    var sortedCards = cards.slice().sort(function (a, b) {
        var valueA = getCardNumberValue(a.cardNumber);
        var valueB = getCardNumberValue(b.cardNumber);
        return valueA - valueB;
    });
    var highestStraight = null;
    var currentStraight = [sortedCards[0]];
    for (var i = 1; i < sortedCards.length; i++) {
        var currentValue = getCardNumberValue(sortedCards[i].cardNumber);
        var prevValue = getCardNumberValue(sortedCards[i - 1].cardNumber);
        if (currentValue === prevValue + 1) {
            currentStraight.push(sortedCards[i]);
        }
        else if (currentValue !== prevValue) {
            currentStraight = [sortedCards[i]];
        }
        if (currentStraight.length === 5 &&
            (!highestStraight || getCardNumberValue(currentStraight[4].cardNumber) > getCardNumberValue(highestStraight[4].cardNumber))) {
            highestStraight = currentStraight;
        }
    }
    if (highestStraight && highestStraight.length > 5) {
        highestStraight = highestStraight.slice(highestStraight.length - 5);
    }
    return highestStraight;
}
function areRoyalNumbers(cards) {
    var validNumbers = new Set(["10", "J", "Q", "K", "A"]);
    return cards.every(function (card) { return validNumbers.has(card.cardNumber); });
}
function areAllSameSign(cards) {
    var sign = cards[0].cardSign;
    return cards.every(function (card) { return card.cardSign === sign; });
}
function getRoyalFlush(cards) {
    if (cards.length !== 5 || !areRoyalNumbers(cards) || !areAllSameSign(cards)) {
        return null;
    }
    var sortedCards = cards.slice().sort(function (a, b) {
        var valueA = getCardNumberValue(a.cardNumber);
        var valueB = getCardNumberValue(b.cardNumber);
        return valueA - valueB;
    });
    if (getCardNumberValue(sortedCards[0].cardNumber) === 10 &&
        getCardNumberValue(sortedCards[1].cardNumber) === 11 &&
        getCardNumberValue(sortedCards[2].cardNumber) === 12 &&
        getCardNumberValue(sortedCards[3].cardNumber) === 13 &&
        getCardNumberValue(sortedCards[4].cardNumber) === 14) {
        return sortedCards;
    }
    return null;
}
function getStraightFlash(cards) {
    if (getFlush(cards) != null && getStraight(cards) != null) {
        if (getFlush(getStraight(cards)) != null) {
            return getStraight(getFlush(getStraight(cards)));
        }
    }
    return null;
}
//high card
function getHighCard(cards) {
    var cardValues = {
        A: 14,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "10": 10,
        J: 11,
        Q: 12,
        K: 13
    };
    var temp = cards[0];
    cards.forEach(function (card) {
        if (cardValues[card.cardNumber] > cardValues[temp.cardNumber]) {
            temp = card;
        }
    });
    return temp;
}
/////////------------------------
function getCardNumberValue(cardNumber) {
    try {
        if (cardNumber === "A")
            return 1;
        if (cardNumber === "J")
            return 11;
        if (cardNumber === "Q")
            return 12;
        if (cardNumber === "K")
            return 13;
        return parseInt(cardNumber);
    }
    catch (error) {
        console.error(error);
        return -1;
    }
}
var cardsArr = [
    new Card("2", "heart"),
    new Card("2", "heart"),
    new Card("4", "heart"),
    new Card("5", "heart"),
    new Card("a", "heart"),
    new Card("9", "club"),
    new Card("9", "diamond"),
];
console.log(getTwoPairs(cardsArr));
