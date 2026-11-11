/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BoardTile {
  id: string; // Unique ID for animations and tracking
  level: number; // 1 to 100
  isNew?: boolean; // Trigger spawn pop animation
  isMerged?: boolean; // Trigger merge burst animation
}

export interface ObjectLevelDef {
  level: number;
  name: string;
  tagline: string;
  description: string;
  scoreValue: number;
  coinReward: number;
  expReward: number;
  primaryColor: string;
  glowColor: string;
  canopyStyle?:
    | 'willow'
    | 'pine'
    | 'blossom'
    | 'oak'
    | 'spire'
    | 'redwood'
    | 'baobab'
    | 'banyan'
    | 'crystal'
    | 'worldtree';
}

export type ToolType = 'undo' | 'shovel' | 'upgrade' | 'shuffle';

export interface BoosterInventory {
  undo: number;
  shovel: number;
  upgrade: number;
  shuffle: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type:
    | 'merge_count'
    | 'reach_level'
    | 'create_high_tier'
    | 'reach_score'
    | 'points_earned'
    | 'combo_count'
    | 'empire_upgrade'
    | 'use_booster'
    | 'earn_coins';
  target: number;
  current: number;
  completed: boolean;
  claimed: boolean;
  rewardCoins: number;
  rewardExp: number;
  rewardBooster?: { type: ToolType; amount: number };
}

export interface EmpireZone {
  id: 'village' | 'garden' | 'town' | 'city' | 'kingdom';
  name: string;
  tagline: string;
  description: string;
  currentTier: number; // 0 = locked, 1-5 = upgrades
  maxTier: number;
  costs: number[]; // Cost for tier 1..5
  coinsPerMinute: number[]; // Income for tier 0..5
  minPlayerLevel: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'merge' | 'score' | 'empire' | 'collection';
  current: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  rewardCoins: number;
  rewardExp: number;
}

export interface DailyReward {
  day: number;
  coins: number;
  exp: number;
  booster?: { type: ToolType; amount: number };
  description: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
  reducedMotion: boolean;
  themeId: string;
}

export interface GameStats {
  totalMerges: number;
  totalCoinsEarned: number;
  highestTierReached: number;
  highestCombo: number;
  gamesPlayed: number;
  empireUpgradesCount: number;
  boostersUsed: number;
}

export interface PlayerProfile {
  nickname: string;
  title: string;
  avatarLevel: number;
  joinedDate: string;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color?: string;
  icon?: 'coin' | 'exp' | 'combo';
}

export interface GameState {
  board: (BoardTile | null)[]; // 25 elements for 5x5
  score: number;
  bestScore: number;
  coins: number;
  playerLevel: number;
  playerExp: number;
  expToNextLevel: number;
  boosters: BoosterInventory;
  profile: PlayerProfile;
  activeMissions: Mission[];
  dailyMissions: {
    date: string;
    items: Mission[];
  };
  empire: Record<string, number>; // zoneId -> currentTier (0-5)
  lastEmpireCollectTime: number; // timestamp
  achievements: Achievement[];
  dailyStreak: {
    currentStreak: number;
    lastClaimDate: string; // YYYY-MM-DD
    claimedDays: number[];
  };
  dailyChallenge: {
    date: string;
    mission: Mission;
  };
  unlockedThemes: string[];
  settings: GameSettings;
  stats: GameStats;
  tutorialCompleted: boolean;
}
