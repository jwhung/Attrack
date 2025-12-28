# Role: Senior Browser Extension Architect & Creative Technologist

# Project: Attrack (Attention Tracker)
A high-end Chrome extension that captures "Active Attention Data" to filter and archive high-value web content automatically.

# Technical Stack
- Manifest V3, React 18, Tailwind CSS
- Storage: chrome.storage.local (Key: URL)
- Animation: canvas-confetti (for threshold celebrations)

# 1. Functional Logic & Architecture
- **Precision Heartbeat:** - Combined `chrome.idle` (30s) and `chrome.tabs/windows` tracking. 
    - The timer MUST pause instantly when a user switches tabs, minimizes windows, or locks the screen.
- **Smart Data Aggregator:**
    - Primary Key: URL. If a URL is revisited, accumulate `totalActiveTime` and increment `visitCount`.
    - Record `lastVisitTime` for recency sorting.
- **Threshold Control:**
    - `MIN_TRACKING_THRESHOLD`: Ignore visits shorter than X seconds.
    - `NOTIFICATION_THRESHOLD`: Trigger celebration when a single session reaches Y minutes.
- **Data Portability:** - Implement a "Data Export" feature in the Dashboard (Export to JSON/CSV).

# 2. "Picky PM" UI/UX Standards (Visual Identity)
- **Theme:** "Modern Cyber-Dark" with a focus on depth and micro-interactions.
- **Color Palette:** Background (#0A0A0B), Cards (#161618 with 0.1 border-opacity), Accents (Linear Gradient: Indigo-to-Cyan).
- **Popup UI (The Live Status):**
    - A futuristic **Circular Progress Ring** showing the current tab's active time.
    - A subtle percentage text showing progress toward the `NOTIFICATION_THRESHOLD`.
- **Dashboard UI (The Insights Hub):**
    - **Bento Grid Layout:** Organize content into clean, grouped cards.
    - **Frontend Computation:** Every card must display `Average Visit Time` (Total Time / Visit Count).
    - **Glassmorphism:** Apply `backdrop-blur` and a faint glow on card hover.
- **The "Attrack" Moment (Ceremony):**
    - When the threshold is hit, inject a sleek Toast in the bottom-right corner.
    - **Trigger:** A sophisticated **Emoji/Particle firework burst** using `canvas-confetti` around the Toast.

# 3. Code Generation Requirements
- **Directory Structure:** `src/background`, `src/content`, `src/popup`, `src/dashboard`.
- **Background.js:** Must maintain a clean state machine for multi-tab timers.
- **Components:** Ensure modular React components with clear Prop types.
- **Animations:** Use CSS transitions and Canvas for high-performance visual feedback.

# Definition of Done
- Robust, bug-free tracking logic.
- A UI that feels like a premium "Pro" tool, not a side project.
- Implementation of the "Average Time" logic and Export functionality.