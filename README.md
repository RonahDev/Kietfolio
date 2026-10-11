# Mai Anh Kiệt — Creative Full-Stack Developer Portfolio

> **"Building digital experiences. Engineering solutions that matter."**  
> *Full-Stack Developer | Creative Developer | Software Engineering Student*

---

## 1. Executive Overview

This repository houses the personal portfolio and digital identity of **Mai Anh Kiệt**, designed and engineered with an editorial Swiss-grid aesthetic, interactive WebGL 3D systems, robust motion choreography, and production-ready software engineering standards.

The project highlights the intersection of three core dimensions:
1. **Engineering Rigor:** Building type-safe, maintainable, and containerized web architectures.
2. **Creative Expression:** Interactive 3D graphics using **Three.js** and smooth orchestration with **GSAP**.
3. **Operational Intuition:** 2 years of operational ground experience at **SPX Express (Thủ Dầu Một 01 Hub)**, currently serving as **Senior Analyst** at the warehouse, applying analytical systems thinking to software engineering.

---

## 2. Verified Personal Facts & Data Integrity

All professional details presented are strictly verified:
- **Full Name:** Mai Anh Kiệt
- **Date of Birth:** 22 October 2005 *(Configurable / Optional in verified telemetry panel)*
- **Education:** Software Engineering, FPT University — Ho Chi Minh City Campus
- **Operational Background:** 2 years staff experience at **SPX Express — Thủ Dầu Một 01 Hub** → Currently **Senior Analyst** at the warehouse
- **Professional Interests:** Full-Stack Development, Creative Coding, Interactive Web Experiences, Software Engineering, Logistics Technology
- **Languages Supported:** English (Default) + Full Vietnamese (`vi-VN`) localization toggle

### Transparent Capability Matrix (No Arbitrary Progress Bars)
- **Frontend Development:** HTML5, CSS3, JavaScript, TypeScript, React, Tailwind CSS
- **Backend & APIs:** Node.js, Express.js, Basic Java Web Development
- **Programming Languages:** TypeScript, JavaScript, Java (FPT curriculum), C++
- **Databases:** PostgreSQL, Microsoft SQL Server
- **Infrastructure & Tools:** Git, GitHub, Docker, Vite
- **Creative Development:** GSAP (GreenSock), Three.js (WebGL), CSS micro-interactions

---

## 3. Technology Architecture

```
src/
├── animations/
│   └── gsapUtils.ts           # GSAP timeline helpers & prefers-reduced-motion guards
├── components/
│   ├── layout/
│   │   ├── Container.tsx      # Consistent grid container bounds
│   │   ├── Footer.tsx         # Editorial telemetry footer & back-to-top
│   │   └── Navbar.tsx         # Fixed glass dock with scroll-spy & language toggle
│   └── ui/
│       ├── Badge.tsx          # Technical monospace indicators
│       ├── Button.tsx         # Accessible buttons (primary, secondary, link variants)
│       ├── Card.tsx           # Hairline borders with engineering corner ticks
│       ├── SectionHeader.tsx  # Editorial section title with index markings
│       └── SocialIcons.tsx    # Lightweight custom SVG icons
├── context/
│   ├── LanguageContext.tsx    # i18n provider with localStorage sync
│   └── languageTypes.ts      # Context contracts & state typing
├── data/
│   ├── experience.ts          # SPX Express timeline & operational correlations
│   ├── principles.ts          # 6 Core engineering principles
│   ├── profile.ts             # Verified identity & contact configuration
│   ├── projects.ts            # Project showcase with full case-study blueprints
│   ├── skills.ts              # Categorized skill matrix
│   └── translations.ts        # Comprehensive EN & VI localization dictionary
├── features/
│   ├── about/                 # Editorial split layout & collapsible telemetry
│   ├── contact/               # Validated contact form, honeypot, & copy email
│   ├── experience/            # Hub career path & logistics-to-software diagram
│   ├── hero/                  # Typographic composition & lazy-loaded 3D viewport
│   ├── principles/            # "How I Build Software" architecture blueprints
│   ├── projects/              # Expandable case study cards with problem/solution
│   └── skills/                # Filterable capability matrix
├── hooks/
│   └── useLanguage.ts         # Fast-refresh-compliant localization hook
├── test/
│   └── setup.ts               # Vitest DOM matchers setup
├── three/
│   └── KineticNetworkScene.tsx # Procedural 3D node sculpture with pointer parallax
├── types/
│   └── index.ts               # Shared TypeScript domain interfaces
├── utils/
│   ├── cn.ts                  # Tailwind clsx + twMerge utility
│   └── validation.ts          # Form validation, bounds checking, & honeypot traps
├── App.tsx                    # Top-level composition & skip-to-content accessibility link
├── index.css                  # Tailwind v4 theme tokens & Swiss grid backgrounds
└── main.tsx                   # React root entry point
```

---

## 4. Key Engineering Features

- **Chunk Splitting & Lazy-Loaded 3D Engine:** Three.js is isolated into its own lazy-loaded bundle (`three-*.js`), preventing WebGL assets from blocking initial DOM paint.
- **GSAP Context Management:** All motion timelines use `gsap.context()` for reliable React lifecycle cleanup on unmount, preventing memory leaks and stale event listeners.
- **Accessibility & Reduced Motion:** Automatically queries `window.matchMedia('(prefers-reduced-motion: reduce)')` to disable continuous rotation and heavy animations.
- **Defensive Form Architecture:** Client-side regex and length validation with zero third-party tracking, anti-bot honeypot protection, and honest direct email dispatch.
- **Zero-Warning Codebase:** 100% compliant with strict TypeScript compiler checks and modern `oxlint` rules.

---

## 5. Development & Verification Guide

### Prerequisites
- Node.js `20.x` or `22.x+` (verified with `v24.18.0`)
- npm `10.x+`

### Installation
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```
Starts the Vite dev server at `http://localhost:5173`.

### Run Automated Unit Tests
```bash
npm test
```
Executes Vitest covering form validation, profile factual integrity, and language state transitions.

### Run Code Quality & Linter
```bash
npm run lint
```

### Production Build
```bash
npm run build
```
Generates the minified, code-split distribution in `/dist`.

### Preview Production Build
```bash
npm run preview
```

---

## 6. Docker Container Deployment

A multi-stage `Dockerfile` is provided for zero-friction containerized deployment:

```bash
# Build and run containerized on port 3000
docker compose up --build -d
```

Visit `http://localhost:3000` to access the running container.

---

## 7. License

Built for **Mai Anh Kiệt**. All personal information and rights reserved.
