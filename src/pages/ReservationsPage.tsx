import React, { useState, useCallback, useMemo } from 'react';
import { ReservationList } from '../components/reservations/ReservationList';
import { useApi } from '../hooks/useApi';
import { useToast } from '../hooks/useToast';
import { apiService } from '../services/api';
import { PaginationParams } from '../types';

export const ReservationsPage: React.FC = () => {
  const toast = useToast();
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });

  // Memoize the API function to prevent unnecessary re-renders
  const getReservationsWithParams = useMemo(
    () => () => apiService.getReservations(paginationParams),
    [paginationParams]
  );

  const {
    data: reservationsData,
    isLoading,
    execute: loadReservations,
  } = useApi(getReservationsWithParams, { immediate: true });

  const handleRefresh = useCallback((params?: PaginationParams) => {
    if (params) {
      setPaginationParams(params);
    }
    loadReservations();
  }, [loadReservations]);

  const handleCreateReservation = async (data: any) => {
    try {
      await apiService.createReservation(data);
      toast.success('Reservation created successfully', 'The space has been booked.');
      // Refresh the reservations list after successful creation
      loadReservations();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create reservation';
      toast.error('Failed to create reservation', message);
      throw error;
    }
  };

  const handleUpdateReservation = async (id: number, data: any) => {
    try {
      await apiService.updateReservation(id, data);
      toast.success('Reservation updated successfully', 'Changes have been saved.');
      // Refresh the reservations list after successful update
      loadReservations();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update reservation';
      toast.error('Failed to update reservation', message);
      throw error;
    }
  };

  const handleDeleteReservation = async (id: number) => {
    try {
      await apiService.deleteReservation(id);
      toast.success('Reservation cancelled successfully', 'The reservation has been removed.');
      // Refresh the reservations list after successful deletion
      loadReservations();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel reservation';
      toast.error('Failed to cancel reservation', message);
      throw error;
    }
  };

  return (
    <ReservationList
      reservations={reservationsData?.data || []}
      pagination={reservationsData?.pagination}
      isLoading={isLoading}
      onCreateReservation={handleCreateReservation}
      onUpdateReservation={handleUpdateReservation}
      onDeleteReservation={handleDeleteReservation}
      onRefresh={handleRefresh}
    />
  );
};