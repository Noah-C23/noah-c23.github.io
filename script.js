let secretNumber;
let attempts;
let maxNumber;
let playerName = "";

const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const difficultySelect = document.getElementById('difficulty');
const startBtn = document.getElementById('start-btn');
const playerInput = document.getElementById('player-name');
const gameSection = document.getElementById('game-section');
const playerSection = document.getElementById('player-section');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const leaderboardDiv = document.getElementById('leaderboard');
const leaderboardList = document.getElementById('leaderboard-list');
const closeLeaderboardBtn = document.getElementById('close-leaderboard');

// Ask for name first (always)
window.addEventListener("load", () => {
    const savedName = localStorage.getItem("playerName");

    // Always show the name input first
    playerSection.style.display = "block";
    gameSection.style.display = "none";

    // If a name is saved, pre-fill it
    if (savedName) {
        playerInput.value = savedName;
    }
});

// Handle start game (after entering name)
startBtn.addEventListener('click', () => {
    playerName = playerInput.value.trim();
    if (!playerName) {
        alert("Please enter your name!");
        return;
    }
    // Save the name
    localStorage.setItem("playerName", playerName);

    // Switch to game
    playerSection.style.display = "none";
    gameSection.style.display = "block";

    startGame();
});

// Start a new game
function startGame() {
    maxNumber = Number(difficultySelect.value);
    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
    attempts = 0;
    message.textContent = `Game started! Guess a number between 1 and ${maxNumber}.`;
    attemptsDisplay.textContent = "Attempts: 0";
    guessInput.value = "";
    guessInput.disabled = false;
    submitBtn.disabled = false;
}

// Handle guess submission
submitBtn.addEventListener('click', () => {
    const guess = Number(guessInput.value);
    attempts++;

    if (!guess || guess < 1 || guess > maxNumber) {
        message.textContent = `⚠️ Enter a number between 1 and ${maxNumber}!`;
        return;
    }

    // Cheater Mode
    if (attempts > 10 && guess !== secretNumber) {
        message.textContent = `🤔 You've tried ${attempts} times... Secret number is ${secretNumber}!`;
        return;
    }

    // Correct guess
    if (guess === secretNumber) {
        message.textContent = `🎉 Correct, ${playerName}! You guessed it in ${attempts} tries.`;
        guessInput.disabled = true;
        submitBtn.disabled = true;

        saveScore(playerName, attempts, difficultySelect.options[difficultySelect.selectedIndex].text);
    }
    else if (guess < secretNumber) {
        message.textContent = "⬇️ Too low! Try again.";
    } else {
        message.textContent = "⬆️ Too high! Try again.";
    }

    // AI Hint
    if (guess !== secretNumber) {
        const difference = Math.abs(secretNumber - guess);
        if (difference <= 5) {
            message.textContent += " 🤖 You're really close!";
        }
    }

    attemptsDisplay.textContent = `Attempts: ${attempts}`;
    guessInput.value = "";
    guessInput.focus();
});

// Restart game
restartBtn.addEventListener('click', startGame);

// Change difficulty resets game
difficultySelect.addEventListener('change', startGame);

// Save score in localStorage
function saveScore(name, attempts, difficulty) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, attempts, difficulty });
    leaderboard.sort((a, b) => a.attempts - b.attempts); // best first
    leaderboard = leaderboard.slice(0, 10); // keep top 10
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// Show leaderboard
leaderboardBtn.addEventListener('click', () => {
    updateLeaderboard();
    leaderboardDiv.style.display = "block";
});

// Close leaderboard
closeLeaderboardBtn.addEventListener('click', () => {
    leaderboardDiv.style.display = "none";
});

// Update leaderboard display
function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboardList.innerHTML = "";
    leaderboard.forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${entry.name} - ${entry.attempts} attempts (${entry.difficulty})`;
        leaderboardList.appendChild(li);
    });
}
