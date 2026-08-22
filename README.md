# 🌍 GlobeTrotter - Travel Planning Made Easy

GlobeTrotter is a modern, collaborative travel itinerary builder designed to help users organize their trips effortlessly. Modeled after top-tier travel apps like Wanderlog, it provides a comprehensive 5-collection architecture that separates abstract "Ideas" from concrete "Scheduled Events".

## 🚀 Live Demo
- **Main App:** [https://globetrotter123.onrender.com](https://globetrotter123.onrender.com)
- **Backend API:** [https://globetrotterbackend-r4bj.onrender.com](https://globetrotterbackend-r4bj.onrender.com)

## ✨ Core Features (Hackathon Roadmap)
The frontend application is currently being built by a 4-developer team to support:
1. **Authentication:** Secure JWT-based Login/Signup.
2. **Dashboard:** Overview of ongoing and previous trips.
3. **Trip Creation:** Start trips with custom dates, descriptions, and cover photos.
4. **Itinerary Builder:** Add cities to visit, discover activities via our built-in scraper, and drag-and-drop them onto a daily timeline.
5. **Cost Breakdown:** Dynamic budget tracking and pie charts based on activity costs.
6. **Community Tab:** Share public, read-only versions of your itinerary with the world.

## 🛠 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS v4
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Testing:** Jest + Supertest (Automated backend tests)
- **Data Enrichment:** `axios` + `cheerio` (Native web scraping)

## 💻 Local Setup (For Developers)

1. **Clone the repo**
   ```bash
   git clone https://github.com/Agavan-Rohaan/GlobeTrotter.git
   cd GlobeTrotter
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in `/backend`:*
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
   *Start the server:* `npm run dev`

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   *Create a `.env` file in `/frontend`:*
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   *Start the app:* `npm run dev`

## 🤝 Contributing (TEAM_SYNC Protocol)
This project uses a strict multi-agent and multi-developer synchronization protocol.
If you are contributing code:
1. You **MUST** read and append to `TEAM_SYNC.md` before pushing any code to `main`. 
2. Follow the 4-Developer screen division outlined in the documentation to avoid `App.jsx` merge conflicts.
3. Check `PROJECT_CONTEXT.md` for deeper architectural information.
