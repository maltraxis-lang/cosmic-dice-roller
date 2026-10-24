const dice = document.getElementById("dice");
const rollButton = document.getElementById("roll-button");
const result = document.getElementById("result");

const faces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function rollDice() {
    const roll = Math.floor(Math.random() * 6) + 1;

    dice.textContent = faces[roll - 1];
    dice.setAttribute("aria-label", `Die showing ${roll}`);
    result.textContent = `You rolled ${roll}!`;
}

rollButton.addEventListener("click", rollDice);
