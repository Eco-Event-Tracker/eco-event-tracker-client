# EcoEvent Tracker Client

React + Tailwind frontend for `eco-event-tracker-api`.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

- `VITE_API_BASE_URL`: backend base URL (example: `http://localhost:3000`)
- `VITE_API_USER_ID`: user UUID sent as `x-user-id` for event creation
- `VITE_API_TIMEOUT_MS`: request timeout in milliseconds

## Available Views (in progress)

- `/` Dashboard / Home
- `/events/new` Create Event
- `/events/:eventId` Event Details
- `*` Not Found
