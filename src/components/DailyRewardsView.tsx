/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import confetti from 'canvas-confetti';
import { DAILY_STREAK_REWARDS } from '../constants/gameData';
import { DailyReward } from '../types/game';
import { sound, triggerHaptic } from '../utils/audio';
import { Coins, CheckCircle, Gift, Sparkles, Flame } from 'lucide-react';

interface DailyRewardsViewProps {
  currentStreak: number;
  lastClaimDate: string;
  claimedDays: number[];
  onClaimDay: (reward: DailyReward) => void;
  onBackToBoard: () => void;
}

export const DailyRewardsView: React.FC<DailyRewardsViewProps> = ({
  currentStreak,
  lastClaimDate,
  claimedDays,
  onClaimDay,
  onBackToBoard,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const canClaimToday = lastClaimDate !== today;
  // Determine which day is current (1-7): if ready to claim, next unclaimed day; otherwise the last claimed day
  const activeDayNumber = canClaimToday
    ? ((claimedDays.length % 7) + 1)
    : (claimedDays.length > 0 ? claimedDays[claimedDays.length - 1] : 1);

  const handleClaim = (reward: DailyReward) => {
    if (!canClaimToday) return;
    sound.playLevelUp();
    triggerHaptic(40);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#38BDF8', '#EC4899'],
    });
    onClaimDay(reward);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 px-4 pt-3 max-w-2xl mx-auto w-full">
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> 7-Day Calendar
          </span>
          <h2 className="text-xl font-bold font-display text-white">Daily Rewards</h2>
        </div>
        <button
          onClick={onBackToBoard}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          Back to Board
        </button>
      </div>

      {/* Streak Info Card */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/30 rounded-2xl p-4 shadow-xl mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Current Login Streak</div>
              <div className="text-lg font-bold font-mono text-amber-300">
                {currentStreak} Day{currentStreak !== 1 ? 's' : ''} in a Row! 🔥
              </div>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                canClaimToday
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {canClaimToday ? 'Reward Ready' : 'Claimed Today'}
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {DAILY_STREAK_REWARDS.map((reward) => {
          const isClaimed = claimedDays.includes(reward.day);
          const isToday = reward.day === activeDayNumber;
          const isGrandPrize = reward.day === 7;

          return (
            <div
              key={reward.day}
              className={`relative rounded-2xl p-3.5 border transition-all flex flex-col justify-between ${
                isGrandPrize ? 'col-span-2 sm:col-span-3 bg-gradient-to-r from-amber-950/70 to-purple-950/70 border-amber-500/50 shadow-xl' : ''
              } ${
                isClaimed
                  ? 'bg-slate-950/60 border-slate-800/80 opacity-65'
                  : isToday && canClaimToday
                  ? 'bg-emerald-950/50 border-emerald-500 shadow-lg ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">Day {reward.day}</span>
                {isClaimed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : isToday ? (
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Today
                  </span>
                ) : null}
              </div>

              <div className="my-1">
                <div className="flex items-center gap-1.5 text-base font-bold font-mono text-amber-300">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>+{reward.coins}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {reward.description}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400">+{reward.exp} EXP</span>

                {isToday && canClaimToday ? (
                  <button
                    onClick={() => handleClaim(reward)}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Claim
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500">
                    {isClaimed ? 'Claimed' : 'Locked'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-slate-500">
        Log in every calendar day to maintain your streak and claim the Grand Day 7 World Crown!
      </p>
    </div>
  );
};
