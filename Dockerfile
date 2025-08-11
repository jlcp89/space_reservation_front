###############################
# Frontend Production (React build -> Nginx)
# Quick wins:
# - Add BuildKit cache for npm ci
# - (Optional) pin digest
# - Clarify that runtime env vars are baked at build
###############################

# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for better caching
COPY package*.json ./

# Install dependencies with cache
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy source code
COPY . .

# Build arguments (injected from docker-compose) with sensible defaults for local dev
ARG REACT_APP_API_BASE_URL=http://localhost:3001
ARG REACT_APP_API_URL=http://localhost:3001/api
ARG REACT_APP_COGNITO_USER_POOL_ID
ARG REACT_APP_COGNITO_APP_CLIENT_ID
ARG REACT_APP_COGNITO_REGION=us-east-1

# Expose them to the build environment so CRA picks them up
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL \
  REACT_APP_API_URL=$REACT_APP_API_URL \
  REACT_APP_COGNITO_USER_POOL_ID=$REACT_APP_COGNITO_USER_POOL_ID \
  REACT_APP_COGNITO_APP_CLIENT_ID=$REACT_APP_COGNITO_APP_CLIENT_ID \
  REACT_APP_COGNITO_REGION=$REACT_APP_COGNITO_REGION

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:1.27-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 3000 (matching container port in nginx.conf)
EXPOSE 3000

# Health check (aligns with compose using index.html)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -q -O /dev/null http://localhost:3000/index.html || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]