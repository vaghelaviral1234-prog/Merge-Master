/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { Sparkles, Coins, ArrowRight, Undo2 } from 'lucide-react';

interface LevelUpModalProps {
  newLevel: number;
  coinBonus: number;
  onDismiss: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  coinBonus,
  onDismiss,
}) => {
  React.useEffect(() => {
    sound.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#10B981', '#F59E0B', '#38BDF8', '#EC4899', '#A855F7'],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center animate-pop-in">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/30 font-display">
          {newLevel}
        </div>

        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Rank Promotion
        </span>
        <h3 className="text-2xl font-bold font-display text-white mb-2">
          Player Level {newLevel}!
        </h3>
        <p className="text-xs text-slate-300 mb-5">
          Your botanical sovereignty deepens. Royal rewards have been credited to your treasury.
        </p>

        {/* Reward gifts */}
        <div className="bg-slate-950/70 rounded-2xl p-3 border border-slate-800 mb-5 flex items-center justify-around">
          <div className="flex items-center gap-1.5 font-mono font-bold text-amber-300">
            <Coins className="w-5 h-5 text-amber-400" />
            <span>+{coinBonus} Coins</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 font-mono font-bold text-sky-300">
            <Undo2 className="w-4 h-4 text-sky-400" />
            <span>+1 Free Undo</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onDismiss();
          }}
          className="w-full py-3 rounded-2xl font-bold font-display text-xs bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Claim & Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
