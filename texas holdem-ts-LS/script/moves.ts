///-----------------------myPlayerMoves--------------------

function playTheButton(myOption: string[]) {
  (document.querySelectorAll(".operations__btn")as NodeListOf<HTMLButtonElement>).forEach((button) => {
    button.disabled = "false";
  });
  if (myOption.length == 2) {
    //check or rise{
    (
      document.querySelector(".operations__btn--call") as HTMLButtonElement
    ).disabled = true;
    (
      document.querySelector(".operations__btn--fold") as HTMLButtonElement
    ).disabled = true;
    (
      document.querySelector(".operations__btn--rise") as HTMLButtonElement
    ).disabled = false;
    (
      document.querySelector(".operations__btn--check") as HTMLButtonElement
    ).disabled = false;
  } else {
    //call or rise or fold
    (
      document.querySelector(".operations__btn--call") as HTMLButtonElement
    ).disabled = false;
    (
      document.querySelector(".operations__btn--fold") as HTMLButtonElement
    ).disabled = false;
    (
      document.querySelector(".operations__btn--rise") as HTMLButtonElement
    ).disabled = false;
    (
      document.querySelector(".operations__btn--check") as HTMLButtonElement
    ).disabled = true;
  }
}

function myPlayerHandleCheck() {
  const myPlayer = players.find((p) => p.id == "myPlayer");
  myPlayer?.checkMove(players);

  delayedTurnOrder(players);

}
function myPlayerHandleFold() {
  const myPlayer = players.find((p) => p.id == "myPlayer");
  myPlayer?.foldMove(players);

  delayedTurnOrder(players);

}

function myPlayerHandleRise() {
  const myPlayer = players.find((p) => p.id == "myPlayer");
  let inputSizeToBet: number = Number(prompt("Enter your bet here:"));
  while (isNaN(inputSizeToBet)) {
    inputSizeToBet = Number(prompt("Enter again your bet here in number:"));
  }
  myPlayer?.riseMove(players, inputSizeToBet);
  
  
  delayedTurnOrder(players);
}

function myPlayerHandleCall() {
  const myPlayer = players.find((p) => p.id == "myPlayer");
  const myPlayerIndex = players.findIndex((p) => p.id == "myPlayer");
  myPlayer?.callMove(players, myPlayerIndex);

  delayedTurnOrder(players);

}

//------------------------



