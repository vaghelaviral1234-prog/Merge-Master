/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { sound } from '../utils/audio';
import { RotateCcw, Shovel, Trophy, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  bestScore: number;
  shovelsAvailable: number;
  onRestart: () => void;
  onUseShovelEscape: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  bestScore,
  shovelsAvailable,
  onRestart,
  onUseShovelEscape,
}) => {
  const isNewBest = score >= bestScore && score > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center mb-3">
          <Trophy className="w-7 h-7" />
        </div>

        <h3 className="text-2xl font-bold font-display text-white mb-1">Board Overgrown!</h3>
        <p className="text-xs text-slate-400 mb-4">
          All 25 garden slots are occupied with no matching flora to merge.
        </p>

        {/* Score Card */}
        <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 mb-5">
          <div className="text-xs text-slate-400 mb-1">Final Score</div>
          <div className="text-3xl font-extrabold font-mono text-amber-300 tabular-nums">
            {score}
          </div>
          {isNewBest ? (
            <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> New Personal Best!
            </div>
          ) : (
            <div className="text-xs text-slate-500 mt-1 font-mono">Best: {bestScore}</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {shovelsAvailable > 0 && (
            <button
              onClick={() => {
                sound.playClick();
                onUseShovelEscape();
              }}
              className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Shovel className="w-4 h-4" />
              <span>Use Prune Shovel ({shovelsAvailable} left)</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>Plant Fresh Garden (Restart)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
