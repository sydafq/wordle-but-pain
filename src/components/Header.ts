import { state, DIFFICULTIES } from '../gameState';
import type { Difficulty } from '../gameState';

export function Header(): string {
  const diffButtons = (Object.entries(DIFFICULTIES) as [Difficulty, typeof DIFFICULTIES[Difficulty]][])
    .map(([key, config]) => {
      const isActive = state.difficulty === key;
      return `<button class="difficulty-btn${isActive ? ' active' : ''}" data-difficulty="${key}">${config.label}</button>`;
    })
    .join('');

  return `
    <header class="game-header">
      <h1 class="game-title">Wordle but Pain!</h1>
      <div class="difficulty-selector">${diffButtons}</div>
    </header>
  `;
}
