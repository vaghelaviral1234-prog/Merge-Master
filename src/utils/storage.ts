/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameState, BoardTile, Mission, PlayerProfile } from '../types/game';
import {
  MISSION_POOL,
  INITIAL_ACHIEVEMENTS,
  EMPIRE_ZONES,
  DAILY_MISSIONS_SPEC,
} from '../constants/gameData';

const STORAGE_KEY = 'merge_master_save_v1';

export function calculateExpToNextLevel(level: number): number {
  return Math.floor(80 * Math.pow(1.32, level - 1));
}

// Generate the 3 daily missions for a specific calendar date
export function generateDailyMissionsForDate(dateStr: string): { date: string; items: Mission[] } {
  return {
    date: dateStr,
    items: DAILY_MISSIONS_SPEC.map((spec) => ({
      ...spec,
      id: `${spec.id}_${dateStr}`,
      current: 0,
      completed: false,
      claimed: false,
    })),
  };
}

// Select 3 random ongoing quests from the pool
export function generateInitialMissions(): Mission[] {
  const shuffled = [...MISSION_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map((m) => ({
    ...m,
    current: 0,
    completed: false,
    claimed: false,
  }));
}

export function generateDailyChallenge(): { date: string; mission: Mission } {
  const today = new Date().toISOString().split('T')[0];
  const challengeMission = {
    ...MISSION_POOL[Math.floor(Math.random() * MISSION_POOL.length)],
    id: `daily_${today}`,
    title: 'Daily Royal Challenge',
    current: 0,
    completed: false,
    claimed: false,
    rewardCoins: 120,
    rewardExp: 150,
  };

  return {
    date: today,
    mission: challengeMission,
  };
}

// Generate starting board with a few initial seeds/sprouts
export function createInitialBoard(): (BoardTile | null)[] {
  const board: (BoardTile | null)[] = Array(25).fill(null);
  const indices = [6, 8, 12, 16];
  board[indices[0]] = { id: `seed_${Date.now()}_1`, level: 1 };
  board[indices[1]] = { id: `seed_${Date.now()}_2`, level: 1 };
  board[indices[2]] = { id: `sprout_${Date.now()}_3`, level: 2 };
  board[indices[3]] = { id: `seed_${Date.now()}_4`, level: 1 };
  return board;
}

export function getDefaultProfile(): PlayerProfile {
  return {
    nickname: 'Botanist Sovereign',
    title: 'Grand Merge Master',
    avatarLevel: 6,
    joinedDate: new Date().toISOString().split('T')[0],
  };
}

export function getDefaultGameState(): GameState {
  const empireRecord: Record<string, number> = {};
  EMPIRE_ZONES.forEach((z) => {
    empireRecord[z.id] = 0;
  });

  const today = new Date().toISOString().split('T')[0];

  return {
    board: createInitialBoard(),
    score: 0,
    bestScore: 0,
    coins: 100, // Starting royal stipend
    playerLevel: 1,
    playerExp: 0,
    expToNextLevel: calculateExpToNextLevel(1),
    boosters: {
      undo: 3,
      shovel: 2,
      upgrade: 1,
      shuffle: 2,
    },
    profile: getDefaultProfile(),
    activeMissions: generateInitialMissions(),
    dailyMissions: generateDailyMissionsForDate(today),
    empire: empireRecord,
    lastEmpireCollectTime: Date.now(),
    achievements: [...INITIAL_ACHIEVEMENTS],
    dailyStreak: {
      currentStreak: 1,
      lastClaimDate: '',
      claimedDays: [],
    },
    dailyChallenge: generateDailyChallenge(),
    unlockedThemes: ['emerald'],
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      hapticEnabled: true,
      reducedMotion: false,
      themeId: 'emerald',
    },
    stats: {
      totalMerges: 0,
      totalCoinsEarned: 100,
      highestTierReached: 2,
      highestCombo: 0,
      gamesPlayed: 1,
      empireUpgradesCount: 0,
      boostersUsed: 0,
    },
    tutorialCompleted: false,
  };
}

export function loadSavedGame(): GameState {
  if (typeof window === 'undefined') return getDefaultGameState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultGameState();

    const parsed = JSON.parse(raw);
    const defaults = getDefaultGameState();

    // Verify board validity
    const board =
      Array.isArray(parsed.board) && parsed.board.length === 25 ? parsed.board : defaults.board;

    const today = new Date().toISOString().split('T')[0];

    // Check daily challenge date
    let dailyChallenge = parsed.dailyChallenge;
    if (!dailyChallenge || dailyChallenge.date !== today) {
      dailyChallenge = generateDailyChallenge();
    }

    // Check daily missions date
    let dailyMissions = parsed.dailyMissions;
    if (!dailyMissions || dailyMissions.date !== today) {
      dailyMissions = generateDailyMissionsForDate(today);
    }

    // Ensure all initial achievements exist
    const achievements = defaults.achievements.map((defaultAch) => {
      const existing = (parsed.achievements || []).find(
        (a: { id: string }) => a.id === defaultAch.id
      );
      return existing ? { ...defaultAch, ...existing } : defaultAch;
    });

    return {
      ...defaults,
      ...parsed,
      board,
      profile: { ...defaults.profile, ...(parsed.profile || {}) },
      boosters: { ...defaults.boosters, ...(parsed.boosters || {}) },
      empire: { ...defaults.empire, ...(parsed.empire || {}) },
      settings: { ...defaults.settings, ...(parsed.settings || {}) },
      stats: { ...defaults.stats, ...(parsed.stats || {}) },
      dailyChallenge,
      dailyMissions,
      achievements,
      unlockedThemes:
        Array.isArray(parsed.unlockedThemes) && parsed.unlockedThemes.length > 0
          ? parsed.unlockedThemes
          : defaults.unlockedThemes,
    };
  } catch (e) {
    console.error('Failed to load saved state, falling back to defaults safely:', e);
    return getDefaultGameState();
  }
}

export function saveGame(state: GameState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

// Calculate accrued offline empire revenue
export function calculateEmpireAccrual(empire: Record<string, number>, lastCollectTime: number): number {
  const now = Date.now();
  const minutesPassed = Math.min((now - lastCollectTime) / 60000, 720); // capped at 12 hours
  if (minutesPassed <= 0.1) return 0;

  let totalCoins = 0;
  EMPIRE_ZONES.forEach((zone) => {
    const tier = empire[zone.id] || 0;
    if (tier > 0) {
      const rate = zone.coinsPerMinute[tier] || 0;
      totalCoins += rate * minutesPassed;
    }
  });

  return Math.floor(totalCoins);
}
