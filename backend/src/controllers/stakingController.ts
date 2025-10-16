import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../types';
import { AuthenticatedRequest } from '../types';
import { aptosService } from '../services/aptosService';
import { logger } from '../utils/logger';

export const stakingController = {
  /**
   * Get staking information for an address
   */
  getStakingInfo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: {
          stakingRecords: {
            where: { isActive: true },
            orderBy: { stakedAt: 'desc' }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const stakingRecord = user.stakingRecords[0];
      if (!stakingRecord) {
        throw new AppError('No staking information found', 404);
      }

      // Calculate pending rewards (simplified calculation)
      const stakedAt = stakingRecord.stakedAt;
      const now = new Date();
      const stakingDuration = now.getTime() - stakedAt.getTime();
      const stakingDurationDays = stakingDuration / (1000 * 60 * 60 * 24);
      
      // Assume 10% annual reward rate
      const annualRewardRate = 0.10;
      const dailyRewardRate = annualRewardRate / 365;
      const pendingRewards = Number(stakingRecord.stakedAmount) * dailyRewardRate * stakingDurationDays;

      res.json({
        success: true,
        data: {
          stakedAmount: Number(stakingRecord.stakedAmount),
          rewardClaimed: Number(stakingRecord.rewardClaimed),
          pendingRewards: Math.max(0, pendingRewards - Number(stakingRecord.rewardClaimed)),
          stakedAt: stakingRecord.stakedAt,
          isActive: stakingRecord.isActive
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Stake AFJP tokens
   */
  stakeTokens: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        throw new AppError('Invalid staking amount', 400);
      }

      if (!req.walletAddress) {
        throw new AppError('Wallet address not found', 401);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: req.walletAddress }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // TODO: Execute actual staking with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Create staking record
      await prisma.stakingRecord.create({
        data: {
          userId: user.id,
          stakedAmount: amount,
          isActive: true
        }
      });

      // Record transaction
      await prisma.tokenTransaction.create({
        data: {
          userId: user.id,
          tokenType: 'AFJP',
          transactionType: 'stake',
          amount: amount,
          txHash: transactionHash,
          status: 'confirmed'
        }
      });

      logger.info('Tokens staked:', {
        address: req.walletAddress,
        amount,
        txHash: transactionHash
      });

      res.json({
        success: true,
        data: {
          transactionHash,
          stakedAmount: amount
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Unstake AFJP tokens
   */
  unstakeTokens: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        throw new AppError('Invalid unstaking amount', 400);
      }

      if (!req.walletAddress) {
        throw new AppError('Wallet address not found', 401);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: req.walletAddress },
        include: {
          stakingRecords: {
            where: { isActive: true }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const totalStaked = user.stakingRecords.reduce((sum, record) => sum + Number(record.stakedAmount), 0);
      
      if (amount > totalStaked) {
        throw new AppError('Insufficient staked balance', 400);
      }

      // TODO: Execute actual unstaking with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Update staking records (simplified - in reality you'd need more complex logic)
      const stakingRecord = user.stakingRecords[0];
      if (stakingRecord) {
        await prisma.stakingRecord.update({
          where: { id: stakingRecord.id },
          data: {
            stakedAmount: Number(stakingRecord.stakedAmount) - amount,
            unstakedAt: new Date(),
            isActive: false
          }
        });
      }

      // Record transaction
      await prisma.tokenTransaction.create({
        data: {
          userId: user.id,
          tokenType: 'AFJP',
          transactionType: 'unstake',
          amount: amount,
          txHash: transactionHash,
          status: 'confirmed'
        }
      });

      logger.info('Tokens unstaked:', {
        address: req.walletAddress,
        amount,
        txHash: transactionHash
      });

      res.json({
        success: true,
        data: {
          transactionHash,
          unstakedAmount: amount
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Claim staking rewards
   */
  claimRewards: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.walletAddress) {
        throw new AppError('Wallet address not found', 401);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: req.walletAddress },
        include: {
          stakingRecords: {
            where: { isActive: true }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const stakingRecord = user.stakingRecords[0];
      if (!stakingRecord) {
        throw new AppError('No active staking found', 404);
      }

      // Calculate pending rewards
      const stakedAt = stakingRecord.stakedAt;
      const now = new Date();
      const stakingDuration = now.getTime() - stakedAt.getTime();
      const stakingDurationDays = stakingDuration / (1000 * 60 * 60 * 24);
      
      const annualRewardRate = 0.10;
      const dailyRewardRate = annualRewardRate / 365;
      const totalRewards = Number(stakingRecord.stakedAmount) * dailyRewardRate * stakingDurationDays;
      const claimableRewards = Math.max(0, totalRewards - Number(stakingRecord.rewardClaimed));

      if (claimableRewards <= 0) {
        throw new AppError('No rewards available to claim', 400);
      }

      // TODO: Execute actual reward claim with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Update staking record
      await prisma.stakingRecord.update({
        where: { id: stakingRecord.id },
        data: {
          rewardClaimed: Number(stakingRecord.rewardClaimed) + claimableRewards
        }
      });

      // Record transaction
      await prisma.tokenTransaction.create({
        data: {
          userId: user.id,
          tokenType: 'AFJP',
          transactionType: 'claim',
          amount: claimableRewards,
          txHash: transactionHash,
          status: 'confirmed'
        }
      });

      logger.info('Staking rewards claimed:', {
        address: req.walletAddress,
        amount: claimableRewards,
        txHash: transactionHash
      });

      res.json({
        success: true,
        data: {
          transactionHash,
          claimedAmount: claimableRewards
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get pending rewards for an address
   */
  getPendingRewards: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: {
          stakingRecords: {
            where: { isActive: true }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const stakingRecord = user.stakingRecords[0];
      if (!stakingRecord) {
        throw new AppError('No staking information found', 404);
      }

      // Calculate pending rewards
      const stakedAt = stakingRecord.stakedAt;
      const now = new Date();
      const stakingDuration = now.getTime() - stakedAt.getTime();
      const stakingDurationDays = stakingDuration / (1000 * 60 * 60 * 24);
      
      const annualRewardRate = 0.10;
      const dailyRewardRate = annualRewardRate / 365;
      const totalRewards = Number(stakingRecord.stakedAmount) * dailyRewardRate * stakingDurationDays;
      const pendingRewards = Math.max(0, totalRewards - Number(stakingRecord.rewardClaimed));

      res.json({
        success: true,
        data: {
          pendingRewards,
          totalStaked: Number(stakingRecord.stakedAmount),
          rewardRate: annualRewardRate,
          lastClaimTime: stakingRecord.stakedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
