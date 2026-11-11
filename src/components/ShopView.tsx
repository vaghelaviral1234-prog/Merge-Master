/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BOARD_THEMES } from '../constants/gameData';
import { ToolType, BoosterInventory } from '../types/game';
import { sound, triggerHaptic } from '../utils/audio';
import { Coins, Palette, Sparkles, Undo2, Shovel, Wand2, Shuffle, Check } from 'lucide-react';

interface ShopViewProps {
  coins: number;
  currentThemeId: string;
  unlockedThemes: string[];
  boosters: BoosterInventory;
  onBuyTheme: (themeId: string, price: number) => void;
  onSelectTheme: (themeId: string) => void;
  onBuyBooster: (tool: ToolType, count: number, price: number) => void;
  onBackToBoard: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  coins,
  currentThemeId,
  unlockedThemes,
  boosters,
  onBuyTheme,
  onSelectTheme,
  onBuyBooster,
  onBackToBoard,
}) => {
  const boosterShopItems = [
    {
      type: 'undo' as ToolType,
      name: 'Undo Pack (3x)',
      description: 'Revert your last 3 moves if you make a mistake',
      count: 3,
      price: 75,
      icon: Undo2,
      color: 'text-sky-400',
      currentOwned: boosters.undo,
    },
    {
      type: 'shovel' as ToolType,
      name: 'Pruning Shears (2x)',
      description: 'Prune unwanted lower-tier botanical items from full boards',
      count: 2,
      price: 120,
      icon: Shovel,
      color: 'text-rose-400',
      currentOwned: boosters.shovel,
    },
    {
      type: 'upgrade' as ToolType,
      name: 'Royal Fertilizer (1x)',
      description: 'Instantly promote any plant (up to Level 99) by +1 tier',
      count: 1,
      price: 200,
      icon: Wand2,
      color: 'text-amber-400',
      currentOwned: boosters.upgrade,
    },
    {
      type: 'shuffle' as ToolType,
      name: 'Forest Breeze (2x)',
      description: 'Shuffle tile positions across the 5x5 board',
      count: 2,
      price: 90,
      icon: Shuffle,
      color: 'text-purple-400',
      currentOwned: boosters.shuffle,
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 px-4 pt-3 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Virtual Bazaar
          </span>
          <h2 className="text-xl font-bold font-display text-white">Botanical Shop</h2>
        </div>
        <button
          onClick={onBackToBoard}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          Back to Board
        </button>
      </div>

      {/* Free Economy Notice */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 mb-4 text-xs text-emerald-200 flex items-center justify-between">
        <div>
          <span className="font-bold text-white block">100% Free Game Economy</span>
          <span className="text-[11px] text-emerald-300/80">
            All themes and boosters are earned strictly through gameplay and merge mastery.
          </span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/40 border border-emerald-500/30 shrink-0 font-mono text-amber-300 font-bold">
          <Coins className="w-3.5 h-3.5 text-amber-400" /> {coins}
        </div>
      </div>

      {/* Booster Packs */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tactical Boosters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {boosterShopItems.map((item) => {
            const Icon = item.icon;
            const canAfford = coins >= item.price;

            return (
              <div
                key={item.type}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{item.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Owned: {item.currentOwned}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 leading-snug">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-400" /> {item.price} Coins
                  </span>

                  <button
                    onClick={() => {
                      if (!canAfford) return;
                      sound.playCoin();
                      triggerHaptic(25);
                      onBuyBooster(item.type, item.count, item.price);
                    }}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 active:scale-95 cursor-pointer shadow-md'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    Buy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cosmetic Board Themes */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-pink-400" /> Cosmetic Board Themes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BOARD_THEMES.map((theme) => {
            const isUnlocked = unlockedThemes.includes(theme.id) || theme.price === 0;
            const isSelected = currentThemeId === theme.id;
            const canAfford = coins >= theme.price;

            return (
              <div
                key={theme.id}
                className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.accent }}
                      />
                      {theme.name}
                    </h4>

                    {isSelected && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{theme.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {theme.price === 0 ? 'Free Default' : `${theme.price} Coins`}
                  </span>

                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        triggerHaptic(15);
                        onSelectTheme(theme.id);
                      }}
                      disabled={isSelected}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-slate-800 text-slate-400 cursor-default'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer active:scale-95'
                      }`}
                    >
                      {isSelected ? 'Equipped' : 'Equip'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (!canAfford) return;
                        sound.playCoin();
                        triggerHaptic(30);
                        onBuyTheme(theme.id, theme.price);
                      }}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 active:scale-95 cursor-pointer shadow-md'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                      }`}
                    >
                      Unlock Theme
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
