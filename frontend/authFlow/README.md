# React Auth Flow Starter

Vite + React starter structured for API-based authentication.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Set `VITE_API_BASE_URL` to your backend API URL.

## Auth API contract expected

- `POST /auth/login` -> `{ access_token, user }` (also supports `token`)
- `GET /auth/me` -> current user
- `POST /auth/logout` -> logout

The response mapping is centralized in `AuthContext.jsx`, so it can be adjusted easily to your API's exact response shape.

## Structure

- `src/components/auth` - authentication UI/forms
- `src/components/common` - reusable UI components
- `src/components/layouts` - auth/application layouts
- `src/context` - global auth state
- `src/hooks` - reusable hooks
- `src/pages` - route-level pages
- `src/routes` - public/protected routing
- `src/services` - API service layer
- `src/config` - API endpoints/configuration

## Recommended next API integrations

Add register, email verification, forgot/reset password, refresh-token handling, role/permission guards, and centralized API error handling without coupling pages directly to Axios.
