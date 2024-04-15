//---------------------------Card--------------------
var Card = /** @class */ (function () {
    function Card(cardNumber, cardSign, partOfSet) {
        if (partOfSet === void 0) { partOfSet = false; }
        this.cardNumber = cardNumber;
        this.cardSign = cardSign;
        this.partOfSet = partOfSet;
        this.cardName = this.cardNumber + "-" + cardSign;
        this.srcImgCard = this.getSignCardSrc();
    }
    Card.prototype.getSignCardSrc = function () {
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
    };
    Card.prototype.renderCard = function (root) {
        if (root === void 0) { root = document.body.querySelector(".cards"); }
        root.innerHTML += this.getHtmlRenderCard();
    };
    Card.prototype.getHtmlRenderCard = function () {
        return "<div class=\"card\" name=\"" + (this.cardNumber + this.cardSign) + "\">\n              <h3 class=\"cardN\">" + this.cardNumber + "</h3>\n              <img class=\"cardS\" src=\"" + this.srcImgCard + "\"  alt=\"\">\n              </div>";
    };
    return Card;
}());
//---------------------------Player--------------------
var Player = /** @class */ (function () {
    function Player(userName, imgSrc, id, chips, isActive, isTurn, pCards, allCards, movesInRound, lastBet, roundNumber, turnNumber) {
        if (imgSrc === void 0) { imgSrc = ""; }
        if (id === void 0) { id = createID(); }
        if (chips === void 0) { chips = 100000; }
        if (isActive === void 0) { isActive = true; }
        if (isTurn === void 0) { isTurn = false; }
        if (pCards === void 0) { pCards = get2RandomCards(); }
        if (allCards === void 0) { allCards = pCards; }
        if (movesInRound === void 0) { movesInRound = []; }
        if (lastBet === void 0) { lastBet = 0; }
        if (roundNumber === void 0) { roundNumber = movesInRound.length - 1; }
        if (turnNumber === void 0) { turnNumber = Player.playerCount++; }
        this.userName = userName;
        this.imgSrc = imgSrc;
        this.id = id;
        this.chips = chips;
        this.isActive = isActive;
        this.isTurn = isTurn;
        this.pCards = pCards;
        this.allCards = allCards;
        this.movesInRound = movesInRound;
        this.lastBet = lastBet;
        this.roundNumber = roundNumber;
        this.turnNumber = turnNumber;
        this.pCards = this.pCards.map(function (c) { return new Card(c.cardNumber, c.cardSign); });
    }
    Player.prototype.setActive = function () {
        this.isActive = !this.isActive;
        if (!this.isActive) {
            var thisImgDiv = document.querySelectorAll(".playerPanel__img")[this.turnNumber];
            thisImgDiv.classList.add("panelIsntActive");
        }
    };
    Player.prototype.setTurn = function () {
        this.isTurn = !this.isTurn;
        if (this.isTurn) {
            var thisImgDiv = document.querySelectorAll(".playerPanel__img")[this.turnNumber];
            console.log(thisImgDiv);
            thisImgDiv.classList.add("panelInTurn");
        }
        else {
            var thisImgDiv = document.querySelectorAll(".playerPanel__img")[this.turnNumber];
            console.log(thisImgDiv);
            thisImgDiv.classList.remove("panelInTurn");
        }
    };
    Player.prototype.renderMyPanel = function () {
        try {
            this.pCards.forEach(function (c) {
                return c.renderCard(document.querySelector(".myPanel__cards"));
            });
            document.querySelector(".myPanel__img img").src =
                this.imgSrc;
            document.querySelector(".myPanel__chips").innerHTML =
                this.chips.toString();
        }
        catch (error) {
            console.error(error);
        }
    };
    Player.prototype.renderTurn = function () {
        var divID = this.turnNumber;
        var root = document.getElementById("player" + divID + "Panel");
        var input = this.lastBet > 0
            ? this.lastBet.toString()
            : this.movesInRound[this.movesInRound.length - 1];
        root.querySelector(".playerPanel__inputChips").innerHTML = " \n  <img src=\"../images/casino-chip.png\" alt=\"\" />\n  <h4>" + input + "</h4>\n  ";
    };
    Player.prototype.addCardToPlayer = function (card) {
        this.allCards.push(card);
    };
    Player.prototype.doingTurn = function (activePlayers, thisIndex) {
        console.log(this.userName + " is doing somethig......");
        activePlayers.forEach(function (p) {
            p.isTurn = true;
            p.setTurn();
        });
        this.setTurn();
        var movesOptions = getMoveOption(activePlayers, thisIndex);
        var pointOfOptionalSet = getPointOfOptionalSet(this);
        var sizeOfBet = getSizeOfBet(pointOfOptionalSet, this.chips, thisIndex);
        chooseMove(activePlayers, movesOptions, sizeOfBet, pointOfOptionalSet, this);
    };
    Player.prototype.checkMove = function (players) {
        {
            this.movesInRound.push(PlayerMovesOption.check);
            this.lastBet = 0;
        }
        localStorage.setItem("players", JSON.stringify(players));
        this.renderTurn();
        delayedTurnOrder(players);
    };
    Player.prototype.foldMove = function (players) {
        this.movesInRound.push(PlayerMovesOption.fold);
        this.lastBet = 0;
        this.setActive();
        localStorage.setItem("players", JSON.stringify(players));
        this.renderTurn();
        delayedTurnOrder(players);
    };
    Player.prototype.callMove = function (players, currentPlayerIndex) {
        this.movesInRound.push(PlayerMovesOption.call);
        var betToCall = riseBetSizeInThisRound(players, currentPlayerIndex);
        this.lastBet = betToCall;
        diler.setDilersChips(betToCall);
        this.chips = this.chips - betToCall;
        localStorage.setItem("players", JSON.stringify(players));
        localStorage.setItem("dilersChips", JSON.stringify(diler.dilersChips));
        this.renderTurn();
        this.renderThisChipsAgain();
        delayedTurnOrder(players);
    };
    Player.prototype.riseMove = function (players, sizeOfBet) {
        this.movesInRound.push(PlayerMovesOption.rise);
        this.lastBet = sizeOfBet;
        this.chips -= sizeOfBet;
        diler.setDilersChips(sizeOfBet);
        localStorage.setItem("players", JSON.stringify(players));
        localStorage.setItem("dilersChips", JSON.stringify(diler.dilersChips));
        this.renderTurn();
        this.renderThisChipsAgain();
        delayedTurnOrder(players);
    };
    Player.prototype.renderThisChipsAgain = function () {
        try {
            var playerElement = document.querySelector("#player" + this.turnNumber + "Panel");
            playerElement.querySelector(".chipsPlayer").innerHTML =
                this.chips.toString();
        }
        catch (error) {
            console.error(error);
        }
    };
    Player.playerCount = 0;
    return Player;
}());
var PlayerMovesOption;
(function (PlayerMovesOption) {
    PlayerMovesOption["fold"] = "fold";
    PlayerMovesOption["check"] = "check";
    PlayerMovesOption["rise"] = "rise";
    PlayerMovesOption["call"] = "call";
})(PlayerMovesOption || (PlayerMovesOption = {}));
//------------------Dealer------------------------------
var Dealer = /** @class */ (function () {
    function Dealer(sum) {
        this.sum = sum;
    }
    return Dealer;
}());
var diler = {
    dilersChips: 0,
    setDilersChips: function (betSize) {
        diler.dilersChips += betSize;
        document.querySelector(".dealer__chips").innerHTML =
            diler.dilersChips.toString();
        localStorage.setItem("dilersChips", JSON.stringify(diler.dilersChips));
    }
};
//----------------Round--------------------------------
var Round = /** @class */ (function () {
    function Round(activePlayers, firstPlayer, chipsOnTable, roundNumber) {
        if (activePlayers === void 0) { activePlayers = players; }
        if (firstPlayer === void 0) { firstPlayer = activePlayers[0]; }
        if (chipsOnTable === void 0) { chipsOnTable = 0; }
        if (roundNumber === void 0) { roundNumber = 0; }
        this.activePlayers = activePlayers;
        this.firstPlayer = firstPlayer;
        this.chipsOnTable = chipsOnTable;
        this.roundNumber = roundNumber;
    }
    Round.prototype.setPlayers = function () {
        this.activePlayers = this.activePlayers.filter(function (p) { return p.isActive == true; });
    };
    return Round;
}());
