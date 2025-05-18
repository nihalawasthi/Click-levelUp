# Hunter Clicker

A cyberpunk-themed incremental/clicker game built with React, TypeScript, and Tailwind CSS where players progress through ranks by clicking and upgrading their hunter.

## Features

### Core Gameplay
- Click-based progression system
- Automatic XP generation
- Multiple upgrade paths:
  - Click power upgrades
  - Auto-generation upgrades
  - Multiplier upgrades
  - Prestige upgrades

### Progression System
- 10 ranks from F to SSS
- Prestige system with permanent bonuses
- Achievement system with rewards
- Special abilities that unlock at higher ranks

### Technical Features
- Save system with offline progress
- Sound effects for actions
- Particle effects and animations
- Responsive design
- Fullscreen support

### Visual Style
- Cyberpunk/tech aesthetic
- Glitch effects
- Custom scrollbars
- Animated backgrounds
- Neon color scheme

## Tech Stack

- React
- TypeScript
- Tailwind CSS 
- Framer Motion (animations)
- React Router
- Vite (build tool)

## Project Structure

```
src/
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── pages/           # Main page components
│   ├── game/        # Main game page
│   ├── landing/     # Landing page
│   └── HunterId/    # Hunter ID display page
├── App.tsx          # Root component
└── main.tsx         # Entry point
```

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Game Mechanics

### Ranks
Progress through ranks from F to SSS, each requiring more XP:
- F (Starting rank)
- E, D, C, B, A
- S, S+, SS, SSS

### Upgrades
- Click Power: Increase XP gained per click
- Auto Power: Generate XP automatically
- Multipliers: Increase all XP gains
- Prestige: Permanent bonuses after reset

### Abilities
Special powers unlock at higher ranks:
- Click Frenzy: Double click power
- Gold Rush: Triple XP gains
- Auto Boost: Double auto power
- Critical Mass: 100% critical chance
- Time Warp: Instant XP gain

### Achievements
Complete achievements to earn bonus XP:
- Click milestones
- XP milestones
- Rank achievements
- Upgrade achievements
- Prestige achievements

## Contributing

This is an unfinished project. Feel free to contribute by:
1. Creating issues for bugs or feature requests
2. Submitting pull requests for improvements
3. Adding new content (achievements, upgrades, abilities)