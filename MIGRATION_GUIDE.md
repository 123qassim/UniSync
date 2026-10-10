# UniSync BrainMate: Supabase + Vercel + VS Code Setup Guide

This guide gives you everything you need to run, customize, and deploy UniSync BrainMate with **Supabase** (Database + Auth) and **Vercel** (Global Hosting & Edge).

---

## 📁 1. Opening and Running in VS Code

### Step 1.1: Extract and Open
1. Unzip the project folder into your workspace directory (e.g. `~/projects/unisync-brainmate`).
2. Open the directory in Visual Studio Code:
   ```bash
   code unisync-brainmate
   ```

### Step 1.2: Install Dependencies
Open the integrated VS Code terminal (`Ctrl + \`` or `Cmd + \``) and run:
```bash
npm install
```

### Step 1.3: Set Up Your Local Environment File
Create a `.env.local` file by copying `.env.example`:
```bash
cp .env.example .env.local
```

---

## 🗄️ 2. Setting Up Supabase

### Step 2.1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in.
2. Click **"New Project"**.
3. Choose your organization, name your project (e.g., `unisync-brainmate`), set a secure database password, and select your region.
4. Click **Create new project** and wait ~1-2 minutes for it to provision.

### Step 2.2: Run the Database Migrations in 1 Click
1. In your Supabase Dashboard, click on **SQL Editor** (icon on the left navigation bar).
2. Click **"+ New Query"**.
3. Open `supabase/full_schema.sql` from your project in VS Code, copy all contents, and paste them into the Supabase SQL editor.
4. Click the green **Run** button.
   - This creates all tables (`students`, `study_groups`, `study_sessions`, `skill_swap_proposals`, `focus_pod_goals`, `exam_readiness_topics`, `peer_endorsements`, `study_karma_ledger`), security functions, and Row-Level Security (RLS) policies.

### Step 2.3: Get Your API Keys
1. In Supabase, go to **Project Settings** (gear icon) -> **API**.
2. Copy:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **anon public key** (`eyJhbGciOi...`)
3. Paste them into your `.env.local` in VS Code:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."
   ```

---

## 💻 3. Running Locally in VS Code

Start the development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

To verify your build before pushing:
```bash
npm run build
```

---

## 🚀 4. Deploying to Vercel

### Option A: Via GitHub (Recommended for automatic CI/CD)
1. Initialize a git repository and commit your files:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for UniSync BrainMate"
   ```
2. Create a new repository on [GitHub](https://github.com/new) and push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/unisync-brainmate.git
   git branch -M main
   git push -u origin main
   ```
3. Go to [https://vercel.com](https://vercel.com) and log in.
4. Click **"Add New..." -> "Project"**.
5. Import your `unisync-brainmate` GitHub repository.
6. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase Anon Key
   - `GEMINI_API_KEY` = your Gemini key (if using AI features)
7. Click **Deploy**. Vercel will build using `vite build` and configure routing via `vercel.json`.

### Option B: Via Vercel CLI (Direct from VS Code terminal)
1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```
2. In your VS Code terminal, run:
   ```bash
   vercel
   ```
3. Follow the prompts. Add your environment variables when asked or via the Vercel dashboard.
4. For production deployment:
   ```bash
   vercel --prod
   ```

---

## 🛠️ 5. Project Architecture & Customization Map

- `src/lib/supabaseClient.ts`: Supabase client configuration with auto-detection.
- `supabase/full_schema.sql`: Complete PostgreSQL schema ready for Supabase SQL Editor.
- `src/pages/brainmate/`:
  - `SkillSwapModule.tsx`: Reciprocal bilateral skill-matching system.
  - `FocusPodModule.tsx`: Web Audio ambient soundscapes & Pomodoro focus pod.
  - `SmartOverlapHeatmapModule.tsx`: Timetable clash matrix & slot finder.
  - `ExamReadinessModule.tsx`: Syllabus burndown tracker & revision sprint planner.
  - `StudyKarmaModule.tsx`: Peer endorsements & scholar karma ledger.
- `server.ts`: Full local Express API server with mock store fallbacks.
- `vercel.json`: Single-Page Application (SPA) rewrite rules for Vercel.
