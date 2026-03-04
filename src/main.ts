import './style.css';
import {
  state,
  startNewGame,
  addLetter,
  removeLetter,
  submitGuess,
  DIFFICULTIES,
} from './gameState';
import type { Difficulty } from './gameState';
import { Header } from './components/Header';
import { Grid } from './components/Grid';
import { Keyboard } from './components/Keyboard';
import { Footer } from './components/Footer';

function statusBar(): string {
  const config = DIFFICULTIES[state.difficulty];
  if (state.errorMessage) {
    return `<div class="status-msg status-error">${state.errorMessage}</div>`;
  }
  if (state.won) {
    return `<div class="status-msg status-win">You got it in ${state.guesses.length}/${config.maxGuesses}!</div>`;
  }
  if (state.gameOver) {
    return `<div class="status-msg status-lose">The word was <strong>${state.targetWord}</strong></div>`;
  }
  return `<div class="status-msg status-info">Guess ${state.guesses.length + 1} of ${config.maxGuesses}</div>`;
}

function render(): void {
  const app = document.querySelector<HTMLDivElement>('#app')!;

  const newGameBtn = state.gameOver
    ? '<button class="new-game-btn" id="new-game-btn">New Game</button>'
    : '';

  app.innerHTML = `
    ${Header()}
    <main class="game-main">
      ${statusBar()}
      ${Grid()}
      ${Keyboard()}
      ${newGameBtn}
    </main>
    ${Footer()}
  `;

  attachListeners();
}

function attachListeners(): void {
  // Difficulty selector
  document.querySelectorAll<HTMLButtonElement>('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      startNewGame(btn.dataset.difficulty as Difficulty);
      render();
    });
  });

  // On-screen keyboard
  document.querySelectorAll<HTMLButtonElement>('.key').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key!;
      if (key === 'ENTER') submitGuess();
      else if (key === '⌫') removeLetter();
      else addLetter(key);
      render();
    });
  });

  // New game button
  document.getElementById('new-game-btn')?.addEventListener('click', () => {
    startNewGame();
    render();
  });
}

// Physical keyboard support
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  if (e.key === 'Enter') {
    submitGuess();
    render();
  } else if (e.key === 'Backspace') {
    removeLetter();
    render();
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    addLetter(e.key.toUpperCase());
    render();
  }
});

// Boot
startNewGame();
render();
