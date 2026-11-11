/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutGrid, Castle, Target, Gift, ShoppingBag } from 'lucide-react';
import { sound } from '../utils/audio';

export type NavTab = 'board' | 'empire' | 'missions' | 'rewards' | 'shop' | 'settings';

interface NavigationFooterProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hasUnclaimedMissions: boolean;
  hasUnclaimedDailyReward: boolean;
  uncollectedEmpireCoins: number;
}

interface NavTabItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: boolean;
  badgeText?: string;
}

export const NavigationFooter: React.FC<NavigationFooterProps> = ({
  currentTab,
  onSelectTab,
  hasUnclaimedMissions,
  hasUnclaimedDailyReward,
  uncollectedEmpireCoins,
}) => {
  const tabs: NavTabItem[] = [
    { id: 'board', label: 'Merge', icon: LayoutGrid, badge: false },
    {
      id: 'empire',
      label: 'Empire',
      icon: Castle,
      badge: uncollectedEmpireCoins > 0,
      badgeText: 'Earn',
    },
    {
      id: 'missions',
      label: 'Missions',
      icon: Target,
      badge: hasUnclaimedMissions,
    },
    {
      id: 'rewards',
      label: 'Daily',
      icon: Gift,
      badge: hasUnclaimedDailyReward,
    },
    { id: 'shop', label: 'Shop', icon: ShoppingBag, badge: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onSelectTab(tab.id as NavTab);
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-emerald-400' : 'text-slate-400'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
