# LeaveFlow React Demo

React/Vite frontend demo for the supplied FastAPI leave-management API.

## Included
- Existing login, registration, forgot-password and reset-password auth flow
- JWT bearer token attached automatically through Axios
- Dashboard with leave-request and balance overview
- My Leave Requests list with status filtering
- Create leave request (draft)
- Leave detail with submit / approve / reject / cancel actions
- Comments on leave requests
- Leave balance page
- Responsive sidebar/header UI

## Run

```bash
npm install
npm run dev
```

The supplied `.env` points to:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Start the FastAPI application on port `8000` first.

## API mapping

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/leaves`
- `GET /api/leaves/my`
- `GET /api/leaves/{id}`
- `POST /api/leaves/{id}/submit`
- `POST /api/leaves/{id}/approve`
- `POST /api/leaves/{id}/reject`
- `POST /api/leaves/{id}/cancel`
- `GET/POST /api/leaves/{id}/comments`
- `GET /api/leave-types`
- `GET /api/leave-balances/user/{user_id}`

Note: the backend currently does not expose `/api/auth/me` or a logout route. The frontend therefore keeps the authenticated user returned by login and clears local auth state on logout. This avoids calling the missing `/me` endpoint.

## Demo routes

- `/login`
- `/register`
- `/dashboard`
- `/leaves`
- `/leaves/new`
- `/leaves/:id`
- `/balances`

## Admin panel

Assign the `admin` role to the user in the API database. The login response now includes the user's role. Log in as that user and the **Admin panel** navigation item appears. The panel provides leave request approvals/rejections, leave type management, and role visibility.
