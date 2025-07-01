# Frontend Integration Setup

This Django project is configured to serve your React frontend with intelligent routing between development and production modes.

## How it works

When you visit `http://localhost:8080/`, Django will:

1. **Check if Vite dev server is running** on port 5173
   - If YES: Redirect to `http://localhost:5173` for Hot Module Replacement (HMR)
   - If NO: Serve built files from `js/dist/`

2. **If no built files exist**: Show an error message with instructions

## Development Workflow

### Option 1: Development with HMR (Recommended)
```bash
# Terminal 1: Start the backend
docker-compose up

# Terminal 2: Start the frontend dev server
cd js
pnpm run dev
```

Then visit `http://localhost:8080/` - you'll be automatically redirected to the Vite dev server with HMR.

### Option 2: Production-like serving
```bash
# Build the frontend
cd js
pnpm run build

# Start the backend
docker-compose up
```

Then visit `http://localhost:8080/` - Django will serve the built files.

## Useful Commands

```bash
# Check frontend status
docker-compose exec web python manage.py check_frontend

# Build frontend
cd js && pnpm run build

# Start frontend dev server
cd js && pnpm run dev
```

## Ports
- Django: `http://localhost:8080`
- Vite dev server: `http://localhost:5173`
- PostgreSQL: `localhost:5432`

## API Endpoints
- Frontend: `http://localhost:8080/`
- API: `http://localhost:8080/api/`
- Admin: `http://localhost:8080/admin/`
