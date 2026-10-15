# UniPath — Full-Stack Academic Discovery & Career Pathways

> Part of the **UniSync Ecosystem** (`UniPath` · `BrainMate` · `ZeroQ` · `Apex AI`)  
> *Core Principle: Explore Without Signing Up. Share With Consent. Learn And Plan With Purpose.*

UniPath helps university students understand how degree coursework connects to professional pathways, evaluate academic strengths with non-judgmental guidance, explore curated portfolio projects, and plan actionable roadmaps.

---

## 1. Feature Matrix

| Capability | Status | Implementation Details |
| :--- | :--- | :--- |
| **Anonymous Career Exploration** | **Implemented** | Browse 8 degree programmes, 12 career paths, and syllabi without creating an account. |
| **Searchable University & Programme Selector** | **Implemented** | Includes Maseno University, University of Nairobi, and Strathmore University. |
| **Deterministic Recommendation Engine** | **Implemented** | Testable scoring algorithm (`35%` degree, `25%` units, `25%` interests, `15%` optional marks). |
| **Non-Judgmental Mark Analysis** | **Implemented** | Marks are strictly optional; blank marks allowed; low marks do not disqualify. |
| **Side-by-Side Academic Comparison** | **Implemented** | Ethical comparison formula: `difference = Student Mark - Cohort Average`. Missing marks ignored. |
| **Career Profiles & Practical Roadmaps** | **Implemented** | Graded portfolio milestones (Beginner, Intermediate, Advanced) with step tracking checkboxes. |
| **Server-Side Apex AI Assistant** | **Implemented** | `@google/genai` integration with `gemini-3.8-flash` on Express backend + labelled demo fallback. |
| **BrainMate Integration Boundary** | **Implemented** | Peer study-partner matching boundary with explicit mutual consent and connection states. |
| **ZeroQ Cross-Navigation Stub** | **Implemented** | Admissions and documentation verification entry point. |
| **Student Consent & Privacy Governance** | **Implemented** | Toggle mark storage, toggle peer matching, and full voluntary data revocation ("Wipe Data"). |
| **Automated Unit Tests** | **Implemented** | 13/13 unit tests passing via `npm test` covering scoring, missing data, and comparison math. |

---

## 2. Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend**: Node.js & Express (`server.ts`) mounting Vite middleware in development and serving static assets in production.
- **AI Engine**: `@google/genai` TypeScript SDK (server-side only; API key never sent to the browser).
- **Typography**: Plus Jakarta Sans (Display / Headers) & DM Sans (Body Prose).

---

## 3. Routes & API Endpoints

### Frontend Routes
- `/`: Landing page with headline copy, career cards, and ecosystem links.
- `/explore`: 4-stage course selection, units selector, optional marks, and interests.
- `/dashboard`: Exploratory recommendations, score breakdowns, and next milestones.
- `/careers`: Searchable career directory with filter by domain and skills.
- `/careers/:slug`: Detailed career profile, responsibilities, work environments, and projects.
- `/roadmap/:career`: Step-by-step career roadmap with milestone checkboxes.
- `/compare`: Non-judgmental side-by-side performance reflections with revision suggestions.
- `/community`: Public course community compendiums and BrainMate peer matching.
- `/profile`: Student profile, consent toggles, and voluntary data deletion.
- `/about`: Mission, algorithm transparency, and synthetic data disclosure.
- `/privacy` & `/terms`: Privacy policy and terms of service.
- `/auth/sign-in` & `/auth/sign-up`: Session authentication and registration.

### Backend Endpoints
- `GET /api/health`: Health status, demo mode flag, and Gemini configuration check.
- `GET /api/universities`: Supported university list.
- `GET /api/programmes`: Programme catalogue with year and semester syllabi.
- `GET /api/careers`: Full career catalogue with search query support.
- `GET /api/careers/:slug`: Detailed career requirements and project briefs.
- `POST /api/recommend`: Executes recommendation engine scoring server-side.
- `POST /api/compare`: Executes academic comparison analysis against synthetic cohorts.
- `POST /api/apex-ai`: Server-side Apex AI assistant using Gemini or demo adapter.
- `POST /api/auth/sign-in` & `sign-up`: Student authentication and profile provisioning.
- `GET /api/profile` & `PUT /api/profile`: Persistent profile management.
- `POST /api/profile/consent`: Granular consent permission updates.
- `DELETE /api/profile/data`: Right to be forgotten (revokes sharing and wipes voluntary marks).
- `GET /api/brainmate/peers`: Peer matching catalogue with connection states.
- `POST /api/brainmate/connect`: Manage connection requests (`request`, `accept`, `decline`, `block`).
- `GET /api/community/resources`: Public course study guides and notes.

---

## 4. Getting Started Locally

### Prerequisites
- Node.js 20+
- npm 10+

### Installation
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set `GEMINI_API_KEY` to your Gemini API key (optional; if omitted, Apex AI operates in verified Demo Adapter mode).

### Development Server
```bash
npm run dev
```
Starts full-stack Express server on `http://localhost:3000`.

### Running Automated Tests
```bash
npm test
```
Runs the 13 automated unit tests for scoring, blank mark handling, and comparison math.

### Production Build
```bash
npm run build
npm start
```
Compiles client assets to `dist/` and starts Express in production mode.

---

## 5. Deploying with GitHub, Vercel, and Supabase

### 5.1 Push the project to GitHub

From the project directory:

```bash
git init
git add .
git commit -m "Prepare UniSync for deployment"
git branch -M main
git remote add origin https://github.com/<your-account>/<your-repository>.git
git push -u origin main
```

Do not commit `.env` or `.env.local`. Only `.env.example` belongs in the repository.

### 5.2 Create and configure the Supabase project

1. Create a Supabase project.
2. In **SQL Editor**, use one schema path only:
   - For a new database, run `supabase/full_schema.sql`, then run only migrations not already included in that combined file (currently `20261012_student_profiles.sql`).
   - Alternatively, run the migration files in timestamp order and do not run `full_schema.sql`.
   - Do not run both `full_schema.sql` and `20261010_brainmate_schema.sql`; they create the same BrainMate tables and policies.
3. In **Project Settings > API**, copy the project URL and the publishable/anon key.
4. Configure authentication redirect URLs for both:
   - `http://localhost:3000`
   - `https://<your-vercel-domain>`

The current application uses the Supabase browser client for configuration detection, but the Express API still uses seeded in-memory stores. This is safe for demonstrations only: data resets on server restarts or serverless cold starts. Before production use, the API routes that mutate profiles, BrainMate, ZeroQ, and orders must be migrated to Supabase tables with authenticated requests and RLS.

### 5.3 Import the GitHub repository into Vercel

1. In Vercel, choose **Add New > Project** and import the GitHub repository.
2. Keep the detected framework as **Vite**.
3. Use these build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm ci`
4. Add the environment variables from `.env.example`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY` (optional; keep server-only)
   - `APP_URL` (your Vercel URL)
5. Deploy. The `api/[...path].ts` function exposes the existing Express `/api/*` routes.

Every push to `main` will create a new Vercel deployment after the GitHub integration is enabled. The included GitHub Actions workflow runs type-checking, tests, and the production build before changes are merged.

### 5.4 Production readiness checklist

- Replace in-memory authentication with Supabase Auth and verify the JWT in API requests.
- Replace all mutable demo stores in `server.ts` with Supabase queries.
- Add RLS policies for every user-owned table and test anonymous/authenticated access.
- Move document uploads to Supabase Storage; never keep uploaded files in process memory.
- Add request validation and rate limiting to public API routes.
- Configure custom-domain CORS and authentication redirect URLs.
- Add monitoring, backups, and a recovery procedure before accepting real student data.

---

## 6. Security & Privacy Guarantees

1. **No Client-Side Secrets**: `GEMINI_API_KEY` is accessed exclusively in server-side routes.
2. **Data Minimization**: Marks are never required to browse or generate recommendations.
3. **Consensual Peer Matching**: Contact information is never exposed without mutual acceptance.
4. **Synthetic Data Transparency**: Demonstration records are clearly marked with badges.
#   U n i S y n c  
 