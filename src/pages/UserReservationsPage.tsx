import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { ReservationForm } from '../components/reservations/ReservationForm';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Reservation, PaginationParams } from '../types';
import { format } from 'date-fns';

export const UserReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const { success, error: showError } = useToast();

  useEffect(() => {
    loadReservations();
  }, [pagination.page]);

  const loadReservations = async () => {
    try {
      setIsLoading(true);
      const params: PaginationParams = {
        page: pagination.page,
        pageSize: pagination.pageSize,
      };
      
      const response = await apiService.getUserReservations(params);
      
      if (response.success && response.data) {
        setReservations(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error: any) {
      console.error('Error loading user reservations:', error);
      showError(error.message || 'Failed to load reservations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReservation = () => {
    setSelectedReservation(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteReservation = async (reservation: Reservation) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) {
      return;
    }

    try {
      await apiService.deleteReservation(reservation.id);
      success('Reservation deleted successfully');
      loadReservations();
    } catch (error: any) {
      console.error('Error deleting reservation:', error);
      showError(error.message || 'Failed to delete reservation');
    }
  };

  const handleSubmitReservation = async (data: any) => {
    try {
      if (modalMode === 'create') {
        await apiService.createReservation(data);
        success('Reservation created successfully');
      } else if (modalMode === 'edit' && selectedReservation) {
        await apiService.updateReservation(selectedReservation.id, data);
        success('Reservation updated successfully');
      }
      
      setIsModalOpen(false);
      loadReservations();
    } catch (error: any) {
      console.error('Error saving reservation:', error);
      showError(error.message || 'Failed to save reservation');
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (reservationDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resDate = new Date(reservationDate);
    resDate.setHours(0, 0, 0, 0);
    
    if (resDate < today) {
      return 'bg-gray-100 text-gray-600';
    } else if (resDate.getTime() === today.getTime()) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (reservationDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resDate = new Date(reservationDate);
    resDate.setHours(0, 0, 0, 0);
    
    if (resDate < today) {
      return 'Past';
    } else if (resDate.getTime() === today.getTime()) {
      return 'Today';
    } else {
      return 'Upcoming';
    }
  };

  if (isLoading && reservations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reservations</h1>
          <p className="text-gray-600 mt-1">
            Manage your workspace reservations
          </p>
        </div>
        <Button onClick={handleCreateReservation}>
          <Plus className="w-4 h-4 mr-2" />
          New Reservation
        </Button>
      </div>

      {/* Reservations List */}
      {reservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reservations</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't made any reservations yet. Create your first one!
          </p>
          <div className="mt-6">
            <Button onClick={handleCreateReservation}>
              <Plus className="w-4 h-4 mr-2" />
              Create Reservation
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Space
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.space?.name || 'Unknown Space'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {reservation.space?.location || 'Unknown Location'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Capacity: {reservation.space?.capacity || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div>{formatDate(reservation.reservationDate)}</div>
                          <div className="text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.reservationDate)}`}>
                        {getStatusText(reservation.reservationDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReservation(reservation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditReservation(reservation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteReservation(reservation)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.pageSize + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.pageSize, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <Button
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Button
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'create'
            ? 'Create Reservation'
            : modalMode === 'edit'
            ? 'Edit Reservation'
            : 'Reservation Details'
        }
        size="lg"
      >
        <ReservationForm
          initialData={selectedReservation || undefined}
          onSubmit={handleSubmitReservation}
          onCancel={() => setIsModalOpen(false)}
          mode={modalMode}
        />
      </Modal>
    </div>
  );
};