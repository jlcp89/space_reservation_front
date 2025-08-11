import React, { useCallback } from 'react';
import { PersonList } from '../components/persons/PersonList';
import { useApi } from '../hooks/useApi';
import { useToast } from '../hooks/useToast';
import { apiService } from '../services/api';

export const PersonsPage: React.FC = () => {
  const toast = useToast();

  // Create a stable reference to the API function
  const getPersonsCallback = useCallback(() => apiService.getPersons(), []);

  const {
    data: persons,
    isLoading,
    execute: loadPersons,
  } = useApi(getPersonsCallback, { immediate: true });

  const handleCreatePerson = async (data: any) => {
    try {
      await apiService.createPerson(data);
      toast.success('Person created successfully', `${data.email} has been added to the system.`);
      // Refresh the persons list after successful creation
      loadPersons();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create person';
      toast.error('Failed to create person', message);
      throw error;
    }
  };

  const handleUpdatePerson = async (id: number, data: any) => {
    try {
      await apiService.updatePerson(id, data);
      toast.success('Person updated successfully', `Changes have been saved.`);
      // Refresh the persons list after successful update
      loadPersons();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update person';
      toast.error('Failed to update person', message);
      throw error;
    }
  };

  const handleDeletePerson = async (id: number) => {
    try {
      await apiService.deletePerson(id);
      toast.success('Person deleted successfully', 'The person has been removed from the system.');
      // Refresh the persons list after successful deletion
      loadPersons();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete person';
      toast.error('Failed to delete person', message);
      throw error;
    }
  };

  return (
    <PersonList
      persons={persons || []}
      isLoading={isLoading}
      onCreatePerson={handleCreatePerson}
      onUpdatePerson={handleUpdatePerson}
      onDeletePerson={handleDeletePerson}
      onRefresh={loadPersons}
    />
  );
};