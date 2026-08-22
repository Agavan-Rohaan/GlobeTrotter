# GlobeTrotter System Architecture & Schema Design

This document serves as the master blueprint for the GlobeTrotter application, detailing the user flow, database schema, and technical architecture.

## 1. User Journey & Screen Flow

The following diagram illustrates how a user navigates through the GlobeTrotter application.

```mermaid
flowchart TD
    A[Screen 1: Login / Signup] -->|Authenticates| B(Screen 2: Dashboard)
    
    B -->|Plan New Trip| C(Screen 3: Create Trip)
    B -->|View All| D(Screen 4: My Trips)
    D -->|Select Trip| E
    
    C -->|Save Trip Details| E{Screen 5: Itinerary Builder}
    
    E -->|Add Stop| F[Screen 7: City Search]
    F -->|Scrapes City Info| E
    
    E -->|Add Activity| G[Screen 8: Activity Search]
    G -->|Scrapes Suggestions| E
    
    E -->|Toggle View| H[Screen 6: Itinerary List View]
    E -->|Toggle View| I[Screen 9: Budget & Cost View]
    E -->|Toggle View| J[Screen 10: Calendar / Timeline View]
    
    E -->|Generate Public Link| K[Screen 11: Shared/Public View]
    
    B -.->|Navigation Bar| L[Screen 12: User Profile]
    B -.->|If Role == Admin| M[Screen 13: Admin Dashboard]
```

## 2. Database Schema (Entity-Relationship Diagram)

We use a normalized MongoDB schema to handle complex travel data, mimicking relational databases.

```mermaid
erDiagram
    USERS ||--o{ TRIPS : "creates"
    USERS {
        ObjectId _id
        string name
        string email
        string password_hashed
        string role "Enum: user, admin"
        string profilePhoto "Dropbox URL"
        object preferences "language, currency"
    }

    TRIPS ||--o{ STOPS : "contains"
    TRIPS {
        ObjectId _id
        ObjectId user_id
        array collaborators "For future group trips"
        string name
        string description
        date startDate
        date endDate
        string coverPhoto "Dropbox URL"
        boolean isPublic
        string status "Enum: Planning, Ongoing, Completed"
    }

    STOPS ||--o{ ACTIVITIES : "has"
    STOPS {
        ObjectId _id
        ObjectId trip_id
        string city
        string country
        string scrapedDescription "Auto-generated via Scraper"
        date arrivalDate
        date departureDate
        number order
    }

    ACTIVITIES {
        ObjectId _id
        ObjectId stop_id
        string name
        string type "Enum: Sightseeing, Food, etc."
        number cost
        string currency
        number duration
        date startTime
        string description
        string image "Dropbox URL"
    }
```

## 3. The Scraping Strategy (Node.js backend)

To provide "Cutting-Edge" features without expensive paid APIs, we utilize native Node.js scraping (`axios` + `cheerio`). 

*Note: We strictly use Dropbox URLs for user-uploaded images (cover photos, profile pictures) to ensure high reliability. Scraping is reserved for data enrichment.*

1. **City Intelligence (`/api/scrape/city-info`)**: When a user selects a city in the Itinerary Builder, the backend scrapes Wikipedia or Wikivoyage to instantly populate the stop's `scrapedDescription` and generic cost/safety indexes.
2. **Activity Discovery (`/api/scrape/activities`)**: If a user needs inspiration, the backend scrapes travel blogs to generate a dynamic list of "Top 5 things to do" in that specific city, which they can click to instantly add to their itinerary.

## 4. Admin Panel Architecture

The Admin dashboard (Screen 13) is built as a completely separate application to ensure security and clean code separation.

- **Frontend:** A standalone React/Vite application located in the `/admin` folder.
- **Backend Protection:** An `adminMiddleware.js` script on the Express server ensures that ONLY users with `role: 'admin'` in the database can access the `/api/admin/*` endpoints.
- **Functionality:** Manage users, view total platform statistics, and see the most popular scraped destinations.
