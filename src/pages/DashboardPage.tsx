import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from '../components/dashboard/Dashboard';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Create stable references to the API functions
  const getPersonsCallback = useCallback(() => apiService.getPersons(), []);
  const getSpacesCallback = useCallback(() => apiService.getSpaces(), []);

  // Memoize the reservations API call with fixed parameters
  const getReservationsForDashboard = useMemo(
    () => () => apiService.getReservations({ page: 1, pageSize: 100 }),
    []
  );

  const {
    data: persons,
    isLoading: personsLoading,
  } = useApi(getPersonsCallback, { immediate: true });

  const {
    data: spaces,
    isLoading: spacesLoading,
  } = useApi(getSpacesCallback, { immediate: true });

  const {
    data: reservationsData,
    isLoading: reservationsLoading,
  } = useApi(getReservationsForDashboard, { immediate: true });

  const isLoading = personsLoading || spacesLoading || reservationsLoading;
  const reservations = reservationsData?.data || [];

  return (
    <Dashboard
      persons={persons || []}
      spaces={spaces || []}
      reservations={reservations}
      isLoading={isLoading}
      onNavigate={(path) => navigate(path)}
    />
  );
};