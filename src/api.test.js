import { beforeEach, describe, expect, it, vi } from 'vitest';

const { signUpMock, signInMock, signOutMock, getCurrentUserMock } = vi.hoisted(() => ({
  signUpMock: vi.fn(),
  signInMock: vi.fn(),
  signOutMock: vi.fn(),
  getCurrentUserMock: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: () => ({
      interceptors: {
        request: {
          use: vi.fn(),
        },
      },
      post: vi.fn(),
      get: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    }),
  },
}));

vi.mock('./insforge', () => ({
  default: {
    auth: {
      signUp: signUpMock,
      signInWithPassword: signInMock,
      signOut: signOutMock,
      getCurrentUser: getCurrentUserMock,
    },
  },
}));

import { loginUser, registerUser } from './api';

describe('auth API client', () => {
  beforeEach(() => {
    signUpMock.mockReset();
    signInMock.mockReset();
    signOutMock.mockReset();
    getCurrentUserMock.mockReset();
  });

  it('registers through the InsForge auth SDK', async () => {
    signUpMock.mockResolvedValueOnce({
      data: { accessToken: 'token', user: { id: 1, name: 'Test User' } },
      error: null,
    });

    await registerUser({
      email: 'test@example.com',
      password: 'Abc12345',
      fullName: 'Test User',
      phone: '9876543210',
      confirmPassword: 'Abc12345',
    });

    expect(signUpMock).toHaveBeenCalledWith(expect.objectContaining({
      email: 'test@example.com',
      password: 'Abc12345',
      name: 'Test User',
    }));
  });

  it('logs in through the InsForge auth SDK', async () => {
    signInMock.mockResolvedValueOnce({
      data: { accessToken: 'token', user: { id: 1, name: 'Test User' } },
      error: null,
    });

    await loginUser({ email: 'test@example.com', password: 'Abc12345' });

    expect(signInMock).toHaveBeenCalledWith(expect.objectContaining({
      email: 'test@example.com',
      password: 'Abc12345',
    }));
  });
});
