

function getMoveOption(activePlayers: Player[], thisIndex: number) {
  const thisPlayer = activePlayers[thisIndex];

  for (var j = thisIndex - 1; j >= 0; j--) {
    if (
      activePlayers[j].movesInRound[activePlayers[j].movesInRound.length - 1] ==
      PlayerMovesOption.rise
    ) {
      return ["fold", "rise", "call"];
    }
  }
  for (var i = activePlayers.length - 1; i > thisIndex; i--) {
    if (
      activePlayers[i].movesInRound[activePlayers[i].movesInRound.length - 1] ==
      PlayerMovesOption.rise
    ) {
      return ["fold", "rise", "call"];
    }
  }
  return ["rise", "check"];
}

function getPointOfOptionalSet(thisPlayer: Player) {
  const thisPCards = thisPlayer.allCards;
  console.log(thisPCards);

  const setsResult: boolean[] = [
    checkPair(thisPCards)!,
    checkTwoPairs(thisPCards)!,
    checkThreeOfAKind(thisPCards)!,
    checkStraight(thisPCards)!,
    checkFlush(thisPCards)!,
    checkFullHouse(thisPCards)!,
    checkFourOfAKind(thisPCards)!,
    checkStraightFlush(thisPCards)!,
    checkRoyalFlush(thisPCards)!,
  ];

  let maxPointsSet: number = 0;
  setsResult.forEach((res, i) => {
    if (res === true) maxPointsSet += i + 1;
  });
  return maxPointsSet;
}

function riseBetSizeInThisRound(players: Player[], currentPlayerIndex: number) {
  const PlayerRiseInThisRound: Player | undefined = getLastRisePLayer(
    players,
    currentPlayerIndex,
  );
  if (PlayerRiseInThisRound) {
    return PlayerRiseInThisRound.lastBet;
  }
  return 0;
}

function getLastRisePLayer(players: Player[], currentPlayerIndex: number) {
  const currentPlayer = players[currentPlayerIndex];
  const round = currentPlayer.movesInRound.length;

  let playerRiseLastInThisRound: Player | undefined;
  players.forEach((p) => {
    if (p.movesInRound[round - 1] == PlayerMovesOption.rise) {
      playerRiseLastInThisRound = p;
    }
  });
  return playerRiseLastInThisRound;
}

function chooseMove(
  players: Player[],
  movesOptions: string[],
  sizeOfBet: number,
  pointOfOptionalSet: number,
  player: Player,
) {
  const movesOptionsLength = movesOptions.length;
  if (movesOptionsLength === 2) {
    //check or rise

    let randomNumToMove = Math.round(Math.random() * 1);
    let randomMove = movesOptions[randomNumToMove];

    if (pointOfOptionalSet < 2) player.checkMove(players);

    if (pointOfOptionalSet == 2) {
      if (randomMove === "rise") {
        player.riseMove(players, sizeOfBet);
      } else {
        player.checkMove(players);
      }
    }

    if (pointOfOptionalSet >= 3) {
      player.riseMove(players, sizeOfBet);
    }
  }

  if (movesOptionsLength == 3) {
    //rise or call or fold

    let randomNumToMove = Math.round(Math.random() * 2);
    let randomMove = movesOptions[randomNumToMove];
    let lastBetSize = riseBetSizeInThisRound(
      players,
      players.findIndex((p) => p.id === player.id),
    );

    if (pointOfOptionalSet < 2)
      if (randomMove == "call" && lastBetSize <= sizeOfBet) {
        player.callMove(players, lastBetSize);
      } else {
        player.foldMove(players);
      }

    if (pointOfOptionalSet == 2) {
      if (randomMove == "call" && lastBetSize <= sizeOfBet) {
        player.callMove(players, lastBetSize);
      }
      if (randomMove == "rise" && lastBetSize <= sizeOfBet) {
        player.riseMove(players, sizeOfBet);
      } else {
        player.foldMove(players);
      }
    }

    if (pointOfOptionalSet >= 3) {
      if (randomMove == "call") {
        player.callMove(players, player.turnNumber);
      } else player.riseMove(players, sizeOfBet);
    }
  }
}

function getSizeOfBet(
  pointOfOptionalSet: number,
  playerChips: number,
  thisIndex: number,
) {
  let randomNum = 0;
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

let counterTurn = 0;
let indexInArray = 0;

function myTurn(players: Player[]) {
  const myPlayer = players.find((p) => p.id == "myPlayer");
  const myPlayerIndex = players.findIndex((p) => p.id == "myPlayer");

  players.forEach((p) => {
    p.isTurn = true;
    p.setTurn();
  });
  myPlayer!.setTurn();

  const sound = new Audio("../sound/service-bell-ring-14610.mp3");
  sound.play();
  const myOption = getMoveOption(players, myPlayerIndex);

  console.log(`${myPlayer?.userName} is doing something......`);

  playTheButton(myOption!);
}





let index = 0;
let indexInRound = 0;
function turnOrder(players: Player[]) {
  players = players.filter((p) => p.isActive === true);
  let playersLen = players.length;
  (
    document.querySelectorAll("button") as NodeListOf<HTMLButtonElement>
  ).forEach((button) => {
    button.disabled = "false";
  });

  if (indexInRound == playersLen) {
    indexInRound = 0;
    index = 0;
    addCardToStage();
  }
  if (index == playersLen +1) {
    index = 0;
  }
  if (index >= playersLen + 1) {
    index = playersLen;
  }
  if (playersLen == 1) {
    addCardToStage();
  }
  if (indexInRound >= playersLen) {
    indexInRound = playersLen-1;
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

    if (players[index - 1].lastBet! > 0) indexInRound = 0;
  }
}

function beginnerTurn() {
  turnOrder(players);

}

function delayedTurnOrder(players: Player[]) {
  setTimeout(() => {
    turnOrder(players);
  }, 3000);
}
