import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Amplify } from 'aws-amplify';
import awsConfig from '../../aws-exports';
import { LoginPage } from '../LoginPage';

// Polyfill (Amplify may rely on these in JSDOM)
import { TextEncoder, TextDecoder } from 'util';
// @ts-ignore
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
// @ts-ignore
if (!global.TextDecoder) global.TextDecoder = TextDecoder as any;

// Configure Amplify once for real calls
Amplify.configure(awsConfig);

// NOTE: This is an integration test hitting real AWS Cognito.
// It requires a pre-existing user and credentials exposed via env vars:
//   REACT_APP_TEST_USER_EMAIL
//   REACT_APP_TEST_USER_PASSWORD
// If they are absent, the test is skipped.

const email = process.env.REACT_APP_TEST_USER_EMAIL;
const password = process.env.REACT_APP_TEST_USER_PASSWORD;

describe('LoginPage (integration – real Cognito)', () => {
  const onLoginSuccess = jest.fn();

  (console as any).error = jest.fn(); // suppress noisy expected errors

  if (!email || !password) {
    test.skip('skipped (missing REACT_APP_TEST_USER_EMAIL / PASSWORD)', () => {});
    return;
  }

  test('signs in successfully with real Cognito user', async () => {
    render(<LoginPage onLoginSuccess={onLoginSuccess} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, email);
    await userEvent.type(passwordInput, password);
    await userEvent.click(submitBtn);

    await waitFor(() => expect(onLoginSuccess).toHaveBeenCalled(), { timeout: 15000 });
  });
});
