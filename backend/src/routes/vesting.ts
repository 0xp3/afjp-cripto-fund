import { Router } from 'express';
import { authenticateWallet, authenticateToken } from '../middleware/auth';
import { vestingController } from '../controllers/vestingController';

const router = Router();

/**
 * @swagger
 * /api/vesting/schedule/{address}:
 *   get:
 *     summary: Get vesting schedule for an address
 *     tags: [Vesting]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *     responses:
 *       200:
 *         description: Vesting schedule retrieved successfully
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
 *                         totalAmount:
 *                           type: number
 *                         releasedAmount:
 *                           type: number
 *                         remainingAmount:
 *                           type: number
 *                         startTime:
 *                           type: string
 *                           format: date-time
 *                         endTime:
 *                           type: string
 *                           format: date-time
 *                         cliffTime:
 *                           type: string
 *                           format: date-time
 *                         isActive:
 *                           type: boolean
 *       404:
 *         description: No vesting schedule found
 */
router.get('/schedule/:address', vestingController.getVestingSchedule);

/**
 * @swagger
 * /api/vesting/release:
 *   post:
 *     summary: Release vested tokens
 *     tags: [Vesting]
 *     security:
 *       - walletAuth: []
 *     responses:
 *       200:
 *         description: Vested tokens released successfully
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
 *                         transactionHash:
 *                           type: string
 *                         releasedAmount:
 *                           type: number
 *       400:
 *         description: No tokens available for release
 *       401:
 *         description: Authentication required
 */
router.post('/release', authenticateWallet, vestingController.releaseVestedTokens);

/**
 * @swagger
 * /api/vesting/calculate/{address}:
 *   get:
 *     summary: Calculate vested amount for an address
 *     tags: [Vesting]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *     responses:
 *       200:
 *         description: Vested amount calculated successfully
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
 *                         vestedAmount:
 *                           type: number
 *                         totalAmount:
 *                           type: number
 *                         releasedAmount:
 *                           type: number
 *                         remainingAmount:
 *                           type: number
 *                         vestingProgress:
 *                           type: number
 *                           description: Percentage of vesting completed
 */
router.get('/calculate/:address', vestingController.calculateVestedAmount);

export default router;
