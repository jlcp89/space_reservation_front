import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import awsConfig from './aws-exports';
import { Navigation } from './components/common/Navigation';
import { ToastContainer } from './components/common/Toast';
import { DashboardPage } from './pages/DashboardPage';
import { PersonsPage } from './pages/PersonsPage';
import { SpacesPage } from './pages/SpacesPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { LoginPage } from './pages/LoginPage';
import { UserReservationsPage } from './pages/UserReservationsPage';
import { useToast } from './hooks/useToast';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Configure Amplify
Amplify.configure(awsConfig);

function App() {
  const { toasts, removeToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation onLogout={() => setIsAuthenticated(false)} />
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/persons" element={<PersonsPage />} />
            <Route path="/spaces" element={<SpacesPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/my-reservations" element={<UserReservationsPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </Router>
  );
}

export default App;