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
- `VITE_API_TIMEOUT_MS`: request timeout in milliseconds

## Available Views (in progress)

- `/` Dashboard / Home
- `/login` Login
- `/signup` Signup
- `/events/new` Create Event
- `/events/:eventId` Event Details
- `*` Not Found

## Notes

- Dashboard list is fetched from the backend (`GET /api/events`, scoped to the logged-in user) so events persist across reloads and devices. Removing an event calls `DELETE /api/events/:eventId`.
- Auth session is stored in browser `sessionStorage` and used for the `x-user-id` header automatically.
- Report exports are available from Event Details (`csv` and `pdf`).

## Deploying (Render static site)

This is a client-side routed SPA, so the host must serve `index.html` for every path — otherwise hard-refreshing a route like `/dashboard` returns a 404. `render.yaml` includes the rewrite rule. If the site was created manually in the Render dashboard (not via Blueprint), add the same rule under **Settings → Redirects/Rewrites**: Source `/*`, Destination `/index.html`, Action **Rewrite**.
