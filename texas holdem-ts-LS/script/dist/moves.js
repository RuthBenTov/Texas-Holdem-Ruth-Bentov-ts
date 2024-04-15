///-----------------------myPlayerMoves--------------------
function playTheButton(myOption) {
    document.querySelectorAll(".operations__btn").forEach(function (button) {
        button.disabled = "false";
    });
    if (myOption.length == 2) {
        //check or rise{
        document.querySelector(".operations__btn--call").disabled = true;
        document.querySelector(".operations__btn--fold").disabled = true;
        document.querySelector(".operations__btn--rise").disabled = false;
        document.querySelector(".operations__btn--check").disabled = false;
    }
    else {
        //call or rise or fold
        document.querySelector(".operations__btn--call").disabled = false;
        document.querySelector(".operations__btn--fold").disabled = false;
        document.querySelector(".operations__btn--rise").disabled = false;
        document.querySelector(".operations__btn--check").disabled = true;
    }
}
function myPlayerHandleCheck() {
    var myPlayer = players.find(function (p) { return p.id == "myPlayer"; });
    myPlayer === null || myPlayer === void 0 ? void 0 : myPlayer.checkMove(players);
    delayedTurnOrder(players);
}
function myPlayerHandleFold() {
    var myPlayer = players.find(function (p) { return p.id == "myPlayer"; });
    myPlayer === null || myPlayer === void 0 ? void 0 : myPlayer.foldMove(players);
    delayedTurnOrder(players);
}
function myPlayerHandleRise() {
    var myPlayer = players.find(function (p) { return p.id == "myPlayer"; });
    var inputSizeToBet = Number(prompt("Enter your bet here:"));
    while (isNaN(inputSizeToBet)) {
        inputSizeToBet = Number(prompt("Enter again your bet here in number:"));
    }
    myPlayer === null || myPlayer === void 0 ? void 0 : myPlayer.riseMove(players, inputSizeToBet);
    delayedTurnOrder(players);
}
function myPlayerHandleCall() {
    var myPlayer = players.find(function (p) { return p.id == "myPlayer"; });
    var myPlayerIndex = players.findIndex(function (p) { return p.id == "myPlayer"; });
    myPlayer === null || myPlayer === void 0 ? void 0 : myPlayer.callMove(players, myPlayerIndex);
    delayedTurnOrder(players);
}
//------------------------
