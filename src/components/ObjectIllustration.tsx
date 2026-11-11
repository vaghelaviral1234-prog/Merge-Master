/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { OBJECT_LEVELS } from '../constants/gameData';

interface ObjectIllustrationProps {
  level: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const ObjectIllustration: React.FC<ObjectIllustrationProps> = ({
  level,
  className = '',
  size = 'md',
  showBadge = true,
}) => {
  const def = OBJECT_LEVELS[level - 1] || OBJECT_LEVELS[0];

  const sizeStyles = {
    sm: 'w-8 h-8 text-[9px]',
    md: 'w-12 h-12 text-[11px]',
    lg: 'w-16 h-16 text-xs',
    xl: 'w-24 h-24 text-sm',
  };

  const renderSvgContent = () => {
    switch (level) {
      case 1: // Seed
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="seedGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#A3E635" />
                <stop offset="45%" stopColor="#65A30D" />
                <stop offset="100%" stopColor="#3F6212" />
              </radialGradient>
              <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#92400E" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
            </defs>
            <ellipse cx="32" cy="54" rx="16" ry="4" fill="rgba(0,0,0,0.25)" />
            {/* Acorn body */}
            <path
              d="M32 20 C42 20 50 32 46 44 C42 54 36 56 32 56 C28 56 22 54 18 44 C14 32 22 20 32 20 Z"
              fill="url(#seedGrad)"
            />
            {/* Acorn cap */}
            <path
              d="M18 24 C18 14 46 14 46 24 C46 27 18 27 18 24 Z"
              fill="url(#capGrad)"
            />
            {/* Stem */}
            <path d="M32 14 Q34 8 40 8" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Highlight */}
            <ellipse cx="26" cy="34" rx="4" ry="7" fill="rgba(255,255,255,0.4)" transform="rotate(-15 26 34)" />
          </svg>
        );

      case 2: // Sprout
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="sproutGrad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="sproutGrad2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            <ellipse cx="32" cy="56" rx="18" ry="4" fill="rgba(0,0,0,0.25)" />
            {/* Soil hill */}
            <path d="M16 56 Q32 48 48 56 Z" fill="#593122" />
            {/* Central stem */}
            <path d="M32 52 Q33 34 31 22" stroke="#10B981" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Right leaf */}
            <path
              d="M31 28 Q48 20 48 30 Q44 40 31 34 Z"
              fill="url(#sproutGrad1)"
            />
            {/* Left leaf */}
            <path
              d="M31 24 Q15 14 17 26 Q20 36 31 30 Z"
              fill="url(#sproutGrad2)"
            />
            {/* Dew drop */}
            <circle cx="44" cy="28" r="2" fill="#E0F2FE" />
          </svg>
        );

      case 3: // Plant
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#9A3412" />
              </linearGradient>
              <linearGradient id="leafGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>
            </defs>
            <ellipse cx="32" cy="58" rx="17" ry="3" fill="rgba(0,0,0,0.3)" />
            {/* Pot */}
            <path d="M22 42 L24 57 L40 57 L42 42 Z" fill="url(#potGrad)" />
            <rect x="20" y="38" width="24" height="5" rx="2" fill="#C2410C" />
            {/* Foliage leaves */}
            <path d="M32 40 Q22 26 14 28 Q18 40 32 38 Z" fill="url(#leafGrad3)" />
            <path d="M32 40 Q42 26 50 28 Q46 40 32 38 Z" fill="url(#leafGrad3)" />
            <path d="M32 38 Q32 12 32 10 Q40 24 32 38 Z" fill="#22C55E" />
            <path d="M32 38 Q24 20 28 12 Q36 22 32 38 Z" fill="#16A34A" />
          </svg>
        );

      case 4: // Flower
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="petalGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FDA4AF" />
                <stop offset="60%" stopColor="#F43F5E" />
                <stop offset="100%" stopColor="#BE123C" />
              </radialGradient>
              <radialGradient id="centerGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#CA8A04" />
              </radialGradient>
            </defs>
            <ellipse cx="32" cy="57" rx="15" ry="3" fill="rgba(0,0,0,0.25)" />
            {/* Stem */}
            <path d="M32 55 Q30 44 32 32" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Small leaves */}
            <ellipse cx="26" cy="46" rx="6" ry="2.5" fill="#22C55E" transform="rotate(-30 26 46)" />
            <ellipse cx="38" cy="42" rx="6" ry="2.5" fill="#22C55E" transform="rotate(25 38 42)" />
            {/* 5 Petals */}
            <circle cx="32" cy="18" r="9" fill="url(#petalGrad)" />
            <circle cx="43" cy="27" r="9" fill="url(#petalGrad)" />
            <circle cx="39" cy="40" r="9" fill="url(#petalGrad)" />
            <circle cx="25" cy="40" r="9" fill="url(#petalGrad)" />
            <circle cx="21" cy="27" r="9" fill="url(#petalGrad)" />
            {/* Center disc */}
            <circle cx="32" cy="30" r="8" fill="url(#centerGrad)" />
            <circle cx="30" cy="28" r="2.5" fill="#FEF9C3" />
          </svg>
        );

      case 5: // Bush
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="bushGrad1" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0369A1" />
              </radialGradient>
              <radialGradient id="bushGrad2" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="50%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#14532D" />
              </radialGradient>
            </defs>
            <ellipse cx="32" cy="56" rx="20" ry="4" fill="rgba(0,0,0,0.3)" />
            {/* Foliage cluster */}
            <circle cx="23" cy="40" r="14" fill="url(#bushGrad2)" />
            <circle cx="41" cy="40" r="14" fill="url(#bushGrad2)" />
            <circle cx="32" cy="28" r="16" fill="url(#bushGrad2)" />
            <circle cx="24" cy="26" r="11" fill="url(#bushGrad2)" />
            <circle cx="40" cy="26" r="11" fill="url(#bushGrad2)" />
            {/* Blueberries */}
            <circle cx="24" cy="32" r="4.5" fill="url(#bushGrad1)" />
            <circle cx="38" cy="30" r="4.5" fill="url(#bushGrad1)" />
            <circle cx="32" cy="42" r="5" fill="url(#bushGrad1)" />
            <circle cx="46" cy="42" r="4" fill="url(#bushGrad1)" />
            <circle cx="18" cy="42" r="4" fill="url(#bushGrad1)" />
            {/* Highlights */}
            <circle cx="22.5" cy="30.5" r="1.5" fill="#BAE6FD" />
            <circle cx="36.5" cy="28.5" r="1.5" fill="#BAE6FD" />
            <circle cx="30.5" cy="40.5" r="1.5" fill="#BAE6FD" />
          </svg>
        );

      case 6: // Tree
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#78350F" />
                <stop offset="50%" stopColor="#92400E" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
              <radialGradient id="canopyGrad" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#86EFAC" />
                <stop offset="40%" stopColor="#22C55E" />
                <stop offset="85%" stopColor="#15803D" />
                <stop offset="100%" stopColor="#14532D" />
              </radialGradient>
            </defs>
            <ellipse cx="32" cy="58" rx="20" ry="4" fill="rgba(0,0,0,0.35)" />
            {/* Trunk */}
            <path d="M28 34 L27 56 Q32 58 37 56 L36 34 Z" fill="url(#trunkGrad)" />
            {/* Main canopy clouds */}
            <circle cx="32" cy="20" r="15" fill="url(#canopyGrad)" />
            <circle cx="20" cy="28" r="13" fill="url(#canopyGrad)" />
            <circle cx="44" cy="28" r="13" fill="url(#canopyGrad)" />
            <circle cx="26" cy="35" r="11" fill="url(#canopyGrad)" />
            <circle cx="38" cy="35" r="11" fill="url(#canopyGrad)" />
            {/* Leaf highlights */}
            <circle cx="30" cy="16" r="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="18" cy="25" r="2.5" fill="rgba(255,255,255,0.2)" />
          </svg>
        );

      case 7: // Magic Tree
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg">
            <defs>
              <radialGradient id="magicGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="60%" stopColor="#7E22CE" />
                <stop offset="100%" stopColor="#3B0764" />
              </radialGradient>
              <linearGradient id="magicTrunk" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#581C87" />
                <stop offset="100%" stopColor="#3B0764" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="28" r="26" fill="rgba(192, 132, 252, 0.2)" filter="blur(4px)" />
            <ellipse cx="32" cy="58" rx="20" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Curved mystic trunk */}
            <path d="M29 32 Q34 46 27 56 L37 56 Q33 46 35 32 Z" fill="url(#magicTrunk)" />
            {/* Canopy */}
            <circle cx="32" cy="22" r="17" fill="url(#magicGlow)" />
            <circle cx="18" cy="29" r="13" fill="url(#magicGlow)" />
            <circle cx="46" cy="29" r="13" fill="url(#magicGlow)" />
            {/* Floating magic orbs / runes */}
            <circle cx="32" cy="14" r="2.5" fill="#F0ABFC" className="animate-pulse" />
            <circle cx="18" cy="22" r="2" fill="#E879F9" />
            <circle cx="45" cy="22" r="2" fill="#E879F9" />
            <circle cx="26" cy="34" r="1.5" fill="#F5D0FE" />
            <circle cx="38" cy="34" r="1.5" fill="#F5D0FE" />
            {/* Magic vines */}
            <path d="M20 32 Q16 46 18 52" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
            <path d="M44 32 Q48 46 46 52" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
          </svg>
        );

      case 8: // Golden Tree
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl">
            <defs>
              <linearGradient id="goldTrunk" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <radialGradient id="goldCanopy" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="35%" stopColor="#FACC15" />
                <stop offset="70%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#854D0E" />
              </radialGradient>
            </defs>
            <circle cx="32" cy="26" r="28" fill="rgba(250, 204, 21, 0.22)" filter="blur(5px)" />
            <ellipse cx="32" cy="58" rx="20" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Trunk with gold filigree */}
            <path d="M28 32 L26 56 L38 56 L36 32 Z" fill="url(#goldTrunk)" />
            {/* Golden canopy */}
            <circle cx="32" cy="20" r="17" fill="url(#goldCanopy)" />
            <circle cx="18" cy="28" r="14" fill="url(#goldCanopy)" />
            <circle cx="46" cy="28" r="14" fill="url(#goldCanopy)" />
            <circle cx="28" cy="36" r="12" fill="url(#goldCanopy)" />
            <circle cx="36" cy="36" r="12" fill="url(#goldCanopy)" />
            {/* Sparkling Gold Coins */}
            <circle cx="26" cy="22" r="3.5" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
            <circle cx="38" cy="20" r="3.5" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
            <circle cx="18" cy="32" r="3" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
            <circle cx="46" cy="32" r="3" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
            <circle cx="32" cy="32" r="4" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
            {/* Sparkles */}
            <path d="M32 6 L33 11 L38 12 L33 13 L32 18 L31 13 L26 12 L31 11 Z" fill="#FFFBEB" />
          </svg>
        );

      case 9: // Crystal Tree
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl">
            <defs>
              <linearGradient id="crystalFacet1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A5F3FC" />
                <stop offset="100%" stopColor="#0891B2" />
              </linearGradient>
              <linearGradient id="crystalFacet2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CFFAFE" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="crystalTrunk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0E7490" />
                <stop offset="100%" stopColor="#164E63" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="26" r="28" fill="rgba(6, 182, 212, 0.25)" filter="blur(6px)" />
            <ellipse cx="32" cy="58" rx="20" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Crystal trunk */}
            <polygon points="28,32 36,32 39,56 25,56" fill="url(#crystalTrunk)" />
            {/* Crystal gemstone clusters */}
            <polygon points="32,8 44,22 32,32 20,22" fill="url(#crystalFacet2)" />
            <polygon points="32,8 32,32 20,22" fill="url(#crystalFacet1)" opacity="0.8" />
            {/* Left crystal shard */}
            <polygon points="18,18 28,32 12,38 8,24" fill="url(#crystalFacet1)" />
            {/* Right crystal shard */}
            <polygon points="46,18 56,24 52,38 36,32" fill="url(#crystalFacet2)" />
            {/* Bottom crystal wings */}
            <polygon points="32,24 48,38 32,48 16,38" fill="url(#crystalFacet1)" />
            {/* Prismatic flare */}
            <polygon points="32,12 34,18 40,20 34,22 32,28 30,22 24,20 30,18" fill="#FFFFFF" />
          </svg>
        );

      case 10: // Empire Tree (The Apex)
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-2xl">
            <defs>
              <radialGradient id="empireAura" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="75%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#451A03" />
              </radialGradient>
              <linearGradient id="imperialGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            {/* Outer halo */}
            <circle cx="32" cy="24" r="30" fill="rgba(245, 158, 11, 0.35)" filter="blur(7px)" />
            <ellipse cx="32" cy="58" rx="22" ry="4" fill="rgba(0,0,0,0.45)" />
            {/* Regal roots and trunk */}
            <path d="M26 34 L22 57 Q32 59 42 57 L38 34 Z" fill="url(#imperialGold)" />
            {/* Giant celestial foliage */}
            <circle cx="32" cy="22" r="20" fill="url(#empireAura)" />
            <circle cx="16" cy="30" r="15" fill="url(#empireAura)" />
            <circle cx="48" cy="30" r="15" fill="url(#empireAura)" />
            <circle cx="25" cy="40" r="13" fill="url(#empireAura)" />
            <circle cx="39" cy="40" r="13" fill="url(#empireAura)" />
            {/* Crown of the Empire atop the canopy */}
            <g transform="translate(20, 2)">
              <polygon points="0,12 4,3 12,9 20,3 24,12" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
              <rect x="0" y="11" width="24" height="4" rx="1" fill="#EAB308" stroke="#B45309" strokeWidth="0.8" />
              <circle cx="4" cy="3" r="1.5" fill="#EF4444" />
              <circle cx="12" cy="9" r="1.8" fill="#3B82F6" />
              <circle cx="20" cy="3" r="1.5" fill="#10B981" />
            </g>
            {/* Radiant gems suspended */}
            <circle cx="32" cy="28" r="3.5" fill="#FFFFFF" className="animate-pulse" />
            <circle cx="22" cy="24" r="2.5" fill="#FEF08A" />
            <circle cx="42" cy="24" r="2.5" fill="#FEF08A" />
            <circle cx="16" cy="36" r="2" fill="#FEF08A" />
            <circle cx="48" cy="36" r="2" fill="#FEF08A" />
          </svg>
        );

      default:
        // Procedural High-Fidelity Botanical Renderer for Levels 11 through 100
        return renderHighTierTree(level, def);
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeStyles[size]} ${className}`}>
      {renderSvgContent()}
      {showBadge && (
        <span
          className={`absolute -bottom-1 -right-1 flex items-center justify-center rounded-full font-extrabold font-mono shadow-md border border-black/60 ${
            level >= 100
              ? 'min-w-[22px] h-[17px] text-[8px] px-0.5'
              : level >= 10
              ? 'min-w-[18px] h-[17px] text-[9px] px-0.5'
              : 'min-w-[16px] h-[16px] text-[10px] px-1'
          }`}
          style={{
            backgroundColor: def.primaryColor,
            color:
              ['#FDE047', '#FEF08A', '#FACC15', '#EAB308', '#BAE6FD', '#E0F2FE', '#F8FAFC'].includes(
                def.primaryColor
              ) || (level >= 8 && level <= 10)
                ? '#000'
                : '#FFF',
          }}
        >
          {level}
        </span>
      )}
    </div>
  );
};

// Procedural Botanical Renderer for Levels 11 to 100
function renderHighTierTree(level: number, def: { primaryColor: string; glowColor: string; canopyStyle?: string }) {
  const primary = def.primaryColor || '#10B981';
  const glow = def.glowColor || 'rgba(16, 185, 129, 0.6)';
  const style = def.canopyStyle || 'worldtree';

  const gradId = `canopyGrad_${level}`;
  const trunkGradId = `trunkGrad_${level}`;
  const auraId = `auraGrad_${level}`;

  const isCosmicTier = level >= 20;
  const isMythicTier = level >= 40;
  const isGalacticTier = level >= 60;
  const isSovereignTier = level >= 75;
  const isGodlyTier = level >= 90;
  const isMaxTier = level === 100;

  return (
    <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl">
      <defs>
        <radialGradient id={auraId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={primary} stopOpacity={0.8} />
          <stop offset="60%" stopColor={primary} stopOpacity={0.3} />
          <stop offset="100%" stopColor="transparent" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={gradId} cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.7} />
          <stop offset="25%" stopColor={primary} />
          <stop offset="75%" stopColor={primary} stopOpacity={0.85} />
          <stop offset="100%" stopColor="#0F172A" stopOpacity={0.9} />
        </radialGradient>
        <linearGradient id={trunkGradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={isSovereignTier ? '#78350F' : '#334155'} />
          <stop offset="50%" stopColor={isSovereignTier ? '#D97706' : '#64748B'} />
          <stop offset="100%" stopColor={isSovereignTier ? '#451A03' : '#1E293B'} />
        </linearGradient>
      </defs>

      {/* Atmospheric Glow Aura */}
      <circle
        cx="32"
        cy="26"
        r={isMaxTier ? 32 : isGodlyTier ? 30 : isGalacticTier ? 28 : 26}
        fill={`url(#${auraId})`}
        filter="blur(5px)"
      />

      {/* Ground Shadow */}
      <ellipse cx="32" cy="58" rx={isMaxTier ? 24 : 20} ry={4} fill="rgba(0,0,0,0.4)" />

      {/* Trunk rendering based on style */}
      {style === 'crystal' ? (
        <polygon points="28,34 36,34 39,57 25,57" fill={primary} opacity={0.8} stroke="#FFF" strokeWidth="0.5" />
      ) : style === 'banyan' ? (
        <g>
          <path d="M25 36 L23 57 L28 57 L29 36 Z" fill={`url(#${trunkGradId})`} />
          <path d="M35 36 L36 57 L41 57 L39 36 Z" fill={`url(#${trunkGradId})`} />
          <path d="M29 34 L31 57 L33 57 L35 34 Z" fill={`url(#${trunkGradId})`} />
        </g>
      ) : style === 'spire' ? (
        <polygon points="30,30 34,30 36,57 28,57" fill={`url(#${trunkGradId})`} />
      ) : style === 'redwood' ? (
        <g>
          <path d="M25 28 L23 57 Q32 59 41 57 L39 28 Z" fill={`url(#${trunkGradId})`} />
          <path d="M29 34 L30 54" stroke="#EF4444" strokeWidth="1" strokeDasharray="3 2" />
          <path d="M34 32 L33 55" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" />
        </g>
      ) : (
        <path d="M27 34 L25 57 Q32 59 39 57 L37 34 Z" fill={`url(#${trunkGradId})`} />
      )}

      {/* Canopy rendering based on style */}
      {style === 'pine' ? (
        <g>
          <polygon points="32,8 46,24 18,24" fill={`url(#${gradId})`} />
          <polygon points="32,18 49,34 15,34" fill={`url(#${gradId})`} />
          <polygon points="32,28 52,44 12,44" fill={`url(#${gradId})`} />
        </g>
      ) : style === 'willow' ? (
        <g>
          <circle cx="32" cy="22" r="16" fill={`url(#${gradId})`} />
          {/* Weeping vines */}
          <path d="M20 25 Q14 38 17 48" stroke={primary} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M26 28 Q22 42 24 51" stroke={primary} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M38 28 Q42 42 40 51" stroke={primary} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M44 25 Q50 38 47 48" stroke={primary} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Glowing stardust drops */}
          <circle cx="17" cy="48" r="2" fill="#FFFFFF" />
          <circle cx="24" cy="51" r="2" fill="#FFFFFF" />
          <circle cx="40" cy="51" r="2" fill="#FFFFFF" />
          <circle cx="47" cy="48" r="2" fill="#FFFFFF" />
        </g>
      ) : style === 'blossom' ? (
        <g>
          <circle cx="32" cy="18" r="12" fill={`url(#${gradId})`} />
          <circle cx="20" cy="26" r="11" fill={`url(#${gradId})`} />
          <circle cx="44" cy="26" r="11" fill={`url(#${gradId})`} />
          <circle cx="27" cy="35" r="10" fill={`url(#${gradId})`} />
          <circle cx="37" cy="35" r="10" fill={`url(#${gradId})`} />
          <circle cx="32" cy="26" r="9" fill="#FFF" opacity={0.6} />
          {/* Floating petals */}
          <ellipse cx="14" cy="38" rx="3" ry="1.5" fill={primary} transform="rotate(-20 14 38)" />
          <ellipse cx="50" cy="38" rx="3" ry="1.5" fill={primary} transform="rotate(25 50 38)" />
        </g>
      ) : style === 'crystal' ? (
        <g>
          <polygon points="32,6 46,20 32,30 18,20" fill={`url(#${gradId})`} stroke="#FFF" strokeWidth="0.8" />
          <polygon points="32,6 32,30 18,20" fill="#FFF" opacity={0.35} />
          <polygon points="16,16 27,28 12,35 7,22" fill={`url(#${gradId})`} stroke="#FFF" strokeWidth="0.6" />
          <polygon points="48,16 57,22 52,35 37,28" fill={`url(#${gradId})`} stroke="#FFF" strokeWidth="0.6" />
          <polygon points="32,22 47,36 32,46 17,36" fill={`url(#${gradId})`} stroke="#FFF" strokeWidth="0.8" />
          {/* Diamond flare */}
          <polygon points="32,10 33.5,15 38,16 33.5,17 32,22 30.5,17 26,16 30.5,15" fill="#FFF" />
        </g>
      ) : style === 'spire' ? (
        <g>
          <polygon points="32,6 42,24 38,44 26,44 22,24" fill={`url(#${gradId})`} />
          {/* Ascending energy rings */}
          <ellipse cx="32" cy="20" rx="14" ry="4" fill="none" stroke="#FFF" strokeWidth="1.2" opacity={0.8} />
          <ellipse cx="32" cy="30" rx="16" ry="4" fill="none" stroke="#FFF" strokeWidth="1.2" opacity={0.7} />
          <ellipse cx="32" cy="40" rx="18" ry="4.5" fill="none" stroke="#FFF" strokeWidth="1.2" opacity={0.6} />
          <circle cx="32" cy="6" r="3" fill="#FFF" />
        </g>
      ) : style === 'redwood' ? (
        <g>
          <circle cx="32" cy="18" r="15" fill={`url(#${gradId})`} />
          <circle cx="18" cy="24" r="11" fill={`url(#${gradId})`} />
          <circle cx="46" cy="24" r="11" fill={`url(#${gradId})`} />
          <circle cx="26" cy="30" r="10" fill={`url(#${gradId})`} />
          <circle cx="38" cy="30" r="10" fill={`url(#${gradId})`} />
          {/* Flaming tips */}
          <path d="M32 3 Q34 10 32 14" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ) : style === 'baobab' ? (
        <g>
          <ellipse cx="32" cy="20" rx="22" ry="12" fill={`url(#${gradId})`} />
          <ellipse cx="22" cy="26" rx="14" ry="9" fill={`url(#${gradId})`} />
          <ellipse cx="42" cy="26" rx="14" ry="9" fill={`url(#${gradId})`} />
          {/* Hanging exotic fruits */}
          <circle cx="20" cy="32" r="3" fill="#F59E0B" />
          <circle cx="44" cy="32" r="3" fill="#F59E0B" />
          <circle cx="32" cy="30" r="3.5" fill="#F59E0B" />
        </g>
      ) : (
        /* World Tree / Oak / Sacred Arboretum */
        <g>
          <circle cx="32" cy="19" r="18" fill={`url(#${gradId})`} />
          <circle cx="16" cy="27" r="13" fill={`url(#${gradId})`} />
          <circle cx="48" cy="27" r="13" fill={`url(#${gradId})`} />
          <circle cx="25" cy="37" r="11" fill={`url(#${gradId})`} />
          <circle cx="39" cy="37" r="11" fill={`url(#${gradId})`} />
        </g>
      )}

      {/* Tier Flourish: Celestial Orbital Ring */}
      {(isCosmicTier || isGalacticTier || isMaxTier) && (
        <ellipse
          cx="32"
          cy="26"
          rx="27"
          ry="7"
          fill="none"
          stroke={isMaxTier ? '#FDE047' : '#FFFFFF'}
          strokeWidth="1.2"
          opacity={0.75}
          transform="rotate(-15 32 26)"
        />
      )}

      {/* Tier Flourish: Orbiting Stars / Spheres */}
      {isCosmicTier && (
        <g>
          <circle cx="10" cy="24" r="2.2" fill="#FFFFFF" />
          <circle cx="54" cy="28" r="2.2" fill="#FFFFFF" />
          <circle cx="32" cy="10" r="2.5" fill="#FEF08A" />
        </g>
      )}

      {/* Tier Flourish: Divine Halos / Golden Crown */}
      {(isSovereignTier || isMaxTier) && (
        <g transform="translate(20, 2)">
          <polygon points="0,11 4,3 12,8 20,3 24,11" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
          <rect x="0" y="10" width="24" height="3" rx="1" fill="#F59E0B" />
          <circle cx="4" cy="3" r="1.3" fill="#EF4444" />
          <circle cx="12" cy="8" r="1.6" fill="#3B82F6" />
          <circle cx="20" cy="3" r="1.3" fill="#10B981" />
        </g>
      )}

      {/* Level 100 Grand Masterpiece Ultimate Crown & Ray Burst */}
      {isMaxTier && (
        <g>
          {/* Radial celestial rays */}
          <line x1="32" y1="2" x2="32" y2="0" stroke="#FFF" strokeWidth="2" />
          <line x1="48" y1="8" x2="52" y2="5" stroke="#FFF" strokeWidth="2" />
          <line x1="16" y1="8" x2="12" y2="5" stroke="#FFF" strokeWidth="2" />
          {/* 4 Orbiting Divine Gemstones */}
          <polygon points="32,4 34,7 32,10 30,7" fill="#38BDF8" />
          <polygon points="56,26 58,29 56,32 54,29" fill="#EC4899" />
          <polygon points="8,26 10,29 8,32 6,29" fill="#10B981" />
          <polygon points="32,50 34,53 32,56 30,53" fill="#F59E0B" />
          {/* Diamond center flare */}
          <circle cx="32" cy="26" r="4.5" fill="#FFFFFF" className="animate-pulse" />
        </g>
      )}
    </svg>
  );
}
