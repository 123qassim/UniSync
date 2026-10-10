# BrainMate Flagship Superpowers & Academic Innovations

## Overview
BrainMate has been upgraded with five unique, production-grade innovations designed to transform university peer collaboration into an engaging, structured, and mutually beneficial experience.

---

### 1. Reciprocal "Skill Swap" Matching (Complementary Synergy)
* **Problem Solved**: Conventional student platforms match peers with identical struggles, leading to unproductive study circles where no one can unblock the group.
* **Architecture & Algorithm**:
  - Computes bilateral reciprocity between student profiles: where Student A is strong (`can_help`) in topics Student B needs (`needs_help`), and Student B is strong in topics Student A needs.
  - Scores **Bilateral Synergy (0–100%)** based on mutual exchange depth and schedule alignment.
  - Visual two-sided barter trade card: `"You Teach: CSC 212 Database Normalization"` ⇄ `"They Teach: CSC 211 Dynamic Programming"`.
  - **Barter Proposal Workflow**: Prefills custom terms, identifies mutually free 90-minute blocks, and sends bilateral study sprint invitations with status tracking.
  - Accessible via dedicated `Skill Swap` tab and filterable in the Discover Matches feed.

---

### 2. Live Focus Pod (Synchronized Pomodoro + Ambient Soundscapes)
* **Problem Solved**: Studying alone leads to distraction, but voice calls can be overwhelming for introverted or deep-work sessions.
* **Architecture & Sound Engine**:
  - **Synchronized Pomodoro**: Configurable sprints (25m Deep Focus, 5m Short Break, 15m Long Break) with automatic cycle progression and harmonic Web Audio end chime.
  - **In-Browser Web Audio Synthesis**: Zero external MP3 downloads or CDN audio dependencies. Pure audio synthesis for:
    - *Rain on Glass* (filtered resonant noise buffer)
    - *Lo-Fi C-Major7 Synth Drone* (multi-oscillator warm harmonic pad)
    - Individual faders and master volume control.
  - **Shared Pod Goals Kanban**: Add sprint objectives, toggle completion with visual feedback, and track aggregate pod completion rate.
  - **Collaborative Scratchpad**: Multi-tab live notepad for formulas, code snippets, and study takeaways with copy and download utilities.
  - **Peer Presence & Live Cheers**: Real-time study status indicators and floating celebratory reactions (⚡ High-Five, 🔥 On Fire, ☕ Coffee, 💡 Breakthrough, 👏 Kudos).
  - Rewards students with **+10 Study Karma** upon each completed focus cycle.

---

### 3. Smart Free-Time Overlap Heatmap & Instant Slot Finder
* **Problem Solved**: "When are you free?" message tag wastes days of coordination.
* **Architecture & Clash Detection**:
  - **7-Day Visual Matrix**: Compares 12 hourly blocks (08:00–20:00) across Monday through Sunday.
  - Color-coded availability: Mutual Free Window (🟩), Partial Overlap (🟨), and Lecture/Classroom Conflict (⬛).
  - **Algorithmic Ranking**: Dynamically analyzes post-lecture energy and duration to surface the top 3 optimal study sprint slots.
  - **1-Click Lock-In**: Selecting any mutual window opens a prefilled modal and commits the session directly to `/api/brainmate/sessions`.

---

### 4. Group Syllabus Burndown & Exam Readiness Tracker
* **Problem Solved**: Students often cram without knowing which syllabus areas carry the highest exam weight.
* **Architecture & Readiness Matrix**:
  - Course-specific tracking for target units (CSC 211 Algorithms, MAT 120 Discrete Math, CSC 212 Database Systems).
  - **Live Exam Countdown Clock**: Real-time countdown (Days, Hours, Minutes, Seconds) to the final examination.
  - **Weighted Syllabus Topics Grid**: Shows module name, exam weight (% of paper), difficulty level, and key conceptual terms.
  - **Interactive Mastery Status**: 1-click toggles (`Needs Work 🔴`, `Practicing 🟡`, `Mastered 🟢`) that dynamically recalculate the student's weighted readiness percentage.
  - **Cohort Benchmark Comparison**: Compares personal mastery with the peer study group cohort average.
  - **Targeted Revision Sprint Generator**: Automatically isolates weak topics with high exam weight and generates an exam revision session.

---

### 5. Peer Academic Endorsement & Study Karma Ledger
* **Problem Solved**: Lack of social proof and accountability in student study groups leads to ghosting and flaking.
* **Architecture & Micro-Credentials**:
  - **Study Karma Score & Scholar Tiers**: e.g. *880 Karma · Gold Scholar Tier*.
  - **Reliability Rating**: Verifiable session attendance percentage (e.g. *98% Attendance*, 0 no-shows).
  - **Six Micro-Endorsement Badges**:
    - 🌟 *Patient Explainer*
    - ⚡ *Code Debugger*
    - 📝 *Concise Notes*
    - ⏰ *Always Punctual*
    - 🧠 *Proofs Master*
    - 🎯 *Problem Crusher*
  - **Peer Commendation System**: Students can endorse classmates with course-linked testimonials, awarding +25 Karma to the peer and +15 Community Karma to the endorser.
  - **Immutable Karma Ledger**: Chronological activity timeline capturing earned karma points.
