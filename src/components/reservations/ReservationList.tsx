import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Calendar, Clock, User, Building, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reservation, PaginationParams } from '../../types';
import { Button } from '../common/Button';
import { Modal, ConfirmModal } from '../common/Modal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { PageContainer } from '../common/PageContainer';
import { ReservationForm } from './ReservationForm';
import { formatDate, formatTime, formatDateTime } from '../../utils/dateHelpers';

interface ReservationListProps {
  reservations: Reservation[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  isLoading?: boolean;
  onCreateReservation: (data: any) => Promise<void>;
  onUpdateReservation: (id: number, data: any) => Promise<void>;
  onDeleteReservation: (id: number) => Promise<void>;
  onRefresh: (params?: PaginationParams) => void;
}

export const ReservationList: React.FC<ReservationListProps> = ({
  reservations,
  pagination,
  isLoading = false,
  onCreateReservation,
  onUpdateReservation,
  onDeleteReservation,
  onRefresh,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [deletingReservation, setDeletingReservation] = useState<Reservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (pagination) {
      setCurrentPage(pagination.page);
    }
  }, [pagination]);

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onCreateReservation(data);
      setIsCreateModalOpen(false);
      onRefresh({ page: currentPage, pageSize: pagination?.pageSize || 10 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingReservation) return;
    setIsSubmitting(true);
    try {
      await onUpdateReservation(editingReservation.id, data);
      setEditingReservation(null);
      onRefresh({ page: currentPage, pageSize: pagination?.pageSize || 10 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingReservation) return;
    setIsSubmitting(true);
    try {
      await onDeleteReservation(deletingReservation.id);
      setDeletingReservation(null);
      onRefresh({ page: currentPage, pageSize: pagination?.pageSize || 10 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    onRefresh({ page: newPage, pageSize: pagination?.pageSize || 10 });
  };

  const getStatusColor = (reservation: Reservation) => {
    const now = new Date();
    const reservationDate = new Date(reservation.reservationDate);
    const [hours, minutes] = reservation.endTime.split(':').map(Number);
    const endDateTime = new Date(reservationDate);
    endDateTime.setHours(hours, minutes);

    if (endDateTime < now) {
      return 'bg-gray-100 text-gray-800'; // Past
    } else if (reservationDate.toDateString() === now.toDateString()) {
      return 'bg-green-100 text-green-800'; // Today
    } else {
      return 'bg-blue-100 text-blue-800'; // Future
    }
  };

  const getStatusText = (reservation: Reservation) => {
    const now = new Date();
    const reservationDate = new Date(reservation.reservationDate);
    const [hours, minutes] = reservation.endTime.split(':').map(Number);
    const endDateTime = new Date(reservationDate);
    endDateTime.setHours(hours, minutes);

    if (endDateTime < now) {
      return 'Completed';
    } else if (reservationDate.toDateString() === now.toDateString()) {
      return 'Today';
    } else {
      return 'Upcoming';
    }
  };

  if (isLoading && reservations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 mt-4">Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reservations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage space bookings and reservations
            {pagination && (
              <span className="ml-2">
                • {pagination.total} total reservations
              </span>
            )}
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Reservation
        </Button>
      </div>

      {/* Reservation List */}
      {reservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first reservation.</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Reservation
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reservation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Person
                    </th>
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
                        <div className="text-sm font-medium text-gray-900">
                          Reservation #{reservation.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          Created {formatDate(reservation.createdAt, 'MMM d')}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {reservation.person?.email || `Person ID: ${reservation.personId}`}
                            </div>
                            {reservation.person?.role && (
                              <div className="text-sm text-gray-500 capitalize">
                                {reservation.person.role}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {reservation.space?.name || `Space ID: ${reservation.spaceId}`}
                            </div>
                            {reservation.space?.location && (
                              <div className="text-sm text-gray-500">
                                {reservation.space.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(reservation.reservationDate, 'MMM d, yyyy')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation)}`}>
                          {getStatusText(reservation)}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingReservation(reservation)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeletingReservation(reservation)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(currentPage - 1) * pagination.pageSize + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pagination.pageSize, pagination.total)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="rounded-l-md"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === pagination.totalPages || 
                        Math.abs(page - currentPage) <= 2
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                              ...
                            </span>
                          )}
                          <Button
                            variant={page === currentPage ? 'primary' : 'outline'}
                            onClick={() => handlePageChange(page)}
                            className="px-3 py-2"
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= pagination.totalPages}
                      className="rounded-r-md"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Reservation"
        size="lg"
      >
        <ReservationForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingReservation}
        onClose={() => setEditingReservation(null)}
        title="Edit Reservation"
        size="lg"
      >
        {editingReservation && (
          <ReservationForm
            onSubmit={handleUpdate}
            onCancel={() => setEditingReservation(null)}
            initialData={editingReservation}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingReservation}
        onClose={() => setDeletingReservation(null)}
        onConfirm={handleDelete}
        title="Cancel Reservation"
        message={`Are you sure you want to cancel this reservation for ${deletingReservation?.person?.email || 'this person'}? This action cannot be undone.`}
        confirmText="Cancel Reservation"
        isLoading={isSubmitting}
      />
    </PageContainer>
  );
};