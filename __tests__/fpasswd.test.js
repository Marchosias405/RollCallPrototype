import { POST } from '../src/app/api/auth/forgot-password/route'; // adjust path
import axios from 'axios';
import { NextResponse } from 'next/server';

// Mocks
jest.mock('axios');
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, opts) => ({
      json: async () => data,
      status: opts?.status || 200,
    })),
  },
}));

describe('POST /api/auth/forgot-password', () => {
  const mockRequest = (body) => ({
    json: jest.fn().mockResolvedValue(body),
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call Auth0 change_password API and return success message', async () => {
    axios.post.mockResolvedValueOnce({ data: "We've just sent you an email to reset your password." });

    const req = mockRequest({ email: 'test@example.com' });
    const res = await POST(req);

    expect(axios.post).toHaveBeenCalledWith(
      `https://${process.env.AUTH0_DOMAIN}/dbconnections/change_password`,
      {
        client_id: process.env.AUTH0_CLIENT_ID,
        email: 'test@example.com',
        connection: process.env.AUTH0_CONNECTION_NAME,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "We've just sent you an email to reset your password." },
      { status: 200 }
    );
  });

  it('should handle API failure with a 500 response', async () => {
    axios.post.mockRejectedValueOnce(new Error("Network error"));

    const req = mockRequest({ email: 'test@example.com' });
    const res = await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: 'An error occurred' },
      { status: 500 }
    );
  });
});
