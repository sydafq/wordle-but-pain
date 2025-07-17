import { WordCard } from './WordCard';
import { WordInput } from './WordInput';

// Generate a random 5-letter word (A-Z)
function randomWord(length = 5) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}

export const wordOfTheDay = randomWord();

// Store guesses in an array
let guesses: string[] = [];

function renderGrid() {
  let grid = '';
  for (let row = 0; row < 5; row++) {
    grid += '<div class="word-row">';
    // Only render guesses that exist, empty rows otherwise
    const guess = guesses[row] || '';
    for (let col = 0; col < 5; col++) {
      const letter = guess[col] || '';
      let status: 'correct' | 'present' | 'absent' | undefined = undefined;
      if (guess && letter) {
        if (letter === wordOfTheDay[col]) {
          status = 'correct';
        } else if (wordOfTheDay.includes(letter)) {
          status = 'present';
        } else {
          status = 'absent';
        }
      }
      grid += WordCard(letter, status);
    }
    grid += '</div>';
  }
  return grid;
}

export function Body() {
  // Render the grid and input
  return `
    <div class="body-grid" id="body-grid">
        <!-- Debug only: display the word of the day -->
        <div>${wordOfTheDay}</div>
        ${renderGrid()}
        <div class="word-input-row">${guesses.length < 5 ? WordInput() : ''}</div>
    </div>`;
}

// Add interactivity after DOM is loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector<HTMLInputElement>('.word-input');
    if (input) {
      input.addEventListener('keyup', () => {
        if (input.value.length === 5 && guesses.length < 5) {
          guesses.push(input.value.toUpperCase());
          input.value = '';
          // Re-render the grid
          const bodyGrid = document.getElementById('body-grid');
          if (bodyGrid) {
            bodyGrid.innerHTML = `<!-- Debug only: display the word of the day -->\n<div>${wordOfTheDay}</div>` + renderGrid() + `<div class=\"word-input-row\">${guesses.length < 5 ? WordInput() : ''}</div>`;
          }
        }
      });
    }
  });
}
