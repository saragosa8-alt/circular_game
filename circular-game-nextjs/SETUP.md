# Circular Game - Setup Instructions

## Prerequisites

1. Node.js 18+ installed
2. A Supabase account (https://supabase.com)

## Database Setup

### Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details and wait for it to initialize

### Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public** key (the long string under "Project API keys")

### Step 3: Configure Environment Variables

1. Open `.env.local` in the project root
2. Replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 4: Run Database Migrations

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor and click "Run"
5. Wait for it to complete successfully
6. Create another new query
7. Copy the contents of `supabase/migrations/002_seed_data.sql`
8. Paste and run this query as well

### Step 5: Verify Database Setup

In the Supabase dashboard:
1. Go to **Table Editor**
2. You should see 4 tables: `profiles`, `modules`, `game_packs`, `questions`
3. Click on `questions` - you should see 8 rows of Biology terms

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Testing the Database Connection

After the app is running:

1. You should be redirected to `/login`
2. Create a new account with any email/password
3. After login, you should be able to play the game
4. The game questions should come from the database

### The Database Test (from Acceptance Criteria)

1. Go to Supabase **Table Editor** → `questions`
2. Find the row with term "Mitochondria"
3. Edit the term to "Powerhouse"
4. Refresh your game page
5. ✅ Success: The game now shows "Powerhouse" instead of "Mitochondria"

## Troubleshooting

- **"Missing Supabase environment variables"**: Check that `.env.local` has valid values
- **Login fails**: Check that you ran the database migrations correctly
- **No questions appear**: Verify the seed data was inserted (check `questions` table in Supabase)
