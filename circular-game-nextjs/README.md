# Circular Matching Game - Next.js + Supabase

A professional, database-backed version of the circular matching game built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🎯 Sprint Goals (Completed)

✅ Visit a URL and see a Login screen
✅ Log in (or play as guest)
✅ Play the exact same circular matching game
✅ Questions fetched from database (not hardcoded)

## 🚀 Features

- **Authentication**: Email/password signup and login via Supabase Auth
- **Guest Mode**: Play without creating an account
- **Database-Driven Content**: Questions dynamically loaded from Supabase
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Game Mechanics**:
  - Drag-and-drop matching interface
  - Proximity detection with visual feedback
  - Score tracking (time, attempts, streak)
  - Star rating system based on performance
  - Multiple difficulty levels (easy, medium, hard)

## 📦 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel-ready

## 🛠️ Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Start

1. **Clone and install**:
   ```bash
   cd circular-game-nextjs
   npm install
   ```

2. **Configure Supabase**:
   - Create a project at https://supabase.com
   - Run the SQL migrations in `supabase/migrations/`
   - Update `.env.local` with your credentials

3. **Run locally**:
   ```bash
   npm run dev
   ```

4. **Open**: http://localhost:3000

## 📁 Project Structure

```
circular-game-nextjs/
├── app/
│   ├── dashboard/       # Game dashboard (protected route)
│   ├── login/           # Authentication page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home (redirects to login)
│   └── globals.css      # Global styles
├── components/
│   ├── CircularGame.tsx        # Main game component
│   └── CircularGame.module.css # Game styles
├── hooks/
│   └── useGameData.ts   # Hook for fetching questions from Supabase
├── lib/
│   └── supabase.ts      # Supabase client configuration
├── types/
│   └── game.ts          # TypeScript type definitions
├── supabase/
│   └── migrations/      # Database schema and seed data
│       ├── 001_initial_schema.sql
│       └── 002_seed_data.sql
├── .env.local           # Environment variables (create this)
└── SETUP.md             # Detailed setup guide
```

## 🎮 How to Play

1. **Login or Play as Guest**: Start from the login page
2. **Start Game**: Click "Start Game" in the play area
3. **Match Terms**: Drag terms to their definitions
4. **Proximity Detection**: Pieces glow when close together
5. **Complete**: Match all pairs to see your score and stars

## 🧪 Testing the Database Connection

Follow the "Database Test" in SETUP.md:

1. Go to Supabase Table Editor → `questions`
2. Edit "Mitochondria" → "Powerhouse"
3. Refresh the game
4. ✅ The term should now display as "Powerhouse"

This proves the game is reading from the database!

## 🔄 Migration from Vanilla Version

This project is a professional migration of the vanilla HTML/JS/CSS game to a modern stack:

- ✅ All game logic ported to React components
- ✅ State management with React hooks
- ✅ Drag & drop using DOM events (compatible with React)
- ✅ CSS converted to CSS Modules (scoped styles)
- ✅ Database integration via Supabase
- ✅ Authentication system
- ✅ Same visual design and game feel

### Key Technical Decisions

1. **Option B (Cleaner)**: Game pieces rendered dynamically via `createElement` and `appendChild` (imperative) rather than declarative JSX, because:
   - Easier to port existing drag/drop logic
   - Better performance (no React re-renders during drag)
   - Maintains exact positioning control

2. **CSS Modules**: Keeps styles scoped and prevents naming conflicts

3. **useRef for DOM manipulation**: Direct access to play area for piece positioning

## 📝 Acceptance Criteria Status

| Criteria | Status |
|----------|--------|
| Database Test (edit "Mitochondria" → updates in game) | ✅ Pass |
| Playability Test (drag, snap, visual feedback) | ✅ Pass |
| Auth Test (create account, login) | ✅ Pass |

## 🚧 Future Enhancements

- [ ] User progress tracking
- [ ] Multiple game packs / subjects
- [ ] Leaderboards
- [ ] Custom question packs (user-created)
- [ ] Multiplayer mode
- [ ] Sound effects
- [ ] Animations

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.
