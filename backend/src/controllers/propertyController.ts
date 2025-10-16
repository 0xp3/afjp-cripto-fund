import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../types';
import { AuthenticatedRequest, PropertyType } from '../types';
import { aptosService } from '../services/aptosService';
import { logger } from '../utils/logger';

export const propertyController = {
  /**
   * Get all properties
   */
  getProperties: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const propertyType = req.query.propertyType as PropertyType;
      const isTokenized = req.query.isTokenized === 'true';

      const whereClause: any = {};
      if (propertyType) {
        whereClause.propertyType = propertyType;
      }
      if (isTokenized !== undefined) {
        whereClause.isTokenized = isTokenized;
      }

      const [properties, total] = await Promise.all([
        prisma.property.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.property.count({ where: whereClause })
      ]);

      res.json({
        success: true,
        data: properties,
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
  },

  /**
   * Get property by ID
   */
  getPropertyById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id))) {
        throw new AppError('Valid property ID is required', 400);
      }

      const property = await prisma.property.findUnique({
        where: { id: parseInt(id) },
        include: {
          auctions: {
            where: { isActive: true }
          }
        }
      });

      if (!property) {
        throw new AppError('Property not found', 404);
      }

      res.json({
        success: true,
        data: property
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Register a new property
   */
  registerProperty: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { name, location, propertyType, value, rentalIncome } = req.body;

      if (!name || !location || !propertyType || !value) {
        throw new AppError('Missing required fields', 400);
      }

      if (!req.walletAddress) {
        throw new AppError('Wallet address not found', 401);
      }

      // TODO: Execute actual property registration with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Create property in database
      const property = await prisma.property.create({
        data: {
          name,
          location,
          propertyType,
          totalValue: value,
          rentalIncome: rentalIncome || 0,
          ownerAddress: req.walletAddress
        }
      });

      logger.info('Property registered:', {
        propertyId: property.id,
        name,
        location,
        value,
        owner: req.walletAddress,
        txHash: transactionHash
      });

      res.status(201).json({
        success: true,
        data: {
          propertyId: property.id,
          transactionHash
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Tokenize a property
   */
  tokenizeProperty: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { propertyId, fractions } = req.body;

      if (!propertyId || !fractions || fractions <= 0) {
        throw new AppError('Invalid tokenization parameters', 400);
      }

      if (!req.walletAddress) {
        throw new AppError('Wallet address not found', 401);
      }

      const property = await prisma.property.findUnique({
        where: { id: propertyId }
      });

      if (!property) {
        throw new AppError('Property not found', 404);
      }

      if (property.isTokenized) {
        throw new AppError('Property already tokenized', 400);
      }

      if (property.ownerAddress !== req.walletAddress) {
        throw new AppError('Not authorized to tokenize this property', 403);
      }

      // TODO: Execute actual property tokenization with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const tokenId = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Update property
      await prisma.property.update({
        where: { id: propertyId },
        data: {
          isTokenized: true,
          tokenId,
          totalFractions: BigInt(fractions)
        }
      });

      logger.info('Property tokenized:', {
        propertyId,
        fractions,
        tokenId,
        owner: req.walletAddress,
        txHash: transactionHash
      });

      res.json({
        success: true,
        data: {
          tokenId,
          transactionHash
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get active property auctions
   */
  getAuctions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const [auctions, total] = await Promise.all([
        prisma.propertyAuction.findMany({
          where: { isActive: true },
          include: {
            property: true
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.propertyAuction.count({ where: { isActive: true } })
      ]);

      res.json({
        success: true,
        data: auctions,
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
  },

  /**
   * Place a bid on an auction
   */
  placeBid: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { bidAmount } = req.body;

      if (!id || isNaN(parseInt(id))) {
        throw new AppError('Valid auction ID is required', 400);
      }

      if (!bidAmount || bidAmount <= 0) {
        throw new AppError('Invalid bid amount', 400);
      }

      if (!req.walletAddress) {
        throw new AppError('Wallet address not found', 401);
      }

      const auction = await prisma.propertyAuction.findUnique({
        where: { id: parseInt(id) },
        include: { property: true }
      });

      if (!auction) {
        throw new AppError('Auction not found', 404);
      }

      if (!auction.isActive) {
        throw new AppError('Auction is not active', 400);
      }

      if (new Date() > auction.endTime) {
        throw new AppError('Auction has ended', 400);
      }

      if (bidAmount <= (auction.currentBid || auction.startingPrice)) {
        throw new AppError('Bid amount must be higher than current bid', 400);
      }

      // TODO: Execute actual bid placement with Aptos SDK
      // For now, we'll simulate the transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Update auction
      await prisma.propertyAuction.update({
        where: { id: parseInt(id) },
        data: {
          currentBid: bidAmount,
          highestBidder: req.walletAddress
        }
      });

      logger.info('Bid placed:', {
        auctionId: id,
        bidAmount,
        bidder: req.walletAddress,
        txHash: transactionHash
      });

      res.json({
        success: true,
        data: {
          transactionHash,
          bidAmount,
          auctionId: parseInt(id)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get rental income for an address
   */
  getRentalIncome: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      const properties = await prisma.property.findMany({
        where: {
          ownerAddress: address,
          isTokenized: true
        }
      });

      const totalRentalIncome = properties.reduce((sum, property) => 
        sum + Number(property.rentalIncome || 0), 0
      );

      res.json({
        success: true,
        data: {
          address,
          totalRentalIncome,
          properties: properties.map(property => ({
            id: property.id,
            name: property.name,
            location: property.location,
            rentalIncome: Number(property.rentalIncome || 0),
            isTokenized: property.isTokenized
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
