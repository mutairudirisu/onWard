# onWard Monorepo

Welcome to the **onWard** monorepo by GIGS Labs.

This repository is structured into two core Next.js projects:
- **`frontend/`**: The core onWard productivity, journey planning, clock reminder, and workspace studio web application.
- **`website/`**: The public product marketing and advertising website showcasing onWard's features, pricing, and capabilities.

---

## Repository Structure

```text
OnWard-Todo/
├── frontend/               # onWard Core Web Application (Next.js 15 App Router)
│   ├── app/                # Application routes: journey, tasks, notes, workspace, insights
│   ├── components/         # Workspace studio, clock picker, modals, cards
│   ├── lib/                # Task & workspace state contexts, Supabase operations
│   ├── public/             # PWA service worker, icons, web manifest
│   ├── supabase/           # Database schema and RLS policies
│   ├── tests/              # Node unit test suite
│   └── package.json        # Frontend configuration and scripts
├── website/                # Product Marketing Website (Next.js 15 App Router)
│   ├── app/                # Landing page layout, globals, hero, interactive tour
│   ├── components/         # Navbar, Hero, FeatureGrid, InteractiveShowcase, Pricing, FAQ
│   └── package.json        # Website configuration (dev port 3001)
├── package.json            # Root npm workspaces configuration
├── AGENTS.md               # Agent and database change instructions
└── README.md               # Monorepo documentation
```

---

## Quick Start

### 1. Run the Frontend App (Port 3000)

```bash
# From repository root
npm run dev:frontend

# Or directly in frontend
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to open the onWard application.

### 2. Run the Marketing Website (Port 3001)

```bash
# From repository root
npm run dev:website

# Or directly in website
cd website
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the marketing landing page.

---

## Development & Testing Scripts

From the repository root:
- **`npm run test:frontend`**: Run the automated test suite (PWA, themes, database operations).
- **`npm run lint:frontend`**: Run ESLint across the frontend application.
- **`npm run lint:website`**: Run ESLint across the marketing website.
- **`npm run build:frontend`**: Build the optimized frontend Next.js production bundle.
- **`npm run build:website`**: Build the optimized marketing website Next.js production bundle.

---

## Features

- **Daily Focus & Calendar**: Dynamic week-strip and full month planner.
- **Targeted Clock Reminders**: 12-hour AM/PM dials with context notes and alarms.
- **Workspace Folders**: Drag-and-drop document grouping with permission controls.
- **Word (.doc) & PDF Studio**: Styled corporate tables and 1-click downloads.
- **Verified Milestones**: Proof of work compiler with 1-click LinkedIn and X publishing.
- **PWA & Offline Ready**: Service worker caching and Supabase synchronization.

A little progress, everyday 🌱
