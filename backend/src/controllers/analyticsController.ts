import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../types';
import { logger } from '../utils/logger';

export const analyticsController = {
  /**
   * Get fund performance analytics
   */
  getFundPerformance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const period = req.query.period as string || '30d';
      
      // Calculate date range based on period
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case '1d':
          startDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // Get fund statistics
      const [
        totalUsers,
        totalProperties,
        tokenizedProperties,
        totalContributions,
        totalStaked,
        totalLoans
      ] = await Promise.all([
        prisma.user.count(),
        prisma.property.count(),
        prisma.property.count({ where: { isTokenized: true } }),
        prisma.tokenTransaction.aggregate({
          where: {
            transactionType: 'mint',
            createdAt: { gte: startDate }
          },
          _sum: { amount: true }
        }),
        prisma.stakingRecord.aggregate({
          where: {
            isActive: true,
            stakedAt: { gte: startDate }
          },
          _sum: { stakedAmount: true }
        }),
        prisma.loan.count({
          where: {
            createdAt: { gte: startDate }
          }
        })
      ]);

      // Calculate fund value (simplified)
      const totalValue = Number(totalContributions._sum.amount || 0);
      const totalReturns = totalValue * 0.15; // Assume 15% returns
      const returnRate = totalValue > 0 ? (totalReturns / totalValue) * 100 : 0;

      // Generate performance history (simplified)
      const performanceHistory = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const value = totalValue * (1 + (Math.random() - 0.5) * 0.1); // Random variation
        const contributions = totalValue * (Math.random() * 0.1);
        const returns = value * 0.15;
        
        performanceHistory.push({
          date: date.toISOString().split('T')[0],
          value,
          contributions,
          returns
        });
      }

      res.json({
        success: true,
        data: {
          totalValue,
          totalContributions: Number(totalContributions._sum.amount || 0),
          totalReturns,
          returnRate,
          activeUsers: totalUsers,
          totalProperties,
          tokenizedProperties,
          performanceHistory
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user portfolio analytics
   */
  getUserPortfolio: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      if (!address) {
        throw new AppError('Address is required', 400);
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: {
          tokenBalances: true,
          stakingRecords: {
            where: { isActive: true }
          },
          vestingSchedules: {
            where: { isActive: true }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Calculate token balances
      const tokenBalances = {
        AFJP: 0,
        JUVENTUD: 0,
        LADRILLO: 0
      };

      user.tokenBalances.forEach(balance => {
        tokenBalances[balance.tokenType as keyof typeof tokenBalances] = Number(balance.balance);
      });

      // Calculate staking info
      const stakedAmount = user.stakingRecords.reduce((sum, record) => 
        sum + Number(record.stakedAmount), 0
      );

      const pendingRewards = user.stakingRecords.reduce((sum, record) => {
        const stakedAt = record.stakedAt;
        const now = new Date();
        const stakingDuration = now.getTime() - stakedAt.getTime();
        const stakingDurationDays = stakingDuration / (1000 * 60 * 60 * 24);
        const dailyRewardRate = 0.10 / 365; // 10% annual
        return sum + (Number(record.stakedAmount) * dailyRewardRate * stakingDurationDays);
      }, 0);

      // Calculate vested amount
      const vestedAmount = user.vestingSchedules.reduce((sum, schedule) => {
        const now = new Date();
        const startTime = schedule.startTime;
        const endTime = schedule.endTime;
        const totalDuration = endTime.getTime() - startTime.getTime();
        const elapsed = now.getTime() - startTime.getTime();
        const progress = Math.min(elapsed / totalDuration, 1);
        return sum + (Number(schedule.totalAmount) * progress);
      }, 0);

      // Calculate total portfolio value
      const totalValue = Object.values(tokenBalances).reduce((sum, balance) => sum + balance, 0) + 
                        stakedAmount + vestedAmount;

      // Calculate performance metrics (simplified)
      const totalReturn = totalValue * 0.15; // Assume 15% return
      const returnRate = totalValue > 0 ? (totalReturn / totalValue) * 100 : 0;
      const riskScore = Math.min(100, Math.max(0, 50 + (Math.random() - 0.5) * 20)); // Random risk score

      res.json({
        success: true,
        data: {
          totalValue,
          tokenBalances,
          stakedAmount,
          pendingRewards,
          vestedAmount,
          propertyInvestments: [], // Would be populated with actual property data
          performanceMetrics: {
            totalReturn,
            returnRate,
            riskScore
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get property valuation analytics
   */
  getPropertyValuations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const propertyType = req.query.propertyType as string;
      const location = req.query.location as string;

      const whereClause: any = {};
      if (propertyType) {
        whereClause.propertyType = propertyType;
      }
      if (location) {
        whereClause.location = { contains: location, mode: 'insensitive' };
      }

      const properties = await prisma.property.findMany({
        where: whereClause
      });

      const totalProperties = properties.length;
      const totalValue = properties.reduce((sum, property) => sum + Number(property.totalValue), 0);
      const averageValue = totalProperties > 0 ? totalValue / totalProperties : 0;
      const medianValue = totalProperties > 0 ? 
        properties.sort((a, b) => Number(a.totalValue) - Number(b.totalValue))[Math.floor(totalProperties / 2)].totalValue : 0;

      const tokenizedProperties = properties.filter(p => p.isTokenized).length;
      const tokenizationRate = totalProperties > 0 ? (tokenizedProperties / totalProperties) * 100 : 0;

      // Group by property type
      const propertyTypes = properties.reduce((acc, property) => {
        if (!acc[property.propertyType]) {
          acc[property.propertyType] = {
            count: 0,
            totalValue: 0,
            averageValue: 0
          };
        }
        acc[property.propertyType].count++;
        acc[property.propertyType].totalValue += Number(property.totalValue);
        return acc;
      }, {} as Record<string, { count: number; totalValue: number; averageValue: number }>);

      // Calculate averages
      Object.keys(propertyTypes).forEach(type => {
        propertyTypes[type].averageValue = propertyTypes[type].totalValue / propertyTypes[type].count;
      });

      // Get top properties
      const topProperties = properties
        .sort((a, b) => Number(b.totalValue) - Number(a.totalValue))
        .slice(0, 10)
        .map(property => ({
          id: property.id,
          name: property.name,
          location: property.location,
          value: Number(property.totalValue),
          rentalIncome: Number(property.rentalIncome || 0),
          isTokenized: property.isTokenized
        }));

      res.json({
        success: true,
        data: {
          totalProperties,
          totalValue,
          averageValue,
          medianValue,
          tokenizedProperties,
          tokenizationRate,
          propertyTypes,
          topProperties
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get market trends and statistics
   */
  getMarketTrends: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const period = req.query.period as string || '30d';
      
      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case '1d':
          startDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // Get transaction volume
      const transactionVolume = await prisma.tokenTransaction.aggregate({
        where: {
          createdAt: { gte: startDate }
        },
        _sum: { amount: true },
        _count: true
      });

      // Get active users
      const activeUsers = await prisma.user.count({
        where: {
          createdAt: { gte: startDate }
        }
      });

      // Get property activity
      const propertyActivity = await Promise.all([
        prisma.property.count({
          where: {
            createdAt: { gte: startDate }
          }
        }),
        prisma.property.count({
          where: {
            isTokenized: true,
            updatedAt: { gte: startDate }
          }
        }),
        prisma.propertyAuction.count({
          where: {
            createdAt: { gte: startDate }
          }
        })
      ]);

      // Generate token price history (simplified)
      const tokenPrices: any = {
        AFJP: {
          current: 1.0 + (Math.random() - 0.5) * 0.2,
          change24h: (Math.random() - 0.5) * 0.1,
          changePercent24h: (Math.random() - 0.5) * 10,
          history: [] as Array<{ timestamp: string; price: number }>
        },
        JUVENTUD: {
          current: 0.8 + (Math.random() - 0.5) * 0.2,
          change24h: (Math.random() - 0.5) * 0.1,
          changePercent24h: (Math.random() - 0.5) * 10,
          history: [] as Array<{ timestamp: string; price: number }>
        }
      };

      // Generate price history
      for (let i = 0; i < 30; i++) {
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - (29 - i));
        
        Object.keys(tokenPrices).forEach(token => {
          const price = tokenPrices[token as keyof typeof tokenPrices].current * 
                       (1 + (Math.random() - 0.5) * 0.1);
          tokenPrices[token as keyof typeof tokenPrices].history.push({
            timestamp: timestamp.toISOString(),
            price
          });
        });
      }

      res.json({
        success: true,
        data: {
          tokenPrices,
          transactionVolume: {
            total: Number(transactionVolume._sum.amount || 0),
            daily: Number(transactionVolume._sum.amount || 0) / 30,
            weekly: Number(transactionVolume._sum.amount || 0) / 4,
            monthly: Number(transactionVolume._sum.amount || 0)
          },
          activeUsers: {
            total: await prisma.user.count(),
            new: activeUsers,
            active: activeUsers
          },
          propertyActivity: {
            newRegistrations: propertyActivity[0],
            tokenizations: propertyActivity[1],
            auctions: propertyActivity[2],
            sales: Math.floor(propertyActivity[2] * 0.3) // Assume 30% of auctions result in sales
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
