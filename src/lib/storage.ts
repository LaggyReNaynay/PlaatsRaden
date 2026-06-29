import type { Stats } from '../types/game';

const defaultStats: Stats = {
  played: 0,
  won: 0,
  lost: 0,
  totalXp: 0,
  currentStreak: 0,
  bestStreak: 0,
  winsByStep: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem('plaatsraden.stats');
    return raw ? { ...defaultStats, ...JSON.parse(raw) } : defaultStats;
  } catch {
    return defaultStats;
  }
}

export function saveStats(stats: Stats) {
  localStorage.setItem('plaatsraden.stats', JSON.stringify(stats));
}
