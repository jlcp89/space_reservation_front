import React, { useState } from 'react';
import { Edit, Trash2, Plus, Building, Users } from 'lucide-react';
import { Space } from '../../types';
import { Button } from '../common/Button';
import { Modal, ConfirmModal } from '../common/Modal';
import { SpaceForm } from './SpaceForm';
import { formatDate } from '../../utils/dateHelpers';

interface SpaceListProps {
  spaces: Space[];
  isLoading?: boolean;
  onCreateSpace: (data: any) => Promise<void>;
  onUpdateSpace: (id: number, data: any) => Promise<void>;
  onDeleteSpace: (id: number) => Promise<void>;
  onRefresh: () => void;
}

export const SpaceList: React.FC<SpaceListProps> = ({
  spaces,
  isLoading = false,
  onCreateSpace,
  onUpdateSpace,
  onDeleteSpace,
  onRefresh,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [deletingSpace, setDeletingSpace] = useState<Space | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onCreateSpace(data);
      setIsCreateModalOpen(false);
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingSpace) return;
    setIsSubmitting(true);
    try {
      await onUpdateSpace(editingSpace.id, data);
      setEditingSpace(null);
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSpace) return;
    setIsSubmitting(true);
    try {
      await onDeleteSpace(deletingSpace.id);
      setDeletingSpace(null);
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && spaces.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading spaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Spaces</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage meeting rooms and work areas available for reservation
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Space
        </Button>
      </div>

      {/* Space List */}
      {spaces.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No spaces yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first space.</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Space
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <div key={space.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{space.name}</h3>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingSpace(space)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setDeletingSpace(space)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    {space.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    Capacity: {space.capacity}
                  </div>
                </div>

                {space.description && (
                  <p className="text-sm text-gray-500 mb-4">{space.description}</p>
                )}

                <div className="text-xs text-gray-400 border-t pt-3">
                  Created {formatDate(space.createdAt, 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Space"
        size="md"
      >
        <SpaceForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingSpace}
        onClose={() => setEditingSpace(null)}
        title="Edit Space"
        size="md"
      >
        {editingSpace && (
          <SpaceForm
            onSubmit={handleUpdate}
            onCancel={() => setEditingSpace(null)}
            initialData={editingSpace}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingSpace}
        onClose={() => setDeletingSpace(null)}
        onConfirm={handleDelete}
        title="Delete Space"
        message={`Are you sure you want to delete "${deletingSpace?.name}"? This will also delete all reservations for this space.`}
        confirmText="Delete"
        isLoading={isSubmitting}
      />
    </div>
  );
};