/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GameState, BoardTile, ToolType, DailyReward, Mission, FloatingText } from './types/game';
import {
  loadSavedGame,
  saveGame,
  createInitialBoard,
  calculateExpToNextLevel,
  calculateEmpireAccrual,
  generateDailyMissionsForDate,
  generateDailyChallenge,
} from './utils/storage';
import { sound, triggerHaptic } from './utils/audio';
import { OBJECT_LEVELS, BOARD_THEMES, MISSION_POOL, MAX_LEVEL } from './constants/gameData';

import { Header } from './components/Header';
import { Board } from './components/Board';
import { NavigationFooter, NavTab } from './components/NavigationFooter';
import { EmpireView } from './components/EmpireView';
import { MissionsView } from './components/MissionsView';
import { DailyRewardsView } from './components/DailyRewardsView';
import { ShopView } from './components/ShopView';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { TutorialModal } from './components/TutorialModal';
import { GameOverModal } from './components/GameOverModal';
import { LevelUpModal } from './components/LevelUpModal';
import { ObjectIllustration } from './components/ObjectIllustration';
import { Play, Sparkles, Trophy, Castle } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(loadSavedGame);
  const [activeTab, setActiveTab] = useState<NavTab>('board');
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [newLevelAward, setNewLevelAward] = useState<number | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isTitleScreen, setIsTitleScreen] = useState(false);

  // History stack for Undo (tracks board and score only to protect accumulated empire coins)
  const historyRef = useRef<{
    board: (BoardTile | null)[];
    score: number;
  }[]>([]);

  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync mute and ambient music state on initial mount & setting changes
  useEffect(() => {
    sound.setMuted(!gameState.settings.soundEnabled);
    sound.setMusicMuted(!gameState.settings.musicEnabled);

    if (!gameState.tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  // Midnight Auto-Refresh: Checks calendar date every 30 seconds for seamless rollover
  useEffect(() => {
    const checkMidnight = () => {
      const nowToday = new Date().toISOString().split('T')[0];
      setGameState((prev) => {
        if (prev.dailyMissions.date !== nowToday) {
          return {
            ...prev,
            dailyMissions: generateDailyMissionsForDate(nowToday),
            dailyChallenge: generateDailyChallenge(),
          };
        }
        return prev;
      });
    };

    const timer = setInterval(checkMidnight, 30000);
    return () => clearInterval(timer);
  }, []);

  // Save game whenever state changes
  useEffect(() => {
    saveGame(gameState);
  }, [gameState]);

  // Check Game Over condition
  const checkGameOver = useCallback((board: (BoardTile | null)[]): boolean => {
    const emptyCount = board.filter((t) => t === null).length;
    if (emptyCount > 0) return false;

    // Check if any two tiles on the board can merge (same level < MAX_LEVEL)
    for (let i = 0; i < board.length; i++) {
      const tileA = board[i];
      if (!tileA) continue;
      for (let j = i + 1; j < board.length; j++) {
        const tileB = board[j];
        if (tileB && tileA.level === tileB.level && tileA.level < MAX_LEVEL) {
          return false;
        }
      }
    }
    return true;
  }, []);

  // Save current board for undo before any mutation (board and score only)
  const pushUndoSnapshot = () => {
    historyRef.current.push({
      board: JSON.parse(JSON.stringify(gameState.board)),
      score: gameState.score,
    });
    if (historyRef.current.length > 10) {
      historyRef.current.shift();
    }
  };

  // Spawn floating text particle at a board cell coordinate
  const spawnFloatingText = (cellIndex: number, text: string) => {
    const x = cellIndex % 5;
    const y = Math.floor(cellIndex / 5);
    const newId = `ft_${Date.now()}_${Math.random()}`;

    setFloatingTexts((prev) => [...prev, { id: newId, x, y, text }]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((ft) => ft.id !== newId));
    }, 900);
  };

  // Update Mission & Achievement Progress
  const trackProgress = (
    type:
      | 'merge_count'
      | 'reach_level'
      | 'create_high_tier'
      | 'reach_score'
      | 'points_earned'
      | 'combo_count'
      | 'empire_upgrade'
      | 'use_booster'
      | 'earn_coins',
    amount: number = 1
  ) => {
    setGameState((prev) => {
      // 1. Update Daily Missions (3 items)
      const updatedDailyItems = prev.dailyMissions.items.map((dm) => {
        if (dm.claimed) return dm;
        let nextCurrent = dm.current;

        if (dm.type === type) {
          if (type === 'reach_score' || type === 'reach_level') {
            nextCurrent = Math.max(dm.current, amount);
          } else {
            nextCurrent = dm.current + amount;
          }
        }

        const isComplete = nextCurrent >= dm.target;
        return {
          ...dm,
          current: nextCurrent,
          completed: isComplete || dm.completed,
        };
      });

      // 2. Update Active Quests
      const updatedMissions = prev.activeMissions.map((m) => {
        if (m.claimed) return m;

        let nextCurrent = m.current;
        if (m.type === type) {
          if (type === 'reach_level' || type === 'reach_score' || type === 'combo_count') {
            nextCurrent = Math.max(m.current, amount);
          } else {
            nextCurrent = m.current + amount;
          }
        }

        const completed = nextCurrent >= m.target;
        return {
          ...m,
          current: nextCurrent,
          completed: completed || m.completed,
        };
      });

      // 3. Update Daily Royal Challenge
      let updatedDaily = prev.dailyChallenge;
      if (updatedDaily.mission && !updatedDaily.mission.claimed) {
        let dcCurrent = updatedDaily.mission.current;
        if (updatedDaily.mission.type === type) {
          if (type === 'reach_level' || type === 'reach_score' || type === 'combo_count') {
            dcCurrent = Math.max(dcCurrent, amount);
          } else {
            dcCurrent = dcCurrent + amount;
          }
        }
        const dcCompleted = dcCurrent >= updatedDaily.mission.target;
        updatedDaily = {
          ...updatedDaily,
          mission: {
            ...updatedDaily.mission,
            current: dcCurrent,
            completed: dcCompleted || updatedDaily.mission.completed,
          },
        };
      }

      // 4. Update Achievements
      const updatedAch = prev.achievements.map((ach) => {
        if (ach.claimed) return ach;
        let achCurrent = ach.current;

        if (type === 'merge_count' && ach.category === 'merge') {
          achCurrent += amount;
        } else if (type === 'reach_level' && ach.category === 'collection') {
          achCurrent = Math.max(achCurrent, amount);
        } else if (type === 'combo_count' && ach.category === 'merge') {
          achCurrent = Math.max(achCurrent, amount);
        } else if (type === 'reach_score' && ach.category === 'score') {
          achCurrent = Math.max(achCurrent, amount);
        } else if (type === 'empire_upgrade' && ach.category === 'empire') {
          achCurrent += amount;
        } else if (type === 'earn_coins' && ach.category === 'empire') {
          achCurrent += amount;
        }

        const isComplete = achCurrent >= ach.target;
        return {
          ...ach,
          current: achCurrent,
          completed: isComplete || ach.completed,
        };
      });

      return {
        ...prev,
        dailyMissions: {
          ...prev.dailyMissions,
          items: updatedDailyItems,
        },
        activeMissions: updatedMissions,
        dailyChallenge: updatedDaily,
        achievements: updatedAch,
      };
    });
  };

  // Add EXP and handle player level up
  const addPlayerExp = (expGain: number) => {
    setGameState((prev) => {
      let currentExp = prev.playerExp + expGain;
      let currentLvl = prev.playerLevel;
      let reqExp = prev.expToNextLevel;
      let leveledUp = false;

      while (currentExp >= reqExp) {
        currentExp -= reqExp;
        currentLvl += 1;
        reqExp = calculateExpToNextLevel(currentLvl);
        leveledUp = true;
      }

      if (leveledUp) {
        setNewLevelAward(currentLvl);
      }

      return {
        ...prev,
        playerLevel: currentLvl,
        playerExp: currentExp,
        expToNextLevel: reqExp,
      };
    });
  };

  // Move Tile to Empty Cell
  const handleTileMove = (fromIndex: number, toIndex: number) => {
    if (gameState.board[toIndex] !== null) return;

    pushUndoSnapshot();

    setGameState((prev) => {
      const newBoard = [...prev.board];
      newBoard[toIndex] = newBoard[fromIndex];
      newBoard[fromIndex] = null;
      return { ...prev, board: newBoard };
    });
  };

  // Merge Two Identical Tiles
  const handleTileMerge = (fromIndex: number, toIndex: number) => {
    const source = gameState.board[fromIndex];
    const target = gameState.board[toIndex];

    if (!source || !target || source.level !== target.level || source.level >= MAX_LEVEL) {
      return;
    }

    pushUndoSnapshot();

    const newLevel = source.level + 1;
    const levelDef = OBJECT_LEVELS[newLevel - 1] || OBJECT_LEVELS[0];

    // Increment combo
    const newCombo = comboCount + 1;
    setComboCount(newCombo);
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setComboCount(0);
    }, 3500);

    // Audio & Haptic feedback
    sound.playMerge(newLevel);
    if (newCombo >= 2) sound.playCombo(newCombo);
    triggerHaptic(30);

    // Bonus multipliers from combo
    const comboMultiplier = 1 + (newCombo - 1) * 0.5;
    const earnedScore = Math.floor(levelDef.scoreValue * comboMultiplier);
    const earnedCoins = Math.floor(levelDef.coinReward * (newCombo >= 2 ? 1.5 : 1));

    // Spawn floating particle text on merged cell
    spawnFloatingText(toIndex, `+${earnedCoins} Coins`);

    // Milestone confetti for higher tier fusions (Level 6+)
    if (newLevel >= 6) {
      confetti({
        particleCount: 40 + newLevel * 6,
        spread: 60,
        origin: { y: 0.6 },
        colors: [levelDef.primaryColor, '#F59E0B', '#FFF'],
      });
    }

    setGameState((prev) => {
      const newBoard = [...prev.board];
      newBoard[fromIndex] = null;
      newBoard[toIndex] = {
        id: `merged_${Date.now()}`,
        level: newLevel,
        isMerged: true,
      };

      const newScore = prev.score + earnedScore;
      const newBest = Math.max(prev.bestScore, newScore);
      const newCoins = prev.coins + earnedCoins;

      const highestTier = Math.max(prev.stats.highestTierReached, newLevel);
      const highestCombo = Math.max(prev.stats.highestCombo, newCombo);

      return {
        ...prev,
        board: newBoard,
        score: newScore,
        bestScore: newBest,
        coins: newCoins,
        stats: {
          ...prev.stats,
          totalMerges: prev.stats.totalMerges + 1,
          totalCoinsEarned: prev.stats.totalCoinsEarned + earnedCoins,
          highestTierReached: highestTier,
          highestCombo: highestCombo,
        },
      };
    });

    addPlayerExp(levelDef.expReward);

    // Track missions & achievements
    trackProgress('merge_count', 1);
    trackProgress('reach_level', newLevel);
    if (newLevel >= 4) {
      trackProgress('create_high_tier', 1);
    }
    trackProgress('combo_count', newCombo);
    trackProgress('reach_score', gameState.score + earnedScore);
    trackProgress('points_earned', earnedScore);
    trackProgress('earn_coins', earnedCoins);
  };

  // Spawn New Tile
  const handleSpawnTile = () => {
    const emptyIndices: number[] = [];
    gameState.board.forEach((tile, idx) => {
      if (tile === null) emptyIndices.push(idx);
    });

    if (emptyIndices.length === 0) {
      if (checkGameOver(gameState.board)) {
        setShowGameOver(true);
      }
      return;
    }

    pushUndoSnapshot();

    const targetIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    // Dynamic Spawn Formula:
    // If tree level reaches 11 or higher -> (Highest Tree Level - 5), e.g. L11->6, L25->20, L54->49.
    // If tree level is between 8 and 10 -> starts from Level 3.
    // If tree level is below 8 -> starts from Level 1.
    const maxLevelOnBoard = gameState.board.reduce(
      (max, tile) => (tile ? Math.max(max, tile.level) : max),
      0
    );

    let baseSpawnLevel = 1;
    if (maxLevelOnBoard >= 11) {
      baseSpawnLevel = maxLevelOnBoard - 5;
    } else if (maxLevelOnBoard >= 8) {
      baseSpawnLevel = 3;
    }

    // Check if there are any orphaned old lower trees left on the board (level < baseSpawnLevel)
    // that have an odd count (no partner to merge with).
    // Spawn exactly one matching seed/tree for that level so the gamer can merge and make it bigger!
    const levelCounts: Record<number, number> = {};
    gameState.board.forEach((tile) => {
      if (tile) {
        levelCounts[tile.level] = (levelCounts[tile.level] || 0) + 1;
      }
    });

    const orphanLevels = Object.keys(levelCounts)
      .map(Number)
      .filter((lvl) => lvl < baseSpawnLevel && levelCounts[lvl] % 2 === 1)
      .sort((a, b) => a - b); // lowest level first to resolve oldest leftover plants

    const roll = Math.random();
    let spawnLevel = baseSpawnLevel;
    let isOrphanMatch = false;

    if (orphanLevels.length > 0) {
      // Spawn one matching seed/tree of the orphan level to merge
      spawnLevel = orphanLevels[0];
      isOrphanMatch = true;
    } else if (baseSpawnLevel > 1) {
      if (roll > 0.98 && baseSpawnLevel + 2 < MAX_LEVEL) {
        spawnLevel = baseSpawnLevel + 2;
      } else if (roll > 0.8 && baseSpawnLevel + 1 < MAX_LEVEL) {
        spawnLevel = baseSpawnLevel + 1;
      }
    } else {
      // Standard initial spawn: Level 1 (80%), Level 2 (18%), Level 3 (2%)
      if (roll > 0.98) spawnLevel = 3;
      else if (roll > 0.8) spawnLevel = 2;
    }

    sound.playClick();
    triggerHaptic(15);

    if (isOrphanMatch) {
      spawnFloatingText(targetIdx, `+Lvl ${spawnLevel} Match!`);
    } else if (baseSpawnLevel > 1) {
      const typeLabel = spawnLevel >= 6 ? 'Tree' : 'Plant';
      spawnFloatingText(targetIdx, `+Lvl ${spawnLevel} ${typeLabel}!`);
    }

    const updatedBoard = [...gameState.board];
    updatedBoard[targetIdx] = {
      id: `spawn_${Date.now()}`,
      level: spawnLevel,
      isNew: true,
    };

    setGameState((prev) => ({
      ...prev,
      board: updatedBoard,
    }));

    // Check game over on newly filled board
    if (emptyIndices.length === 1) {
      if (checkGameOver(updatedBoard)) {
        setTimeout(() => {
          sound.playGameOver();
          setShowGameOver(true);
        }, 500);
      }
    }
  };

  // Boosters & Tools
  const handleUseBooster = (tool: ToolType, targetIndex?: number) => {
    if (gameState.boosters[tool] <= 0) return;

    if (tool === 'undo') {
      if (historyRef.current.length === 0) return;
      const lastSnapshot = historyRef.current.pop();
      if (!lastSnapshot) return;

      sound.playBooster();
      triggerHaptic(25);

      setGameState((prev) => ({
        ...prev,
        board: lastSnapshot.board,
        score: lastSnapshot.score,
        boosters: {
          ...prev.boosters,
          undo: prev.boosters.undo - 1,
        },
        stats: {
          ...prev.stats,
          boostersUsed: prev.stats.boostersUsed + 1,
        },
      }));
      trackProgress('use_booster', 1);
      return;
    }

    if (tool === 'shovel' && targetIndex !== undefined) {
      if (gameState.board[targetIndex] === null) return;
      pushUndoSnapshot();

      sound.playShovel();
      triggerHaptic(30);

      setGameState((prev) => {
        const newBoard = [...prev.board];
        newBoard[targetIndex] = null;
        return {
          ...prev,
          board: newBoard,
          boosters: {
            ...prev.boosters,
            shovel: prev.boosters.shovel - 1,
          },
          stats: {
            ...prev.stats,
            boostersUsed: prev.stats.boostersUsed + 1,
          },
        };
      });
      trackProgress('use_booster', 1);
      return;
    }

    if (tool === 'upgrade' && targetIndex !== undefined) {
      const tile = gameState.board[targetIndex];
      if (!tile || tile.level >= MAX_LEVEL) return;
      pushUndoSnapshot();

      const newLvl = tile.level + 1;
      sound.playBooster();
      triggerHaptic(35);

      setGameState((prev) => {
        const newBoard = [...prev.board];
        newBoard[targetIndex] = {
          id: `upgraded_${Date.now()}`,
          level: newLvl,
          isMerged: true,
        };
        return {
          ...prev,
          board: newBoard,
          boosters: {
            ...prev.boosters,
            upgrade: prev.boosters.upgrade - 1,
          },
          stats: {
            ...prev.stats,
            boostersUsed: prev.stats.boostersUsed + 1,
            highestTierReached: Math.max(prev.stats.highestTierReached, newLvl),
          },
        };
      });
      trackProgress('use_booster', 1);
      trackProgress('reach_level', newLvl);
      if (newLvl >= 4) {
        trackProgress('create_high_tier', 1);
      }
      return;
    }

    if (tool === 'shuffle') {
      pushUndoSnapshot();

      sound.playBooster();
      triggerHaptic(30);

      setGameState((prev) => {
        const existingTiles = prev.board.filter((t) => t !== null) as BoardTile[];
        const shuffled = [...existingTiles].sort(() => 0.5 - Math.random());
        const newBoard: (BoardTile | null)[] = Array(25).fill(null);

        shuffled.forEach((tile, i) => {
          newBoard[i] = { ...tile, isNew: true };
        });

        return {
          ...prev,
          board: newBoard,
          boosters: {
            ...prev.boosters,
            shuffle: prev.boosters.shuffle - 1,
          },
          stats: {
            ...prev.stats,
            boostersUsed: prev.stats.boostersUsed + 1,
          },
        };
      });
      trackProgress('use_booster', 1);
    }
  };

  // Empire Zone Upgrades
  const handleUpgradeEmpireZone = (zoneId: string, cost: number, newTier: number) => {
    setGameState((prev) => {
      const updatedEmpire = { ...prev.empire, [zoneId]: newTier };
      const updatedCoins = prev.coins - cost;

      return {
        ...prev,
        coins: updatedCoins,
        empire: updatedEmpire,
        stats: {
          ...prev.stats,
          empireUpgradesCount: prev.stats.empireUpgradesCount + 1,
        },
      };
    });

    trackProgress('empire_upgrade', 1);
    addPlayerExp(100 * newTier);
  };

  // Collect Empire Revenue
  const handleCollectEmpireRevenue = (accruedCoins: number) => {
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + accruedCoins,
      lastEmpireCollectTime: Date.now(),
      stats: {
        ...prev.stats,
        totalCoinsEarned: prev.stats.totalCoinsEarned + accruedCoins,
      },
    }));
    trackProgress('earn_coins', accruedCoins);
  };

  // Claim Daily Mission
  const handleClaimDailyMission = (missionId: string) => {
    const dm = gameState.dailyMissions.items.find((m) => m.id === missionId);
    if (!dm || !dm.completed || dm.claimed) return;

    let newBoosters = { ...gameState.boosters };
    if (dm.rewardBooster) {
      newBoosters[dm.rewardBooster.type] += dm.rewardBooster.amount;
    }

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + dm.rewardCoins,
      boosters: newBoosters,
      dailyMissions: {
        ...prev.dailyMissions,
        items: prev.dailyMissions.items.map((m) =>
          m.id === missionId ? { ...m, claimed: true } : m
        ),
      },
      stats: {
        ...prev.stats,
        totalCoinsEarned: prev.stats.totalCoinsEarned + dm.rewardCoins,
      },
    }));

    addPlayerExp(dm.rewardExp);
  };

  // Ongoing Quest Claims
  const handleClaimMission = (missionId: string) => {
    setGameState((prev) => {
      const mission = prev.activeMissions.find((m) => m.id === missionId);
      if (!mission) return prev;

      const rewardCoins = mission.rewardCoins;
      let newBoosters = { ...prev.boosters };
      if (mission.rewardBooster) {
        newBoosters[mission.rewardBooster.type] += mission.rewardBooster.amount;
      }

      const availableFromPool = MISSION_POOL.filter(
        (p) => !prev.activeMissions.some((am) => am.id === p.id)
      );
      const replacementTemplate =
        availableFromPool.length > 0
          ? availableFromPool[Math.floor(Math.random() * availableFromPool.length)]
          : MISSION_POOL[0];

      const newMission: Mission = {
        ...replacementTemplate,
        id: `m_${Date.now()}`,
        current: 0,
        completed: false,
        claimed: false,
      };

      const updatedMissions = prev.activeMissions.map((m) =>
        m.id === missionId ? newMission : m
      );

      return {
        ...prev,
        coins: prev.coins + rewardCoins,
        boosters: newBoosters,
        activeMissions: updatedMissions,
        stats: {
          ...prev.stats,
          totalCoinsEarned: prev.stats.totalCoinsEarned + rewardCoins,
        },
      };
    });

    const mission = gameState.activeMissions.find((m) => m.id === missionId);
    if (mission) {
      addPlayerExp(mission.rewardExp);
    }
  };

  // Daily Challenge Claim
  const handleClaimDailyChallenge = () => {
    const dc = gameState.dailyChallenge;
    if (!dc.mission || !dc.mission.completed || dc.mission.claimed) return;

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + dc.mission.rewardCoins,
      dailyChallenge: {
        ...prev.dailyChallenge,
        mission: { ...prev.dailyChallenge.mission, claimed: true },
      },
      stats: {
        ...prev.stats,
        totalCoinsEarned: prev.stats.totalCoinsEarned + dc.mission.rewardCoins,
      },
    }));

    addPlayerExp(dc.mission.rewardExp);
  };

  // Achievement Claim
  const handleClaimAchievement = (achId: string) => {
    setGameState((prev) => {
      const ach = prev.achievements.find((a) => a.id === achId);
      if (!ach) return prev;

      const updatedAch = prev.achievements.map((a) =>
        a.id === achId ? { ...a, claimed: true } : a
      );

      return {
        ...prev,
        coins: prev.coins + ach.rewardCoins,
        achievements: updatedAch,
        stats: {
          ...prev.stats,
          totalCoinsEarned: prev.stats.totalCoinsEarned + ach.rewardCoins,
        },
      };
    });

    const ach = gameState.achievements.find((a) => a.id === achId);
    if (ach) {
      addPlayerExp(ach.rewardExp);
    }
  };

  // Daily Streak Claim
  const handleClaimDailyReward = (reward: DailyReward) => {
    const today = new Date().toISOString().split('T')[0];
    let newBoosters = { ...gameState.boosters };
    if (reward.booster) {
      newBoosters[reward.booster.type] += reward.booster.amount;
    }

    setGameState((prev) => {
      // If Day 7 is claimed, reset claimedDays so next week (Days 1..7) cycles properly
      const updatedClaimed = reward.day === 7 ? [] : [...prev.dailyStreak.claimedDays, reward.day];
      return {
        ...prev,
        coins: prev.coins + reward.coins,
        boosters: newBoosters,
        dailyStreak: {
          currentStreak: prev.dailyStreak.currentStreak + 1,
          lastClaimDate: today,
          claimedDays: updatedClaimed,
        },
        stats: {
          ...prev.stats,
          totalCoinsEarned: prev.stats.totalCoinsEarned + reward.coins,
        },
      };
    });

    addPlayerExp(reward.exp);
  };

  // Buy Booster Pack
  const handleBuyBooster = (tool: ToolType, count: number, price: number) => {
    if (gameState.coins < price) return;

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - price,
      boosters: {
        ...prev.boosters,
        [tool]: prev.boosters[tool] + count,
      },
    }));
  };

  // Buy Theme (Persisted to GameState and LocalStorage)
  const handleBuyTheme = (themeId: string, price: number) => {
    if (gameState.coins < price) return;

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - price,
      unlockedThemes: prev.unlockedThemes.includes(themeId)
        ? prev.unlockedThemes
        : [...prev.unlockedThemes, themeId],
      settings: { ...prev.settings, themeId },
    }));
  };

  // Edit Player Nickname
  const handleUpdateNickname = (newNickname: string) => {
    setGameState((prev) => ({
      ...prev,
      profile: { ...prev.profile, nickname: newNickname },
    }));
  };

  // Restart Board
  const handleRestartBoard = () => {
    historyRef.current = [];
    setGameState((prev) => ({
      ...prev,
      board: createInitialBoard(),
      score: 0,
      stats: {
        ...prev.stats,
        gamesPlayed: prev.stats.gamesPlayed + 1,
      },
    }));
    setShowGameOver(false);
  };

  // Shovel Rescue from Game Over
  const handleShovelRescue = () => {
    setShowGameOver(false);
    setActiveTool('shovel');
  };

  // Settings update
  const handleUpdateSettings = (newSettings: Partial<GameState['settings']>) => {
    setGameState((prev) => {
      const updated = { ...prev.settings, ...newSettings };
      if (newSettings.soundEnabled !== undefined) {
        sound.setMuted(!newSettings.soundEnabled);
      }
      if (newSettings.musicEnabled !== undefined) {
        sound.setMusicMuted(!newSettings.musicEnabled);
      }
      return { ...prev, settings: updated };
    });
  };

  // Calculations for Badges
  const hasUnclaimedMissions =
    gameState.dailyMissions.items.some((m) => m.completed && !m.claimed) ||
    gameState.activeMissions.some((m) => m.completed && !m.claimed) ||
    (gameState.dailyChallenge.mission &&
      gameState.dailyChallenge.mission.completed &&
      !gameState.dailyChallenge.mission.claimed) ||
    gameState.achievements.some((a) => a.completed && !a.claimed);

  const todayStr = new Date().toISOString().split('T')[0];
  const hasUnclaimedDailyReward = gameState.dailyStreak.lastClaimDate !== todayStr;
  const uncollectedEmpireCoins = calculateEmpireAccrual(
    gameState.empire,
    gameState.lastEmpireCollectTime
  );

  const currentTheme =
    BOARD_THEMES.find((t) => t.id === gameState.settings.themeId) || BOARD_THEMES[0];

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b ${currentTheme.pageGradient} text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] select-none`}
    >
      {/* Title Screen View */}
      {isTitleScreen ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="w-24 h-24 mb-4 animate-float">
            <ObjectIllustration level={100} size="xl" showBadge={false} />
          </div>

          <span className="text-xs font-extrabold tracking-widest text-amber-400 uppercase mb-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Casual Botanical Puzzle
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight leading-tight">
            MERGE MASTER
          </h1>
          <p className="text-sm font-semibold text-emerald-400 mt-1 mb-6">
            Merge. Upgrade. Build Your Empire.
          </p>

          <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 text-left space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Fuse botanical wonders from humble Seed to grand Empire Tree</span>
            </div>
            <div className="flex items-center gap-2">
              <Castle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Invest earned virtual coins to construct Villages, Gardens & Kingdoms</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsTitleScreen(false);
            }}
            className="w-full py-4 rounded-2xl font-black font-display text-base bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:brightness-110 text-slate-950 shadow-xl shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>PLAY NOW</span>
          </button>
        </div>
      ) : (
        <>
          {/* Top HUD Header */}
          <Header
            score={gameState.score}
            bestScore={gameState.bestScore}
            coins={gameState.coins}
            playerLevel={gameState.playerLevel}
            playerExp={gameState.playerExp}
            expToNextLevel={gameState.expToNextLevel}
            nickname={gameState.profile.nickname}
            soundEnabled={gameState.settings.soundEnabled}
            musicEnabled={gameState.settings.musicEnabled}
            onToggleSound={() =>
              handleUpdateSettings({ soundEnabled: !gameState.settings.soundEnabled })
            }
            onToggleMusic={() =>
              handleUpdateSettings({ musicEnabled: !gameState.settings.musicEnabled })
            }
            onOpenProfile={() => setShowProfile(true)}
            onOpenSettings={() => setShowSettings(true)}
            activeTab={activeTab}
            onSelectTab={(tab) => {
              if (tab === 'settings') {
                setShowSettings(true);
              } else {
                setActiveTab(tab);
              }
            }}
            hasUnclaimedMissions={hasUnclaimedMissions}
            uncollectedEmpireCoins={uncollectedEmpireCoins}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col justify-center items-center py-2 px-2 overflow-y-auto">
            {(activeTab === 'board' || activeTab === 'settings') && (
              <Board
                board={gameState.board}
                themeId={gameState.settings.themeId}
                boosters={gameState.boosters}
                activeTool={activeTool}
                comboCount={comboCount}
                floatingTexts={floatingTexts}
                onTileMove={handleTileMove}
                onTileMerge={handleTileMerge}
                onSpawnTile={handleSpawnTile}
                onUseBooster={handleUseBooster}
                onSelectTool={setActiveTool}
              />
            )}

            {activeTab === 'empire' && (
              <EmpireView
                coins={gameState.coins}
                playerLevel={gameState.playerLevel}
                empire={gameState.empire}
                lastCollectTime={gameState.lastEmpireCollectTime}
                onUpgradeZone={handleUpgradeEmpireZone}
                onCollectRevenue={handleCollectEmpireRevenue}
                onBackToBoard={() => setActiveTab('board')}
              />
            )}

            {activeTab === 'missions' && (
              <MissionsView
                dailyMissions={gameState.dailyMissions}
                missions={gameState.activeMissions}
                dailyChallenge={gameState.dailyChallenge}
                achievements={gameState.achievements}
                onClaimDailyMission={handleClaimDailyMission}
                onClaimMission={handleClaimMission}
                onClaimDailyChallenge={handleClaimDailyChallenge}
                onClaimAchievement={handleClaimAchievement}
                onBackToBoard={() => setActiveTab('board')}
              />
            )}

            {activeTab === 'rewards' && (
              <DailyRewardsView
                currentStreak={gameState.dailyStreak.currentStreak}
                lastClaimDate={gameState.dailyStreak.lastClaimDate}
                claimedDays={gameState.dailyStreak.claimedDays}
                onClaimDay={handleClaimDailyReward}
                onBackToBoard={() => setActiveTab('board')}
              />
            )}

            {activeTab === 'shop' && (
              <ShopView
                coins={gameState.coins}
                currentThemeId={gameState.settings.themeId}
                unlockedThemes={gameState.unlockedThemes}
                boosters={gameState.boosters}
                onBuyTheme={handleBuyTheme}
                onSelectTheme={(themeId) =>
                  setGameState((prev) => ({
                    ...prev,
                    settings: { ...prev.settings, themeId },
                  }))
                }
                onBuyBooster={handleBuyBooster}
                onBackToBoard={() => setActiveTab('board')}
              />
            )}
          </main>

          {/* Bottom Navigation */}
          <NavigationFooter
            currentTab={activeTab}
            onSelectTab={setActiveTab}
            hasUnclaimedMissions={hasUnclaimedMissions}
            hasUnclaimedDailyReward={hasUnclaimedDailyReward}
            uncollectedEmpireCoins={uncollectedEmpireCoins}
          />
        </>
      )}

      {/* Player Profile Modal */}
      {showProfile && (
        <ProfileModal
          profile={gameState.profile}
          playerLevel={gameState.playerLevel}
          playerExp={gameState.playerExp}
          expToNextLevel={gameState.expToNextLevel}
          score={gameState.score}
          bestScore={gameState.bestScore}
          stats={gameState.stats}
          achievements={gameState.achievements}
          onUpdateNickname={handleUpdateNickname}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={gameState.settings}
          stats={gameState.stats}
          nickname={gameState.profile.nickname}
          onUpdateSettings={handleUpdateSettings}
          onOpenProfile={() => {
            setShowSettings(false);
            setShowProfile(true);
          }}
          onReplayTutorial={() => {
            setShowSettings(false);
            setShowTutorial(true);
          }}
          onRestartGame={handleRestartBoard}
          onClose={() => {
            setShowSettings(false);
            if (activeTab === 'settings') setActiveTab('board');
          }}
        />
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <TutorialModal
          onComplete={() => {
            setShowTutorial(false);
            setGameState((prev) => ({ ...prev, tutorialCompleted: true }));
          }}
        />
      )}

      {/* Game Over Modal */}
      {showGameOver && (
        <GameOverModal
          score={gameState.score}
          bestScore={gameState.bestScore}
          shovelsAvailable={gameState.boosters.shovel}
          onRestart={handleRestartBoard}
          onUseShovelEscape={handleShovelRescue}
        />
      )}

      {/* Level Up Celebration Modal */}
      {newLevelAward !== null && (
        <LevelUpModal
          newLevel={newLevelAward}
          coinBonus={50 + newLevelAward * 25}
          onDismiss={() => {
            const coinBonus = 50 + newLevelAward * 25;
            setGameState((prev) => ({
              ...prev,
              coins: prev.coins + coinBonus,
              boosters: { ...prev.boosters, undo: prev.boosters.undo + 1 },
            }));
            setNewLevelAward(null);
          }}
        />
      )}
    </div>
  );
}
