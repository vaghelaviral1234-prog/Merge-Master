/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { BoardTile, ToolType, BoosterInventory, FloatingText } from '../types/game';
import { ObjectIllustration } from './ObjectIllustration';
import { sound, triggerHaptic } from '../utils/audio';
import { Sparkles, Undo2, Shovel, Wand2, Shuffle, PlusCircle, Flame } from 'lucide-react';
import { BOARD_THEMES, MAX_LEVEL } from '../constants/gameData';

interface BoardProps {
  board: (BoardTile | null)[];
  themeId: string;
  boosters: BoosterInventory;
  activeTool: ToolType | null;
  comboCount: number;
  floatingTexts: FloatingText[];
  onTileMove: (fromIndex: number, toIndex: number) => void;
  onTileMerge: (fromIndex: number, toIndex: number) => void;
  onSpawnTile: () => void;
  onUseBooster: (tool: ToolType, targetIndex?: number) => void;
  onSelectTool: (tool: ToolType | null) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  themeId,
  boosters,
  activeTool,
  comboCount,
  floatingTexts,
  onTileMove,
  onTileMerge,
  onSpawnTile,
  onUseBooster,
  onSelectTool,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const touchTargetIdx = useRef<number | null>(null);

  const currentTheme = BOARD_THEMES.find((t) => t.id === themeId) || BOARD_THEMES[0];
  const emptyCellsCount = board.filter((t) => t === null).length;
  const maxLevelOnBoard = board.reduce((max, tile) => (tile ? Math.max(max, tile.level) : max), 0);
  let baseSpawnLevel = 1;
  if (maxLevelOnBoard >= 11) {
    baseSpawnLevel = maxLevelOnBoard - 5;
  } else if (maxLevelOnBoard >= 8) {
    baseSpawnLevel = 3;
  }

  // Detect orphan lower trees (odd count below baseSpawnLevel that need a partner to merge)
  const levelCounts: Record<number, number> = {};
  board.forEach((tile) => {
    if (tile) {
      levelCounts[tile.level] = (levelCounts[tile.level] || 0) + 1;
    }
  });

  const orphanLevels = Object.keys(levelCounts)
    .map(Number)
    .filter((lvl) => lvl < baseSpawnLevel && levelCounts[lvl] % 2 === 1)
    .sort((a, b) => a - b);

  const nextOrphanLevel = orphanLevels.length > 0 ? orphanLevels[0] : null;

  const triggerInvalidShake = (index: number) => {
    sound.playInvalid();
    triggerHaptic(40);
    setShakingIndex(index);
    setTimeout(() => {
      setShakingIndex(null);
    }, 350);
  };

  // Handle cell click (Tap-to-select, tap-to-move, tap-to-merge, or booster application)
  const handleCellClick = (index: number) => {
    // If a booster tool is active (e.g. Shovel or Magic Upgrade)
    if (activeTool === 'shovel') {
      if (board[index] !== null) {
        onUseBooster('shovel', index);
        onSelectTool(null);
      } else {
        triggerInvalidShake(index);
      }
      return;
    }

    if (activeTool === 'upgrade') {
      if (board[index] !== null && board[index]!.level < MAX_LEVEL) {
        onUseBooster('upgrade', index);
        onSelectTool(null);
      } else {
        triggerInvalidShake(index);
      }
      return;
    }

    // Normal play: No booster tool selected
    if (selectedIndex === null) {
      if (board[index] !== null) {
        sound.playClick();
        triggerHaptic(15);
        setSelectedIndex(index);
      }
    } else {
      if (selectedIndex === index) {
        // Tapped same tile -> deselect
        sound.playClick();
        setSelectedIndex(null);
      } else if (board[index] === null) {
        // Target is empty -> MOVE item
        sound.playObjectMove();
        triggerHaptic(20);
        onTileMove(selectedIndex, index);
        setSelectedIndex(null);
      } else {
        // Target has an item
        const sourceTile = board[selectedIndex];
        const targetTile = board[index];

        if (sourceTile && targetTile && sourceTile.level === targetTile.level && sourceTile.level < MAX_LEVEL) {
          // Identical level -> MERGE!
          onTileMerge(selectedIndex, index);
          setSelectedIndex(null);
        } else {
          // Different level or reached MAX_LEVEL -> feedback shake and select new item
          triggerInvalidShake(index);
          setSelectedIndex(index);
        }
      }
    }
  };

  // HTML5 Drag and Drop handlers (Desktop)
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (board[index] === null || activeTool !== null) {
      e.preventDefault();
      return;
    }
    sound.playObjectMove();
    setDraggedIndex(index);
    setSelectedIndex(null);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    triggerHaptic(20);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    const sourceIndex = draggedIndex;
    setDraggedIndex(null);

    if (sourceIndex === null || sourceIndex === targetIndex) return;

    const sourceTile = board[sourceIndex];
    const targetTile = board[targetIndex];

    if (!sourceTile) return;

    if (targetTile === null) {
      sound.playObjectMove();
      onTileMove(sourceIndex, targetIndex);
    } else if (sourceTile.level === targetTile.level && sourceTile.level < MAX_LEVEL) {
      onTileMerge(sourceIndex, targetIndex);
    } else {
      triggerInvalidShake(targetIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Mobile Touch Drag Support
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    if (board[index] === null || activeTool !== null) return;
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    touchTargetIdx.current = index;
    setDraggedIndex(index);
    triggerHaptic(15);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cellEl = element?.closest('[data-cell-index]');
    if (cellEl) {
      const idx = parseInt(cellEl.getAttribute('data-cell-index') || '-1', 10);
      if (idx >= 0 && idx < 25 && idx !== dragOverIndex) {
        setDragOverIndex(idx);
      }
    }
  };

  const handleTouchEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const sourceTile = board[draggedIndex];
      const targetTile = board[dragOverIndex];

      if (sourceTile) {
        if (targetTile === null) {
          sound.playObjectMove();
          onTileMove(draggedIndex, dragOverIndex);
        } else if (sourceTile.level === targetTile.level && sourceTile.level < MAX_LEVEL) {
          onTileMerge(draggedIndex, dragOverIndex);
        } else {
          triggerInvalidShake(dragOverIndex);
        }
      }
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    touchStartPos.current = null;
    touchTargetIdx.current = null;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-2">
      {/* Active Booster Tool Banner */}
      {activeTool && (
        <div className="w-full mb-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between animate-pulse">
          <span className="font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {activeTool === 'shovel' && 'Tap any plant on the board to prune and remove it'}
            {activeTool === 'upgrade' && `Tap any plant (Level 1-${MAX_LEVEL - 1}) to promote by +1 Level`}
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onSelectTool(null);
            }}
            className="text-[11px] underline hover:text-white font-bold"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 5x5 Board Container */}
      <div
        ref={boardRef}
        className={`relative w-full aspect-square p-2.5 rounded-3xl border shadow-2xl transition-colors duration-500 ${currentTheme.boardBg}`}
      >
        {/* Floating Combo Indicator */}
        {comboCount >= 2 && (
          <div className="absolute -top-3.5 right-4 z-20 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full shadow-lg shadow-rose-500/30 animate-bounce border border-yellow-200 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-slate-950" />
            <span>COMBO x{comboCount}!</span>
          </div>
        )}

        {/* 5x5 Grid */}
        <div
          className="grid grid-cols-5 grid-rows-5 gap-1.5 sm:gap-2 w-full h-full"
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {board.map((tile, index) => {
            const isSelected = selectedIndex === index;
            const isDragged = draggedIndex === index;
            const isDragOver = dragOverIndex === index;
            const isShaking = shakingIndex === index;

            // Check if floating texts exist for this cell
            const cellFloatingTexts = floatingTexts.filter(
              (ft) => ft.x === index % 5 && ft.y === Math.floor(index / 5)
            );

            return (
              <div
                key={index}
                data-cell-index={index}
                onClick={() => handleCellClick(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={`relative flex items-center justify-center rounded-2xl border transition-all duration-150 game-cell-glow select-none cursor-pointer ${
                  currentTheme.cellBg
                } ${
                  isSelected
                    ? 'ring-2 ring-amber-400 bg-amber-500/30 scale-105 z-10 shadow-lg shadow-amber-500/30'
                    : isDragOver
                    ? 'ring-2 ring-emerald-400 bg-emerald-500/35 scale-105 z-10 shadow-lg shadow-emerald-500/30'
                    : currentTheme.cellBorder
                } ${isDragged ? 'opacity-40 scale-95' : 'opacity-100'} ${
                  isShaking ? 'animate-shake ring-2 ring-rose-500 bg-rose-500/20' : ''
                }`}
              >
                {/* Floating Reward Text Popups */}
                {cellFloatingTexts.map((ft) => (
                  <div
                    key={ft.id}
                    className="absolute z-30 pointer-events-none animate-float-up font-extrabold text-[11px] sm:text-xs font-mono drop-shadow-md text-amber-300"
                  >
                    {ft.text}
                  </div>
                ))}

                {tile ? (
                  <div
                    draggable={!activeTool}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={(e) => handleTouchStart(e, index)}
                    className={`w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing ${
                      tile.isNew ? 'animate-pop-in' : ''
                    } ${tile.isMerged ? 'animate-merge-burst' : ''}`}
                  >
                    <ObjectIllustration
                      level={tile.level}
                      size="md"
                      showBadge={true}
                      className="w-10 h-10 sm:w-12 sm:h-12 pointer-events-none drop-shadow-md"
                    />
                  </div>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Spawn Button & Action Area */}
      <div className="w-full mt-3 flex items-center gap-2">
        {/* Spawn / Plant Button */}
        <button
          onClick={() => {
            sound.playClick();
            onSpawnTile();
          }}
          disabled={emptyCellsCount === 0}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold font-display text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
            emptyCellsCount > 0
              ? nextOrphanLevel !== null
                ? 'bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 hover:brightness-110 text-slate-950 shadow-sky-500/25 active:scale-98 cursor-pointer ring-2 ring-sky-300/60'
                : baseSpawnLevel > 1
                ? 'bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 hover:brightness-110 text-slate-950 shadow-emerald-500/25 active:scale-98 cursor-pointer ring-1 ring-amber-300/40'
                : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 active:scale-98 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <PlusCircle className="w-5 h-5 text-slate-950" />
          <span>
            {nextOrphanLevel !== null
              ? `Plant Match (Lvl ${nextOrphanLevel})`
              : baseSpawnLevel >= 6
              ? `Plant Tree (Lvl ${baseSpawnLevel}+)`
              : baseSpawnLevel >= 3
              ? `Plant Seed (Lvl 3+)`
              : 'Plant Seed'}
          </span>
          <span className="text-xs font-mono font-normal opacity-85 px-1.5 py-0.5 rounded bg-black/15">
            {emptyCellsCount} free
          </span>
        </button>
      </div>

      {/* Booster Controls Strip */}
      <div className="w-full mt-2.5 grid grid-cols-4 gap-2">
        {/* Undo Move */}
        <button
          onClick={() => {
            sound.playClick();
            onUseBooster('undo');
          }}
          disabled={boosters.undo <= 0}
          className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-xs font-medium transition-all ${
            boosters.undo > 0
              ? 'bg-slate-900/90 border-slate-700 hover:bg-slate-800 text-slate-200 active:scale-95 cursor-pointer'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-600 cursor-not-allowed opacity-60'
          }`}
          title="Undo previous move"
        >
          <Undo2 className="w-4 h-4 text-sky-400 mb-0.5" />
          <span className="text-[10px] leading-tight">Undo</span>
          <span className="absolute -top-1.5 -right-1 font-mono font-bold text-[9px] bg-sky-500 text-slate-950 px-1 rounded-full border border-black/40">
            {boosters.undo}
          </span>
        </button>

        {/* Shovel / Prune */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTool(activeTool === 'shovel' ? null : 'shovel');
          }}
          disabled={boosters.shovel <= 0}
          className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-xs font-medium transition-all ${
            activeTool === 'shovel'
              ? 'bg-rose-500 text-slate-950 border-rose-400 font-bold shadow-md shadow-rose-500/20'
              : boosters.shovel > 0
              ? 'bg-slate-900/90 border-slate-700 hover:bg-slate-800 text-slate-200 active:scale-95 cursor-pointer'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-600 cursor-not-allowed opacity-60'
          }`}
          title="Prune an unwanted botanical item"
        >
          <Shovel
            className={`w-4 h-4 mb-0.5 ${activeTool === 'shovel' ? 'text-slate-950' : 'text-rose-400'}`}
          />
          <span className="text-[10px] leading-tight">Prune</span>
          <span className="absolute -top-1.5 -right-1 font-mono font-bold text-[9px] bg-rose-500 text-white px-1 rounded-full border border-black/40">
            {boosters.shovel}
          </span>
        </button>

        {/* Magic Upgrade */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTool(activeTool === 'upgrade' ? null : 'upgrade');
          }}
          disabled={boosters.upgrade <= 0}
          className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-xs font-medium transition-all ${
            activeTool === 'upgrade'
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
              : boosters.upgrade > 0
              ? 'bg-slate-900/90 border-slate-700 hover:bg-slate-800 text-slate-200 active:scale-95 cursor-pointer'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-600 cursor-not-allowed opacity-60'
          }`}
          title="Instantly upgrade any plant by +1 Level"
        >
          <Wand2
            className={`w-4 h-4 mb-0.5 ${activeTool === 'upgrade' ? 'text-slate-950' : 'text-amber-400'}`}
          />
          <span className="text-[10px] leading-tight">Upgrade</span>
          <span className="absolute -top-1.5 -right-1 font-mono font-bold text-[9px] bg-amber-500 text-slate-950 px-1 rounded-full border border-black/40">
            {boosters.upgrade}
          </span>
        </button>

        {/* Shuffle Board */}
        <button
          onClick={() => {
            sound.playClick();
            onUseBooster('shuffle');
          }}
          disabled={boosters.shuffle <= 0}
          className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-xs font-medium transition-all ${
            boosters.shuffle > 0
              ? 'bg-slate-900/90 border-slate-700 hover:bg-slate-800 text-slate-200 active:scale-95 cursor-pointer'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-600 cursor-not-allowed opacity-60'
          }`}
          title="Shuffle items on board to break deadlocks"
        >
          <Shuffle className="w-4 h-4 text-purple-400 mb-0.5" />
          <span className="text-[10px] leading-tight">Shuffle</span>
          <span className="absolute -top-1.5 -right-1 font-mono font-bold text-[9px] bg-purple-500 text-white px-1 rounded-full border border-black/40">
            {boosters.shuffle}
          </span>
        </button>
      </div>

      {/* Control Hint Line */}
      <div className="mt-2 text-center text-[11px] text-slate-400">
        <span>Tap or drag identical trees together to merge up to Level 100 · Spawns fill empty slots</span>
      </div>
    </div>
  );
};
