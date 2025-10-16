import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { AppError } from '../types';
import { AuthenticatedRequest, CreateUserRequest, WalletSignature } from '../types';
import { logger } from '../utils/logger';

export const authController = {
  /**
   * Connect wallet and authenticate user
   */
  connectWallet: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { walletAddress, signature, message, timestamp }: WalletSignature = req.body;

      if (!walletAddress || !signature || !message || !timestamp) {
        throw new AppError('Missing required fields', 400);
      }

      // Verify timestamp (within 5 minutes)
      const now = Date.now();
      if (now - timestamp > 300000) { // 5 minutes
        throw new AppError('Request expired', 401);
      }

      // TODO: Implement actual signature verification with Aptos SDK
      // For now, we'll just check if the user exists or create them

      let user = await prisma.user.findUnique({
        where: { walletAddress }
      });

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            walletAddress,
            kycStatus: 'pending'
          }
        });
        logger.info('New user created:', { walletAddress, userId: user.id });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, walletAddress },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            walletAddress: user.walletAddress,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            kycStatus: user.kycStatus
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verify wallet signature
   */
  verifySignature: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address, signature, message } = req.body;

      if (!address || !signature || !message) {
        throw new AppError('Missing required fields', 400);
      }

      // TODO: Implement actual signature verification with Aptos SDK
      // For now, we'll just return success
      
      res.json({
        success: true,
        message: 'Signature verified successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      // Generate new JWT token
      const token = jwt.sign(
        { userId: req.user.id, walletAddress: req.user.walletAddress },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: req.user.id,
            walletAddress: req.user.walletAddress,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            kycStatus: req.user.kycStatus
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Logout user
   */
  logout: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // In a more sophisticated implementation, you might want to blacklist the token
      // For now, we'll just return success
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
