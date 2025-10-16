import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../types';
import { AuthenticatedRequest } from '../types';
import { aptosService } from '../services/aptosService';
import { logger } from '../utils/logger';

export const inheritanceController = {
  /**
   * Get beneficiaries for an address
   */
  getBeneficiaries: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: {
          beneficiaries: {
            orderBy: [
              { isPrimary: 'desc' },
              { createdAt: 'asc' }
            ]
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (user.beneficiaries.length === 0) {
        throw new AppError('No beneficiaries found', 404);
      }

      const primaryBeneficiary = user.beneficiaries.find(b => b.isPrimary);
      const secondaryBeneficiaries = user.beneficiaries
        .filter(b => !b.isPrimary)
        .map(b => b.beneficiaryAddress);
      const distributionPercentages = user.beneficiaries
        .filter(b => !b.isPrimary)
        .map(b => Number(b.distributionPercentage));

      res.json({
        success: true,
        data: {
          primaryBeneficiary: primaryBeneficiary?.beneficiaryAddress || null,
          secondaryBeneficiaries,
          distributionPercentages
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Designate beneficiaries
   */
  designateBeneficiaries: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { primary, secondary, percentages } = req.body;

      if (!primary || !secondary || !percentages) {
        throw new AppError('Missing required fields', 400);
      }

      if (!Array.isArray(secondary) || !Array.isArray(percentages)) {
        throw new AppError('Secondary beneficiaries and percentages must be arrays', 400);
      }

      if (secondary.length !== percentages.length) {
        throw new AppError('Secondary beneficiaries and percentages arrays must have the same length', 400);
      }

      // Check if percentages add up to 100
      const totalPercentage = percentages.reduce((sum, p) => sum + p, 0);
      if (totalPercentage !== 100) {
        throw new AppError('Distribution percentages must add up to 100', 400);
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

      // TODO: Execute actual beneficiary designation with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Clear existing beneficiaries
      await prisma.beneficiary.deleteMany({
        where: { userId: user.id }
      });

      // Create primary beneficiary
      await prisma.beneficiary.create({
        data: {
          userId: user.id,
          beneficiaryAddress: primary,
          isPrimary: true,
          distributionPercentage: 100
        }
      });

      // Create secondary beneficiaries
      for (let i = 0; i < secondary.length; i++) {
        await prisma.beneficiary.create({
          data: {
            userId: user.id,
            beneficiaryAddress: secondary[i],
            isPrimary: false,
            distributionPercentage: percentages[i]
          }
        });
      }

      logger.info('Beneficiaries designated:', {
        user: req.walletAddress,
        primary,
        secondary,
        percentages,
        txHash: transactionHash
      });

      res.json({
        success: true,
        data: {
          transactionHash
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Request inheritance for a deceased user
   */
  requestInheritance: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { deceasedAddress, notes } = req.body;

      if (!deceasedAddress) {
        throw new AppError('Deceased address is required', 400);
      }

      if (!req.walletAddress) {
        throw new AppError('Wallet address not found', 401);
      }

      const requester = await prisma.user.findUnique({
        where: { walletAddress: req.walletAddress }
      });

      if (!requester) {
        throw new AppError('Requester not found', 404);
      }

      const deceased = await prisma.user.findUnique({
        where: { walletAddress: deceasedAddress }
      });

      if (!deceased) {
        throw new AppError('Deceased user not found', 404);
      }

      // Check if deceased user has beneficiaries
      const beneficiaries = await prisma.beneficiary.findMany({
        where: { userId: deceased.id }
      });

      if (beneficiaries.length === 0) {
        throw new AppError('Deceased user has no designated beneficiaries', 400);
      }

      // Check if requester is a beneficiary
      const isBeneficiary = beneficiaries.some(b => b.beneficiaryAddress === req.walletAddress);
      if (!isBeneficiary) {
        throw new AppError('You are not a designated beneficiary', 403);
      }

      // TODO: Execute actual inheritance request with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Create inheritance request
      const request = await prisma.inheritanceRequest.create({
        data: {
          requesterId: requester.id,
          deceasedAddress,
          notes: notes || null
        }
      });

      logger.info('Inheritance request created:', {
        requestId: request.id,
        requester: req.walletAddress,
        deceased: deceasedAddress,
        txHash: transactionHash
      });

      res.status(201).json({
        success: true,
        data: {
          requestId: request.id,
          transactionHash
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get inheritance requests for an address
   */
  getInheritanceRequests: async (req: Request, res: Response, next: NextFunction) => {
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

      const whereClause: any = { requesterId: user.id };
      if (status) {
        whereClause.status = status;
      }

      const requests = await prisma.inheritanceRequest.findMany({
        where: whereClause,
        orderBy: { requestTime: 'desc' }
      });

      res.json({
        success: true,
        data: requests.map(request => ({
          id: request.id,
          deceasedAddress: request.deceasedAddress,
          requestTime: request.requestTime,
          status: request.status,
          approvedBy: request.approvedBy,
          approvedAt: request.approvedAt,
          notes: request.notes
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Execute inheritance for an approved request
   */
  executeInheritance: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { requestId } = req.params;

      if (!requestId || isNaN(parseInt(requestId))) {
        throw new AppError('Valid request ID is required', 400);
      }

      if (!req.walletAddress) {
        throw new AppError('Wallet address not found', 401);
      }

      const request = await prisma.inheritanceRequest.findUnique({
        where: { id: parseInt(requestId) },
        include: {
          requester: true
        }
      });

      if (!request) {
        throw new AppError('Inheritance request not found', 404);
      }

      if (request.requester.walletAddress !== req.walletAddress) {
        throw new AppError('Not authorized to execute this inheritance request', 403);
      }

      if (request.status !== 'approved') {
        throw new AppError('Request must be approved before execution', 400);
      }

      // TODO: Execute actual inheritance with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Get deceased user's assets (simplified)
      const deceased = await prisma.user.findUnique({
        where: { walletAddress: request.deceasedAddress },
        include: {
          tokenBalances: true,
          beneficiaries: true
        }
      });

      if (!deceased) {
        throw new AppError('Deceased user not found', 404);
      }

      // Calculate total assets
      const totalAssets = deceased.tokenBalances.reduce((sum, balance) => 
        sum + Number(balance.balance), 0
      );

      // Update request status
      await prisma.inheritanceRequest.update({
        where: { id: parseInt(requestId) },
        data: {
          status: 'completed'
        }
      });

      logger.info('Inheritance executed:', {
        requestId: parseInt(requestId),
        requester: req.walletAddress,
        deceased: request.deceasedAddress,
        totalAssets,
        txHash: transactionHash
      });

      res.json({
        success: true,
        data: {
          transactionHash,
          distributedAmount: totalAssets
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
