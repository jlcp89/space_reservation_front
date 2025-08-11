import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { PersonFormData, Person } from '../../types';
import { USER_ROLES } from '../../utils/constants';

interface PersonFormProps {
  onSubmit: (data: PersonFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Person;
  isLoading?: boolean;
}

export const PersonForm: React.FC<PersonFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonFormData>({
    defaultValues: {
      email: initialData?.email || '',
      role: initialData?.role || 'client',
    },
  });

  // Add validation and data cleaning
  const handleFormSubmit = async (data: PersonFormData) => {
    // Basic validation
    if (!data.email?.trim()) {
      throw new Error('Email is required');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      throw new Error('Please enter a valid email address');
    }
    
    if (!data.role) {
      throw new Error('Role is required');
    }
    
    // Clean the data
    const cleanData = {
      ...data,
      email: data.email.trim().toLowerCase(),
    };
    
    return onSubmit(cleanData);
  };

  const roleOptions = [
    { value: USER_ROLES.CLIENT, label: 'Client' },
    { value: USER_ROLES.ADMIN, label: 'Admin' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
          }
        })}
        error={errors.email?.message}
        placeholder="Enter email address"
        disabled={isLoading}
      />

      <Select
        label="Role"
        {...register('role', { required: 'Role is required' })}
        options={roleOptions}
        error={errors.role?.message}
        disabled={isLoading}
      />

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
          {initialData ? 'Update Person' : 'Create Person'}
        </Button>
      </div>
    </form>
  );
};