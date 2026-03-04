import { state, evaluateGuess, DIFFICULTIES } from '../gameState';

export function Grid(): string {
  const config = DIFFICULTIES[state.difficulty];
  const { guesses, currentGuess, targetWord, gameOver } = state;

  let rows = '';

  for (let row = 0; row < config.maxGuesses; row++) {
    let cells = '';

    if (row < guesses.length) {
      // Submitted row – show coloured tiles
      const guess = guesses[row];
      const statuses = evaluateGuess(guess, targetWord);
      for (let col = 0; col < config.wordLength; col++) {
        cells += `<div class="tile tile-${statuses[col]}">${guess[col]}</div>`;
      }
    } else if (row === guesses.length && !gameOver) {
      // Active typing row
      for (let col = 0; col < config.wordLength; col++) {
        const letter = currentGuess[col] ?? '';
        const extra = col < currentGuess.length ? ' tile-filled' : '';
        cells += `<div class="tile tile-current${extra}">${letter}</div>`;
      }
    } else {
      // Future empty row
      for (let col = 0; col < config.wordLength; col++) {
        cells += '<div class="tile tile-empty"></div>';
      }
    }

    rows += `<div class="grid-row">${cells}</div>`;
  }

  return `<div class="grid" data-word-length="${config.wordLength}">${rows}</div>`;
}
