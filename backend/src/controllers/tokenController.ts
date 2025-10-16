import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../types';
import { AuthenticatedRequest, TokenType } from '../types';
import { aptosService } from '../services/aptosService';
import { logger } from '../utils/logger';

export const tokenController = {
  /**
   * Get AFJP token balance for an address
   */
  getAFJPBalance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      // Get balance from blockchain
      const blockchainBalance = await aptosService.getTokenBalance(address, 'AFJP');
      
      // Get balance from database
      const user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: {
          tokenBalances: {
            where: { tokenType: 'AFJP' }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const dbBalance = user.tokenBalances[0]?.balance || 0;

      res.json({
        success: true,
        data: {
          address,
          tokenType: 'AFJP',
          balance: blockchainBalance,
          lockedBalance: user.tokenBalances[0]?.lockedBalance || 0,
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Juventud token balance for an address
   */
  getJuventudBalance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      // Get balance from blockchain
      const blockchainBalance = await aptosService.getTokenBalance(address, 'JUVENTUD');
      
      // Get balance from database
      const user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: {
          tokenBalances: {
            where: { tokenType: 'JUVENTUD' }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: {
          address,
          tokenType: 'JUVENTUD',
          balance: blockchainBalance,
          lockedBalance: user.tokenBalances[0]?.lockedBalance || 0,
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Ladrillo token balance for an address
   */
  getLadrilloBalance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      // Get balance from blockchain
      const blockchainBalance = await aptosService.getTokenBalance(address, 'LADRILLO');
      
      // Get balance from database
      const user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: {
          tokenBalances: {
            where: { tokenType: 'LADRILLO' }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: {
          address,
          tokenType: 'LADRILLO',
          balance: blockchainBalance,
          lockedBalance: user.tokenBalances[0]?.lockedBalance || 0,
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Transfer AFJP tokens
   */
  transferAFJP: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { to, amount } = req.body;

      if (!to || !amount || amount <= 0) {
        throw new AppError('Invalid transfer parameters', 400);
      }

      if (!req.walletAddress) {
        throw new AppError('Wallet address not found', 401);
      }

      // TODO: Implement actual token transfer with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Record transaction in database
      const user = await prisma.user.findUnique({
        where: { walletAddress: req.walletAddress }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      await prisma.tokenTransaction.create({
        data: {
          userId: user.id,
          tokenType: 'AFJP',
          transactionType: 'transfer',
          amount: amount,
          txHash: transactionHash,
          status: 'confirmed'
        }
      });

      logger.info('AFJP transfer recorded:', {
        from: req.walletAddress,
        to,
        amount,
        txHash: transactionHash
      });

      res.json({
        success: true,
        data: {
          transactionHash,
          from: req.walletAddress,
          to,
          amount,
          status: 'confirmed'
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Burn AFJP tokens
   */
  burnAFJP: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        throw new AppError('Invalid burn amount', 400);
      }

      if (!req.walletAddress) {
        throw new AppError('Wallet address not found', 401);
      }

      // TODO: Implement actual token burn with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Record transaction in database
      const user = await prisma.user.findUnique({
        where: { walletAddress: req.walletAddress }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      await prisma.tokenTransaction.create({
        data: {
          userId: user.id,
          tokenType: 'AFJP',
          transactionType: 'burn',
          amount: amount,
          txHash: transactionHash,
          status: 'confirmed'
        }
      });

      logger.info('AFJP burn recorded:', {
        address: req.walletAddress,
        amount,
        txHash: transactionHash
      });

      res.json({
        success: true,
        data: {
          transactionHash,
          address: req.walletAddress,
          amount,
          status: 'confirmed'
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get transaction history for an address
   */
  getTransactions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const tokenType = req.query.tokenType as TokenType;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: address }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const whereClause: any = { userId: user.id };
      if (tokenType) {
        whereClause.tokenType = tokenType;
      }

      const [transactions, total] = await Promise.all([
        prisma.tokenTransaction.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.tokenTransaction.count({ where: whereClause })
      ]);

      res.json({
        success: true,
        data: transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
