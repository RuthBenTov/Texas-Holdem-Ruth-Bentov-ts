"use strict";

var cardsNumber = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var cardSign = ["heart", "diamond", "club", "spade"];
var decksCards = [];
cardSign.forEach(function (cardS) {
  cardsNumber.forEach(function (cardN) {
    decksCards.push(new Card(cardN, cardS));
  });
});
localStorage.setItem("deckCards", JSON.stringify(decksCards));

function renderAllCards() {
  var root = document.body.querySelector(".cards");
  var html = decksCards.map(function (c) {
    return "<div class=\"card\" name=\"" + (c.cardNumber + c.cardSign) + "\">\n        <h3 class=\"cardN\">" + c.cardNumber + "</h3>\n        <img class=\"cardS\" src=\"" + c.srcImgCard + "\"  alt=\"\">\n        </div>";
  }).join(" ");
  root.innerHTML += html;
}

function get2RandomCards() {
  var randomNumCard1 = Math.round(Math.random() * decksCards.length);
  var randomCard1 = decksCards[randomNumCard1];
  decksCards.splice(randomNumCard1, 1);
  var randomNumCard2 = Math.round(Math.random() * decksCards.length);
  var randomCard2 = decksCards[randomNumCard2];
  decksCards.splice(randomNumCard2, 1);
  setDeckCardsInLs();
  return [new Card(randomCard1.cardNumber, randomCard1.cardSign), new Card(randomCard2.cardNumber, randomCard2.cardSign)];
}

function getRandomCard() {
  var randomNumCard1 = Math.round(Math.random() * decksCards.length);
  var randomCard1 = decksCards[randomNumCard1];
  decksCards.splice(randomNumCard1, 1);
  setDeckCardsInLs();
  return randomCard1;
}

function setDeckCardsInLs() {
  localStorage.setItem("deckCards", JSON.stringify(decksCards));
}

function getDeckCardsFromLs() {
  var decksCardsStr = JSON.parse(localStorage.getItem("deckCards"));
  decksCards = decksCardsStr.map(function (c) {
    return new Card(c.cardNumber, c.cardSign);
  });
}

var myPlayer = new Player("ruth1", "#", "myPlayer");
var users = [new Player("ruth300290!", "https://cdn.pixabay.com/photo/2013/05/30/18/21/cat-114782_1280.jpg"), new Player("ruth0908", "https://cdn.pixabay.com/photo/2014/04/05/11/40/chess-316658_1280.jpg"), new Player("ruth765", "https://cdn.pixabay.com/photo/2015/11/21/04/17/grandparents-1054311_1280.jpg"), new Player("ruth5645", "https://cdn.pixabay.com/photo/2023/06/22/02/25/motocross-8080377_1280.jpg")]; // users.unshift(myPlayer);

var firstPlayers = [myPlayer].concat(users);
var players = getPlayerFromLs();

function getPlayerFromLs() {
  try {
    var playersStr = localStorage.getItem("players");

    if (!playersStr) {
      console.log(firstPlayers);
      localStorage.setItem("players", JSON.stringify(firstPlayers));
      return firstPlayers;
    } else {
      var playersOnArrayObjs = JSON.parse(playersStr);
      var players_1 = playersOnArrayObjs.map(function (p) {
        return new Player(p.userName, p.imgSrc, p.id, p.chips, p.isActive, p.isTurn, p.pCards, p.allCards, p.movesInRound, p.lastBet, p.roundNumber, p.turnNumber);
      });
      console.log(players_1);
      return players_1;
    }
  } catch (error) {
    console.error(error);
  }
}

players[0].renderMyPanel(); //---------------------------------------------render players-------------------------------------

function renderPlayersPanel(players) {
  try {
    var playersElement_1 = document.querySelectorAll(".playerPanel");
    players.forEach(function (p, i) {
      // p.pCards.forEach((c) =>
      //   c.renderCard(document.querySelector(`#player${i+1}Cards`) as HTMLElement),
      // );
      playersElement_1[i].querySelector(".playerPanel__img img").src = p.imgSrc;
      playersElement_1[i].querySelector(".playerPanel__inform__chips").innerHTML = p.chips.toString();
      playersElement_1[i].querySelector(".playerPanel__inform__userName").textContent = p.userName;
    });
  } catch (error) {
    console.error(error);
  }
}

renderPlayersPanel(users);

function addCardToStage() {
  var root = document.querySelector(".stage");

  if (root.children.length < 6) {
    if (root.children.length > 3) {
      var newCard_1 = getRandomCard();
      players.forEach(function (p) {
        return p.addCardToPlayer(newCard_1);
      });
      localStorage.setItem("players", JSON.stringify(players));
      newCard_1.renderCard(root);
    } else {
      var _loop_1 = function _loop_1(i) {
        var newCard = getRandomCard();
        players.forEach(function (p) {
          return p.addCardToPlayer(newCard);
        });
        localStorage.setItem("players", JSON.stringify(players));
        newCard.renderCard(root);
      };

      for (var i = 0; i < 3; i++) {
        _loop_1(i);
      }
    }
  } else alert("game stopped!");
}

function createID() {
  return String(Date.now().toString(32) + Math.random().toString(16)).replace(/\./g, "");
}

var array = [1, 5, 7, 3, 5, 6, 2];
console.log(array[-2]);