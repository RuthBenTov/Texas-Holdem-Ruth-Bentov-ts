function getMoveOption(activePlayers, thisIndex) {
    var thisPlayer = activePlayers[thisIndex];
    for (var j = thisIndex - 1; j >= 0; j--) {
        if (activePlayers[j].movesInRound[activePlayers[j].movesInRound.length - 1] ==
            PlayerMovesOption.rise) {
            return ["fold", "rise", "call"];
        }
    }
    for (var i = activePlayers.length - 1; i > thisIndex; i--) {
        if (activePlayers[i].movesInRound[activePlayers[i].movesInRound.length - 1] ==
            PlayerMovesOption.rise) {
            return ["fold", "rise", "call"];
        }
    }
    return ["rise", "check"];
}
function getPointOfOptionalSet(thisPlayer) {
    var thisPCards = thisPlayer.allCards;
    console.log(thisPCards);
    var setsResult = [
        checkPair(thisPCards),
        checkTwoPairs(thisPCards),
        checkThreeOfAKind(thisPCards),
        checkStraight(thisPCards),
        checkFlush(thisPCards),
        checkFullHouse(thisPCards),
        checkFourOfAKind(thisPCards),
        checkStraightFlush(thisPCards),
        checkRoyalFlush(thisPCards),
    ];
    var maxPointsSet = 0;
    setsResult.forEach(function (res, i) {
        if (res === true)
            maxPointsSet += i + 1;
    });
    return maxPointsSet;
}
function riseBetSizeInThisRound(players, currentPlayerIndex) {
    var PlayerRiseInThisRound = getLastRisePLayer(players, currentPlayerIndex);
    if (PlayerRiseInThisRound) {
        return PlayerRiseInThisRound.lastBet;
    }
    return 0;
}
function getLastRisePLayer(players, currentPlayerIndex) {
    var currentPlayer = players[currentPlayerIndex];
    var round = currentPlayer.movesInRound.length;
    var playerRiseLastInThisRound;
    players.forEach(function (p) {
        if (p.movesInRound[round - 1] == PlayerMovesOption.rise) {
            playerRiseLastInThisRound = p;
        }
    });
    return playerRiseLastInThisRound;
}
function chooseMove(players, movesOptions, sizeOfBet, pointOfOptionalSet, player) {
    var movesOptionsLength = movesOptions.length;
    if (movesOptionsLength === 2) {
        //check or rise
        var randomNumToMove = Math.round(Math.random() * 1);
        var randomMove = movesOptions[randomNumToMove];
        if (pointOfOptionalSet < 2)
            player.checkMove(players);
        if (pointOfOptionalSet == 2) {
            if (randomMove === "rise") {
                player.riseMove(players, sizeOfBet);
            }
            else {
                player.checkMove(players);
            }
        }
        if (pointOfOptionalSet >= 3) {
            player.riseMove(players, sizeOfBet);
        }
    }
    if (movesOptionsLength == 3) {
        //rise or call or fold
        var randomNumToMove = Math.round(Math.random() * 2);
        var randomMove = movesOptions[randomNumToMove];
        var lastBetSize = riseBetSizeInThisRound(players, players.findIndex(function (p) { return p.id === player.id; }));
        if (pointOfOptionalSet < 2)
            if (randomMove == "call" && lastBetSize <= sizeOfBet) {
                player.callMove(players, lastBetSize);
            }
            else {
                player.foldMove(players);
            }
        if (pointOfOptionalSet == 2) {
            if (randomMove == "call" && lastBetSize <= sizeOfBet) {
                player.callMove(players, lastBetSize);
            }
            if (randomMove == "rise" && lastBetSize <= sizeOfBet) {
                player.riseMove(players, sizeOfBet);
            }
            else {
                player.foldMove(players);
            }
        }
        if (pointOfOptionalSet >= 3) {
            if (randomMove == "call") {
                player.callMove(players, player.turnNumber);
            }
            else
                player.riseMove(players, sizeOfBet);
        }
    }
}
function getSizeOfBet(pointOfOptionalSet, playerChips, thisIndex) {
    var randomNum = 0;
    if (pointOfOptionalSet < 2) {
        randomNum = Math.round(Math.random() * (0.05 * playerChips));
    }
    if (pointOfOptionalSet == 2) {
        randomNum = Math.round(Math.random() * (0.2 * playerChips));
    }
    if (pointOfOptionalSet == 3) {
        randomNum = Math.round(Math.random() * (0.4 * playerChips));
    }
    if (pointOfOptionalSet >= 4) {
        randomNum = Math.round(Math.random() * (0.8 * playerChips));
    }
    // if ( randomNum < riseBetSizeInThisRound(players, thisIndex))return 0;
    return randomNum;
}
var counterTurn = 0;
var indexInArray = 0;
function myTurn(players) {
    var myPlayer = players.find(function (p) { return p.id == "myPlayer"; });
    var myPlayerIndex = players.findIndex(function (p) { return p.id == "myPlayer"; });
    players.forEach(function (p) {
        p.isTurn = true;
        p.setTurn();
    });
    myPlayer.setTurn();
    var sound = new Audio("../sound/service-bell-ring-14610.mp3");
    sound.play();
    var myOption = getMoveOption(players, myPlayerIndex);
    console.log((myPlayer === null || myPlayer === void 0 ? void 0 : myPlayer.userName) + " is doing something......");
    playTheButton(myOption);
}
var index = 0;
var indexInRound = 0;
function turnOrder(players) {
    players = players.filter(function (p) { return p.isActive === true; });
    var playersLen = players.length;
    document.querySelectorAll("button").forEach(function (button) {
        button.disabled = "false";
    });
    if (indexInRound == playersLen) {
        indexInRound = 0;
        index = 0;
        addCardToStage();
    }
    if (index == playersLen + 1) {
        index = 0;
    }
    if (index >= playersLen + 1) {
        index = playersLen;
    }
    if (playersLen == 1) {
        addCardToStage();
    }
    if (indexInRound >= playersLen) {
        indexInRound = playersLen - 1;
    }
    if (index < playersLen + 1) {
        index++;
        indexInRound++;
        if (players[index - 1].id == "myPlayer") {
            console.log(players[index - 1]);
            myTurn(players);
        }
        if (players[index - 1].id != "myPlayer") {
            players[index - 1].doingTurn(players, index - 1);
        }
        if (players[index - 1].lastBet > 0)
            indexInRound = 0;
    }
}
function beginnerTurn() {
    turnOrder(players);
}
function delayedTurnOrder(players) {
    setTimeout(function () {
        turnOrder(players);
    }, 3000);
}
