export function WordCard(letter: string = '', status?: 'correct' | 'present' | 'absent') {
  let statusClass = status ? `word-card-${status}` : '';
  return `<div class="word-card ${statusClass}">${letter}</div>`;
}
