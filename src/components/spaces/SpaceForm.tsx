import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SpaceFormData, Space } from '../../types';

interface SpaceFormProps {
  onSubmit: (data: SpaceFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Space;
  isLoading?: boolean;
}

export const SpaceForm: React.FC<SpaceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpaceFormData>({
    defaultValues: {
      name: initialData?.name || '',
      location: initialData?.location || '',
      capacity: initialData?.capacity || 1,
      description: initialData?.description || '',
    },
  });

  // Manual validation for now until we resolve the type issues
  const handleFormSubmit = async (data: SpaceFormData) => {
    // Basic validation
    if (!data.name?.trim()) {
      throw new Error('Space name is required');
    }
    if (!data.location?.trim()) {
      throw new Error('Location is required');
    }
    if (!data.capacity || data.capacity < 1 || data.capacity > 1000) {
      throw new Error('Capacity must be between 1 and 1000');
    }
    
    // Clean the data
    const cleanData = {
      ...data,
      name: data.name.trim(),
      location: data.location.trim(),
      description: data.description?.trim() || undefined,
    };
    
    return onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Space Name"
        {...register('name', { 
          required: 'Space name is required',
          minLength: { value: 2, message: 'Space name must be at least 2 characters' },
          maxLength: { value: 100, message: 'Space name must be less than 100 characters' }
        })}
        error={errors.name?.message}
        placeholder="e.g., Conference Room A"
        disabled={isLoading}
      />

      <Input
        label="Location"
        {...register('location', { 
          required: 'Location is required',
          minLength: { value: 2, message: 'Location must be at least 2 characters' },
          maxLength: { value: 200, message: 'Location must be less than 200 characters' }
        })}
        error={errors.location?.message}
        placeholder="e.g., Building 1, Floor 2"
        disabled={isLoading}
      />

      <Input
        label="Capacity"
        type="number"
        {...register('capacity', { 
          required: 'Capacity is required',
          min: { value: 1, message: 'Capacity must be at least 1' },
          max: { value: 1000, message: 'Capacity must be less than 1000' },
          valueAsNumber: true
        })}
        error={errors.capacity?.message}
        placeholder="e.g., 12"
        min="1"
        max="1000"
        disabled={isLoading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          {...register('description', {
            maxLength: { value: 500, message: 'Description must be less than 500 characters' }
          })}
          rows={3}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-primary-500 focus:ring-primary-500 sm:text-sm
            ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          `}
          placeholder="Brief description of the space and its amenities"
          disabled={isLoading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
        >
          {initialData ? 'Update Space' : 'Create Space'}
        </Button>
      </div>
    </form>
  );
};