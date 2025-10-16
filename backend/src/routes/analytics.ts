import { Router } from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { analyticsController } from '../controllers/analyticsController';

const router = Router();

/**
 * @swagger
 * /api/analytics/fund-performance:
 *   get:
 *     summary: Get fund performance analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [1d, 7d, 30d, 90d, 1y]
 *           default: 30d
 *         description: Time period for analytics
 *     responses:
 *       200:
 *         description: Fund performance data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalValue:
 *                           type: number
 *                         totalContributions:
 *                           type: number
 *                         totalReturns:
 *                           type: number
 *                         returnRate:
 *                           type: number
 *                         activeUsers:
 *                           type: integer
 *                         totalProperties:
 *                           type: integer
 *                         tokenizedProperties:
 *                           type: integer
 *                         performanceHistory:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               date:
 *                                 type: string
 *                                 format: date
 *                               value:
 *                                 type: number
 *                               contributions:
 *                                 type: number
 *                               returns:
 *                                 type: number
 */
router.get('/fund-performance', analyticsController.getFundPerformance);

/**
 * @swagger
 * /api/analytics/user-portfolio/{address}:
 *   get:
 *     summary: Get user portfolio analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *     responses:
 *       200:
 *         description: User portfolio data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalValue:
 *                           type: number
 *                         tokenBalances:
 *                           type: object
 *                           properties:
 *                             AFJP:
 *                               type: number
 *                             JUVENTUD:
 *                               type: number
 *                             LADRILLO:
 *                               type: number
 *                         stakedAmount:
 *                           type: number
 *                         pendingRewards:
 *                           type: number
 *                         vestedAmount:
 *                           type: number
 *                         propertyInvestments:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               propertyId:
 *                                 type: integer
 *                               propertyName:
 *                                 type: string
 *                               investmentAmount:
 *                                 type: number
 *                               currentValue:
 *                                 type: number
 *                               rentalIncome:
 *                                 type: number
 *                         performanceMetrics:
 *                           type: object
 *                           properties:
 *                             totalReturn:
 *                               type: number
 *                             returnRate:
 *                               type: number
 *                             riskScore:
 *                               type: number
 *       404:
 *         description: User not found
 */
router.get('/user-portfolio/:address', analyticsController.getUserPortfolio);

/**
 * @swagger
 * /api/analytics/property-valuations:
 *   get:
 *     summary: Get property valuation analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: propertyType
 *         schema:
 *           type: string
 *           enum: [building, home, tourism]
 *         description: Filter by property type
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *     responses:
 *       200:
 *         description: Property valuation data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalProperties:
 *                           type: integer
 *                         totalValue:
 *                           type: number
 *                         averageValue:
 *                           type: number
 *                         medianValue:
 *                           type: number
 *                         tokenizedProperties:
 *                           type: integer
 *                         tokenizationRate:
 *                           type: number
 *                         propertyTypes:
 *                           type: object
 *                           properties:
 *                             building:
 *                               type: object
 *                               properties:
 *                                 count:
 *                                   type: integer
 *                                 totalValue:
 *                                   type: number
 *                                 averageValue:
 *                                   type: number
 *                             home:
 *                               type: object
 *                               properties:
 *                                 count:
 *                                   type: integer
 *                                 totalValue:
 *                                   type: number
 *                                 averageValue:
 *                                   type: number
 *                             tourism:
 *                               type: object
 *                               properties:
 *                                 count:
 *                                   type: integer
 *                                 totalValue:
 *                                   type: number
 *                                 averageValue:
 *                                   type: number
 *                         topProperties:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                               location:
 *                                 type: string
 *                               value:
 *                                 type: number
 *                               rentalIncome:
 *                                 type: number
 *                               isTokenized:
 *                                 type: boolean
 */
router.get('/property-valuations', analyticsController.getPropertyValuations);

/**
 * @swagger
 * /api/analytics/market-trends:
 *   get:
 *     summary: Get market trends and statistics
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [1d, 7d, 30d, 90d, 1y]
 *           default: 30d
 *         description: Time period for trends
 *     responses:
 *       200:
 *         description: Market trends data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         tokenPrices:
 *                           type: object
 *                           properties:
 *                             AFJP:
 *                               type: object
 *                               properties:
 *                                 current:
 *                                   type: number
 *                                 change24h:
 *                                   type: number
 *                                 changePercent24h:
 *                                   type: number
 *                                 history:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       timestamp:
 *                                         type: string
 *                                         format: date-time
 *                                       price:
 *                                         type: number
 *                             JUVENTUD:
 *                               type: object
 *                               properties:
 *                                 current:
 *                                   type: number
 *                                 change24h:
 *                                   type: number
 *                                 changePercent24h:
 *                                   type: number
 *                         transactionVolume:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: number
 *                             daily:
 *                               type: number
 *                             weekly:
 *                               type: number
 *                             monthly:
 *                               type: number
 *                         activeUsers:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: integer
 *                             new:
 *                               type: integer
 *                             active:
 *                               type: integer
 *                         propertyActivity:
 *                           type: object
 *                           properties:
 *                             newRegistrations:
 *                               type: integer
 *                             tokenizations:
 *                               type: integer
 *                             auctions:
 *                               type: integer
 *                             sales:
 *                               type: integer
 */
router.get('/market-trends', analyticsController.getMarketTrends);

export default router;
