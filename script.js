const dice = document.getElementById("dice");
const diceTwo = document.getElementById("dice-two");
const rollButton = document.getElementById("roll-button");
const result = document.getElementById("result");
const diceCount = document.getElementById("dice-count");
const historyList = document.getElementById("history");
const emptyHistory = document.getElementById("empty-history");
const soundToggle = document.getElementById("sound-toggle");
const themeToggle = document.getElementById("theme-toggle");

const patterns = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
};

const rollDuration = 900;

let isRolling = false;
let rollNumber = 0;
let soundEnabled = false;
let audioContext = null;
let masterGain = null;

// Storage can be unavailable in some browser settings.
function readSetting(key, fallback) {
    try {
        return localStorage.getItem(key) ?? fallback;
    } catch {
        return fallback;
    }
}

function saveSetting(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // The controls still work without saving preferences.
    }
}

// THEME

function applyTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle("light", isLight);
    themeToggle.textContent = isLight ? "Dark mode" : "Light mode";
    themeToggle.setAttribute("aria-pressed", String(isLight));
}

applyTheme(readSetting("cosmic-theme", "dark"));

themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light")
        ? "dark"
        : "light";

    applyTheme(nextTheme);
    saveSetting("cosmic-theme", nextTheme);
});

// SOUND

function updateSoundButton() {
    soundToggle.textContent = soundEnabled ? "Sound: On" : "Sound: Off";
    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
}

async function prepareAudio() {
    const AudioClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioClass) {
        throw new Error("Browser audio is unavailable");
    }

    if (!audioContext) {
        audioContext = new AudioClass();

        masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);
    }

    await audioContext.resume();
}

soundToggle.addEventListener("click", async () => {
    soundEnabled = !soundEnabled;
    updateSoundButton();

    if (!soundEnabled) {
        if (masterGain) {
            masterGain.gain.setValueAtTime(0, audioContext.currentTime);
        }
        return;
    }

    try {
        await prepareAudio();
        masterGain.gain.setValueAtTime(
            soundEnabled ? 0.12 : 0,
            audioContext.currentTime
        );
    } catch {
        soundEnabled = false;
        updateSoundButton();
        soundToggle.textContent = "Sound unavailable";
    }
});

function playTone(frequency, start, duration) {
    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(
        frequency * 1.025,
        start + duration
    );

    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(0.35, start + 0.015);
    envelope.gain.exponentialRampToValueAtTime(
        0.001,
        start + duration
    );

    oscillator.connect(envelope);
    envelope.connect(masterGain);

    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);

    oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
    };
}

async function playCosmicSound() {
    if (!soundEnabled) {
        return;
    }

    try {
        await prepareAudio();

        if (!soundEnabled) {
            return;
        }

        masterGain.gain.setValueAtTime(0.12, audioContext.currentTime);

        const start = audioContext.currentTime + 0.01;
        const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99];

        notes.forEach((frequency, index) => {
            playTone(frequency, start + index * 0.10, 0.22);
        });

        // A soft final chord as the dice land.
        [523.25, 659.25, 783.99].forEach((frequency) => {
            playTone(frequency, start + 0.87, 0.35);
        });
    } catch {
        soundEnabled = false;
        updateSoundButton();
    }
}

// DICE AND HISTORY

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
    result.textContent = "The cosmos is deciding…";

    const count = Number(diceCount.value);
    const activeDice = count === 2 ? [dice, diceTwo] : [dice];

    playCosmicSound();

    for (const element of activeDice) {
        element.classList.add("rolling");
    }

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
    }, rollDuration);
}

function resetDiceDisplay() {
    diceTwo.hidden = diceCount.value === "1";

    drawDie(dice, 1);
    drawDie(diceTwo, 1);

    result.textContent = "Click the button to roll.";
}

diceCount.addEventListener("change", resetDiceDisplay);
rollButton.addEventListener("click", rollDice);

resetDiceDisplay();
updateSoundButton();