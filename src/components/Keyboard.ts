import { getKeyboardState } from '../gameState';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

export function Keyboard(): string {
  const keyboardState = getKeyboardState();

  const rowsHtml = ROWS.map(row => {
    const keysHtml = row.map(key => {
      const status = key.length === 1 ? (keyboardState.get(key) ?? '') : '';
      const classes = ['key'];
      if (key === 'ENTER' || key === '⌫') classes.push('key-wide');
      if (status) classes.push(`key-${status}`);
      return `<button class="${classes.join(' ')}" data-key="${key}">${key}</button>`;
    }).join('');
    return `<div class="keyboard-row">${keysHtml}</div>`;
  }).join('');

  return `<div class="keyboard" id="keyboard">${rowsHtml}</div>`;
}
