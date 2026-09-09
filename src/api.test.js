import { beforeEach, describe, expect, it, vi } from 'vitest';

const postMock = vi.fn();
const getMock = vi.fn();
const patchMock = vi.fn();
const deleteMock = vi.fn();

vi.mock('axios', () => ({
  default: {
    create: () => ({
      interceptors: {
        request: {
          use: vi.fn(),
        },
      },
      post: postMock,
      get: getMock,
      patch: patchMock,
      delete: deleteMock,
    }),
  },
}));

import { loginUser, registerUser } from './api';

describe('auth API client', () => {
  beforeEach(() => {
    postMock.mockReset();
    getMock.mockReset();
    patchMock.mockReset();
    deleteMock.mockReset();
    localStorage.clear();
  });

  it('registers through the local backend auth endpoint', async () => {
    postMock.mockResolvedValueOnce({
      data: {
        accessToken: 'token',
        user: { id: 1, name: 'Test User' },
      },
    });

    await registerUser({
      email: 'test@example.com',
      password: 'Abc12345',
      fullName: 'Test User',
      phone: '9876543210',
      confirmPassword: 'Abc12345',
    });

    expect(postMock).toHaveBeenCalledWith(
      '/auth/register',
      expect.objectContaining({
        email: 'test@example.com',
        password: 'Abc12345',
        fullName: 'Test User',
        phone: '9876543210',
        confirmPassword: 'Abc12345',
      }),
    );
  });

  it('logs in through the local backend auth endpoint', async () => {
    postMock.mockResolvedValueOnce({
      data: {
        accessToken: 'token',
        user: { id: 1, name: 'Test User' },
      },
    });

    await loginUser({ email: 'test@example.com', password: 'Abc12345' });

    expect(postMock).toHaveBeenCalledWith('/auth/login', expect.objectContaining({
      email: 'test@example.com',
      password: 'Abc12345',
    }));
  });
});
