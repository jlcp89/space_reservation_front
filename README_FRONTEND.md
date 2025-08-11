# Workspace Reservation Frontend

A modern React TypeScript frontend for the workspace reservation system, featuring a clean UI for managing spaces, people, and reservations with real-time conflict detection.

## Features

### 🏢 **Core Functionality**
- **Dashboard Overview**: Quick stats and upcoming reservations
- **Person Management**: Create and manage admin/client users
- **Space Management**: Manage meeting rooms and work areas
- **Reservation System**: Book spaces with conflict detection and weekly limits
- **Real-time Validation**: Instant feedback for scheduling conflicts

### 🎨 **User Interface**
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Intuitive Navigation**: Easy-to-use routing and navigation
- **Loading States**: Smooth loading indicators and skeleton screens
- **Toast Notifications**: User-friendly success and error messages

### 🔧 **Technical Features**
- **TypeScript**: Full type safety throughout the application
- **Form Validation**: Comprehensive validation with react-hook-form and Yup
- **API Integration**: Robust API service layer with error handling
- **Pagination**: Efficient data loading for large datasets
- **Modal System**: Reusable modal components for forms and confirmations

## Quick Start

### Prerequisites
- Node.js 18+
- Backend API running on localhost:3000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API settings
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Environment Configuration

Update `.env` file:
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_API_KEY=secure-api-key-2024
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

## Project Structure

```
src/
├── components/           # React components
│   ├── common/          # Reusable UI components
│   ├── dashboard/       # Dashboard components
│   ├── persons/         # Person management
│   ├── spaces/          # Space management
│   └── reservations/    # Reservation management
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API service layer
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Key Components

### Dashboard
- System overview with key metrics
- Upcoming reservations
- Popular spaces and active clients
- Quick action buttons

### Person Management
- Create admin and client users
- Email validation and role assignment
- User listing with search and filters

### Space Management
- Create and edit meeting rooms/work areas
- Capacity and location tracking
- Visual space cards with occupancy info

### Reservation System
- Date/time picker with validation
- Real-time conflict detection
- Weekly limit enforcement (3 per user)
- Comprehensive error messaging

## Business Rules Implementation

### Conflict Prevention
- Real-time validation prevents overlapping bookings
- Shows existing reservations when conflicts occur
- Clear error messages with conflict details

### Weekly Limits
- Enforces maximum 3 reservations per person per week
- Week runs Monday to Sunday
- Shows current reservation count in error messages

### Validation Rules
- **Dates**: Must be today or future, proper format validation
- **Times**: 24-hour format, end time must be after start time
- **Emails**: Proper email format validation
- **Capacity**: Positive integers within reasonable limits

## API Integration

The frontend communicates with the Express.js backend through a robust API service layer:

- **Authentication**: API key-based authentication
- **Error Handling**: Centralized error processing with user-friendly messages
- **Loading States**: Consistent loading indicators across all operations
- **Caching**: Smart caching for improved performance

## Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablet screens
- **Desktop**: Full-featured desktop experience
- **Touch Friendly**: Large tap targets and smooth interactions

## Development

### Adding New Components
1. Create component in appropriate folder
2. Add TypeScript interfaces in `types/`
3. Implement responsive design
4. Add error handling and loading states

### Extending API Service
1. Add method to `services/api.ts`
2. Create custom hook in `hooks/`
3. Update types as needed

### Styling Guidelines
- Use Tailwind CSS utility classes
- Maintain consistent spacing and colors
- Follow responsive design patterns
- Use provided color palette

## Deployment

### Build for Production
```bash
npm run build
```

### Serve Static Files
The build folder can be served by any static file server or deployed to:
- Netlify
- Vercel
- AWS S3
- GitHub Pages

## Integration with Backend

This frontend is designed to work with the Express.js + TypeScript backend located in the `test1` folder. Make sure the backend is running before starting the frontend development server.

**Backend Requirements:**
- Express.js API running on localhost:3000
- API key authentication enabled
- CORS configured for frontend domain
- All CRUD endpoints implemented

## Contributing

1. Follow TypeScript best practices
2. Use provided component patterns
3. Maintain responsive design
4. Add proper error handling
5. Update types as needed

## License

MIT License - see LICENSE file for details