import React, { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import { LockKeyhole, Mail } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@workspace.com');
  const [password, setPassword] = useState('AdminPass123!');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const { isSignedIn } = await signIn({
        username: email,
        password: password,
      });

      if (isSignedIn) {
        success('Login successful!');
        onLoginSuccess();
      }
    } catch (error: any) {
      console.error('Login error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Invalid email or password.';
      } else if (error.name === 'UserNotConfirmedException') {
        errorMessage = 'Please verify your email address before logging in.';
      } else if (error.name === 'UserNotFoundException') {
        errorMessage = 'User not found. Please check your email address.';
      } else if (error.name === 'TooManyRequestsException') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.name === 'InvalidParameterException') {
        errorMessage = 'Invalid login parameters. Please check your configuration.';
      } else if (error.message?.includes('USER_SRP_AUTH')) {
        errorMessage = 'Authentication method not enabled. Please check Cognito configuration.';
      } else {
        errorMessage = `Login failed: ${error.message || error.name || 'Unknown error'}`;
      }
      
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <LockKeyhole className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2">
              Sign in to your workspace reservation account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Test Credentials */}
          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setEmail('admin@workspace.com');
                setPassword('AdminPass123!');
              }}
            >
              Use Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setEmail('client@workspace.com');
                setPassword('ClientPass123!');
              }}
            >
              Use Client
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Workspace Reservation System
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Powered by AWS Cognito
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};