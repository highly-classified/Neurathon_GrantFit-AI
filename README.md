# 🏆 GrantFit AI — Neurathon 2026

> **AI-powered grant matching and pitch readiness platform for researchers & founders.**  
> Built for Neurathon Hackathon · Full-Stack · React + Node.js + Firebase + Gemini AI

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Solution Architecture](#-solution-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture Diagram](#-system-architecture-diagram)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [AI Pipeline](#-ai-pipeline)
- [Credits System](#-credits-system)
- [Team](#-team)

---

## 🚀 Project Overview

**GrantFit AI** is an intelligent grant discovery and pitch preparation platform. It uses a **two-layer AI matching system** to connect researchers and startup founders with funding opportunities that align with their profiles — and then helps them craft winning pitches using real-time AI feedback.

Built end-to-end during **Neurathon**, the platform addresses a critical gap in the research/startup funding ecosystem: the enormous time and effort wasted applying to mismatched grants.

---

## 🧩 Problem Statement

Founders and researchers spend **hundreds of hours** searching for grants, only to discover they're ineligible or misaligned after investing significant effort. The process is:

- **Opaque** — eligibility criteria are buried in long PDFs
- **Manual** — no intelligent filtering based on profile
- **Unguided** — no feedback on pitch quality before submission

**GrantFit AI solves all three.**

---

## 🏗️ Solution Architecture

GrantFit AI uses a **two-layer matching engine**:

```
USER PROFILE
     │
     ▼
┌─────────────────────────────────────────┐
│  LAYER 1: Hard Eligibility Filter       │
│  • Citizenship check                    │
│  • Career stage / role check            │
│  • Funding amount compatibility         │
│  → Deterministic, zero AI cost          │
└─────────────────┬───────────────────────┘
                  │ Eligible candidates
                  ▼
┌─────────────────────────────────────────┐
│  LAYER 2: AI Soft Filtering (Gemini)    │
│  • Domain alignment scoring             │
│  • Historical grant specialization      │
│  • Idea-to-grant semantic matching      │
│  → Score 0.0–1.0, cached for efficiency │
└─────────────────┬───────────────────────┘
                  │
          ┌───────┴────────┐
          ▼                ▼
    ELIGIBLE (≥0.8)   PARTIALLY ELIGIBLE (≥0.4)
```

---

## ✨ Key Features

### 🎯 Smart Grant Matching
- Two-layer system combining deterministic hard filters with Gemini-powered semantic matching
- Grants categorized as **Eligible**, **Partially Eligible** for clarity
- Real-time refresh with intelligent caching (localStorage + backend AI cache)

### 📝 AI Pitch Analysis
- Submit your pitch text and receive an instant **readiness score (0–100)**
- Detailed breakdown: **strengths**, **areas for improvement**, **critical weaknesses**
- Iterative improvement loop — edit manually, re-evaluate, track progress

### 🎤 Voice-to-Text Pitch Input
- Browser-native `SpeechRecognition` API for real-time voice dictation
- 5-minute timer with live interim transcript display
- Seamlessly appends dictated text to the rich-text editor

### 📊 Application Tracking
- Real-time Firestore listener for live application status updates
- PDF report generation for each application (using `jsPDF`)
- Filter and search across all tracked applications

### 💳 Credits System
- Per-action credit deduction using **Firestore transactions** (race-condition safe)
- Tiered plan model: Free (10 credits) → Pro → Plus
- Real-time credit balance via `onSnapshot` listeners

### 👤 Profile-Driven Everything
- Structured user profile (domain, citizenship, career stage, idea, funding needs)
- Profile data drives all matching logic — change it, matching updates automatically
- Local storage fallback for resilient UX

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express |
| **Database** | Firebase Firestore (real-time) |
| **Auth** | Firebase Authentication (Email + Google OAuth) |
| **Storage** | Firebase Storage (proposal uploads) |
| **AI** | Google Gemini 2.5 Flash (`gemini-2.5-flash`) |
| **AI Caching** | JSON file-based persistent cache (`ai_cache.json`) |
| **PDF Generation** | jsPDF (client-side) |
| **Animations** | GSAP + ScrollTrigger (landing page Masonry) |
| **Voice Input** | Web Speech API (`SpeechRecognition`) |
| **Icons** | Lucide React |

---

## 📐 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Vite + React)                │
│                                                             │
│  Landing  →  Auth  →  Profile Setup  →  Dashboard          │
│                              │              │               │
│                         Firestore     Grant Matching        │
│                          (users)       API call             │
│                                             │               │
│  Tracking  ←  Registration  ←  GrantCard  ←┘               │
│      │                                                      │
│  PitchModule ──── Analyze/Improve ──── Credits              │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP (REST)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express/Node)                   │
│                                                             │
│  /api/grants/:userId                                        │
│       └── matchingEngine.js                                 │
│              ├── checkHardEligibility()  (deterministic)    │
│              └── getAIPreferenceScore()  (Gemini)           │
│                                                             │
│  /api/pitch/analyze                                         │
│       └── pitchAnalysisService.js                           │
│              ├── analyzePitchWithAI()                       │
│              └── improvePitchWithAI()                       │
│                                                             │
│  /api/eligibility/:userId                                   │
│       └── eligibilityService.js (batch pre-filter)         │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        Firestore      Gemini API      ai_cache.json
       (users, orgs,  (2.5-flash)    (persistent LLM
        sessions,                     response cache)
        credits)
```

---

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore, Auth, and Storage enabled
- A Google Gemini API key
- `service-account.json` from Firebase (for Admin SDK)

### 1. Clone the repository

```bash
git clone https://github.com/your-team/grantfit-ai.git
cd grantfit-ai
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Configure Environment Variables

See the [Environment Variables](#-environment-variables) section below.

### 5. Place Firebase Service Account

Download your `service-account.json` from the Firebase Console and place it at:

```
backend/service-account.json
```

> ⚠️ **Never commit this file.** It is listed in `.gitignore`.

### 6. Run the Backend

```bash
cd backend
node server.js
# Server starts on http://localhost:5001
```

### 7. Run the Frontend

```bash
cd frontend
npm run dev
# App starts on http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here

# Set to "true" to skip all AI calls and return mock responses
G_DRY_RUN=false
```

### Frontend (`frontend/.env`)

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📁 Project Structure

```
grantfit-ai/
│
├── backend/
│   ├── src/
│   │   ├── aiService.js           # Gemini API wrapper with caching
│   │   ├── creditService.js       # Credit deduction (Firestore transactions)
│   │   ├── eligibilityService.js  # Batch hard eligibility filter
│   │   ├── firebase-admin.js      # Firebase Admin SDK init
│   │   ├── firebase.js            # Firebase Client SDK (shared)
│   │   ├── matchingEngine.js      # Two-layer grant matching
│   │   ├── pitchAnalysisService.js# AI pitch analysis & improvement
│   │   ├── pitchSessionService.js # Session creation with attempt tracking
│   │   ├── profiles.js            # User profile CRUD
│   │   └── firestore/
│   │       └── collections.js     # Collection name constants
│   ├── service-account.json       # ⚠️ NOT committed
│   ├── ai_cache.json              # Persistent AI response cache
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── public/
    │   ├── logo-white.png
    │   └── bg-landing.png
    └── src/
        ├── components/
        │   ├── auth/
        │   │   └── LoginPage.jsx
        │   ├── credits/
        │   │   └── Credits.jsx
        │   ├── dashboard/
        │   │   ├── Dashboard.jsx
        │   │   ├── GrantCard.jsx
        │   │   ├── Navbar.jsx
        │   │   ├── RegistrationPage.jsx
        │   │   └── BottomBar.jsx
        │   ├── landing/
        │   │   ├── Hero.jsx
        │   │   ├── Features.jsx
        │   │   ├── HowItWorks.jsx
        │   │   ├── PitchPractice.jsx
        │   │   ├── Masonry.jsx        # GSAP-powered masonry grid
        │   │   ├── TrueFocus.jsx      # Animated headline component
        │   │   ├── Navbar.jsx
        │   │   └── Footer.jsx
        │   ├── pitch/
        │   │   └── PitchModule.jsx    # Core pitch editor + AI feedback
        │   ├── profile/
        │   │   ├── ProfileSetup.jsx
        │   │   └── ProfileView.jsx
        │   └── tracking/
        │       └── Tracking.jsx
        ├── constants/
        │   └── countries.js           # 150+ countries with flags & currencies
        ├── services/
        │   └── trackingService.js     # Registration + file upload service
        ├── firebase.js                # Firebase client init
        ├── App.jsx                    # React Router setup
        └── index.css                  # Global styles + CSS variables
```

---

## 📡 API Reference

All backend routes are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/grants/:userId` | Run two-layer matching for a user, returns `{ eligible[], partially_eligible[] }` |
| `POST` | `/api/pitch/analyze` | Analyze pitch text against a grant, deducts 1 `analyze_credit` |
| `POST` | `/api/pitch/improve` | Re-evaluate manually edited pitch, deducts 1 `analyze_credit` |
| `POST` | `/api/eligibility/:userId` | Run batch hard eligibility filter, writes results to Firestore |
| `GET` | `/api/profile/:userId` | Fetch a user's profile |
| `POST` | `/api/profile/:userId` | Upsert a user's profile |

---

## 🤖 AI Pipeline

### Grant Matching Prompt

The AI is given the **user's idea, domain, and role** alongside the **grant's organization name, event, domain, tags, and historical funded projects**. It returns a float score `0.0–1.0`.

```
≥ 0.8  →  Eligible        (High Alignment)
≥ 0.4  →  Partially Eligible  (Potential Fit)
< 0.4  →  Filtered out
```

### Pitch Analysis Prompt

The AI receives the **pitch text** and the **grant's organization name**, and returns structured JSON:

```json
{
  "score": 75,
  "best_part": "Clear problem statement.",
  "improvement_needed": "Add market size data.",
  "worse_part": "No measurable outcomes."
}
```

### Caching Strategy

All Gemini calls are keyed by a **deterministic cache key** (e.g., `match_user@email.com_orgId`) and persisted to `ai_cache.json`. Identical requests never re-hit the API — making repeated demo runs free and instantaneous.

To force a fresh AI call, delete the relevant key from `ai_cache.json`.

To bypass all AI calls (for testing), set `G_DRY_RUN=true` in your `.env`.

---

## 💳 Credits System

| Credit Type | Cost | Action |
|---|---|---|
| `analyze_credits` | 1 | Analyze a pitch |
| `analyze_credits` | 1 | Re-evaluate an improved pitch |
| `improve_credits` | 1 | *(Reserved for future AI rewrite feature)* |

**New users receive 10 `analyze_credits` for free** on profile creation.

Credits are deducted using **Firestore transactions** to prevent race conditions in concurrent use.

---

## 🎨 UI Highlights

- **Landing page** — animated Masonry grid (GSAP + ScrollTrigger), `TrueFocus` headline animation, glassmorphism navbar
- **Dashboard** — two-column grant discovery with live search, skeleton loaders, and real-time AI status indicator
- **Pitch Module** — split-panel rich text editor with voice input, circular readiness gauge, and animated feedback panels
- **Credits page** — real-time Firestore balance, usage log table, animated plan upgrade modal
- **Profile Setup** — searchable country dropdown with flag images and auto-currency detection

---

## 🔒 Security Notes

- All credit deductions use Firestore **server-side transactions** — client cannot manipulate balances
- Firebase Auth guards all user-specific routes
- Proposal file uploads are namespaced under `proposals/{userId}/` in Firebase Storage
- `service-account.json` is never exposed to the client bundle

---

## 👥 Team

Built with ❤️ for **Neurathon** by:

| Name | Role |
|---|---|
| *(Sandhya D)* | Full Stack|
| *(Shruthi K)* | Backend |
| *(Swathi P)* | AI Integration |
| *(Swathi P)* | UI Design |

---

## 📄 License

This project was built for the **Neurathon Hackathon**. All rights reserved by the team.

---

<p align="center">
  <strong>GrantFit AI — Stop searching. Start winning.</strong><br/>
  <em>Neurathon 2025 Submission</em>
</p>
