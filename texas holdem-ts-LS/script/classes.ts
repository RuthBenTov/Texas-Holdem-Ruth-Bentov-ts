//---------------------------Card--------------------

class Card {
  public cardName: string;
  public srcImgCard: string;
  constructor(public cardNumber: string, public cardSign: string ,public partOfSet:boolean = false ) {
    this.cardName = `${this.cardNumber}-${cardSign}`;
    this.srcImgCard = this.getSignCardSrc() as string;
  }
  getSignCardSrc() {
    switch (this.cardSign) {
      case "heart": {
        return "../images/heart-sign1.png";
      }
      case "diamond": {
        return "../images/diamond-sign1.png";
      }
      case "club": {
        return "../images/club-sign1.png";
      }
      case "spade": {
        return "../images/spade-sign1.png";
      }
    }
  }

  renderCard(root = document.body.querySelector(".cards")) {
    root!.innerHTML += this.getHtmlRenderCard();
  }

  getHtmlRenderCard() {
    return `<div class="card" name="${this.cardNumber + this.cardSign}">
              <h3 class="cardN">${this.cardNumber}</h3>
              <img class="cardS" src="${this.srcImgCard}"  alt="">
              </div>`;
  }
}
//---------------------------Player--------------------
class Player {
  static playerCount = 0;

  constructor(
    public userName: string,
    public imgSrc: string = "",
    public id: string = createID(),
    public chips: number = 100000,
    public isActive: boolean = true,
    public isTurn: boolean = false,
    public pCards: Card[] = get2RandomCards(),
    public allCards: Card[] = pCards,
    public movesInRound: PlayerMovesOption[] = [],
    public lastBet: number = 0,
    public roundNumber = movesInRound.length - 1,
    public turnNumber: number = Player.playerCount++,
  ) {
    this.pCards = this.pCards.map((c) => new Card(c.cardNumber, c.cardSign));
  }

  setActive() {
    this.isActive = !this.isActive;
    if (!this.isActive) {
      const thisImgDiv = document.querySelectorAll(".playerPanel__img")[
        this.turnNumber
      ] as HTMLDivElement;
      thisImgDiv.classList.add("panelIsntActive");
    }
  }

  setTurn() {
    this.isTurn = !this.isTurn;
    if (this.isTurn) {
      const thisImgDiv = document.querySelectorAll(".playerPanel__img")[
        this.turnNumber
      ] as HTMLDivElement;
      console.log(thisImgDiv);

      thisImgDiv.classList.add("panelInTurn");
    } else {
      const thisImgDiv = document.querySelectorAll(".playerPanel__img")[
        this.turnNumber
      ] as HTMLDivElement;
      console.log(thisImgDiv);
      thisImgDiv.classList.remove("panelInTurn");
    }
  }

  renderMyPanel() {
    try {
      this.pCards!.forEach((c) =>
        c.renderCard(document.querySelector(".myPanel__cards") as HTMLElement),
      );

      (document.querySelector(".myPanel__img img") as HTMLImageElement).src =
        this.imgSrc;
      document.querySelector(".myPanel__chips")!.innerHTML =
        this.chips.toString();
    } catch (error) {
      console.error(error);
    }
  }

  renderTurn() {
    const divID = this.turnNumber;

    const root = document.getElementById(
      `player${divID}Panel`,
    ) as HTMLDivElement;

    const input =
      this.lastBet > 0
        ? this.lastBet.toString()
        : this.movesInRound[this.movesInRound.length - 1];

    root.querySelector(".playerPanel__inputChips")!.innerHTML = ` 
  <img src="../images/casino-chip.png" alt="" />
  <h4>${input}</h4>
  `;
  }

  addCardToPlayer(card: Card) {
    this.allCards.push(card);
  }

  doingTurn(activePlayers: Player[], thisIndex: number) {
    console.log(`${this.userName} is doing somethig......`);
    activePlayers.forEach((p) => {
      p.isTurn = true;
      p.setTurn();
    });
    this.setTurn();
    let movesOptions = getMoveOption(activePlayers, thisIndex);
    let pointOfOptionalSet = getPointOfOptionalSet(this);
    let sizeOfBet = getSizeOfBet(pointOfOptionalSet, this.chips, thisIndex);

    chooseMove(
      activePlayers,
      movesOptions!,
      sizeOfBet,
      pointOfOptionalSet,
      this,
    );
  }

  checkMove(players: Player[]) {
    {
      this.movesInRound.push(PlayerMovesOption.check);
      this.lastBet = 0;
    }
    localStorage.setItem("players", JSON.stringify(players));
    this.renderTurn();

    delayedTurnOrder(players);
  }

  foldMove(players: Player[]) {
    this.movesInRound.push(PlayerMovesOption.fold);
    this.lastBet = 0;
    this.setActive();

    localStorage.setItem("players", JSON.stringify(players));
    this.renderTurn();

    delayedTurnOrder(players);
  }

  callMove(players: Player[], currentPlayerIndex: number) {
    this.movesInRound.push(PlayerMovesOption.call);
    const betToCall = riseBetSizeInThisRound(players, currentPlayerIndex);

    this.lastBet = betToCall;
    diler.setDilersChips(betToCall);
    this.chips = this.chips - betToCall;

    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("dilersChips", JSON.stringify(diler.dilersChips));
    this.renderTurn();

    this.renderThisChipsAgain();
    delayedTurnOrder(players);
  }

  riseMove(players: Player[], sizeOfBet: number) {
    this.movesInRound.push(PlayerMovesOption.rise);

    this.lastBet = sizeOfBet;
    this.chips -= sizeOfBet;
    diler.setDilersChips(sizeOfBet);

    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("dilersChips", JSON.stringify(diler.dilersChips));
    this.renderTurn();

    this.renderThisChipsAgain();
    delayedTurnOrder(players);
  }

  renderThisChipsAgain() {
    try {
      const playerElement = document.querySelector(
        `#player${this.turnNumber}Panel`,
      ) as HTMLElement;

      playerElement.querySelector(`.chipsPlayer`)!.innerHTML =
        this.chips.toString();
    } catch (error) {
      console.error(error);
    }
  }
}

enum PlayerMovesOption {
  fold = "fold",
  check = "check",
  rise = "rise",
  call = "call",
}

//------------------Dealer------------------------------
class Dealer {
  constructor(public sum: number) {}
}

const diler = {
  dilersChips: 0,

  setDilersChips(betSize: number) {
    diler.dilersChips += betSize;

    document.querySelector(".dealer__chips")!.innerHTML =
      diler.dilersChips.toString();

    localStorage.setItem("dilersChips", JSON.stringify(diler.dilersChips));
  },
};

//----------------Round--------------------------------
class Round {
  constructor(
    public activePlayers: Player[] = players,
    public firstPlayer: Player = activePlayers[0],
    public chipsOnTable: number = 0,
    public roundNumber: number = 0,
  ) {}

  setPlayers() {
    this.activePlayers = this.activePlayers.filter((p) => p.isActive == true);
  }
}
