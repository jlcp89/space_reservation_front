import React, { useState } from 'react';
import { Edit, Trash2, Plus, Users } from 'lucide-react';
import { Person } from '../../types';
import { Button } from '../common/Button';
import { Modal, ConfirmModal } from '../common/Modal';
import { PageContainer } from '../common/PageContainer';
import { PersonForm } from './PersonForm';
import { formatDate } from '../../utils/dateHelpers';

interface PersonListProps {
  persons: Person[];
  isLoading?: boolean;
  onCreatePerson: (data: any) => Promise<void>;
  onUpdatePerson: (id: number, data: any) => Promise<void>;
  onDeletePerson: (id: number) => Promise<void>;
  onRefresh: () => void;
}

export const PersonList: React.FC<PersonListProps> = ({
  persons,
  isLoading = false,
  onCreatePerson,
  onUpdatePerson,
  onDeletePerson,
  onRefresh,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onCreatePerson(data);
      setIsCreateModalOpen(false);
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingPerson) return;
    setIsSubmitting(true);
    try {
      await onUpdatePerson(editingPerson.id, data);
      setEditingPerson(null);
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPerson) return;
    setIsSubmitting(true);
    try {
      await onDeletePerson(deletingPerson.id);
      setDeletingPerson(null);
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'admin'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  if (isLoading && persons.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading persons...</p>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">People</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage users who can make reservations
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Person
        </Button>
      </div>

      {/* Person List */}
      {persons.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No people yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first person.</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Person
          </Button>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {persons.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {person.email}
                      </div>
                      <div className="text-sm text-gray-500">ID: {person.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(person.role)}`}>
                      {person.role.charAt(0).toUpperCase() + person.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(person.createdAt, 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingPerson(person)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setDeletingPerson(person)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Person"
        size="md"
      >
        <PersonForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingPerson}
        onClose={() => setEditingPerson(null)}
        title="Edit Person"
        size="md"
      >
        {editingPerson && (
          <PersonForm
            onSubmit={handleUpdate}
            onCancel={() => setEditingPerson(null)}
            initialData={editingPerson}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingPerson}
        onClose={() => setDeletingPerson(null)}
        onConfirm={handleDelete}
        title="Delete Person"
        message={`Are you sure you want to delete ${deletingPerson?.email}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
      />
    </PageContainer>
  );
};