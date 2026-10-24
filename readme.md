# 🌌 Cosmic Dice Roller

![Cosmic Dice Roller — dark theme](screenshots/dark-mode.png)

### Roll through the cosmos. Let chance decide.

[🚀 Launch Live Demo](https://cosmic-dice-roller.vercel.app/)

A space-themed dice rolling website with animated dice,
cosmic sound effects, and light/dark themes.
## Features

- Roll one or two six-sided dice.
- Display dice faces using CSS-drawn dots.
- Animate dice with opposite-direction spins in two-dice mode.
- Display individual results and their total.
- Show the last 10 rolls, newest first.
- Play synthesized cosmic sound effects with a sound toggle.
- Switch between light and dark themes.
- Remember the selected theme using localStorage.
- Adapt the layout to mobile and desktop screens.
- Support keyboard controls and reduced-motion preferences.

## Screenshots

### Dark Mode

![Dark theme with two dice and roll history](screenshots/dark-mode.png)

### Light Mode

![Light theme](screenshots/light-mode.png)

## Technologies

- HTML: page structure and controls.
- CSS: responsive layout, dice faces, themes and animations.
- JavaScript: random rolls, interactions and history.
- Web Audio API: synthesized sound effects.
- localStorage: theme preference storage.
- Vercel: website hosting.

## Run Locally

1. Clone the repository:

   git clone https://github.com/maltraxis-lang/cosmic-dice-roller.git

2. Open the project folder.
3. Open index.html in a browser.

No package installation or build step is required.
An internet connection is needed to load the Google Font;
a fallback font is used if it is unavailable.

## Project Files

- index.html — webpage structure.
- style.css — styling, themes and animations.
- script.js — dice logic, sound, controls and history.
- screenshots/ — website screenshots.

## How Randomness Works

Each die uses:

Math.floor(Math.random() * 6) + 1

Math.random() produces a pseudorandom number from 0 inclusive
to 1 exclusive. Multiplying by 6, rounding down and adding 1
maps the result to an integer from 1 to 6.

The six outcomes correspond to equal-sized intervals, avoiding
the endpoint bias that using Math.round() would introduce.

In two-dice mode, the random function is called separately for
each die. Repeated results are possible and expected.

This is a casual simulation, not a cryptographically secure
random generator.

## Behaviour and Limitations

- Results are revealed after a 900 ms animation delay.
- Rolling controls are disabled during a roll to prevent overlap.
- History contains only the latest 10 rolls and resets on refresh.
- Sound starts off and must be enabled by the user.
- Theme preferences persist when browser storage is available.
- Reduced-motion settings disable the dice animation.

## AI Assistance

AI assisted with code generation, styling and debugging.
The project was developed incrementally with Git commits.
