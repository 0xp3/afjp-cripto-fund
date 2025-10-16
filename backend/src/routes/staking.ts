import { Router } from 'express';
import { authenticateWallet, authenticateToken } from '../middleware/auth';
import { stakingController } from '../controllers/stakingController';

const router = Router();

/**
 * @swagger
 * /api/staking/info/{address}:
 *   get:
 *     summary: Get staking information for an address
 *     tags: [Staking]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *     responses:
 *       200:
 *         description: Staking information retrieved successfully
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
 *                         stakedAmount:
 *                           type: number
 *                         rewardClaimed:
 *                           type: number
 *                         pendingRewards:
 *                           type: number
 *                         stakedAt:
 *                           type: string
 *                           format: date-time
 *                         isActive:
 *                           type: boolean
 *       404:
 *         description: No staking information found
 */
router.get('/info/:address', stakingController.getStakingInfo);

/**
 * @swagger
 * /api/staking/stake:
 *   post:
 *     summary: Stake AFJP tokens
 *     tags: [Staking]
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
 *                 description: Amount to stake
 *     responses:
 *       200:
 *         description: Tokens staked successfully
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
 *                         stakedAmount:
 *                           type: number
 *       400:
 *         description: Invalid amount or insufficient balance
 *       401:
 *         description: Authentication required
 */
router.post('/stake', authenticateWallet, stakingController.stakeTokens);

/**
 * @swagger
 * /api/staking/unstake:
 *   post:
 *     summary: Unstake AFJP tokens
 *     tags: [Staking]
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
 *                 description: Amount to unstake
 *     responses:
 *       200:
 *         description: Tokens unstaked successfully
 *       400:
 *         description: Invalid amount or insufficient staked balance
 *       401:
 *         description: Authentication required
 */
router.post('/unstake', authenticateWallet, stakingController.unstakeTokens);

/**
 * @swagger
 * /api/staking/claim-rewards:
 *   post:
 *     summary: Claim staking rewards
 *     tags: [Staking]
 *     security:
 *       - walletAuth: []
 *     responses:
 *       200:
 *         description: Rewards claimed successfully
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
 *                         claimedAmount:
 *                           type: number
 *       400:
 *         description: No rewards available to claim
 *       401:
 *         description: Authentication required
 */
router.post('/claim-rewards', authenticateWallet, stakingController.claimRewards);

/**
 * @swagger
 * /api/staking/rewards/{address}:
 *   get:
 *     summary: Get pending rewards for an address
 *     tags: [Staking]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *     responses:
 *       200:
 *         description: Pending rewards retrieved successfully
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
 *                         pendingRewards:
 *                           type: number
 *                         totalStaked:
 *                           type: number
 *                         rewardRate:
 *                           type: number
 *                         lastClaimTime:
 *                           type: string
 *                           format: date-time
 */
router.get('/rewards/:address', stakingController.getPendingRewards);

export default router;
