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

//royal flush
function checkRoyalFlush(cards: Card[]) {
  try {
    if (checkFlush(cards) && checkRoyalStraight(cards)) return true;
    return false;
  } catch (error) {
    console.error(error);
  }
}

//straight flush
function checkStraightFlush(cards: Card[]) {
  try {
    if (checkStraight(cards) && checkRoyalStraight(cards)) return true;
    return false;
  } catch (error) {
    console.error(error);
  }
}

//four of a kind
function checkFourOfAKind(cards: Card[]) {
  const copiedCards = [...cards];

  for (let i = 0; i < copiedCards.length; i++) {
    const tempArray = copiedCards.slice(i + 1);
    const sameNumberCards = tempArray.filter(
      (card) => card.cardNumber === copiedCards[i].cardNumber,
    );
    if (sameNumberCards.length == 3) {
      return true;
    }
  }

  return false;
}

//full house
function checkFullHouse(cards: Card[]) {
  const pairs = {};

  cards.forEach((card) => {
    if (!pairs[card.cardNumber]) {
      pairs[card.cardNumber] = 1;
    } else {
      pairs[card.cardNumber]++;
    }
  });

  const pairValues = Object.values(pairs);
  const pairCounts =
    pairValues.filter((count) => count === 2).length > 0 ? true : false;
  const threeOfKindCounts =
    pairValues.filter((count) => count === 3).length > 0 ? true : false;
  return pairCounts && threeOfKindCounts;
}

//flush
function checkFlush(cards: Card[]) {
  try {
    for (let i = 0; i < cards.length - 4; i++) {
      const tempCardsSign = cards.filter(
        (c) => c.cardSign == cards[i].cardSign,
      );
      if (tempCardsSign.length >= 5) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(error);
  }
}

//straight

function checkStraight(cards: Card[]) {
  try {
    const cardsNumbers = cards.map((card) =>
      getCardNumberValue(card.cardNumber),
    );
    const sortedCardsNumbers = cardsNumbers.sort();

    let count = 0;
    for (let i = 0; i < sortedCardsNumbers.length - 1; i++) {
      if (sortedCardsNumbers[i + 1] - sortedCardsNumbers[i] === 1) {
        count++;
        if (count === 4) {
          return true;
        }
      } else {
        count = 0;
      }
    }
    if (checkRoyalStraight(cards)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
  }
}

function checkRoyalStraight(cards: Card[]) {
  const cardsNumbers = cards.map((card) => getCardNumberValue(card.cardNumber));
  const sortedCardsNumbers = cardsNumbers.sort();
  if (
    sortedCardsNumbers.includes(10) &&
    sortedCardsNumbers.includes(11) &&
    sortedCardsNumbers.includes(12) &&
    sortedCardsNumbers.includes(13) &&
    sortedCardsNumbers.includes(1)
  ) {
    return true;
  }
  return false;
}

//three of a kind
function checkThreeOfAKind(cards: Card[]) {
  const copiedCards = [...cards];

  for (let i = 0; i < copiedCards.length; i++) {
    const tempArray = copiedCards.slice(i + 1);
    const sameNumberCards = tempArray.filter(
      (card) => card.cardNumber === copiedCards[i].cardNumber,
    );
    if (sameNumberCards.length == 2) {
      return true;
    }
  }

  return false;
}

//two pairs
function checkTwoPairs(cards: Card[]) {
  const pairs = {};

  cards.forEach((card) => {
    if (!pairs[card.cardNumber]) {
      pairs[card.cardNumber] = 1;
    } else {
      pairs[card.cardNumber]++;
    }
  });

  const pairValues = Object.values(pairs);
  const pairCounts = pairValues.filter((count) => count === 2);

  return pairCounts.length >= 2;
}

//one pair
function checkPair(cards: Card[]) {
  const copiedCards = [...cards];
  

  for (let i = 0; i < copiedCards.length; i++) {
    const tempArray = copiedCards.slice(i);
    const sameNumberCards = tempArray.filter(
      (card) => card.cardNumber === copiedCards[i].cardNumber,
    );

    if (sameNumberCards.length == 1) {
      return true;
    }
  }

  return false;
}


function  getPair(cards: Card[]) {
  const cardCounts = {};

  let duplicateCards;

  cards.forEach((card) => {
    const cardNumber = card.cardNumber;
    if (cardCounts[cardNumber]) {
      duplicateCards = [cardCounts[cardNumber], card];
    } else {
      cardCounts[cardNumber] = card;
    }
  });

  return duplicateCards;
}

function getTwoPairs(cards) {
  const cardCounts: { [key: string]: Card[] } = {};

  cards.forEach((card) => {
    const cardNumber = card.cardNumber;
    if (cardCounts[cardNumber]) {
      cardCounts[cardNumber].push(card);
    } else {
      cardCounts[cardNumber] = [card];
    }
  });

  const twoPairs = Object.values(cardCounts).filter((group) => group.length === 2);  
  if (twoPairs.length === 2) {
    return [...twoPairs[0], ...twoPairs[1]];
  }
 
  return null;
}



function getFullHouse(cards: Card[]): Card[] | null {
  const cardCounts: { [key: string]: Card[] } = {};

  cards.forEach((card) => {
    const cardNumber = card.cardNumber;
    if (cardCounts[cardNumber]) {
      cardCounts[cardNumber].push(card);
    } else {
      cardCounts[cardNumber] = [card];
    }
  });

  let twoOfAKind: Card[] | null = null;
  let threeOfAKind: Card[] | null = null;

  Object.values(cardCounts).forEach((group) => {
    if (group.length === 2) {
      twoOfAKind = group;
    } else if (group.length === 3) {
      threeOfAKind = group;
    }
  });

  if (twoOfAKind && threeOfAKind) {
    return [...twoOfAKind, ...threeOfAKind];
  }

  return null;
}

function getThreeOfKind(cards: Card[]): Card[] | null {
  const cardCounts: { [key: string]: Card[] } = {};

 
  cards.forEach((card) => {
    const cardNumber = card.cardNumber;
    if (cardCounts[cardNumber]) {
      cardCounts[cardNumber].push(card);
    } else {
      cardCounts[cardNumber] = [card];
    }
  });

  const threeOfAKind = Object.values(cardCounts).find((group) => group.length === 3);
  
  if (threeOfAKind) {
    return threeOfAKind;
  }
  return null;
}


function getFourOfAKind(cards: Card[]): Card[] | null {
  const cardCounts: { [key: string]: Card[] } = {};

  cards.forEach((card) => {
    const cardNumber = card.cardNumber;
    if (cardCounts[cardNumber]) {
      cardCounts[cardNumber].push(card);
    } else {
      cardCounts[cardNumber] = [card];
    }
  });

  const fourOfAKind = Object.values(cardCounts).find((group) => group.length === 4);

  if (fourOfAKind) {
    return fourOfAKind;
  }

  return null;
}


function getFlush(cards: Card[]): Card[] | null {
  const signCounts: { [key: string]: Card[] } = {};

  // Iterate through the cards and group them by cardSign
  cards.forEach((card) => {
    const cardSign = card.cardSign;
    if (signCounts[cardSign]) {
      signCounts[cardSign].push(card);
    } else {
      signCounts[cardSign] = [card];
    }
  });

  // Find five of a kind (if any)
  const fiveOfAKind = Object.values(signCounts).find((group) => group.length === 5);

  // Check if we found five of a kind
  if (fiveOfAKind) {
    return fiveOfAKind;
  }

  // If no five of a kind found, return null
  return null;
}



function getStraight(cards: Card[]): Card[] | null {
    const sortedCards = cards.slice().sort((a, b) => {
      const valueA = getCardNumberValue(a.cardNumber);
      const valueB = getCardNumberValue(b.cardNumber);
      return valueA - valueB;
    });
  
    let highestStraight: Card[] | null = null;
    let currentStraight: Card[] = [sortedCards[0]];
  
    for (let i = 1; i < sortedCards.length; i++) {
      const currentValue = getCardNumberValue(sortedCards[i].cardNumber);
      const prevValue = getCardNumberValue(sortedCards[i - 1].cardNumber);
  
      if (currentValue === prevValue + 1) {
        currentStraight.push(sortedCards[i]);
      } else if (currentValue !== prevValue) {
        currentStraight = [sortedCards[i]];
      }
  
      if (
        currentStraight.length === 5 &&
        (!highestStraight || getCardNumberValue(currentStraight[4].cardNumber) > getCardNumberValue(highestStraight[4].cardNumber))
      ) {
        highestStraight = currentStraight;
      }
    }
  
    if (highestStraight && highestStraight.length > 5) {
      highestStraight = highestStraight.slice(highestStraight.length - 5);
    }
  
    return highestStraight;
  }



  function areRoyalNumbers(cards: Card[]): boolean {
    const validNumbers = new Set(["10", "J", "Q", "K", "A"]);
    return cards.every((card) => validNumbers.has(card.cardNumber));
  }
  
  function areAllSameSign(cards: Card[]): boolean {
    const sign = cards[0].cardSign;
    return cards.every((card) => card.cardSign === sign);
  }
  
  
  function getRoyalFlush(cards: Card[]): Card[] | null {
    if (cards.length !== 5 || !areRoyalNumbers(cards) || !areAllSameSign(cards)) {
      return null;
    }

    const sortedCards = cards.slice().sort((a, b) => {
      const valueA = getCardNumberValue(a.cardNumber);
      const valueB = getCardNumberValue(b.cardNumber);
      return valueA - valueB;
    });  
  
    if (
      getCardNumberValue(sortedCards[0].cardNumber) === 10 &&
      getCardNumberValue(sortedCards[1].cardNumber) === 11 &&
      getCardNumberValue(sortedCards[2].cardNumber) === 12 &&
      getCardNumberValue(sortedCards[3].cardNumber) === 13 &&
      getCardNumberValue(sortedCards[4].cardNumber) === 14
    ) {
      return sortedCards;
    }
  
    return null;
  }
  


function getStraightFlash(cards: Card[]): Card[] | null {
if(getFlush(cards)!=null && getStraight(cards)!=null){
  if(getFlush(getStraight(cards)!)!=null){
    return getStraight(getFlush(getStraight(cards)!)!);
  }
}
return null
}

//high card
function getHighCard(cards: Card[]) {
  const cardValues = {
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
    K: 13,
  };

  let temp = cards[0];
  cards.forEach((card) => {
    if (cardValues[card.cardNumber] > cardValues[temp.cardNumber]) {
      temp = card;
    }
  });

  return temp;
}




/////////------------------------

function getCardNumberValue(cardNumber: string): number {
  try {
    if (cardNumber === "A") return 1;
    if (cardNumber === "J") return 11;
    if (cardNumber === "Q") return 12;
    if (cardNumber === "K") return 13;
    return parseInt(cardNumber);
  } catch (error) {
    console.error(error);
    return -1;
  }
}




const cardsArr: Card[] = [
  new Card("2", "heart"),
  new Card("2", "heart"),
  new Card("4", "heart"),
  new Card("5", "heart"),
  new Card("a", "heart"),
  new Card("9", "club"),
  new Card("9", "diamond"),
];

console.log(getTwoPairs(cardsArr));
