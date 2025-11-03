import { Request, Response } from 'express';
import { Login, Register } from '../../routes/auth';
import { supabase } from '../../utils/supabase';
import { mockRequest, mockResponse, mockDatabase } from '../mocks';

// Mock supabase
jest.mock('../../utils/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  },
}));

describe('Auth Routes', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('Login', () => {
    it('should return 400 if email is missing', async () => {
      req.body = { password: 'password123' };
      
      await Login(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Email and Password Required');
    });

    it('should return 400 if password is missing', async () => {
      req.body = { email: 'test@example.com' };
      
      await Login(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Email and Password Required');
    });

    it('should return 401 if login fails', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      const mockError = { message: 'Invalid credentials' };
      
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await Login(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });

    it('should return 401 if session is not created', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: { id: '123' }, session: null },
        error: null,
      });

      await Login(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create session' });
    });

    it('should return token and user on successful login', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockToken = 'mock-access-token';
      
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: {
          user: mockUser,
          session: { access_token: mockToken },
        },
        error: null,
      });

      await Login(req as Request, res as Response);
      
      expect(res.json).toHaveBeenCalledWith({
        token: mockToken,
        user: mockUser,
      });
    });

    it('should handle server errors', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      
      (supabase.auth.signInWithPassword as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await Login(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('Register', () => {
    it('should return 400 if email is missing', async () => {
      req.body = { password: 'password123' };
      
      await Register(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Email and Password Required');
    });

    it('should return 400 if password is missing', async () => {
      req.body = { email: 'test@example.com' };
      
      await Register(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Email and Password Required');
    });

    it('should return 400 if password is too short', async () => {
      req.body = { email: 'test@example.com', password: '12345' };
      
      await Register(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Password must be at least 6 characters');
    });

    it('should return 400 if registration fails', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const mockError = { message: 'User already exists' };
      
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      await Register(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });

    it('should return 400 if user is not created', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      });

      await Register(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create user' });
    });

    it('should register user and return token when session exists', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      req.db = mockDatabase;
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockToken = 'mock-access-token';
      
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: {
          user: mockUser,
          session: { access_token: mockToken },
        },
        error: null,
      });
      (mockDatabase.registerUser as jest.Mock).mockResolvedValue(undefined);

      await Register(req as Request, res as Response);
      
      expect(mockDatabase.registerUser).toHaveBeenCalledWith(
        '123',
        'test@example.com',
        'user',
        'test'
      );
      expect(res.json).toHaveBeenCalledWith({
        token: mockToken,
        user: mockUser,
      });
    });

    it('should return requiresEmailConfirmation when session is null', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const mockUser = { id: '123', email: 'test@example.com' };
      
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: {
          user: mockUser,
          session: null,
        },
        error: null,
      });

      await Register(req as Request, res as Response);
      
      expect(res.json).toHaveBeenCalledWith({
        user: mockUser,
        requiresEmailConfirmation: true,
        message: 'Please check your email to confirm your account.',
      });
    });

    it('should handle server errors', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      
      (supabase.auth.signUp as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await Register(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});

