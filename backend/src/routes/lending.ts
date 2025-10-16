import { Router } from 'express';
import { authenticateWallet, authenticateToken } from '../middleware/auth';
import { lendingController } from '../controllers/lendingController';

const router = Router();

/**
 * @swagger
 * /api/lending/loans/{address}:
 *   get:
 *     summary: Get loans for an address
 *     tags: [Lending]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, liquidated]
 *         description: Filter by loan status
 *     responses:
 *       200:
 *         description: Loans retrieved successfully
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
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           collateralAmount:
 *                             type: number
 *                           borrowedAmount:
 *                             type: number
 *                           interestRate:
 *                             type: number
 *                           startTime:
 *                             type: string
 *                             format: date-time
 *                           dueDate:
 *                             type: string
 *                             format: date-time
 *                           isActive:
 *                             type: boolean
 */
router.get('/loans/:address', lendingController.getLoans);

/**
 * @swagger
 * /api/lending/create-loan:
 *   post:
 *     summary: Create a new loan
 *     tags: [Lending]
 *     security:
 *       - walletAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - collateralAmount
 *               - borrowAmount
 *             properties:
 *               collateralAmount:
 *                 type: number
 *                 description: Amount of collateral to provide
 *               borrowAmount:
 *                 type: number
 *                 description: Amount to borrow
 *     responses:
 *       201:
 *         description: Loan created successfully
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
 *                         loanId:
 *                           type: integer
 *                         transactionHash:
 *                           type: string
 *       400:
 *         description: Invalid request or insufficient collateral
 *       401:
 *         description: Authentication required
 */
router.post('/create-loan', authenticateWallet, lendingController.createLoan);

/**
 * @swagger
 * /api/lending/repay:
 *   post:
 *     summary: Repay a loan
 *     tags: [Lending]
 *     security:
 *       - walletAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loanId
 *               - amount
 *             properties:
 *               loanId:
 *                 type: integer
 *                 description: Loan ID to repay
 *               amount:
 *                 type: number
 *                 description: Amount to repay
 *     responses:
 *       200:
 *         description: Loan repaid successfully
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
 *                         remainingBalance:
 *                           type: number
 *       400:
 *         description: Invalid loan ID or insufficient funds
 *       401:
 *         description: Authentication required
 */
router.post('/repay', authenticateWallet, lendingController.repayLoan);

/**
 * @swagger
 * /api/lending/collateral/{address}:
 *   get:
 *     summary: Get collateral information for an address
 *     tags: [Lending]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *     responses:
 *       200:
 *         description: Collateral information retrieved successfully
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
 *                         totalCollateral:
 *                           type: number
 *                         availableCollateral:
 *                           type: number
 *                         lockedCollateral:
 *                           type: number
 *                         collateralizationRatio:
 *                           type: number
 */
router.get('/collateral/:address', lendingController.getCollateral);

/**
 * @swagger
 * /api/lending/liquidate:
 *   post:
 *     summary: Liquidate collateral for a loan
 *     tags: [Lending]
 *     security:
 *       - walletAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loanId
 *             properties:
 *               loanId:
 *                 type: integer
 *                 description: Loan ID to liquidate
 *     responses:
 *       200:
 *         description: Collateral liquidated successfully
 *       400:
 *         description: Invalid loan ID or loan not eligible for liquidation
 *       401:
 *         description: Authentication required
 */
router.post('/liquidate', authenticateWallet, lendingController.liquidateCollateral);

export default router;
