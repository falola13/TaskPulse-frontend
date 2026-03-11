## TaskPulse Frontend

TaskPulse is a modern productivity and task‑management app with a Pomodoro‑style timer and a clean, responsive UI.  
This repo contains the **Next.js frontend** for TaskPulse, which talks to a separate backend API.

---

### Features

- **Authentication**
  - Email/password login & registration
  - JWT-based auth with token stored in `js-cookie`
  - Route protection via Next.js `middleware`
  - Client auth state via Zustand, hydrated from server on first render
- **Dashboard**
  - Protected `/dashboard` route (requires valid JWT)
  - Fast, server‑side check of JWT expiry (no extra API round‑trip)
- **Profile**
  - Protected `/profile` route
  - Uses shared auth/session logic
- **UI/UX**
  - Responsive layout with a persistent navbar
  - Auth‑aware navbar (switches between guest and logged‑in links)
  - Modern, accessible styling (Tailwind via `globals.css`/design system)
- **Data fetching**
  - Axios instance with JWT `Authorization` header
  - React Query for mutations/queries

---

### Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript / React
- **Styling**: Tailwind CSS (via `globals.css` and utility classes)
- **State Management**: Zustand (`authStore`)
- **Data Fetching**: Axios + @tanstack/react‑query
- **Auth**
  - JWT (with `exp` claim) stored in `js-cookie` under `access_token`
  - Server: `next/headers` + custom `isJwtValid` helper
  - Middleware: Next.js `middleware.ts` for route guarding

---

### Project Structure (key parts)

- `app/`
  - `layout.tsx` – root layout, fonts, providers, navbar, auth store init
  - `page.tsx`, `dashboard/`, `profile/` – main pages (protected by middleware)
- `components/`
  - `ui/Navbar.tsx` – auth‑aware navbar (uses Zustand `loggedIn`)
  - `AuthInitializer.tsx` – hydrates `authStore` from server on first render
  - `auth/ClientWrapper.tsx` – legacy client wrapper (optional/unused now)
- `lib/`
  - `api.ts` – configured Axios instance with JWT `Authorization` header
  - `services/auth.ts` – login/register/profile/logout API helpers
  - `queries/auth.ts` – login/register React Query mutations
  - `store/authStore.ts` – Zustand store for `loggedIn` boolean
  - `auth-server.ts` – server‑side `getIsLoggedIn` using JWT decode
  - `jwt.ts` – lightweight JWT decode + expiry check
- `middleware.ts`
  - Protects `/dashboard` and `/profile`
  - Redirects auth pages based on JWT validity

---

### Prerequisites

- Node.js **18+**
- npm, pnpm, or yarn
- Running TaskPulse backend API (see backend repo) with compatible routes:
  - `POST /auth/login`
  - `POST /auth/register`
  - `GET /auth/profile`
  - `POST /auth/logout`

---

### Environment Variables

Create a `.env.local` file in the root of this frontend project:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

Adjust the URL/port to match your backend.

---

### Getting Started

1. **Install dependencies**

```bash
npm install
# or
yarn
# or
pnpm install
```

2. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. **Open the app**

Visit `http://localhost:3000` in your browser.

---

### Auth Flow (High‑Level)

- **Login / Register**
  - `authService.login` / `authService.register` calls the backend.
  - Backend returns a JWT; frontend stores it in `js-cookie` as `access_token`.
  - React Query `useLogin` / `useRegister` mark `loggedIn` as `true` in `authStore`.
  - Navbar instantly updates to show Dashboard/Profile/Logout.

- **Server‑side / initial render**
  - `layout.tsx` calls `getIsLoggedIn()`:
    - Reads `access_token` from cookies (server‑side).
    - Uses `isJwtValid` to check the `exp` claim.
  - `AuthStoreInitializer` hydrates the client `authStore` with this value on first render.

- **Route protection**
  - `middleware.ts` runs on `/dashboard`, `/profile`, `/login`, `/register`.
  - For protected routes:
    - If JWT is missing/expired → redirect to `/login`.
  - For auth pages:
    - If JWT is valid → redirect to `/dashboard`.

- **API calls**
  - `lib/api.ts` reads `access_token` from `js-cookie` on each request.
  - Adds `Authorization: Bearer <token>` header.
  - On `401` responses:
    - Removes the token from `js-cookie`.
    - Redirects the user to `/login`.

---

### Scripts

Common `package.json` scripts (names may vary slightly):

- `dev` – start the Next.js dev server
- `build` – build the production bundle
- `start` – start the production server
- `lint` – run linters

Example:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

### Development Notes

- **State vs security**: UI state (`authStore.loggedIn`) is for rendering; actual access control is enforced via middleware + JWT validation.
- **Token expiry**: No extra backend call is made to check validity; `isJwtValid` decodes the token and checks `exp` locally for performance.
- **SSR friendliness**: `getIsLoggedIn` runs on the server and avoids client‑only APIs, so it’s safe in layouts, server components, and middleware.

---

### Future Improvements

- Add full task/timer UI details (Pomodoro cycles, statistics, etc.).
- Implement better error boundaries and loading states for protected pages.
- Internationalization/localization support.
- More granular roles/permissions if needed.

---

### License

Add your preferred license here (e.g. MIT) and include a `LICENSE` file in the repo.

