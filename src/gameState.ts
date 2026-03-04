import { getWordList } from './words';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type LetterStatus = 'correct' | 'present' | 'absent';

export interface DifficultyConfig {
  wordLength: number;
  maxGuesses: number;
  label: string;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy:   { wordLength: 5, maxGuesses: 6, label: 'Easy (5)' },
  medium: { wordLength: 6, maxGuesses: 7, label: 'Medium (6)' },
  hard:   { wordLength: 7, maxGuesses: 8, label: 'Hard (7)' },
};

export interface GameState {
  difficulty: Difficulty;
  targetWord: string;
  guesses: string[];
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
  errorMessage: string;
}

export const state: GameState = {
  difficulty: 'easy',
  targetWord: '',
  guesses: [],
  currentGuess: '',
  gameOver: false,
  won: false,
  errorMessage: '',
};

/**
 * Evaluates a guess against the target using the standard Wordle algorithm:
 * 1. First pass marks exact matches (correct).
 * 2. Second pass marks letters present elsewhere, without double-counting.
 */
export function evaluateGuess(guess: string, target: string): LetterStatus[] {
  const result: LetterStatus[] = new Array(guess.length).fill('absent');
  const targetArr = target.split('');
  const guessArr = guess.split('');

  // Pass 1 – correct positions
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = 'correct';
      targetArr[i] = '#'; // mark consumed
      guessArr[i] = '*'; // mark handled
    }
  }

  // Pass 2 – present in wrong position
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === '*') continue;
    const idx = targetArr.indexOf(guessArr[i]);
    if (idx !== -1) {
      result[i] = 'present';
      targetArr[idx] = '#';
    }
  }

  return result;
}

/** Returns a map of letter → best known status across all submitted guesses. */
export function getKeyboardState(): Map<string, LetterStatus> {
  const keyMap = new Map<string, LetterStatus>();

  for (const guess of state.guesses) {
    const statuses = evaluateGuess(guess, state.targetWord);
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const status = statuses[i];
      const current = keyMap.get(letter);
      // Priority: correct > present > absent
      if (
        !current ||
        (current === 'absent') ||
        (current === 'present' && status === 'correct')
      ) {
        keyMap.set(letter, status);
      }
    }
  }

  return keyMap;
}

export function startNewGame(difficulty?: Difficulty): void {
  if (difficulty) state.difficulty = difficulty;
  const config = DIFFICULTIES[state.difficulty];
  const wordList = getWordList(config.wordLength);
  state.targetWord = wordList[Math.floor(Math.random() * wordList.length)];
  state.guesses = [];
  state.currentGuess = '';
  state.gameOver = false;
  state.won = false;
  state.errorMessage = '';
}

export function addLetter(letter: string): void {
  if (state.gameOver) return;
  const config = DIFFICULTIES[state.difficulty];
  if (state.currentGuess.length < config.wordLength) {
    state.currentGuess += letter;
    state.errorMessage = '';
  }
}

export function removeLetter(): void {
  if (state.gameOver) return;
  if (state.currentGuess.length > 0) {
    state.currentGuess = state.currentGuess.slice(0, -1);
    state.errorMessage = '';
  }
}

export function submitGuess(): boolean {
  if (state.gameOver) return false;
  const config = DIFFICULTIES[state.difficulty];

  if (state.currentGuess.length !== config.wordLength) {
    state.errorMessage = `Word must be ${config.wordLength} letters`;
    return false;
  }

  state.guesses.push(state.currentGuess);

  if (state.currentGuess === state.targetWord) {
    state.won = true;
    state.gameOver = true;
  } else if (state.guesses.length >= config.maxGuesses) {
    state.gameOver = true;
  }

  state.currentGuess = '';
  state.errorMessage = '';
  return true;
}
