// Centralized API base URL resolution for the React app.
// Only environment variables prefixed with REACT_APP_ are available at runtime (CRA build-time substitution).
// Priority:
// 1. REACT_APP_API_URL (full base including /api)
// 2. REACT_APP_API_BASE_URL + '/api'
// 3. Fallback default 'http://localhost:3001/api'
// NOTE: For containerized local dev, backend is published on host port 3001.

const trimSlash = (v?: string) => (v ? v.replace(/\/$/, '') : v);
const explicitFull = trimSlash(process.env.REACT_APP_API_URL);
const base = trimSlash(process.env.REACT_APP_API_BASE_URL);

export const API_BASE_URL = explicitFull || (base ? `${base}/api` : 'http://localhost:3001/api');

export function buildApiUrl(path: string): string {
  if (!path.startsWith('/')) path = `/${path}`;
  return `${API_BASE_URL}${path}`;
}

export default { API_BASE_URL, buildApiUrl };
