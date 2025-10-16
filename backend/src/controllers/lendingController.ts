import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../types';
import { AuthenticatedRequest } from '../types';
import { aptosService } from '../services/aptosService';
import { logger } from '../utils/logger';

export const lendingController = {
  /**
   * Get loans for an address
   */
  getLoans: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;
      const status = req.query.status as string;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: address }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const whereClause: any = { borrowerId: user.id };
      if (status) {
        whereClause.isActive = status === 'active';
      }

      const loans = await prisma.loan.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: loans.map(loan => ({
          id: loan.id,
          collateralAmount: Number(loan.collateralAmount),
          borrowedAmount: Number(loan.borrowedAmount),
          interestRate: Number(loan.interestRate),
          startTime: loan.startTime,
          dueDate: loan.dueDate,
          isActive: loan.isActive
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new loan
   */
  createLoan: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { collateralAmount, borrowAmount } = req.body;

      if (!collateralAmount || !borrowAmount || collateralAmount <= 0 || borrowAmount <= 0) {
        throw new AppError('Invalid loan parameters', 400);
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

      // Check if user has sufficient collateral (simplified check)
      const userBalance = await prisma.tokenBalance.findFirst({
        where: {
          userId: user.id,
          tokenType: 'AFJP'
        }
      });

      if (!userBalance || Number(userBalance.balance) < collateralAmount) {
        throw new AppError('Insufficient collateral', 400);
      }

      // Calculate interest rate (simplified - 5% annual)
      const interestRate = 5.0;

      // TODO: Execute actual loan creation with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Create loan
      const loan = await prisma.loan.create({
        data: {
          borrowerId: user.id,
          collateralAmount,
          borrowedAmount: borrowAmount,
          interestRate,
          startTime: new Date(),
          dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          isActive: true
        }
      });

      logger.info('Loan created:', {
        loanId: loan.id,
        borrower: req.walletAddress,
        collateralAmount,
        borrowAmount,
        interestRate,
        txHash: transactionHash
      });

      res.status(201).json({
        success: true,
        data: {
          loanId: loan.id,
          transactionHash
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Repay a loan
   */
  repayLoan: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { loanId, amount } = req.body;

      if (!loanId || !amount || amount <= 0) {
        throw new AppError('Invalid repayment parameters', 400);
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

      const loan = await prisma.loan.findUnique({
        where: { id: loanId }
      });

      if (!loan) {
        throw new AppError('Loan not found', 404);
      }

      if (loan.borrowerId !== user.id) {
        throw new AppError('Not authorized to repay this loan', 403);
      }

      if (!loan.isActive) {
        throw new AppError('Loan is not active', 400);
      }

      // TODO: Execute actual loan repayment with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Calculate remaining balance
      const remainingBalance = Math.max(0, Number(loan.borrowedAmount) - amount);

      // Update loan
      await prisma.loan.update({
        where: { id: loanId },
        data: {
          borrowedAmount: remainingBalance,
          isActive: remainingBalance > 0
        }
      });

      logger.info('Loan repaid:', {
        loanId,
        borrower: req.walletAddress,
        amount,
        remainingBalance,
        txHash: transactionHash
      });

      res.json({
        success: true,
        data: {
          transactionHash,
          remainingBalance
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get collateral information for an address
   */
  getCollateral: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: {
          loans: {
            where: { isActive: true }
          },
          tokenBalances: {
            where: { tokenType: 'AFJP' }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const totalCollateral = user.loans.reduce((sum, loan) => 
        sum + Number(loan.collateralAmount), 0
      );

      const availableBalance = user.tokenBalances[0]?.balance || 0;
      const lockedCollateral = totalCollateral;
      const availableCollateral = Math.max(0, Number(availableBalance) - lockedCollateral);

      const collateralizationRatio = totalCollateral > 0 ? 
        (Number(availableBalance) / totalCollateral) * 100 : 0;

      res.json({
        success: true,
        data: {
          totalCollateral,
          availableCollateral,
          lockedCollateral,
          collateralizationRatio
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Liquidate collateral for a loan
   */
  liquidateCollateral: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { loanId } = req.body;

      if (!loanId) {
        throw new AppError('Loan ID is required', 400);
      }

      if (!req.walletAddress) {
        throw new AppError('Wallet address not found', 401);
      }

      const loan = await prisma.loan.findUnique({
        where: { id: loanId }
      });

      if (!loan) {
        throw new AppError('Loan not found', 404);
      }

      if (!loan.isActive) {
        throw new AppError('Loan is not active', 400);
      }

      // Check if loan is eligible for liquidation (simplified - overdue by 30 days)
      const now = new Date();
      const overdueDays = (now.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (overdueDays < 30) {
        throw new AppError('Loan is not eligible for liquidation', 400);
      }

      // TODO: Execute actual collateral liquidation with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Mark loan as liquidated
      await prisma.loan.update({
        where: { id: loanId },
        data: {
          isActive: false
        }
      });

      logger.info('Collateral liquidated:', {
        loanId,
        liquidator: req.walletAddress,
        collateralAmount: Number(loan.collateralAmount),
        txHash: transactionHash
      });

      res.json({
        success: true,
        data: {
          transactionHash,
          liquidatedAmount: Number(loan.collateralAmount)
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
