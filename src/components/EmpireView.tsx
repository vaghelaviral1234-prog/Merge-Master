/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EMPIRE_ZONES } from '../constants/gameData';
import { sound, triggerHaptic } from '../utils/audio';
import { calculateEmpireAccrual } from '../utils/storage';
import { Coins, Sparkles, Lock, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface EmpireViewProps {
  coins: number;
  playerLevel: number;
  empire: Record<string, number>;
  lastCollectTime: number;
  onUpgradeZone: (zoneId: string, cost: number, newTier: number) => void;
  onCollectRevenue: (accruedCoins: number) => void;
  onBackToBoard: () => void;
}

export const EmpireView: React.FC<EmpireViewProps> = ({
  coins,
  playerLevel,
  empire,
  lastCollectTime,
  onUpgradeZone,
  onCollectRevenue,
  onBackToBoard,
}) => {
  const [accrued, setAccrued] = useState(0);

  useEffect(() => {
    const updateAccrual = () => {
      const pending = calculateEmpireAccrual(empire, lastCollectTime);
      setAccrued(pending);
    };

    updateAccrual();
    const interval = setInterval(updateAccrual, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, [empire, lastCollectTime]);

  const handleCollect = () => {
    if (accrued <= 0) return;
    sound.playCoin();
    triggerHaptic(25);
    onCollectRevenue(accrued);
    setAccrued(0);
  };

  const handleUpgrade = (zoneId: string, currentTier: number, nextCost: number) => {
    if (coins < nextCost) return;
    sound.playEmpireUpgrade();
    triggerHaptic(35);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
    });

    onUpgradeZone(zoneId, nextCost, currentTier + 1);
  };

  // Render bespoke architectural SVG for each zone & tier
  const renderZoneIllustration = (zoneId: string, tier: number) => {
    if (tier === 0) {
      return (
        <div className="w-full h-36 bg-slate-900/60 rounded-xl flex flex-col items-center justify-center border border-dashed border-slate-700/60 p-4">
          <Lock className="w-8 h-8 text-slate-500 mb-2" />
          <span className="text-xs text-slate-400 font-medium">Locked Territory</span>
          <span className="text-[11px] text-slate-500 mt-0.5">Pay royal coins to discover</span>
        </div>
      );
    }

    switch (zoneId) {
      case 'village':
        return (
          <svg viewBox="0 0 240 120" className="w-full h-36 rounded-xl bg-gradient-to-b from-amber-950/30 to-emerald-950/50 border border-emerald-800/40">
            {/* Hills */}
            <path d="M0 120 L0 80 Q60 50 140 85 Q200 60 240 75 L240 120 Z" fill="#064E3B" />
            <path d="M0 120 L0 95 Q80 80 180 100 L240 95 L240 120 Z" fill="#047857" />
            {/* Windmill */}
            <rect x="180" y="45" width="22" height="45" fill="#78350F" rx="2" />
            <polygon points="176,45 191,28 206,45" fill="#B45309" />
            <line x1="191" y1="36" x2="165" y2="36" stroke="#FEF08A" strokeWidth="2.5" />
            <line x1="191" y1="36" x2="217" y2="36" stroke="#FEF08A" strokeWidth="2.5" />
            <line x1="191" y1="36" x2="191" y2="10" stroke="#FEF08A" strokeWidth="2.5" />
            <line x1="191" y1="36" x2="191" y2="62" stroke="#FEF08A" strokeWidth="2.5" />
            <circle cx="191" cy="36" r="3" fill="#D97706" />
            {/* Cottage 1 */}
            <rect x="40" y="65" width="36" height="26" fill="#D97706" rx="2" />
            <polygon points="36,65 58,48 80,65" fill="#78350F" />
            <rect x="52" y="75" width="10" height="16" fill="#451A03" />
            <rect x="44" y="70" width="6" height="6" fill="#FEF08A" />
            {/* Cottage 2 (if tier >= 2) */}
            {tier >= 2 && (
              <g>
                <rect x="95" y="70" width="38" height="25" fill="#CA8A04" rx="2" />
                <polygon points="91,70 114,52 137,70" fill="#92400E" />
                <rect x="110" y="78" width="9" height="17" fill="#451A03" />
                <circle cx="102" cy="76" r="3" fill="#FEF08A" />
              </g>
            )}
            {/* Farm Silo & Wheat (if tier >= 3) */}
            {tier >= 3 && (
              <g>
                <rect x="145" y="60" width="16" height="32" fill="#B45309" rx="3" />
                <path d="M145 60 Q153 50 161 60 Z" fill="#92400E" />
                <path d="M18 90 Q22 80 26 90" stroke="#EAB308" strokeWidth="2" fill="none" />
                <path d="M28 88 Q32 78 36 88" stroke="#EAB308" strokeWidth="2" fill="none" />
              </g>
            )}
            {/* Cobblestone path & Festival Flags (tier >= 4) */}
            {tier >= 4 && (
              <g>
                <path d="M60 91 Q110 102 180 95" stroke="#E2E8F0" strokeWidth="3" strokeDasharray="3 3" fill="none" />
                <line x1="40" y1="45" x2="140" y2="45" stroke="#F43F5E" strokeWidth="1" strokeDasharray="4 4" />
              </g>
            )}
            {/* Golden Weather Vane & Grand Well (tier 5) */}
            {tier === 5 && (
              <g>
                <circle cx="191" cy="9" r="3" fill="#FACC15" />
                <circle cx="85" cy="88" r="7" fill="#64748B" stroke="#CBD5E1" strokeWidth="1.5" />
                <rect x="83" y="80" width="4" height="8" fill="#78350F" />
              </g>
            )}
          </svg>
        );

      case 'garden':
        return (
          <svg viewBox="0 0 240 120" className="w-full h-36 rounded-xl bg-gradient-to-b from-teal-950/40 to-emerald-950/60 border border-teal-800/40">
            {/* Lawns */}
            <path d="M0 120 L0 75 Q120 60 240 75 L240 120 Z" fill="#047857" />
            {/* Grand Marble Gazebo */}
            <rect x="95" y="48" width="50" height="36" fill="#F8FAFC" rx="2" />
            <polygon points="90,48 120,25 150,48" fill="#0D9488" />
            <rect x="100" y="55" width="8" height="29" fill="#CBD5E1" />
            <rect x="116" y="55" width="8" height="29" fill="#CBD5E1" />
            <rect x="132" y="55" width="8" height="29" fill="#CBD5E1" />
            {/* Royal Fountain */}
            <ellipse cx="120" cy="100" rx="30" ry="10" fill="#38BDF8" stroke="#E2E8F0" strokeWidth="2" />
            <ellipse cx="120" cy="96" rx="14" ry="5" fill="#0284C7" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M120 95 Q115 78 120 74 Q125 78 120 95" fill="#E0F2FE" />
            {/* Sculpted Hedge Arches (tier >= 2) */}
            {tier >= 2 && (
              <g>
                <path d="M30 90 Q45 65 60 90" stroke="#065F46" strokeWidth="8" fill="none" />
                <path d="M180 90 Q195 65 210 90" stroke="#065F46" strokeWidth="8" fill="none" />
              </g>
            )}
            {/* Rose Bushes (tier >= 3) */}
            {tier >= 3 && (
              <g>
                <circle cx="20" cy="85" r="7" fill="#F43F5E" />
                <circle cx="68" cy="88" r="6" fill="#FB7185" />
                <circle cx="172" cy="88" r="6" fill="#FB7185" />
                <circle cx="220" cy="85" r="7" fill="#F43F5E" />
              </g>
            )}
            {/* Classical Statues (tier >= 4) */}
            {tier >= 4 && (
              <g>
                <rect x="75" y="65" width="8" height="18" fill="#F1F5F9" rx="1" />
                <circle cx="79" cy="62" r="3" fill="#F1F5F9" />
                <rect x="157" y="65" width="8" height="18" fill="#F1F5F9" rx="1" />
                <circle cx="161" cy="62" r="3" fill="#F1F5F9" />
              </g>
            )}
            {/* Floating Celestial Lilypad Pond (tier 5) */}
            {tier === 5 && (
              <g>
                <circle cx="120" cy="74" r="4" fill="#FDE047" className="animate-pulse" />
                <circle cx="110" cy="98" r="3" fill="#EC4899" />
                <circle cx="130" cy="99" r="3" fill="#EC4899" />
              </g>
            )}
          </svg>
        );

      case 'town':
        return (
          <svg viewBox="0 0 240 120" className="w-full h-36 rounded-xl bg-gradient-to-b from-slate-900 to-amber-950/40 border border-amber-800/40">
            {/* Paved plaza */}
            <path d="M0 120 L0 80 L240 80 L240 120 Z" fill="#334155" />
            {/* Clock Tower */}
            <rect x="105" y="20" width="30" height="70" fill="#78350F" rx="2" />
            <polygon points="100,20 120,4 140,20" fill="#B45309" />
            <circle cx="120" cy="36" r="7" fill="#FEF08A" stroke="#451A03" strokeWidth="1.5" />
            <line x1="120" y1="36" x2="120" y2="32" stroke="#451A03" strokeWidth="1" />
            <line x1="120" y1="36" x2="124" y2="36" stroke="#451A03" strokeWidth="1" />
            {/* Merchant Guild Building Left */}
            <rect x="25" y="50" width="55" height="40" fill="#9A3412" rx="2" />
            <polygon points="20,50 52,34 85,50" fill="#431407" />
            <rect x="35" y="60" width="12" height="14" fill="#FEF08A" />
            <rect x="55" y="60" width="12" height="14" fill="#FEF08A" />
            {/* Artisan Shop Right */}
            <rect x="160" y="55" width="55" height="35" fill="#B45309" rx="2" />
            <polygon points="155,55 187,40 220,55" fill="#451A03" />
            <rect x="175" y="68" width="12" height="22" fill="#1E293B" />
            {/* Market Stalls (tier >= 2) */}
            {tier >= 2 && (
              <g>
                <polygon points="82,78 102,78 100,70 84,70" fill="#EF4444" />
                <rect x="85" y="78" width="14" height="12" fill="#78350F" />
              </g>
            )}
            {/* Street Lanterns (tier >= 3) */}
            {tier >= 3 && (
              <g>
                <line x1="18" y1="95" x2="18" y2="70" stroke="#0F172A" strokeWidth="2.5" />
                <circle cx="18" cy="68" r="3.5" fill="#FDE047" />
                <line x1="225" y1="95" x2="225" y2="70" stroke="#0F172A" strokeWidth="2.5" />
                <circle cx="225" cy="68" r="3.5" fill="#FDE047" />
              </g>
            )}
            {/* Cobblestone Pattern (tier >= 4) */}
            {tier >= 4 && (
              <g stroke="#475569" strokeWidth="1" strokeDasharray="3 4">
                <line x1="0" y1="92" x2="240" y2="92" />
                <line x1="0" y1="104" x2="240" y2="104" />
              </g>
            )}
            {/* Grand Town Hall Golden Banner (tier 5) */}
            {tier === 5 && (
              <g>
                <polygon points="120,4 120,-4 132,0" fill="#F59E0B" />
                <circle cx="120" cy="36" r="8.5" fill="none" stroke="#FACC15" strokeWidth="1.5" />
              </g>
            )}
          </svg>
        );

      case 'city':
        return (
          <svg viewBox="0 0 240 120" className="w-full h-36 rounded-xl bg-gradient-to-b from-slate-900 to-indigo-950/60 border border-indigo-800/40">
            {/* High Fortress Battlements */}
            <rect x="10" y="55" width="220" height="40" fill="#1E293B" />
            <polygon points="10,55 18,48 26,55 34,48 42,55 50,48 58,55 66,48 74,55 82,48 90,55" fill="#334155" />
            <polygon points="150,55 158,48 166,55 174,48 182,55 190,48 198,55 206,48 214,55 222,48 230,55" fill="#334155" />
            {/* Grand Aqueduct Arches */}
            <path d="M0 120 L0 90 L240 90 L240 120 Z" fill="#0F172A" />
            <path d="M30 120 Q50 95 70 120 Z" fill="#1E293B" />
            <path d="M90 120 Q110 95 130 120 Z" fill="#1E293B" />
            <path d="M150 120 Q170 95 190 120 Z" fill="#1E293B" />
            {/* Twin High Watchtowers */}
            <rect x="90" y="24" width="22" height="60" fill="#334155" rx="1" />
            <polygon points="86,24 101,8 116,24" fill="#4338CA" />
            <rect x="128" y="24" width="22" height="60" fill="#334155" rx="1" />
            <polygon points="124,24 139,8 154,24" fill="#4338CA" />
            {/* Academy Dome (tier >= 2) */}
            {tier >= 2 && (
              <g>
                <path d="M106 50 Q120 30 134 50 Z" fill="#38BDF8" />
                <rect x="110" y="50" width="20" height="20" fill="#1E293B" />
              </g>
            )}
            {/* Illuminated Windows & Arcane Academy (tier >= 3) */}
            {tier >= 3 && (
              <g>
                <rect x="97" y="35" width="8" height="12" rx="4" fill="#FEF08A" />
                <rect x="135" y="35" width="8" height="12" rx="4" fill="#FEF08A" />
              </g>
            )}
            {/* Harbor Canal & Cargo ships (tier >= 4) */}
            {tier >= 4 && (
              <g>
                <rect x="10" y="105" width="220" height="8" fill="#0284C7" />
                <polygon points="205,103 218,103 214,107 207,107" fill="#78350F" />
                <polygon points="211,96 211,103 215,103" fill="#F8FAFC" />
              </g>
            )}
            {/* Imperial Spires with Radiant Beacons (tier 5) */}
            {tier === 5 && (
              <g>
                <circle cx="101" cy="7" r="3.5" fill="#38BDF8" className="animate-pulse" />
                <circle cx="139" cy="7" r="3.5" fill="#38BDF8" className="animate-pulse" />
              </g>
            )}
          </svg>
        );

      case 'kingdom':
        return (
          <svg viewBox="0 0 240 120" className="w-full h-36 rounded-xl bg-gradient-to-b from-amber-950/60 via-purple-950/60 to-slate-950 border border-amber-600/50">
            {/* Mountain Crag */}
            <polygon points="0,120 40,70 120,50 200,70 240,120" fill="#1E1B4B" />
            {/* The Grand Imperial Citadel */}
            <rect x="70" y="32" width="100" height="60" fill="#475569" rx="2" />
            <polygon points="65,32 120,8 175,32" fill="#7C3AED" />
            {/* Central Throne Tower */}
            <rect x="105" y="15" width="30" height="40" fill="#334155" />
            <polygon points="100,15 120,-2 140,15" fill="#F59E0B" />
            {/* Royal Golden Banners */}
            <polygon points="85,35 95,35 90,52" fill="#F59E0B" />
            <polygon points="145,35 155,35 150,52" fill="#F59E0B" />
            {/* Golden Palace Arches */}
            <path d="M110 75 Q120 60 130 75 Z" fill="#FEF08A" />
            <rect x="110" y="75" width="20" height="17" fill="#FEF08A" />
            {/* Side Golden Spires (tier >= 2) */}
            {tier >= 2 && (
              <g>
                <polygon points="45,55 55,25 65,55" fill="#F59E0B" />
                <polygon points="175,55 185,25 195,55" fill="#F59E0B" />
              </g>
            )}
            {/* Stained Glass Rose Window (tier >= 3) */}
            {tier >= 3 && (
              <circle cx="120" cy="40" r="8" fill="#8B5CF6" stroke="#FEF08A" strokeWidth="2" />
            )}
            {/* Imperial Airship & Royal Bridges (tier >= 4) */}
            {tier >= 4 && (
              <g>
                <ellipse cx="40" cy="22" rx="16" ry="7" fill="#FACC15" />
                <polygon points="24,22 18,17 18,27" fill="#B45309" />
              </g>
            )}
            {/* The Sun Crown Apex (tier 5) */}
            {tier === 5 && (
              <g>
                <circle cx="120" cy="-2" r="6" fill="#FDE047" className="animate-pulse" filter="blur(1px)" />
                <line x1="120" y1="-12" x2="120" y2="8" stroke="#FEF08A" strokeWidth="2" />
                <line x1="110" y1="-2" x2="130" y2="-2" stroke="#FEF08A" strokeWidth="2" />
              </g>
            )}
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 px-4 pt-3 max-w-2xl mx-auto w-full">
      {/* Top Banner / Revenue Card */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/30 rounded-2xl p-4 shadow-xl mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Royal Treasury Revenue
            </span>
            <h2 className="text-xl font-bold font-display text-white">Empire Production</h2>
          </div>
          <button
            onClick={onBackToBoard}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Back to Board
          </button>
        </div>

        <div className="flex items-center justify-between bg-black/40 rounded-xl p-3 border border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Uncollected Revenue</div>
              <div className="text-lg font-bold font-mono tabular-nums text-amber-300">
                +{accrued} Coins
              </div>
            </div>
          </div>

          <button
            onClick={handleCollect}
            disabled={accrued <= 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              accrued > 0
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Coins className="w-4 h-4" /> Collect All
          </button>
        </div>
      </div>

      {/* Empire Zones List */}
      <div className="space-y-4">
        {EMPIRE_ZONES.map((zone) => {
          const currentTier = empire[zone.id] || 0;
          const isMaxed = currentTier >= zone.maxTier;
          const nextCost = !isMaxed ? zone.costs[currentTier] : 0;
          const currentIncome = zone.coinsPerMinute[currentTier];
          const nextIncome = !isMaxed ? zone.coinsPerMinute[currentTier + 1] : currentIncome;
          const isLevelLocked = playerLevel < zone.minPlayerLevel;
          const canAfford = coins >= nextCost && !isLevelLocked && !isMaxed;

          return (
            <div
              key={zone.id}
              className={`rounded-2xl p-4 border transition-all ${
                currentTier > 0
                  ? 'bg-slate-900/90 border-slate-700/60 shadow-lg'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-display text-white">{zone.name}</h3>
                    <span className="text-[11px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Tier {currentTier} / {zone.maxTier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{zone.tagline}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Yield</div>
                  <div className="text-xs font-mono font-semibold text-emerald-400">
                    +{currentIncome}/min
                  </div>
                </div>
              </div>

              {/* Visual SVG Asset */}
              <div className="mb-3">{renderZoneIllustration(zone.id, currentTier)}</div>

              {/* Action / Upgrade Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="text-xs text-slate-400">
                  {isMaxed ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Fully Upgraded
                    </span>
                  ) : (
                    <span>
                      Next: <strong className="text-emerald-300">+{nextIncome}/min</strong>
                    </span>
                  )}
                </div>

                {isMaxed ? (
                  <span className="text-xs text-amber-400 font-bold px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    Apex Sovereign
                  </span>
                ) : isLevelLocked ? (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Requires Player Level {zone.minPlayerLevel}
                  </span>
                ) : (
                  <button
                    onClick={() => handleUpgrade(zone.id, currentTier, nextCost)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      canAfford
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md active:scale-95 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span>{currentTier === 0 ? 'Unlock' : 'Upgrade'}</span>
                    <span className="font-mono tabular-nums flex items-center gap-0.5 text-amber-300">
                      <Coins className="w-3 h-3" /> {nextCost}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
