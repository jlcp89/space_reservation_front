# Workspace Reservation System - Frontend

A modern React + TypeScript frontend for the workspace reservation system with AWS Cognito authentication and responsive design.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features

### 🎨 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Role-based Access**: Different views for admin and client users
- **Real-time Updates**: Dynamic data fetching and state management

### 🔐 Authentication
- **AWS Cognito Integration**: Secure user authentication
- **Role-based Authorization**: Admin and client user roles
- **Session Management**: Automatic token refresh and logout
- **Protected Routes**: Secure access control

### 📱 Pages & Components
- **Dashboard**: Overview of reservations and quick actions
- **Reservations**: Create, view, edit, and delete reservations
- **Spaces**: Manage meeting rooms and work areas (admin only)
- **Users**: Manage persons and roles (admin only)
- **Authentication**: Login and logout flows

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (recommended)
- Backend API running (see ../test1/)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd darient/test1f
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env if needed (default values should work for development)
   ```

3. **Run with Docker (Recommended):**
   ```bash
   # Start the React development server
   docker-compose up --build
   
   # Frontend will be available at: http://localhost:3000
   ```

   **OR start locally:**
   ```bash
   npm start
   # Application will open at: http://localhost:3001
   ```

4. **Verify installation:**
   - Open browser to `http://localhost:3000` (Docker) or `http://localhost:3001` (local)
   - You should see the login page
   - Use test credentials (see backend setup for user creation)

### Full Stack Development Setup

For complete local development with both frontend and backend:

1. **Start Backend (in separate terminal):**
   ```bash
   cd ../test1
   docker-compose up --build
   # Backend API at: http://localhost:3001
   ```

2. **Start Frontend:**
   ```bash
   cd test1f
   docker-compose up --build
   # Frontend at: http://localhost:3000
   ```

3. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001/api`

## Available Scripts

### Development
```bash
npm start              # Start development server (localhost:3001)
npm test               # Run test suite
npm run build          # Build for production
npm run eject          # Eject from Create React App (one-way operation)
```

### Docker Commands
```bash
# Start frontend only
docker-compose up --build

# Start in background
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Full Stack Docker Setup
```bash
# Start both backend and frontend
cd test1 && docker-compose up --build -d && cd ../test1f && docker-compose up --build -d

# Or use the project root scripts (if available)
cd .. && ./start.sh
```

## Environment Configuration

### Development (.env)
```bash
REACT_APP_API_URL=http://localhost:3001/api
PORT=3001
BROWSER=none

# AWS Cognito Configuration
REACT_APP_COGNITO_REGION=us-east-1
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_Wn3ItnBEN
REACT_APP_COGNITO_APP_CLIENT_ID=5e7j49odu6t50eruiac8t7kc7o
```

### Service URLs
- **Frontend (Docker)**: `http://localhost:3000`
- **Frontend (Local)**: `http://localhost:3001`
- **Backend API**: `http://localhost:3001/api` (when backend is running)

## Authentication

### Test Users
After setting up the backend and running the test data script, you can login with:
- **Admin**: `admin@workspace.com`
- **Client**: `client@workspace.com`

Passwords are set in AWS Cognito (see backend setup instructions).

### AWS Cognito Setup
The application uses AWS Cognito for authentication. The configuration is already set up in the environment variables. No additional AWS setup is required for development.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
