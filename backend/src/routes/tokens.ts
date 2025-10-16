import { Router } from 'express';
import { authenticateWallet, authenticateToken } from '../middleware/auth';
import { tokenController } from '../controllers/tokenController';

const router = Router();

/**
 * @swagger
 * /api/tokens/afjp/balance/{address}:
 *   get:
 *     summary: Get AFJP token balance for an address
 *     tags: [Tokens]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *     responses:
 *       200:
 *         description: Token balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TokenBalance'
 *       404:
 *         description: Address not found
 */
router.get('/afjp/balance/:address', tokenController.getAFJPBalance);

/**
 * @swagger
 * /api/tokens/juventud/balance/{address}:
 *   get:
 *     summary: Get Juventud token balance for an address
 *     tags: [Tokens]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *     responses:
 *       200:
 *         description: Token balance retrieved successfully
 */
router.get('/juventud/balance/:address', tokenController.getJuventudBalance);

/**
 * @swagger
 * /api/tokens/ladrillo/balance/{address}:
 *   get:
 *     summary: Get Ladrillo token balance for an address
 *     tags: [Tokens]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *     responses:
 *       200:
 *         description: Token balance retrieved successfully
 */
router.get('/ladrillo/balance/:address', tokenController.getLadrilloBalance);

/**
 * @swagger
 * /api/tokens/afjp/transfer:
 *   post:
 *     summary: Transfer AFJP tokens
 *     tags: [Tokens]
 *     security:
 *       - walletAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - amount
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient address
 *               amount:
 *                 type: number
 *                 description: Amount to transfer
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Authentication required
 */
router.post('/afjp/transfer', authenticateWallet, tokenController.transferAFJP);

/**
 * @swagger
 * /api/tokens/afjp/burn:
 *   post:
 *     summary: Burn AFJP tokens
 *     tags: [Tokens]
 *     security:
 *       - walletAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to burn
 *     responses:
 *       200:
 *         description: Burn successful
 */
router.post('/afjp/burn', authenticateWallet, tokenController.burnAFJP);

/**
 * @swagger
 * /api/tokens/transactions/{address}:
 *   get:
 *     summary: Get transaction history for an address
 *     tags: [Tokens]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
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
 *         name: tokenType
 *         schema:
 *           type: string
 *           enum: [AFJP, JUVENTUD, LADRILLO]
 *         description: Filter by token type
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 */
router.get('/transactions/:address', tokenController.getTransactions);

export default router;
