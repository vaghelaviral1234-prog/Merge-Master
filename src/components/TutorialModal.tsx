/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ObjectIllustration } from './ObjectIllustration';
import { sound } from '../utils/audio';
import { Sparkles, ArrowRight, Check, Castle, PlusCircle } from 'lucide-react';

interface TutorialModalProps {
  onComplete: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: 'Plant Seeds & Sprouts',
      description:
        'Tap the green "Plant Seed" button to sow botanical life into any empty cell on the 5x5 board.',
      icon: PlusCircle,
      renderIllustration: () => (
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center shadow-lg">
            <ObjectIllustration level={1} size="lg" />
          </div>
          <div className="text-xs text-slate-400 font-mono">Seed (L1)</div>
        </div>
      ),
    },
    {
      title: 'Drag or Tap to Merge',
      description:
        'Drag or tap two identical plants together to fuse them into the next tier! Merge combos give massive bonus score and coins.',
      icon: Sparkles,
      renderIllustration: () => (
        <div className="flex items-center justify-center gap-3 py-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center">
            <ObjectIllustration level={1} size="md" />
          </div>
          <span className="text-lg font-bold text-emerald-400">+</span>
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center">
            <ObjectIllustration level={1} size="md" />
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400 animate-pulse" />
          <div className="w-16 h-16 rounded-2xl bg-teal-950/80 border border-teal-500 flex items-center justify-center shadow-lg ring-2 ring-emerald-500/40">
            <ObjectIllustration level={2} size="lg" />
          </div>
        </div>
      ),
    },
    {
      title: 'Construct Your Royal Empire',
      description:
        'Spend your earned virtual coins in the Empire section to construct Villages, Gardens, Towns, Cities, and Kingdoms that generate passive coin income!',
      icon: Castle,
      renderIllustration: () => (
        <div className="flex items-center justify-center gap-3 py-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-600/50 flex items-center justify-center">
            <ObjectIllustration level={8} size="md" />
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400" />
          <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-500 flex items-center justify-center shadow-xl">
            <ObjectIllustration level={10} size="lg" />
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[step - 1];

  const handleNext = () => {
    sound.playClick();
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i + 1 === step ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <h3 className="text-xl font-bold font-display text-white mb-1">
          {currentStepData.title}
        </h3>

        {currentStepData.renderIllustration()}

        <p className="text-xs text-slate-300 leading-relaxed mb-6 px-2">
          {currentStepData.description}
        </p>

        <button
          onClick={handleNext}
          className="w-full py-3 rounded-2xl font-bold font-display text-sm bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {step < steps.length ? (
            <>
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Start Merging!</span>
              <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
