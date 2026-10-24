const dice = document.getElementById("dice");
const diceTwo = document.getElementById("dice-two");
const rollButton = document.getElementById("roll-button");
const result = document.getElementById("result");
const diceCount = document.getElementById("dice-count");
const historyList = document.getElementById("history");
const emptyHistory = document.getElementById("empty-history");

// Positions on a 3-by-3 grid, numbered from 1 to 9.
const patterns = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
};

let isRolling = false;
let rollNumber = 0;

function drawDie(element, value) {
    element.replaceChildren();

    for (const position of patterns[value]) {
        const pip = document.createElement("span");
        pip.className = "pip";
        pip.setAttribute("aria-hidden", "true");

        pip.style.gridRow = Math.floor((position - 1) / 3) + 1;
        pip.style.gridColumn = ((position - 1) % 3) + 1;

        element.appendChild(pip);
    }

    element.setAttribute("aria-label", `Die showing ${value}`);
}

function randomRoll() {
    return Math.floor(Math.random() * 6) + 1;
}

function addHistory(values) {
    rollNumber += 1;

    const total = values.reduce((sum, value) => sum + value, 0);
    const entry = document.createElement("li");

    entry.textContent =
        `Roll ${rollNumber}: ${values.join(" + ")} — Total: ${total}`;

    historyList.prepend(entry);
    emptyHistory.hidden = true;

    if (historyList.children.length > 10) {
        historyList.lastElementChild.remove();
    }
}

function rollDice() {
    if (isRolling) {
        return;
    }

    isRolling = true;
    rollButton.disabled = true;
    diceCount.disabled = true;
    result.textContent = "Rolling through the cosmos…";

    const count = Number(diceCount.value);
    const activeDice = count === 2 ? [dice, diceTwo] : [dice];

    for (const element of activeDice) {
        element.classList.add("rolling");
    }

    // Reveal results after the animation finishes.
    setTimeout(() => {
        const values = activeDice.map(() => randomRoll());

        activeDice.forEach((element, index) => {
            element.classList.remove("rolling");
            drawDie(element, values[index]);
        });

        const total = values.reduce((sum, value) => sum + value, 0);

        result.textContent = count === 2
            ? `You rolled ${values[0]} + ${values[1]} = ${total}!`
            : `You rolled ${values[0]}!`;

        addHistory(values);

        isRolling = false;
        rollButton.disabled = false;
        diceCount.disabled = false;
    }, 600);
}

diceCount.addEventListener("change", () => {
    diceTwo.hidden = diceCount.value === "1";

    drawDie(dice, 1);
    drawDie(diceTwo, 1);

    result.textContent = "Click the button to roll.";
});

rollButton.addEventListener("click", rollDice);

drawDie(dice, 1);
drawDie(diceTwo, 1);
