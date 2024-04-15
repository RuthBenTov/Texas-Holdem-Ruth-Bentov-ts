"use strict";

function checkWinner(players) {
  players = players.filter(function (p) {
    return p.isActive;
  });
  var winnerPlayer = players[0];

  for (var i = 0; i < players.length - 1; i++) {
    var tempScore1 = getPointOfOptionalSet(players[i]);
    var tempScoreWinner = getPointOfOptionalSet(winnerPlayer);

    if (tempScore1 > tempScoreWinner) {
      winnerPlayer = players[i];
    }

    if (tempScore1 == tempScoreWinner) {
      var tempHighCard1 = getHighCard(players[i].allCards).cardNumber;
      var tempHighCardWinner = getHighCard(winnerPlayer.allCards).cardNumber;

      if (tempHighCard1 > tempHighCardWinner) {
        winnerPlayer = players[i];
      }
    }
  }

  winnerPlayer.chips += Number(localStorage.getItem("dilersChips"));
  return winnerPlayer;
}

function getResultOfCheckSets(cards) {
  var setsResult = [true, checkPair(cards), checkTwoPairs(cards), checkThreeOfAKind(cards), checkStraight(cards), checkFlush(cards), checkFullHouse(cards), checkFourOfAKind(cards), checkStraightFlush(cards), checkRoyalFlush(cards)];
  return setsResult;
}

function getBestHandForEachPlayer(player) {
  var thisCards = player.allCards;
  var arraySetResult = getResultOfCheckSets(thisCards);
  console.log(arraySetResult);
  var arrayOfFunctionToGet = [getHighCard, getPair, getTwoPairs, getThreeOfKind, getStraight, getFlush, getFullHouse, getFourOfAKind, getStraightFlash, getRoyalFlush];
  var arrayHandCards = [];

  for (var i = arraySetResult.length - 1; i >= 0; i--) {
    if (arraySetResult[i]) {
      console.log(arrayOfFunctionToGet[i]);
      var cardsOfSet = arrayOfFunctionToGet[i](thisCards);
      console.log(cardsOfSet);
      arrayHandCards.push.apply(arrayHandCards, cardsOfSet);
      break;
    }
  }

  if (arrayHandCards.length == 5) {
    return arrayHandCards;
  } else {
    for (var _i = 0; _i <= 5 - arrayHandCards.length + 1; _i++) {
      var uniqArrayCards = thisCards.filter(function (card) {
        return !arrayHandCards.includes(card);
      });
      arrayHandCards.push(uniqArrayCards[_i]);
    }
  }

  arrayHandCards.forEach(function (c) {
    return c.partOfSet = true;
  });
  return arrayHandCards;
}

var cardsArray = [new Card("2", "heart"), new Card("2", "heart"), new Card("9", "heart"), new Card("6", "heart"), new Card("5", "heart"), new Card("k", "club"), new Card("a", "diamond")]; // console.log(getBestHandForEachPlayer(cardsArray));

function getHandName(cards) {
  var setBooleanArray = getResultOfCheckSets(cards);
  var functionIndex = -1;

  for (var i = setBooleanArray.length; i >= 0; i--) {
    if (setBooleanArray[i] === true) {
      functionIndex = i;
      break;
    }
  }

  switch (functionIndex) {
    case 9:
      {
        var cardSign = getFlush(cards)[0].cardSign;
        return "Royal Flush (" + cardSign + ")";
      }

    case 8:
      {
        var _cardSign = getFlush(cards)[0].cardSign;
        return "Straight Flush (" + _cardSign + ")";
      }

    case 7:
      {
        var cardNumber = getFourOfAKind(cards)[0].cardNumber;
        return "Four of a kind - " + cardNumber;
      }

    case 6:
      {
        var cardNum1 = getFullHouse(cards)[4].cardNumber;
        var cardNum2 = getFullHouse(cards)[0].cardNumber;
        return "Full house " + cardNum1 + " " + cardNum2;
      }

    case 5:
      {
        var _cardSign2 = getFlush(cards)[0].cardSign;
        return "Flush " + _cardSign2;
      }

    case 4:
      return "Straight";

    case 3:
      {
        var _cardNumber = getThreeOfKind(cards)[0].cardNumber;
        return "Tree of a kind " + _cardNumber;
      }

    case 2:
      {
        var _cardNumber2 = getTwoPairs(cards)[0].cardNumber;
        var _cardNum = getTwoPairs(cards)[3].cardNumber;
        return "Two pair " + _cardNumber2 + " ,  " + _cardNum;
      }

    case 1:
      {
        var _cardNumber3 = getPair(cards)[0].cardNumber;
        return "Pair " + _cardNumber3;
      }

    case 0:
      {
        var _cardNumber4 = getHighCard(cards)[0].cardNumber;
        return "High card " + _cardNumber4;
      }
  }
}

function renderWinHand(player) {
  var winHandName = getHandName(player.allCards);
  var rootElement = document.querySelector(".winPlayerDiv");
  var cardsElements = player.allCards.map(function (c) {
    if (c.partOfSet) {
      return '<div class="card partOfSet" name="' + (c.cardNumber + c.cardSign) + '">\n                 <h3 class="cardN">' + c.cardNumber + '</h3>\n                 <img class="cardS" src="' + c.srcImgCard + '"  alt="">\n                 </div>';
    } else {
      return '<div class="card " name="' + (c.cardNumber + c.cardSign) + '">\n          <h3 class="cardN">' + c.cardNumber + '</h3>\n          <img class="cardS" src="' + c.srcImgCard + '"  alt="">\n          </div>';
    }
  }).join(" ");
  var html = '\n  \n  <h2 class="handName">' + winHandName + '</h2>\n        <div class="winPlayerDiv__information">\n          <div class="winPlayerDiv__information__winnerNameAndImg">\n            <img src="' + player.imgSrc + '" alt="" />\n            <h3>' + player.userName + '</h3>\n          </div>\n\n          <div class="winPlayerDiv__information__winnerHandName">\n            <div class="winPlayerDiv__information__winnerChips">\n             <p>' + player.chips + ' $ </p> \n            </div>\n          </div>\n        </div>\n        <div class="winPlayerDiv__handCard">' + cardsElements + "</div>\n    ";
  rootElement.innerHTML = html;
}

function renderPage() {
  var winner = checkWinner(players);
  getBestHandForEachPlayer(winner);
  renderWinHand(winner);
}