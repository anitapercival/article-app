# Full Stack Article Platform

This project is a full-stack web application designed to display and manage a list of editorial articles. It demonstrates authentication, dynamic filtering, protected content, and a clean, responsive frontend. The application leverages technologies like **Node.js, React, TypeScript, and SQLite**, while showcasing core skills in **authentication, filtering, pagination, and secure data access**.

---

## Project Architecture

The application follows a **separated frontend/backend architecture** with secure authentication and efficient SQL-based querying.

### Authentication
- JWT-based login flow using HTTP-only cookies.
- Authenticated users see full article content.
- Unauthenticated users only see summaries with a login prompt.
- Logout handled via avatar click or token expiry.

### Frontend (React + TypeScript)
- Built with Vite for fast development.
- Uses functional components with `useState`, `useEffect`, and props/state lifting.
- Filters (by analyst or channel) implemented with controlled form inputs.
- Pagination controlled via query parameters.
- Headline logic highlights the latest "Breaking News" article if available.
- TailwindCSS used for consistent design and responsive layout.
- Date format utility for human-readable dates.

### Backend (Node.js + Express + SQLite)
- REST API with filterable, paginated endpoints:
  - `GET /api/articles`
  - `GET /api/articles/:slug`
  - `GET /api/articles/analysts`
  - `GET /api/articles/channels`
- SQL joins retrieve related data (channels, analysts, regions).
- Middleware handles JWT decoding for protected routes.
- Error handling for invalid tokens and DB issues.
- Article content deleted on backend if user is not authenticated

### Database (SQLite)
- Lightweight embedded database with schema for:
  - `articles`
  - `analysts`
  - `channels`
  - `regions`

---

## Technologies Used

| Area        | Tech Stack                         |
|-------------|----------------------------------|
| Frontend    | React, TailwindCSS, Vite          |
| Backend     | Node.js, Express, JWT             |
| Database    | SQLite                            |
| Auth        | JWT (HTTP-only cookie)            |

---

## Reflections & Next Steps

- This project demonstrates secure full-stack architecture, dynamic filtering, and content protection.
- Future improvements:
  - Add **GraphQL** endpoints.
  - Deploy backend to **Serverless AWS Lambda**.
  - Integrate **LangGraph** agent to suggest content or automate filtering.
  - Search bar for more specific searches.
  - Testing!

---

## Getting Started

### 1. Install Dependencies

```
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
JWT_SECRET=supersecretkey123
```

### 3. Run the App

Start backend:

```
npm run start
```

Start frontend:

```
npm run dev
```

App will be available at: [http://localhost:5173](http://localhost:5173)

---

### Test Login

```
Username: testuser
Password: password123
```

After login, protected content becomes visible and the avatar appears in the header.
