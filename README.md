# MERGE MASTER – BUILD YOUR EMPIRE (VERSION 2.0)

> **Tagline**: Merge. Upgrade. Build Your Empire.

A premium, highly polished, responsive casual merge puzzle game built with React, TypeScript, Tailwind CSS, and the Web Audio API. 100% free-to-play with zero real-money purchases, powered by browser LocalStorage persistence.

---

## 🌟 Version 2.0 Premium Upgrade Highlights

1. **Player Profile System**:
   - Customizable player nickname with inline editing.
   - Dynamic avatar preview based on your apex botanical discovery.
   - Career statistics dashboard (Total Score, Total Merges, Total Coins Earned, Highest Combo).
   - Unlocked feats & achievement badges tracker.

2. **Refined Daily Reward Calendar**:
   - Day 1: 100 Coins
   - Day 2: 150 Coins
   - Day 3: 200 Coins + 1 Free Undo
   - Day 4: 300 Coins
   - Day 5: 400 Coins + 1 Prune Shovel
   - Day 6: 500 Coins
   - Day 7: 1,000 Coins + 1 Magic Upgrade Booster (Sovereign Jackpot)
   - Strict local calendar validation preventing repeated claims on the same day.

3. **Three Calendar-Date Daily Missions**:
   - **Merge 10 Objects**: Fuse 10 botanical items on the 5x5 board.
   - **Create 3 Higher-Level Objects**: Cultivate 3 items of Level 4 (Flower) or higher.
   - **Earn 500 Points**: Score at least 500 points from botanical fusions today.
   - Auto-refreshes daily with virtual coin and EXP rewards.

4. **Web Audio Sound & Ambient Fantasy Music Engine**:
   - **Background Music (BGM)**: Gentle procedural fantasy marimba/celesta arpeggiator with independent ON/OFF control.
   - **Sound Effects (SFX)**: Distinct movement whooshes, invalid move tactile bumps, pitch-scaling merge chimes, combo chords, and celebratory fanfares.
   - Respects browser autoplay restrictions and reduced motion preferences.

5. **Enhanced Mobile Touch & Drag Experience**:
   - Smooth touch drag & drop with pointer hit-testing (`document.elementFromPoint`).
   - Tactile invalid merge shake animation (`animate-shake`).
   - Floating particle text rewards (`+25 Coins`, `+50 EXP`) rising from merged tiles.

---

## 🎮 Gameplay & Core Mechanics

### 1. The 5 × 5 Merge Board
- **Drag & Drop**: Grab botanical items with touch or mouse to move to any empty garden plot or drop directly onto an identical item to merge.
- **Tap-to-Move / Tap-to-Merge**:
  - Tap once on any item to highlight it.
  - Tap an empty cell to move it there.
  - Tap an identical item to fuse them into the next level.
  - Tap the same item to deselect.
- **Controlled Seed Spawner**: Tap **"Plant Seed"** to generate new low-level flora (Level 1 Seed: 80%, Level 2 Sprout: 18%, Level 3 Plant: 2%).
- **Combo System**: Fast consecutive merges within 3.5 seconds trigger Combo x2, x3, x4 with escalating score multipliers and bonus coins.
- **Undo Moves**: Reverts accidental moves or fusions using a snapshot history stack.
- **Fair Game-Over Detection**: If all 25 cells are occupied and zero matching items exist across the entire board, a Game Over screen appears with an option to restart or use a Prune Shovel to escape.

---

## 🌿 10 Progressive Botanical Levels

| Level | Name | Score | Coins | EXP | Description |
|:---:|:---|:---:|:---:|:---:|:---|
| 1 | **Seed** | 10 | 1 | 5 | A dormant botanical seed full of imperial potential |
| 2 | **Sprout** | 25 | 2 | 12 | Tender twin leaves pushing through fertile soil |
| 3 | **Plant** | 60 | 5 | 25 | Thriving foliage drinking in sunlight and moisture |
| 4 | **Flower** | 150 | 12 | 50 | Fragrant blossom radiating vibrant nectar and beauty |
| 5 | **Bush** | 350 | 25 | 90 | Dense verdant shrub laden with juicy royal berries |
| 6 | **Tree** | 800 | 50 | 160 | Broad canopy providing shade and timeless strength |
| 7 | **Magic Tree** | 1,800 | 110 | 280 | Enchanted willow humming with cosmic arcane energy |
| 8 | **Golden Tree** | 4,000 | 240 | 500 | Shimmering branches bearing coins of solid gold |
| 9 | **Crystal Tree** | 9,000 | 500 | 900 | Faceted crystalline boughs refracting divine light |
| 10 | **Empire Tree** | 25,000 | 1,500 | 2,000 | The monumental World Tree crowned in royal majesty |

---

## 🏰 Empire Section (World Building & Passive Income)

Players invest their earned virtual coins to unlock and upgrade 5 historical royal territories:
1. **Rustic Village** (Tier 1–5): Thatched cottages, working windmill, farmlands.
2. **Botanical Garden** (Tier 1–5): Marble gazebos, sculpted hedge arches, royal fountains.
3. **Merchant Town** (Tier 1–5): Clock tower, cobblestone avenues, market stalls.
4. **Imperial City** (Tier 1–5): Fortified stone aqueducts, watchtowers, harbor canals.
5. **Grand Royal Kingdom** (Tier 1–5): The Sun Citadel, stained glass rose windows, golden spires.

Each tier upgrade visually alters the territory's custom SVG illustration and increases passive coin generation per minute. Players can collect their accumulated revenue anytime via the **"Collect All"** button.

---

## 💎 Economy & Tactical Boosters

- **100% Free Virtual Economy**: No real-money purchases, wagering, or paywalls.
- **Boosters**:
  - ↩️ *Undo*: Reverts the previous move via a snapshot history stack.
  - ✂️ *Pruning Shears / Shovel*: Removes unwanted lower-tier botanical items from crowded boards.
  - 🪄 *Royal Fertilizer (Upgrade)*: Promotes any plant up to Level 9 by +1 level instantly.
  - 🌪️ *Forest Breeze (Shuffle)*: Reorganizes tiles across the board to break deadlocks.
- **Cosmetic Bazaar**: Unlockable board themes (*Emerald Grove*, *Midnight Twilight*, *Imperial Gold*, and *Cherry Blossom*).

---

## 🚀 Running & Building

### Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the game.

### Production Build
```bash
npm run build
```
Creates an optimized static bundle in the `dist` directory ready for deployment.

---

## 📄 License
Apache-2.0
