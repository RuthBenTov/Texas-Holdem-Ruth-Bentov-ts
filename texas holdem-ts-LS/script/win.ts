function checkWinner(players: Player[]) {
  players = players.filter((p) => p.isActive);
  let winnerPlayer: Player = players[0];

  for (let i = 0; i < players.length - 1; i++) {
    let tempScore1 = getPointOfOptionalSet(players[i]);
    let tempScoreWinner = getPointOfOptionalSet(winnerPlayer);

    if (tempScore1 > tempScoreWinner) {
      winnerPlayer = players[i];
    }
    if (tempScore1 == tempScoreWinner) {
      let tempHighCard1 = getHighCard(players[i].allCards).cardNumber;
      let tempHighCardWinner = getHighCard(winnerPlayer.allCards).cardNumber;
      if (tempHighCard1 > tempHighCardWinner) {
        winnerPlayer = players[i];
      }
    }
  }
  winnerPlayer.chips += Number(localStorage.getItem("dilersChips")!);
  return winnerPlayer;
}

function getResultOfCheckSets(cards: Card[]) {
  const setsResult: boolean[] = [
    true,
    checkPair(cards)!,
    checkTwoPairs(cards)!,
    checkThreeOfAKind(cards)!,
    checkStraight(cards)!,
    checkFlush(cards)!,
    checkFullHouse(cards)!,
    checkFourOfAKind(cards)!,
    checkStraightFlush(cards)!,
    checkRoyalFlush(cards)!,
  ];

  return setsResult;
}

function getBestHandForEachPlayer(player: Player) {
  let thisCards: Card[] = player.allCards;
  const arraySetResult: boolean[] = getResultOfCheckSets(thisCards);
  console.log(arraySetResult);

  const arrayOfFunctionToGet: Function[] = [
    getHighCard,
    getPair,
    getTwoPairs,
    getThreeOfKind,
    getStraight,
    getFlush,
    getFullHouse,
    getFourOfAKind,
    getStraightFlash,
    getRoyalFlush,
  ];
  let arrayHandCards: Card[] = [];

  for (let i = arraySetResult.length - 1; i >= 0; i--) {
    if (arraySetResult[i]) {
      console.log(arrayOfFunctionToGet[i]);

      let cardsOfSet: Card[] = arrayOfFunctionToGet[i](thisCards);
      console.log(cardsOfSet);

      arrayHandCards.push(...cardsOfSet);
      break;
    }
  }

  if (arrayHandCards.length == 5) {
    return arrayHandCards;
  } else {
    for (let i = 0; i < 5 - arrayHandCards.length + 1; i++) {
      let uniqArrayCards: Card[] = thisCards.filter(
        (card) => !arrayHandCards.includes(card),
      );
      arrayHandCards.push(uniqArrayCards[i]);
    }
  }

  arrayHandCards.forEach((c) => (c.partOfSet = true));
  return arrayHandCards;
}

const cardsArray: Card[] = [
  new Card("2", "heart"),
  new Card("2", "heart"),
  new Card("9", "heart"),
  new Card("6", "heart"),
  new Card("5", "heart"),
  new Card("k", "club"),
  new Card("a", "diamond"),
];

// console.log(getBestHandForEachPlayer(cardsArray));

function getHandName(cards) {
  const setBooleanArray = getResultOfCheckSets(cards);
  let functionIndex = -1;
  for (let i = setBooleanArray.length; i >= 0; i--) {
    if (setBooleanArray[i] === true) {
      functionIndex = i;
      break;
    }
  }
  switch (functionIndex) {
    case 9: {
      const cardSign = getFlush(cards)![0].cardSign;
      return `Royal Flush (${cardSign})`;
    }
    case 8: {
      const cardSign = getFlush(cards)![0].cardSign;
      return `Straight Flush (${cardSign})`;
    }
    case 7: {
      const cardNumber = getFourOfAKind(cards)![0].cardNumber;
      return `Four of a kind - ${cardNumber}`;
    }
    case 6: {
      const cardNum1 = getFullHouse(cards)![4].cardNumber;
      const cardNum2 = getFullHouse(cards)![0].cardNumber;
      return `Full house ${cardNum1} ${cardNum2}`;
    }
    case 5: {
      const cardSign = getFlush(cards)![0].cardSign;
      return `Flush ${cardSign}`;
    }
    case 4:
      return "Straight";
    case 3: {
      const cardNumber = getThreeOfKind(cards)![0].cardNumber;
      return `Tree of a kind ${cardNumber}`;
    }
    case 2: {
      const cardNumber = getTwoPairs(cards)![0].cardNumber;
      const cardNum2 = getTwoPairs(cards)![3].cardNumber;
      return `Tow pair ${cardNumber} and ${cardNum2}`;
    }
    case 1: {
      const cardNumber = getPair(cards)![0].cardNumber;
      return `Pair ${cardNumber}`;
    }
    case 0: {
      const cardNumber = getHighCard(cards)![0].cardNumber;
      return `High card ${cardNumber}`;
    }
  }
}

function renderWinHand(player: Player) {
  const winHandName = getHandName(player.allCards);
  const rootElement = document.querySelector(".winPlayerDiv") as HTMLElement;
  const cardsElements = player.allCards
    .map((c) => {
      if (c.partOfSet) {
        return `<div class="card partOfSet" name="${c.cardNumber + c.cardSign}">
                 <h3 class="cardN">${c.cardNumber}</h3>
                 <img class="cardS" src="${c.srcImgCard}"  alt="">
                 </div>`;
      } else {
        return `<div class="card " name="${c.cardNumber + c.cardSign}">
          <h3 class="cardN">${c.cardNumber}</h3>
          <img class="cardS" src="${c.srcImgCard}"  alt="">
          </div>`;
      }
    })
    .join(" ");

  const html = `
  
  <h2 class="handName">${winHandName}</h2>
        <div class="winPlayerDiv__information">
          <div class="winPlayerDiv__information__winnerNameAndImg">
            <img src="${player.imgSrc}" alt="" />
            <h3>${player.userName}</h3>
          </div>

          <div class="winPlayerDiv__information__winnerHandName">
            <div class="winPlayerDiv__information__winnerChips">
             <p>${player.chips} $ </p> 
            </div>
          </div>
        </div>
        <div class="winPlayerDiv__handCard">${cardsElements}</div>
    `;

  rootElement.innerHTML = html;
}

function renderPage() {
  const winner = checkWinner(players);
  getBestHandForEachPlayer(winner);
  renderWinHand(winner);
}
