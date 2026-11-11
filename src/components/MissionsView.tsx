/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mission, Achievement } from '../types/game';
import { sound, triggerHaptic } from '../utils/audio';
import { Coins, CheckCircle, Trophy, Sparkles, Flame, Calendar, Target, Award } from 'lucide-react';

interface MissionsViewProps {
  dailyMissions: { date: string; items: Mission[] };
  missions: Mission[];
  dailyChallenge: { date: string; mission: Mission };
  achievements: Achievement[];
  onClaimDailyMission: (missionId: string) => void;
  onClaimMission: (missionId: string) => void;
  onClaimDailyChallenge: () => void;
  onClaimAchievement: (achievementId: string) => void;
  onBackToBoard: () => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  dailyMissions,
  missions,
  dailyChallenge,
  achievements,
  onClaimDailyMission,
  onClaimMission,
  onClaimDailyChallenge,
  onClaimAchievement,
  onBackToBoard,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'quests' | 'achievements'>('daily');

  const handleClaimDaily = (id: string) => {
    sound.playDailyReward();
    triggerHaptic(35);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#10B981', '#F59E0B', '#38BDF8'],
    });
    onClaimDailyMission(id);
  };

  const handleClaim = (missionId: string) => {
    sound.playCoin();
    triggerHaptic(30);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.5 },
      colors: ['#10B981', '#F59E0B', '#38BDF8'],
    });
    onClaimMission(missionId);
  };

  const handleClaimChallenge = () => {
    sound.playCoin();
    triggerHaptic(40);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#EF4444', '#10B981'],
    });
    onClaimDailyChallenge();
  };

  const handleClaimAch = (id: string) => {
    sound.playLevelUp();
    triggerHaptic(35);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#8B5CF6', '#10B981'],
    });
    onClaimAchievement(id);
  };

  const unclaimedDailyCount = dailyMissions.items.filter((m) => m.completed && !m.claimed).length;
  const unclaimedQuestsCount = missions.filter((m) => m.completed && !m.claimed).length;
  const unclaimedAchCount = achievements.filter((a) => a.completed && !a.claimed).length;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 px-4 pt-3 max-w-2xl mx-auto w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Objectives & Feats
          </span>
          <h2 className="text-xl font-bold font-display text-white">Missions & Trophies</h2>
        </div>
        <button
          onClick={onBackToBoard}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          Back to Board
        </button>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl mb-4 border border-slate-800">
        <button
          onClick={() => {
            sound.playClick();
            setActiveSubTab('daily');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeSubTab === 'daily'
              ? 'bg-slate-800 text-emerald-300 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Daily (3)</span>
          {unclaimedDailyCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveSubTab('quests');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeSubTab === 'quests'
              ? 'bg-slate-800 text-sky-300 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Quests</span>
          {unclaimedQuestsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveSubTab('achievements');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeSubTab === 'achievements'
              ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Trophies</span>
          {unclaimedAchCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </div>

      {activeSubTab === 'daily' && (
        <div className="space-y-4">
          {/* Daily Date Banner */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Today's Date: <strong className="text-white">{dailyMissions.date}</strong></span>
            </span>
            <span className="text-[11px] text-slate-500">Refreshes daily at midnight</span>
          </div>

          {/* 3 Specified Daily Missions */}
          <div className="space-y-3">
            {dailyMissions.items.map((mission) => {
              const progressPercent = Math.min(
                100,
                Math.floor((mission.current / mission.target) * 100)
              );

              return (
                <div
                  key={mission.id}
                  className={`rounded-2xl p-4 border transition-all ${
                    mission.claimed
                      ? 'bg-slate-950/60 border-slate-800/80 opacity-70'
                      : mission.completed
                      ? 'bg-emerald-950/50 border-emerald-500/50 shadow-lg ring-1 ring-emerald-500/20'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{mission.title}</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">{mission.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-0.5 px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <Coins className="w-3 h-3 text-amber-400" /> +{mission.rewardCoins}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                        <span>Progress</span>
                        <span className="tabular-nums">
                          {Math.min(mission.current, mission.target)} / {mission.target}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {mission.claimed ? (
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Claimed
                      </span>
                    ) : mission.completed ? (
                      <button
                        onClick={() => handleClaimDaily(mission.id)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Claim
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono tabular-nums">
                        {progressPercent}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily Royal Challenge Card */}
          <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border border-amber-500/40 rounded-2xl p-4 shadow-lg mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Daily Royal Bonus Challenge
              </span>
              <span className="text-xs font-mono text-slate-400">Date: {dailyChallenge.date}</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">{dailyChallenge.mission.title}</h3>
            <p className="text-xs text-slate-300 mb-3">{dailyChallenge.mission.description}</p>

            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Progress</span>
                  <span className="tabular-nums">
                    {Math.min(dailyChallenge.mission.current, dailyChallenge.mission.target)} /{' '}
                    {dailyChallenge.mission.target}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        (dailyChallenge.mission.current / dailyChallenge.mission.target) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {dailyChallenge.mission.claimed ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle className="w-3.5 h-3.5" /> Completed
                </span>
              ) : dailyChallenge.mission.completed ? (
                <button
                  onClick={handleClaimChallenge}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Claim +{dailyChallenge.mission.rewardCoins} Coins
                </button>
              ) : (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 px-3 py-1.5 rounded-lg bg-black/30 border border-amber-500/20">
                  <Coins className="w-3.5 h-3.5" /> +{dailyChallenge.mission.rewardCoins}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'quests' && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Ongoing Sovereign Quests
          </h4>
          {missions.map((mission) => {
            const progressPercent = Math.min(
              100,
              Math.floor((mission.current / mission.target) * 100)
            );

            return (
              <div
                key={mission.id}
                className={`rounded-2xl p-4 border transition-all ${
                  mission.completed
                    ? 'bg-sky-950/40 border-sky-500/40 shadow-md'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{mission.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{mission.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-0.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      <Coins className="w-3 h-3 text-amber-400" /> +{mission.rewardCoins}
                    </span>
                    {mission.rewardBooster && (
                      <span className="text-[10px] font-mono font-bold text-sky-300 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                        +{mission.rewardBooster.amount} {mission.rewardBooster.type}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 mt-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="tabular-nums">
                        {Math.min(mission.current, mission.target)} / {mission.target}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-sky-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {mission.completed ? (
                    <button
                      onClick={() => handleClaim(mission.id)}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      Claim Reward
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono tabular-nums">
                      {progressPercent}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeSubTab === 'achievements' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Royal Feats & Milestones
            </h4>
            <span className="text-xs font-mono font-bold text-amber-300">
              {achievements.filter((a) => a.completed).length} / {achievements.length} Unlocked
            </span>
          </div>

          {achievements.map((ach) => {
            const isDone = ach.completed;
            const isClaimed = ach.claimed;

            return (
              <div
                key={ach.id}
                className={`rounded-2xl p-3.5 border transition-all flex items-center justify-between gap-3 ${
                  isClaimed
                    ? 'bg-slate-950/60 border-slate-800/60 opacity-70'
                    : isDone
                    ? 'bg-amber-950/30 border-amber-500/40 shadow-lg'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isDone
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                      <span>{ach.title}</span>
                      {isDone && !isClaimed && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">{ach.description}</p>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                      Goal: {ach.target} · Reward: +{ach.rewardCoins} Coins
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isClaimed ? (
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> Claimed
                    </span>
                  ) : isDone ? (
                    <button
                      onClick={() => handleClaimAch(ach.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      Claim
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      {Math.min(ach.current, ach.target)}/{ach.target}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
