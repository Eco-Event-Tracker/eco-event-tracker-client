# EcoEvent Tracker Client

React + Tailwind frontend for `eco-event-tracker-api`.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

- `VITE_API_BASE_URL`: backend base URL (default: `https://eco-event-tracker-api.onrender.com/api`)
- `VITE_API_USER_ID`: user UUID sent as `x-user-id` for event creation
- `VITE_API_TIMEOUT_MS`: request timeout in milliseconds

## Available Views (in progress)

- `/` Dashboard / Home
- `/events/new` Create Event
- `/events/:eventId` Event Details
- `*` Not Found

## Notes

- Dashboard management list uses local storage because the backend currently has no `GET /api/events` listing endpoint.
- Report exports are available from Event Details (`csv` and `pdf`).
