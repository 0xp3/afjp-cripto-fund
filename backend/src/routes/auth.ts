import { Router } from 'express';
import { authenticateWallet, authenticateToken } from '../middleware/auth';
import { authController } from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * /api/auth/wallet-connect:
 *   post:
 *     summary: Connect wallet and authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *               - signature
 *               - message
 *               - timestamp
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 description: User's wallet address
 *               signature:
 *                 type: string
 *                 description: Wallet signature
 *               message:
 *                 type: string
 *                 description: Signed message
 *               timestamp:
 *                 type: number
 *                 description: Timestamp of the request
 *     responses:
 *       200:
 *         description: Wallet connected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Authentication failed
 *       400:
 *         description: Invalid request
 */
router.post('/wallet-connect', authController.connectWallet);

/**
 * @swagger
 * /api/auth/verify-signature:
 *   post:
 *     summary: Verify wallet signature
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - signature
 *               - message
 *             properties:
 *               address:
 *                 type: string
 *               signature:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signature verified successfully
 *       401:
 *         description: Invalid signature
 */
router.post('/verify-signature', authController.verifySignature);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid token
 */
router.post('/refresh', authenticateToken, authController.refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', authenticateToken, authController.logout);

export default router;
