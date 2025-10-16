import { authController } from '../../controllers/authController';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mock the dependencies
jest.mock('../../index', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    }
  }
}));

jest.mock('jsonwebtoken');
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  }
}));

describe('AuthController Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('verifySignature', () => {
    it('should verify signature successfully', async () => {
      mockRequest.body = {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        signature: '0xsignature',
        message: 'test message'
      };

      await authController.verifySignature(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Signature verified successfully'
      });
    });

    it('should return 400 for missing fields', async () => {
      mockRequest.body = {};

      await authController.verifySignature(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Missing required fields',
          statusCode: 400
        })
      );
    });
  });
});
