# Frontend Containerization

This document describes how to run the React frontend using Docker containers.

## Port Configuration

- **Production**: `localhost:3002` (nginx-served static files)
- **Development**: `localhost:3003` (hot reload with CRA dev server)
- **Backend API**: Expected at `localhost:3001` (configurable via env var)

## Production Mode

Build and run the optimized production container:

```bash
# Build and start production container
docker compose up -d --build

# Check container status
docker compose ps

# View logs
docker compose logs frontend

# Stop container
docker compose down
```

The production build uses:
- Multi-stage Docker build with nginx
- Gzip compression and cache headers
- Health check endpoint at `/health`
- API URL injected via `REACT_APP_API_BASE_URL` build arg

## Development Mode

Run with hot reload for development:

```bash
# Start development container with volume mounting
docker compose -f docker-compose.dev.yml up -d --build

# View development logs
docker compose -f docker-compose.dev.yml logs -f frontend

# Stop development container
docker compose -f docker-compose.dev.yml down
```

Development features:
- Volume mounting for hot reload
- CRA development server
- File watching with polling enabled
- All npm dependencies installed

## Environment Variables

Override the API base URL by setting build args:

```bash
# Custom API URL for production
docker compose build --build-arg REACT_APP_API_BASE_URL=http://api.example.com frontend

# Or modify docker-compose.yml:
build:
  args:
    REACT_APP_API_BASE_URL: http://your-api-host:3000
```

## Files Created

- `Dockerfile` - Production build with nginx
- `Dockerfile.dev` - Development build with hot reload
- `docker-compose.yml` - Production container configuration
- `docker-compose.dev.yml` - Development container configuration  
- `nginx.conf` - Nginx configuration for static serving
- `.dockerignore` - Build context exclusions

## Cache Optimization

The Dockerfile uses multi-stage builds with dependency layer caching:
- Package files copied first for better cache hits
- Source changes don't invalidate dependency installation
- Second build with only source changes reuses dependency layer