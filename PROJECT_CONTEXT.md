# GlobeTrotter - AI & Developer Context Document

**Purpose:** This file exists to provide immediate context to any AI assistant or developer joining the project. It outlines the technology stack, the current state of the architecture, and the live production URLs.

## 1. Live Production URLs
- **Backend API (Node.js/Express):** `https://globetrotterbackend-r4bj.onrender.com`
- **Main Frontend (Traveler App):** `https://globetrotter123.onrender.com`
- **Admin Dashboard (Standalone):** *(Automatically deployed via render.yaml under `globetrotter-admin`)*

## 2. The Technology Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Frontend (Traveler):** React.js (Vite), Tailwind CSS (planned), React Router
- **Frontend (Admin):** React.js (Vite), Tailwind CSS v4
- **Testing:** Jest + Supertest (Automated API tests)
- **Scraping Engine:** `axios` + `cheerio` (Used for lightweight data enrichment without heavy Puppeteer overhead)
- **Deployment:** Render (configured via `render.yaml`)

## 3. The 5-Collection Wanderlog-Style Architecture
The database is heavily normalized to support complex itinerary building, similar to the app "Wanderlog".

1. **Users:** Authentication (`role: user | admin`).
2. **Trips:** The main workspace. Owns dates, collaborators, and the `coverPhoto` (Dropbox URL).
3. **Destinations (Stops):** Cities visited during a trip. Includes geospatial `coordinates` for map integration and a `scrapedDescription`.
4. **Places (Ideas):** Specific locations (hotels, restaurants, flights). Has its own `coordinates`, `category`, and cost. Not necessarily tied to a specific day.
5. **Itinerary Events:** The calendar scheduler. This collection links a `Place` to a specific `Date` and `startTime`.

## 4. Current Project State (Phase 4 Completed)
- **Phase 1-4 are 100% finished.**
- The backend is fully built, secured with JWT authentication, and contains CRUD routes for all 5 collections (`/api/trips`, `/api/destinations`, `/api/places`, `/api/events`, `/api/admin/stats`).
- An isolated Admin React Dashboard was created in `/admin`, styled with Tailwind, and successfully communicates with the backend `adminMiddleware`.
- A Jest automated testing suite was written and passes 100% of security checks.

## 5. Local Development Environment
If you are running this project locally, you must set up the following `.env` files:
- `backend/.env`: Needs `MONGO_URI`, `PORT=5000`, `JWT_SECRET`.
- `frontend/.env`: Needs `VITE_API_URL=http://localhost:5000`.
- `admin/.env`: Needs `VITE_API_URL=http://localhost:5000`.
