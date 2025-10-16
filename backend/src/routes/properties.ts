import { Router } from 'express';
import { authenticateWallet, authenticateToken, optionalAuth } from '../middleware/auth';
import { propertyController } from '../controllers/propertyController';

const router = Router();

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: propertyType
 *         schema:
 *           type: string
 *           enum: [building, home, tourism]
 *         description: Filter by property type
 *       - in: query
 *         name: isTokenized
 *         schema:
 *           type: boolean
 *         description: Filter by tokenization status
 *     responses:
 *       200:
 *         description: Properties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Property'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 */
router.get('/', propertyController.getProperties);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 */
router.get('/:id', propertyController.getPropertyById);

/**
 * @swagger
 * /api/properties/register:
 *   post:
 *     summary: Register a new property
 *     tags: [Properties]
 *     security:
 *       - walletAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - propertyType
 *               - value
 *             properties:
 *               name:
 *                 type: string
 *                 description: Property name
 *               location:
 *                 type: string
 *                 description: Property location
 *               propertyType:
 *                 type: string
 *                 enum: [building, home, tourism]
 *                 description: Type of property
 *               value:
 *                 type: number
 *                 description: Property value
 *               rentalIncome:
 *                 type: number
 *                 description: Monthly rental income
 *     responses:
 *       201:
 *         description: Property registered successfully
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
 *                         propertyId:
 *                           type: integer
 *                         transactionHash:
 *                           type: string
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 */
router.post('/register', authenticateWallet, propertyController.registerProperty);

/**
 * @swagger
 * /api/properties/tokenize:
 *   post:
 *     summary: Tokenize a property
 *     tags: [Properties]
 *     security:
 *       - walletAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *               - fractions
 *             properties:
 *               propertyId:
 *                 type: integer
 *                 description: Property ID to tokenize
 *               fractions:
 *                 type: integer
 *                 description: Number of fractions to create
 *     responses:
 *       200:
 *         description: Property tokenized successfully
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
 *                         tokenId:
 *                           type: string
 *                         transactionHash:
 *                           type: string
 *       400:
 *         description: Invalid request or property already tokenized
 *       401:
 *         description: Authentication required
 */
router.post('/tokenize', authenticateWallet, propertyController.tokenizeProperty);

/**
 * @swagger
 * /api/properties/auctions:
 *   get:
 *     summary: Get active property auctions
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Auctions retrieved successfully
 */
router.get('/auctions', propertyController.getAuctions);

/**
 * @swagger
 * /api/properties/auctions/{id}/bid:
 *   post:
 *     summary: Place a bid on an auction
 *     tags: [Properties]
 *     security:
 *       - walletAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Auction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bidAmount
 *             properties:
 *               bidAmount:
 *                 type: number
 *                 description: Bid amount
 *     responses:
 *       200:
 *         description: Bid placed successfully
 *       400:
 *         description: Invalid bid amount or auction not active
 *       401:
 *         description: Authentication required
 */
router.post('/auctions/:id/bid', authenticateWallet, propertyController.placeBid);

/**
 * @swagger
 * /api/properties/rental-income/{address}:
 *   get:
 *     summary: Get rental income for an address
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *     responses:
 *       200:
 *         description: Rental income retrieved successfully
 */
router.get('/rental-income/:address', propertyController.getRentalIncome);

export default router;
