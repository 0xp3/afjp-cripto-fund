import { Router } from 'express';
import { authenticateWallet, authenticateToken } from '../middleware/auth';
import { inheritanceController } from '../controllers/inheritanceController';

const router = Router();

/**
 * @swagger
 * /api/inheritance/beneficiaries/{address}:
 *   get:
 *     summary: Get beneficiaries for an address
 *     tags: [Inheritance]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *     responses:
 *       200:
 *         description: Beneficiaries retrieved successfully
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
 *                         primaryBeneficiary:
 *                           type: string
 *                         secondaryBeneficiaries:
 *                           type: array
 *                           items:
 *                             type: string
 *                         distributionPercentages:
 *                           type: array
 *                           items:
 *                             type: number
 *       404:
 *         description: No beneficiaries found
 */
router.get('/beneficiaries/:address', inheritanceController.getBeneficiaries);

/**
 * @swagger
 * /api/inheritance/designate:
 *   post:
 *     summary: Designate beneficiaries
 *     tags: [Inheritance]
 *     security:
 *       - walletAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - primary
 *               - secondary
 *               - percentages
 *             properties:
 *               primary:
 *                 type: string
 *                 description: Primary beneficiary address
 *               secondary:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Secondary beneficiary addresses
 *               percentages:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Distribution percentages for each beneficiary
 *     responses:
 *       200:
 *         description: Beneficiaries designated successfully
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
 *       400:
 *         description: Invalid request or percentages don't add up to 100
 *       401:
 *         description: Authentication required
 */
router.post('/designate', authenticateWallet, inheritanceController.designateBeneficiaries);

/**
 * @swagger
 * /api/inheritance/request:
 *   post:
 *     summary: Request inheritance for a deceased user
 *     tags: [Inheritance]
 *     security:
 *       - walletAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deceasedAddress
 *             properties:
 *               deceasedAddress:
 *                 type: string
 *                 description: Address of the deceased user
 *               notes:
 *                 type: string
 *                 description: Additional notes or documentation
 *     responses:
 *       201:
 *         description: Inheritance request created successfully
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
 *                         requestId:
 *                           type: integer
 *                         transactionHash:
 *                           type: string
 *       400:
 *         description: Invalid request or deceased user not found
 *       401:
 *         description: Authentication required
 */
router.post('/request', authenticateWallet, inheritanceController.requestInheritance);

/**
 * @swagger
 * /api/inheritance/requests/{address}:
 *   get:
 *     summary: Get inheritance requests for an address
 *     tags: [Inheritance]
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
 *           enum: [pending, approved, rejected]
 *         description: Filter by request status
 *     responses:
 *       200:
 *         description: Inheritance requests retrieved successfully
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
 *                           deceasedAddress:
 *                             type: string
 *                           requestTime:
 *                             type: string
 *                             format: date-time
 *                           status:
 *                             type: string
 *                           approvedBy:
 *                             type: string
 *                           approvedAt:
 *                             type: string
 *                             format: date-time
 *                           notes:
 *                             type: string
 */
router.get('/requests/:address', inheritanceController.getInheritanceRequests);

/**
 * @swagger
 * /api/inheritance/execute/{requestId}:
 *   post:
 *     summary: Execute inheritance for an approved request
 *     tags: [Inheritance]
 *     security:
 *       - walletAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inheritance request ID
 *     responses:
 *       200:
 *         description: Inheritance executed successfully
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
 *                         distributedAmount:
 *                           type: number
 *       400:
 *         description: Request not approved or already executed
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Request not found
 */
router.post('/execute/:requestId', authenticateWallet, inheritanceController.executeInheritance);

export default router;
