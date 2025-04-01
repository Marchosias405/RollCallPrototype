// __tests__/route.test.js
import { POST } from '../src/app/api/auth/login/route';
import axios from 'axios';
import { NextResponse } from 'next/server';

jest.mock('axios');
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(() => ({
      cookies: {
        set: jest.fn(),
      },
    })),
  },
}));

describe('POST /api/login', () => {
  const mockRequest = (body) => ({
    json: jest.fn().mockResolvedValue(body),
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully log in and set cookies', async () => {
    axios.post
      .mockResolvedValueOnce({ data: { access_token: 'user_access_token' } }) // for initial token
      .mockResolvedValueOnce({ data: { access_token: 'mgmt_token' } }); // for management token

    axios.get
      .mockResolvedValueOnce({ data: { sub: 'user123', email: 'test@example.com' } }) // for user profile
      .mockResolvedValueOnce({ data: { app_metadata: { role: 'coordinator' } } }); // for user metadata

    const req = mockRequest({ email: 'test@example.com', password: 'password123' });
    const res = await POST(req);

    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: 'Login successful', role: 'coordinator' }
    );
    expect(res.cookies.set).toHaveBeenCalledWith('auth_token', 'user_access_token', { httpOnly: true, secure: true });
    expect(res.cookies.set).toHaveBeenCalledWith('user_role', 'coordinator', { httpOnly: true, secure: true });
  });

  it('should handle login failure', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: 'invalid_grant' } });

    const req = mockRequest({ email: 'wrong@example.com', password: 'wrongpass' });
    const res = await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  });
});
