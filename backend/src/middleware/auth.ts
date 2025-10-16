import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { AppError } from '../types';
import { AuthenticatedRequest } from '../types';

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Access token required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = user;
    req.walletAddress = user.walletAddress;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const authenticateWallet = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers['x-wallet-signature'] as string;
    const address = req.headers['x-wallet-address'] as string;
    const message = req.headers['x-wallet-message'] as string;
    const timestamp = req.headers['x-wallet-timestamp'] as string;

    if (!signature || !address || !message || !timestamp) {
      throw new AppError('Wallet authentication required', 401);
    }

    // Verify timestamp (within 5 minutes)
    const now = Date.now();
    const requestTime = parseInt(timestamp);
    if (now - requestTime > 300000) { // 5 minutes
      throw new AppError('Request expired', 401);
    }

    // TODO: Implement actual signature verification with Aptos SDK
    // For now, we'll just check if the user exists
    const user = await prisma.user.findUnique({
      where: { walletAddress: address }
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = user;
    req.walletAddress = address;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (user) {
        req.user = user;
        req.walletAddress = user.walletAddress;
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't throw errors
    next();
  }
};
