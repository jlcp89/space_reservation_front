import React, { useCallback } from 'react';
import { SpaceList } from '../components/spaces/SpaceList';
import { useApi } from '../hooks/useApi';
import { useToast } from '../hooks/useToast';
import { apiService } from '../services/api';

export const SpacesPage: React.FC = () => {
  const toast = useToast();

  // Create a stable reference to the API function
  const getSpacesCallback = useCallback(() => apiService.getSpaces(), []);

  const {
    data: spaces,
    isLoading,
    execute: loadSpaces,
  } = useApi(getSpacesCallback, { immediate: true });

  const handleCreateSpace = async (data: any) => {
    try {
      await apiService.createSpace(data);
      toast.success('Space created successfully', `${data.name} is now available for reservations.`);
      // Refresh the spaces list after successful creation
      loadSpaces();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create space';
      toast.error('Failed to create space', message);
      throw error;
    }
  };

  const handleUpdateSpace = async (id: number, data: any) => {
    try {
      await apiService.updateSpace(id, data);
      toast.success('Space updated successfully', `Changes have been saved.`);
      // Refresh the spaces list after successful update
      loadSpaces();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update space';
      toast.error('Failed to update space', message);
      throw error;
    }
  };

  const handleDeleteSpace = async (id: number) => {
    try {
      await apiService.deleteSpace(id);
      toast.success('Space deleted successfully', 'The space and all its reservations have been removed.');
      // Refresh the spaces list after successful deletion
      loadSpaces();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete space';
      toast.error('Failed to delete space', message);
      throw error;
    }
  };

  return (
    <SpaceList
      spaces={spaces || []}
      isLoading={isLoading}
      onCreateSpace={handleCreateSpace}
      onUpdateSpace={handleUpdateSpace}
      onDeleteSpace={handleDeleteSpace}
      onRefresh={loadSpaces}
    />
  );
};