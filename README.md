# Personal Dashboard

A personal productivity dashboard: tasks, notes, checklist, daily reflection, and a real Google Calendar integration.

## Structure

```
.
├── frontend/   React + TypeScript + Vite app
└── backend/    Express API backed by Supabase (Postgres), plus Google Calendar OAuth
```

## Local development

**Backend** (`backend/`):
```
cd backend
npm install
cp .env.example .env   # fill in Google OAuth + Supabase credentials
node server.js
```
Also run `backend/supabase_schema.sql` once in your Supabase project's SQL Editor before first boot.

**Frontend** (`frontend/`):
```
cd frontend
npm install
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:3001/api
npm run dev
```

## Deployment

- **Frontend** deploys to Vercel with Root Directory set to `frontend`. Set `VITE_API_URL` in the Vercel project's environment variables to the deployed backend URL (e.g. `https://your-backend.onrender.com/api`).
- **Backend** deploys to Render with Root Directory set to `backend`, start command `node server.js`. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` (pointing at the Render URL's `/api/calendar/oauth2callback`), and `FRONTEND_URL` (the deployed Vercel URL) as environment variables. Remember to also add the production redirect URI to the Google Cloud Console OAuth client's authorized redirect URIs.
