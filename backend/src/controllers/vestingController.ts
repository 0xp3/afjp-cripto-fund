import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../types';
import { AuthenticatedRequest } from '../types';
import { aptosService } from '../services/aptosService';
import { logger } from '../utils/logger';

export const vestingController = {
  /**
   * Get vesting schedule for an address
   */
  getVestingSchedule: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: {
          vestingSchedules: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const vestingSchedule = user.vestingSchedules[0];
      if (!vestingSchedule) {
        throw new AppError('No vesting schedule found', 404);
      }

      const now = new Date();
      const startTime = vestingSchedule.startTime;
      const endTime = vestingSchedule.endTime;
      const totalDuration = endTime.getTime() - startTime.getTime();
      const elapsed = now.getTime() - startTime.getTime();
      const progress = Math.min(elapsed / totalDuration, 1);

      const vestedAmount = Number(vestingSchedule.totalAmount) * progress;
      const remainingAmount = Number(vestingSchedule.totalAmount) - Number(vestingSchedule.releasedAmount);

      res.json({
        success: true,
        data: {
          totalAmount: Number(vestingSchedule.totalAmount),
          releasedAmount: Number(vestingSchedule.releasedAmount),
          remainingAmount,
          vestedAmount,
          startTime: vestingSchedule.startTime,
          endTime: vestingSchedule.endTime,
          cliffTime: vestingSchedule.cliffTime,
          isActive: vestingSchedule.isActive,
          vestingProgress: progress * 100
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Release vested tokens
   */
  releaseVestedTokens: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.walletAddress) {
        throw new AppError('Wallet address not found', 401);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: req.walletAddress },
        include: {
          vestingSchedules: {
            where: { isActive: true }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const vestingSchedule = user.vestingSchedules[0];
      if (!vestingSchedule) {
        throw new AppError('No active vesting schedule found', 404);
      }

      // Calculate vested amount
      const now = new Date();
      const startTime = vestingSchedule.startTime;
      const endTime = vestingSchedule.endTime;
      const totalDuration = endTime.getTime() - startTime.getTime();
      const elapsed = now.getTime() - startTime.getTime();
      const progress = Math.min(elapsed / totalDuration, 1);

      const totalVestedAmount = Number(vestingSchedule.totalAmount) * progress;
      const releasableAmount = totalVestedAmount - Number(vestingSchedule.releasedAmount);

      if (releasableAmount <= 0) {
        throw new AppError('No tokens available for release', 400);
      }

      // TODO: Execute actual token release with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Update vesting schedule
      await prisma.vestingSchedule.update({
        where: { id: vestingSchedule.id },
        data: {
          releasedAmount: Number(vestingSchedule.releasedAmount) + releasableAmount
        }
      });

      // Record transaction
      await prisma.tokenTransaction.create({
        data: {
          userId: user.id,
          tokenType: 'AFJP',
          transactionType: 'claim',
          amount: releasableAmount,
          txHash: transactionHash,
          status: 'confirmed'
        }
      });

      logger.info('Vested tokens released:', {
        address: req.walletAddress,
        amount: releasableAmount,
        txHash: transactionHash
      });

      res.json({
        success: true,
        data: {
          transactionHash,
          releasedAmount: releasableAmount,
          remainingAmount: Number(vestingSchedule.totalAmount) - (Number(vestingSchedule.releasedAmount) + releasableAmount)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Calculate vested amount for an address
   */
  calculateVestedAmount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: {
          vestingSchedules: {
            where: { isActive: true }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const vestingSchedule = user.vestingSchedules[0];
      if (!vestingSchedule) {
        throw new AppError('No vesting schedule found', 404);
      }

      const now = new Date();
      const startTime = vestingSchedule.startTime;
      const endTime = vestingSchedule.endTime;
      const totalDuration = endTime.getTime() - startTime.getTime();
      const elapsed = now.getTime() - startTime.getTime();
      const progress = Math.min(elapsed / totalDuration, 1);

      const totalAmount = Number(vestingSchedule.totalAmount);
      const releasedAmount = Number(vestingSchedule.releasedAmount);
      const vestedAmount = totalAmount * progress;
      const remainingAmount = totalAmount - releasedAmount;

      res.json({
        success: true,
        data: {
          vestedAmount,
          totalAmount,
          releasedAmount,
          remainingAmount,
          vestingProgress: progress * 100
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
